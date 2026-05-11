const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

// C-3: Session stored in sessionStorage (tab-scoped) instead of localStorage.
// This prevents persistent token exposure across browser sessions and reduces
// the blast radius of XSS — a stolen token expires when the tab closes.
const SESSION_KEY = 'questly.session';

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

const readSession = () => {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const writeSession = ({ username, userId, token }) => {
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username, userId, token }));
  } catch { }
};

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

const normalizeUsername = (u) => String(u || '').trim().toLowerCase();

// ---------- public API ----------

export const createAccount = async ({ username, password, name, role }) => {
  if (!normalizeUsername(username)) throw new Error('Choose a username.');
  if (String(password || '').length < 6) throw new Error('Password must be at least 6 characters.');

  // C-2: All auth is server-side only. Client-side password hashing and local
  // account storage have been removed — they used unsalted SHA-256 and stored
  // the full account database (including password hashes) in localStorage.
  const payload = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username: normalizeUsername(username), password, name, role }),
  });
  writeSession({ username: payload.user.username, userId: payload.user.id, token: payload.token });
  return { ...payload, source: 'database' };
};

export const signInAccount = async ({ username, password }) => {
  if (!normalizeUsername(username)) throw new Error('Enter your username.');
  if (!password) throw new Error('Enter your password.');

  const payload = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: normalizeUsername(username), password }),
  });
  writeSession({ username: payload.user.username, userId: payload.user.id, token: payload.token });
  return { ...payload, source: 'database' };
};

// Restores session from the server using the stored JWT.
// Returns null if no session exists, the token is expired, or the server is unreachable.
export const loadSavedSession = async () => {
  const session = readSession();
  if (!session?.token) return null;

  try {
    const payload = await request('/auth/me');
    return { ...payload, source: 'database' };
  } catch {
    // Token invalid, expired, or server unreachable — clear the session and
    // require the user to sign in again. No local fallback: storing accounts
    // client-side is a critical security vulnerability (unsalted hashes, XSS exposure).
    clearSavedSession();
    return null;
  }
};

export const saveLearningState = async (user, progress, stats) => {
  if (!user?.username) return;

  try {
    await request('/learning-state', {
      method: 'PUT',
      body: JSON.stringify({ progress, stats }),
    });
  } catch {
    // Offline — progress is held in React state until the next successful sync.
  }
};

export const clearSavedSession = () => {
  try { window.sessionStorage.removeItem(SESSION_KEY); } catch { }
  // Purge any legacy localStorage data left over from before this security fix.
  try { window.localStorage.removeItem('questly.session'); } catch { }
  try { window.localStorage.removeItem('questly.accounts'); } catch { }
};
