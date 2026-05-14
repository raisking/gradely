const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { isAdmin }      = require('../middleware/roles');
const ctrl = require('../controllers/admin');

router.use(authenticate, isAdmin);

// ── Dashboard stats ────────────────────────────────────────────────────────────
router.get('/stats', ctrl.getStats);

// ── User management ────────────────────────────────────────────────────────────
router.get('/users',                       ctrl.listUsers);
router.get('/users/:id',                   ctrl.getUser);
router.put('/users/:id',                   ctrl.updateUser);
router.delete('/users/:id',                ctrl.deleteUser);
router.post('/users/:id/reset-password',   ctrl.adminResetPassword);

// ── Quiz content ───────────────────────────────────────────────────────────────
router.get('/content/topics',              ctrl.listTopics);
router.post('/content/topics',             ctrl.createTopic);
router.put('/content/topics/:id',          ctrl.updateTopic);
router.delete('/content/topics/:id',       ctrl.deleteTopic);

router.get('/content/questions',           ctrl.listQuestions);
router.post('/content/questions',          ctrl.createQuestion);
router.put('/content/questions/:id',       ctrl.updateQuestion);
router.delete('/content/questions/:id',    ctrl.deleteQuestion);

module.exports = router;
