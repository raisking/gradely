const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';
const ACCOUNTS_KEY = 'gradely.accounts';
const SESSION_KEY = 'gradely.session';

const emptyStats = {
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

const normalizeUsername = (username) => String(username || '').trim().toLowerCase();

const readJson = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Browser storage can fail in private mode; the API path will still work.
  }
};

const hashPassword = async (password) => {
  const text = String(password || '');
  if (!window.crypto?.subtle) return btoa(text);
  const data = new TextEncoder().encode(text);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.error || 'Request failed');
  return payload;
};

const toPublicUser = (account) => ({
  id: account.id,
  username: account.username,
  name: account.name,
  role: account.role,
});

const localRegister = async ({ username, password, name, role }) => {
  const normalized = normalizeUsername(username);
  const accounts = readJson(ACCOUNTS_KEY, {});
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
  writeJson(ACCOUNTS_KEY, accounts);
  writeJson(SESSION_KEY, { username: normalized });
  return { user: toPublicUser(account), progress: {}, stats: emptyStats, source: 'browser' };
};

const localLogin = async ({ username, password }) => {
  const normalized = normalizeUsername(username);
  const accounts = readJson(ACCOUNTS_KEY, {});
  const account = accounts[normalized];
  if (!account || account.passwordHash !== await hashPassword(password)) {
    throw new Error('Username or password is incorrect.');
  }

  writeJson(SESSION_KEY, { username: normalized });
  return {
    user: toPublicUser(account),
    progress: account.progress || {},
    stats: { ...emptyStats, ...(account.stats || {}) },
    source: 'browser',
  };
};

export const createAccount = async ({ username, password, name, role }) => {
  if (!normalizeUsername(username)) throw new Error('Choose a username.');
  if (String(password || '').length < 6) throw new Error('Password must be at least 6 characters.');

  try {
    const payload = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: normalizeUsername(username), password, name, role }),
    });
    writeJson(SESSION_KEY, { username: payload.user.username, userId: payload.user.id, token: payload.token });
    return { ...payload, source: 'database' };
  } catch (err) {
    if (err.message && !err.message.includes('Failed to fetch')) throw err;
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
    writeJson(SESSION_KEY, { username: payload.user.username, userId: payload.user.id, token: payload.token });
    return { ...payload, source: 'database' };
  } catch (err) {
    if (err.message && !err.message.includes('Failed to fetch')) throw err;
    return localLogin({ username, password });
  }
};

export const loadSavedSession = () => {
  const session = readJson(SESSION_KEY, null);
  if (!session?.username) return null;
  const account = readJson(ACCOUNTS_KEY, {})[normalizeUsername(session.username)];
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

  const accounts = readJson(ACCOUNTS_KEY, {});
  const account = accounts[normalizeUsername(user.username)];
  if (account) {
    accounts[account.username] = { ...account, progress, stats, updatedAt: new Date().toISOString() };
    writeJson(ACCOUNTS_KEY, accounts);
  }

  try {
    await request('/learning-state', {
      method: 'PUT',
      body: JSON.stringify({ username: user.username, progress, stats }),
    });
  } catch {
    // The browser copy keeps the user moving when the API is offline.
  }
};

export const clearSavedSession = () => {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore storage cleanup errors.
  }
};

export { emptyStats };
