const { PrismaClient } = require('@prisma/client');
const { notFound } = require('../utils/errors');

const prisma = new PrismaClient();

function masteryLabel(pct) {
  if (pct >= 85) return 'Mastery';
  if (pct >= 60) return 'Proficient';
  if (pct >= 30) return 'Developing';
  if (pct > 0)   return 'Beginner';
  return 'Not Started';
}

// GET /api/progress  — all progress for current user
async function getMyProgress(req, res, next) {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: req.user.id },
      include: {
        topic: {
          include: {
            subject: { select: { key: true, label: true, color: true, bgColor: true } },
            grade:   { select: { key: true, label: true, order: true } },
          },
        },
      },
      orderBy: { lastPracticed: 'desc' },
    });

    const enriched = progress.map(p => ({
      ...p,
      masteryLabel: masteryLabel(p.masteryPct),
      accuracy: p.totalAttempted > 0 ? Math.round((p.totalCorrect / p.totalAttempted) * 100) : 0,
    }));

    res.json(enriched);
  } catch (err) { next(err); }
}

// GET /api/progress/topic/:topicId
async function getTopicProgress(req, res, next) {
  try {
    const progress = await prisma.progress.findUnique({
      where: { userId_topicId: { userId: req.user.id, topicId: req.params.topicId } },
      include: {
        topic: {
          include: {
            subject: { select: { key: true, label: true, color: true } },
            grade:   { select: { key: true, label: true } },
          },
        },
      },
    });

    if (!progress) return res.json({ masteryPct: 0, masteryLabel: 'Not Started', totalSessions: 0 });

    res.json({
      ...progress,
      masteryLabel: masteryLabel(progress.masteryPct),
      accuracy: progress.totalAttempted > 0
        ? Math.round((progress.totalCorrect / progress.totalAttempted) * 100)
        : 0,
    });
  } catch (err) { next(err); }
}

// GET /api/progress/subject/:subjectKey
async function getSubjectProgress(req, res, next) {
  try {
    const subject = await prisma.subject.findUnique({ where: { key: req.params.subjectKey } });
    if (!subject) return next(notFound('Subject not found.'));

    const progress = await prisma.progress.findMany({
      where: {
        userId: req.user.id,
        topic: { subjectId: subject.id },
      },
      include: {
        topic: {
          include: { grade: { select: { key: true, label: true, order: true } } },
        },
      },
      orderBy: { lastPracticed: 'desc' },
    });

    const totalCorrect   = progress.reduce((s, p) => s + p.totalCorrect, 0);
    const totalAttempted = progress.reduce((s, p) => s + p.totalAttempted, 0);
    const avgMastery     = progress.length > 0
      ? Math.round(progress.reduce((s, p) => s + p.masteryPct, 0) / progress.length)
      : 0;

    res.json({
      subject,
      avgMastery,
      masteryLabel: masteryLabel(avgMastery),
      overallAccuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
      topicsStarted: progress.length,
      topicsMastered: progress.filter(p => p.masteryPct >= 85).length,
      topics: progress.map(p => ({
        ...p,
        masteryLabel: masteryLabel(p.masteryPct),
        accuracy: p.totalAttempted > 0 ? Math.round((p.totalCorrect / p.totalAttempted) * 100) : 0,
      })),
    });
  } catch (err) { next(err); }
}

// GET /api/progress/summary  — dashboard summary
async function getSummary(req, res, next) {
  try {
    const userId = req.user.id;

    const [allProgress, sessionAgg, recentSessions, userBadges] = await Promise.all([
      prisma.progress.findMany({ where: { userId } }),
      prisma.quizSession.aggregate({
        where: { userId, completedAt: { not: null } },
        _sum:   { score: true, correctAnswers: true, totalQuestions: true, timeSpentSeconds: true },
        _count: { id: true },
      }),
      prisma.quizSession.findMany({
        where: { userId, completedAt: { not: null } },
        orderBy: { completedAt: 'desc' },
        take: 5,
        include: {
          topic: {
            include: {
              subject: { select: { key: true, label: true, color: true } },
              grade:   { select: { key: true, label: true } },
            },
          },
        },
      }),
      prisma.userBadge.count({ where: { userId } }),
    ]);

    const totalCorrect   = sessionAgg._sum.correctAnswers || 0;
    const totalAttempted = sessionAgg._sum.totalQuestions  || 0;
    const totalScore     = sessionAgg._sum.score           || 0;
    const totalSessions  = sessionAgg._count.id            || 0;
    const totalTime      = sessionAgg._sum.timeSpentSeconds || 0;

    res.json({
      totalScore,
      totalSessions,
      totalTimeSeconds: totalTime,
      overallAccuracy:  totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
      totalCorrect,
      totalAttempted,
      topicsStarted:    allProgress.length,
      topicsMastered:   allProgress.filter(p => p.masteryPct >= 85).length,
      topicsProficient: allProgress.filter(p => p.masteryPct >= 60).length,
      badgesEarned:     userBadges,
      recentSessions,
    });
  } catch (err) { next(err); }
}

module.exports = { getMyProgress, getTopicProgress, getSubjectProgress, getSummary };
