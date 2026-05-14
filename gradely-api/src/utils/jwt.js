const jwt    = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXP     = process.env.JWT_ACCESS_EXPIRES_IN  || '15m';
const REFRESH_EXP    = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// C-4: Fail fast — never allow the server to start with a missing or weak secret.
// A missing secret causes jwt.sign() to silently use undefined, making every token forgeable.
if (!ACCESS_SECRET  || ACCESS_SECRET.length  < 32) throw new Error('JWT_ACCESS_SECRET must be set and at least 32 characters.');
if (!REFRESH_SECRET || REFRESH_SECRET.length < 32) throw new Error('JWT_REFRESH_SECRET must be set and at least 32 characters.');

function signAccess(payload) {
  // C-5: Explicitly lock to HS256. Without this, jsonwebtoken accepts any algorithm the
  // token header declares, enabling the "alg:none" bypass and RS256→HS256 confusion attacks.
  return jwt.sign(payload, ACCESS_SECRET, { algorithm: 'HS256', expiresIn: ACCESS_EXP });
}

function signRefresh(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { algorithm: 'HS256', expiresIn: REFRESH_EXP });
}

function verifyAccess(token) {
  return jwt.verify(token, ACCESS_SECRET, { algorithms: ['HS256'] });
}

function verifyRefresh(token) {
  return jwt.verify(token, REFRESH_SECRET, { algorithms: ['HS256'] });
}

// Refresh token stored in DB — use a random opaque string
function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

function refreshExpiresAt() {
  const days = parseInt(REFRESH_EXP) || 30;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh, generateRefreshToken, refreshExpiresAt };
