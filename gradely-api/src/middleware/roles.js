const { forbidden } = require('../utils/errors');

// requireRole('ADMIN') or requireRole(['ADMIN','TEACHER'])
function requireRole(...roles) {
  const allowed = roles.flat();
  return (req, _res, next) => {
    if (!req.user) return next(forbidden());
    if (!allowed.includes(req.user.role)) {
      return next(forbidden(`Requires one of roles: ${allowed.join(', ')}`));
    }
    next();
  };
}

// Shorthand guards
const isAdmin   = requireRole('ADMIN');
const isTeacher = requireRole('ADMIN', 'TEACHER');
const isParent  = requireRole('ADMIN', 'PARENT');
const isStudent = requireRole('ADMIN', 'TEACHER', 'PARENT', 'STUDENT');

module.exports = { requireRole, isAdmin, isTeacher, isParent, isStudent };
