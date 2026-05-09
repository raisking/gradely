const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';
const SESSION_KEY = 'questly.session';
const LOCAL_ACCOUNTS_KEY = 'questly.accounts';

export const emptyStats = {
  points: 0,
  streak: 1,
  bestStreak: 0,
  currentRunStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  masteredSkills: 0,
  subjectsTried: 0,
  earnedBadges: [],
};

// ---------- storage helpers ----------

const readJson = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

const writeJson = (key, value) => {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { }
};

const readSession = () => readJson(SESSION_KEY, null);

const writeSession = ({ username, userId, token }) =>
  writeJson(SESSION_KEY, { username, userId, token });

// ---------- API ----------

const request = async (path, options = {}) => {
  const session = readSession();
  const headers = {
    'Content-Type': 'application/json',
    ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.error || 'Request failed');
  return payload;
};

const isNetworkError = (err) => err.message === 'Failed to fetch' || err instanceof TypeError;

// ---------- local (offline) fallback ----------

const normalizeUsername = (u) => String(u || '').trim().toLowerCase();

const hashPassword = async (password) => {
  const text = String(password || '');
  if (!window.crypto?.subtle) return btoa(text);
  const data = new TextEncoder().encode(text);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const toPublicUser = (a) => ({ id: a.id, username: a.username, name: a.name, role: a.role });

const localRegister = async ({ username, password, name, role }) => {
  const normalized = normalizeUsername(username);
  const accounts = readJson(LOCAL_ACCOUNTS_KEY, {});
  if (accounts[normalized]) throw new Error('That username is already taken.');
  const account = {
    id: `local-${Date.now()}`,
    username: normalized,
    name: String(name || username).trim(),
    role: role || 'student',
    passwordHash: await hashPassword(password),
    progress: {},
    stats: emptyStats,
    createdAt: new Date().toISOString(),
  };
  accounts[normalized] = account;
  writeJson(LOCAL_ACCOUNTS_KEY, accounts);
  writeSession({ username: normalized });
  return { user: toPublicUser(account), progress: {}, stats: emptyStats, source: 'browser' };
};

const localLogin = async ({ username, password }) => {
  const normalized = normalizeUsername(username);
  const accounts = readJson(LOCAL_ACCOUNTS_KEY, {});
  const account = accounts[normalized];
  if (!account || account.passwordHash !== await hashPassword(password))
    throw new Error('Username or password is incorrect.');
  writeSession({ username: normalized });
  return {
    user: toPublicUser(account),
    progress: account.progress || {},
    stats: { ...emptyStats, ...(account.stats || {}) },
    source: 'browser',
  };
};

// ---------- public API ----------

export const createAccount = async ({ username, password, name, role }) => {
  if (!normalizeUsername(username)) throw new Error('Choose a username.');
  if (String(password || '').length < 6) throw new Error('Password must be at least 6 characters.');

  try {
    const payload = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: normalizeUsername(username), password, name, role }),
    });
    writeSession({ username: payload.user.username, userId: payload.user.id, token: payload.token });
    return { ...payload, source: 'database' };
  } catch (err) {
    if (!isNetworkError(err)) throw err;
    return localRegister({ username, password, name, role });
  }
};

export const signInAccount = async ({ username, password }) => {
  if (!normalizeUsername(username)) throw new Error('Enter your username.');
  if (!password) throw new Error('Enter your password.');

  try {
    const payload = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: normalizeUsername(username), password }),
    });
    writeSession({ username: payload.user.username, userId: payload.user.id, token: payload.token });
    return { ...payload, source: 'database' };
  } catch (err) {
    if (!isNetworkError(err)) throw err;
    return localLogin({ username, password });
  }
};

// Tries to restore session from DB using stored JWT; falls back to localStorage copy.
export const loadSavedSession = async () => {
  const session = readSession();
  if (!session?.username) return null;

  // Try to refresh from DB if we have a token
  if (session.token) {
    try {
      const payload = await request('/auth/me');
      return { ...payload, source: 'database' };
    } catch (err) {
      // Token expired or server down — fall through to local copy
      if (!isNetworkError(err) && err.message?.includes('expired')) {
        // Token is definitively expired; clear it so user re-logs next time
        writeJson(SESSION_KEY, { ...session, token: null });
      }
    }
  }

  // Local fallback
  const accounts = readJson(LOCAL_ACCOUNTS_KEY, {});
  const account = accounts[normalizeUsername(session.username)];
  if (!account) return null;
  return {
    user: toPublicUser(account),
    progress: account.progress || {},
    stats: { ...emptyStats, ...(account.stats || {}) },
    source: 'browser',
  };
};

export const saveLearningState = async (user, progress, stats) => {
  if (!user?.username) return;

  // Always update local copy first
  const accounts = readJson(LOCAL_ACCOUNTS_KEY, {});
  const key = normalizeUsername(user.username);
  if (accounts[key]) {
    accounts[key] = { ...accounts[key], progress, stats, updatedAt: new Date().toISOString() };
    writeJson(LOCAL_ACCOUNTS_KEY, accounts);
  }

  // Sync to DB using JWT from session (request() injects it automatically)
  try {
    await request('/learning-state', {
      method: 'PUT',
      body: JSON.stringify({ progress, stats }),
    });
  } catch {
    // Offline — local copy keeps user moving
  }
};

export const clearSavedSession = () => {
  try { window.localStorage.removeItem(SESSION_KEY); } catch { }
};
