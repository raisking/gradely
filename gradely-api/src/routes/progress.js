const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/progress');

router.use(authenticate);

router.get('/',                      ctrl.getMyProgress);
router.get('/summary',               ctrl.getSummary);
router.get('/topic/:topicId',        ctrl.getTopicProgress);
router.get('/subject/:subjectKey',   ctrl.getSubjectProgress);

module.exports = router;
