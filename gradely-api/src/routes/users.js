const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { isParent }     = require('../middleware/roles');
const ctrl = require('../controllers/users');

router.use(authenticate);

router.get('/me',                      ctrl.getMe);
router.put('/me',                      ctrl.updateMe);
router.put('/me/password',             ctrl.changePassword);
router.delete('/me',                   ctrl.deleteMe);

router.get('/me/children',             isParent, ctrl.getMyChildren);
router.post('/link-child',             isParent, ctrl.linkChild);
router.delete('/children/:childId',    isParent, ctrl.unlinkChild);
router.get('/children/:childId/progress', isParent, ctrl.getChildProgress);

module.exports = router;
