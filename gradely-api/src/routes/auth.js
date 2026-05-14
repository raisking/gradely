const router = require('express').Router();
const Joi    = require('joi');
const ctrl   = require('../controllers/auth');

// Simple validation middleware
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: error.details.map(d => d.message).join('; '),
    });
    next();
  };
}

const registerSchema = Joi.object({
  email:     Joi.string().email().required(),
  password:  Joi.string().min(8).max(128).required(),
  firstName: Joi.string().min(1).max(50).required(),
  lastName:  Joi.string().min(1).max(50).required(),
  role:      Joi.string().valid('STUDENT','PARENT','TEACHER').default('STUDENT'),
  gradeKey:  Joi.string().optional(),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

const passwordSchema = Joi.object({
  token:       Joi.string().required(),
  newPassword: Joi.string().min(8).max(128).required(),
});

router.post('/register',        validate(registerSchema), ctrl.register);
router.post('/login',           validate(loginSchema),    ctrl.login);
router.post('/refresh',         ctrl.refresh);
router.post('/logout',          ctrl.logout);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password',  validate(passwordSchema), ctrl.resetPassword);
router.get('/verify-email',     ctrl.verifyEmail);

module.exports = router;
