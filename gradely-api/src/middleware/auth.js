const { verifyAccess } = require('../utils/jwt');
const { unauth }       = require('../utils/errors');

// Attach req.user from Bearer token
function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next(unauth('No token provided.'));

  const token = header.slice(7);
  try {
    req.user = verifyAccess(token);  // { id, email, role }
    next();
  } catch (err) {
    next(unauth(err.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.'));
  }
}

// Optional auth — attaches user if token is present, doesn't fail if absent
function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try { req.user = verifyAccess(header.slice(7)); } catch (_) {}
  }
  next();
}

module.exports = { authenticate, optionalAuth };
