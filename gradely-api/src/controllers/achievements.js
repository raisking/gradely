const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/achievements/badges  — all badges with earned status
async function getBadges(req, res, next) {
  try {
    const [allBadges, earnedBadges] = await Promise.all([
      prisma.badge.findMany({ where: { isActive: true }, orderBy: { requirementValue: 'asc' } }),
      prisma.userBadge.findMany({
        where: { userId: req.user.id },
        select: { badgeId: true, earnedAt: true },
      }),
    ]);

    const earnedMap = new Map(earnedBadges.map(ub => [ub.badgeId, ub.earnedAt]));

    const badges = allBadges.map(b => ({
      ...b,
      earned: earnedMap.has(b.id),
      earnedAt: earnedMap.get(b.id) || null,
    }));

    res.json({
      total:   badges.length,
      earned:  badges.filter(b => b.earned).length,
      badges,
    });
  } catch (err) { next(err); }
}

// GET /api/achievements/badges/mine  — only earned badges
async function getMyBadges(req, res, next) {
  try {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: req.user.id },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });

    res.json(userBadges.map(ub => ({ ...ub.badge, earnedAt: ub.earnedAt })));
  } catch (err) { next(err); }
}

// GET /api/achievements/leaderboard?limit=10
async function getLeaderboard(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit || '10'), 50);

    const top = await prisma.quizSession.groupBy({
      by: ['userId'],
      where: { completedAt: { not: null } },
      _sum: { score: true },
      orderBy: { _sum: { score: 'desc' } },
      take: limit,
    });

    const userIds = top.map(t => t.userId);
    const users   = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, firstName: true, lastName: true, avatarUrl: true,
                grade: { select: { label: true, emoji: true } } },
    });

    const userMap = new Map(users.map(u => [u.id, u]));

    const leaderboard = top.map((t, idx) => ({
      rank:       idx + 1,
      totalScore: t._sum.score || 0,
      user:       userMap.get(t.userId),
    }));

    res.json(leaderboard);
  } catch (err) { next(err); }
}

module.exports = { getBadges, getMyBadges, getLeaderboard };
