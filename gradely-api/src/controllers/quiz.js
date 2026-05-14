const { PrismaClient } = require('@prisma/client');
const { notFound, badReq, forbidden } = require('../utils/errors');

const prisma = new PrismaClient();

// Helper: compute mastery from progress record
function computeMastery(progress) {
  if (!progress || progress.totalAttempted === 0) return 0;
  const accuracy  = progress.totalCorrect / progress.totalAttempted;
  const sessions  = Math.min(progress.totalSessions / 10, 1);     // caps at 1 after 10 sessions
  return Math.round((accuracy * 0.8 + sessions * 0.2) * 100);
}

// Helper: award points per session
function sessionScore(correctAnswers, totalQuestions, timeSpentSeconds) {
  const base       = correctAnswers * 10;
  const bonus      = totalQuestions > 0 && correctAnswers === totalQuestions ? 25 : 0;
  const speedBonus = timeSpentSeconds < 120 ? 10 : timeSpentSeconds < 300 ? 5 : 0;
  return base + bonus + speedBonus;
}

// GET /api/quiz/subjects
async function getSubjects(_req, res, next) {
  try {
    const subjects = await prisma.subject.findMany({ orderBy: { label: 'asc' } });
    res.json(subjects);
  } catch (err) { next(err); }
}

// GET /api/quiz/grades
async function getGrades(_req, res, next) {
  try {
    const grades = await prisma.grade.findMany({ orderBy: { order: 'asc' } });
    res.json(grades);
  } catch (err) { next(err); }
}

// GET /api/quiz/topics?subject=math&grade=3
async function getTopics(req, res, next) {
  try {
    const { subject: subjectKey, grade: gradeKey } = req.query;

    const where = { isActive: true };

    if (subjectKey) {
      const sub = await prisma.subject.findUnique({ where: { key: subjectKey } });
      if (!sub) return next(notFound('Subject not found.'));
      where.subjectId = sub.id;
    }

    if (gradeKey) {
      const grade = await prisma.grade.findUnique({ where: { key: gradeKey } });
      if (!grade) return next(notFound('Grade not found.'));
      where.gradeId = grade.id;
    }

    const topics = await prisma.topic.findMany({
      where,
      include: {
        subject: { select: { key: true, label: true, color: true, bgColor: true } },
        grade:   { select: { key: true, label: true, order: true } },
        _count:  { select: { questions: { where: { isActive: true } } } },
      },
      orderBy: [{ grade: { order: 'asc' } }, { title: 'asc' }],
    });

    res.json(topics);
  } catch (err) { next(err); }
}

// GET /api/quiz/topics/:id
async function getTopic(req, res, next) {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: req.params.id },
      include: {
        subject: true,
        grade: true,
        _count: { select: { questions: { where: { isActive: true } } } },
      },
    });
    if (!topic) return next(notFound());
    res.json(topic);
  } catch (err) { next(err); }
}

// GET /api/quiz/questions?topicId=&difficulty=&limit=10
async function getQuestions(req, res, next) {
  try {
    const { topicId, difficulty, limit = '10' } = req.query;
    if (!topicId) return next(badReq('topicId is required.'));

    const where = { topicId, isActive: true };
    if (difficulty) where.difficulty = parseInt(difficulty);

    const questions = await prisma.question.findMany({
      where,
      take: parseInt(limit),
      orderBy: { difficulty: 'asc' },
      select: { id: true, type: true, prompt: true, difficulty: true, options: true, hint: true },
    });

    res.json(questions);
  } catch (err) { next(err); }
}

// POST /api/quiz/sessions  — start a new quiz session
async function startSession(req, res, next) {
  try {
    const { topicId } = req.body;
    if (!topicId) return next(badReq('topicId is required.'));

    const topic = await prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic || !topic.isActive) return next(notFound('Topic not found.'));

    const existingProgress = await prisma.progress.findUnique({
      where: { userId_topicId: { userId: req.user.id, topicId } },
    });

    const session = await prisma.quizSession.create({
      data: {
        userId:       req.user.id,
        topicId,
        masteryBefore: existingProgress ? computeMastery(existingProgress) : 0,
      },
    });

    res.status(201).json({ sessionId: session.id });
  } catch (err) { next(err); }
}

