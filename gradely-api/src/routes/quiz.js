const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/quiz');

// Public catalog endpoints
router.get('/subjects',  ctrl.getSubjects);
router.get('/grades',    ctrl.getGrades);
router.get('/topics',    ctrl.getTopics);
router.get('/topics/:id', ctrl.getTopic);

// Authenticated quiz engine
router.use(authenticate);
router.get('/questions',             ctrl.getQuestions);
router.post('/sessions',             ctrl.startSession);
router.post('/sessions/:id/answer',  ctrl.submitAnswer);
router.post('/sessions/:id/complete', ctrl.completeSession);
router.get('/sessions/history',      ctrl.getHistory);

module.exports = router;
