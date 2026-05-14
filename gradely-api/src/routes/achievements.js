const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/achievements');

router.use(authenticate);

router.get('/badges',        ctrl.getBadges);
router.get('/badges/mine',   ctrl.getMyBadges);
router.get('/leaderboard',   ctrl.getLeaderboard);

module.exports = router;