// POST /api/quiz/sessions/:id/answer
async function submitAnswer(req, res, next) {
  try {
    const { questionId, userAnswer, timeSpentMs = 0 } = req.body;
    const sessionId = req.params.id;

    const session = await prisma.quizSession.findUnique({ where: { id: sessionId } });
    if (!session) return next(notFound('Session not found.'));
    if (session.userId !== req.user.id) return next(forbidden());
    if (session.completedAt) return next(badReq('Session already completed.'));

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return next(notFound('Question not found.'));

    const isCorrect = question.answer.trim().toLowerCase() === userAnswer.trim().toLowerCase();

    await prisma.quizAnswer.create({
      data: { sessionId, questionId, userAnswer, isCorrect, timeSpentMs },
    });

    await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        totalQuestions:   { increment: 1 },
        correctAnswers:   { increment: isCorrect ? 1 : 0 },
        timeSpentSeconds: { increment: Math.round(timeSpentMs / 1000) },
      },
    });

    res.json({
      isCorrect,
      correctAnswer: isCorrect ? undefined : question.answer,
      explanation:   question.explanation,
      hint:          !isCorrect ? question.hint : undefined,
    });
  } catch (err) { next(err); }
}

// POST /api/quiz/sessions/:id/complete
async function completeSession(req, res, next) {
  try {
    const sessionId = req.params.id;

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { topic: true },
    });

    if (!session) return next(notFound());
    if (session.userId !== req.user.id) return next(forbidden());
    if (session.completedAt) return next(badReq('Session already completed.'));

    const accuracy = session.totalQuestions > 0
      ? (session.correctAnswers / session.totalQuestions) * 100
      : 0;

    const score = sessionScore(session.correctAnswers, session.totalQuestions, session.timeSpentSeconds);

    // Upsert progress
    const progress = await prisma.progress.upsert({
      where:  { userId_topicId: { userId: session.userId, topicId: session.topicId } },
      update: {
        totalSessions:  { increment: 1 },
        totalCorrect:   { increment: session.correctAnswers },
        totalAttempted: { increment: session.totalQuestions },
        lastPracticed:  new Date(),
      },
      create: {
        userId:         session.userId,
        topicId:        session.topicId,
        totalSessions:  1,
        totalCorrect:   session.correctAnswers,
        totalAttempted: session.totalQuestions,
        lastPracticed:  new Date(),
      },
    });

    const newMastery = computeMastery(progress);
    await prisma.progress.update({
      where: { id: progress.id },
      data:  { masteryPct: newMastery },
    });

    const completed = await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date(),
        accuracyPct: accuracy,
        score,
        masteryAfter: newMastery,
      },
    });

    // Check and award badges
    const newBadges = await checkAndAwardBadges(session.userId);

    res.json({
      session: completed,
      accuracy: Math.round(accuracy),
      score,
      masteryAfter: newMastery,
      newBadges,
    });
  } catch (err) { next(err); }
}

// GET /api/quiz/sessions/history
async function getHistory(req, res, next) {
  try {
    const { limit = '20', offset = '0', topicId } = req.query;
    const where = { userId: req.user.id, completedAt: { not: null } };
    if (topicId) where.topicId = topicId;

    const [total, sessions] = await Promise.all([
      prisma.quizSession.count({ where }),
      prisma.quizSession.findMany({
        where,
        orderBy: { completedAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
        include: {
          topic: {
            include: {
              subject: { select: { key: true, label: true, color: true } },
              grade:   { select: { key: true, label: true } },
            },
          },
        },
      }),
    ]);

    res.json({ total, sessions });
  } catch (err) { next(err); }
}

// Badge check after session completion
async function checkAndAwardBadges(userId) {
  const [sessionCount, userBadges, badges, progressList] = await Promise.all([
    prisma.quizSession.count({ where: { userId, completedAt: { not: null } } }),
    prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } }),
    prisma.badge.findMany({ where: { isActive: true } }),
    prisma.progress.findMany({ where: { userId } }),
  ]);

  const earnedIds = new Set(userBadges.map(ub => ub.badgeId));
  const totalScore = (await prisma.quizSession.aggregate({
    where: { userId, completedAt: { not: null } },
    _sum: { score: true },
  }))._sum.score || 0;

  const masteredCount = progressList.filter(p => p.masteryPct >= 85).length;

  const newBadges = [];

  for (const badge of badges) {
    if (earnedIds.has(badge.id)) continue;

    let earned = false;
    switch (badge.requirementType) {
      case 'sessions':  earned = sessionCount >= badge.requirementValue; break;
      case 'score':     earned = totalScore   >= badge.requirementValue; break;
      case 'mastery':   earned = masteredCount >= badge.requirementValue; break;
    }

    if (earned) {
      await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
      newBadges.push(badge);
    }
  }

  return newBadges;
}

module.exports = { getSubjects, getGrades, getTopics, getTopic, getQuestions, startSession, submitAnswer, completeSession, getHistory };
