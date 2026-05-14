const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { notFound, badReq } = require('../utils/errors');

const prisma = new PrismaClient();

// ── Users ─────────────────────────────────────────────────────────────────────

// GET /api/admin/users?role=&search=&page=&limit=
async function listUsers(req, res, next) {
  try {
    const { role, search, page = '1', limit = '25' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (role)   where.role  = role;
    if (search) where.OR = [
      { email:     { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName:  { contains: search, mode: 'insensitive' } },
    ];

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, role: true, firstName: true, lastName: true,
          isActive: true, emailVerified: true, lastLoginAt: true, createdAt: true,
          grade: { select: { key: true, label: true } },
          subscription: { select: { status: true, plan: { select: { name: true } } } },
          _count: { select: { quizSessions: true, userBadges: true } },
        },
      }),
    ]);

    res.json({ total, page: parseInt(page), limit: parseInt(limit), users });
  } catch (err) { next(err); }
}

// GET /api/admin/users/:id
async function getUser(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        grade: true,
        subscription: { include: { plan: true, invoices: { take: 5, orderBy: { createdAt: 'desc' } } } },
        userBadges:   { include: { badge: true }, orderBy: { earnedAt: 'desc' } },
        _count: { select: { quizSessions: true, progress: true } },
      },
    });
    if (!user) return next(notFound('User not found.'));

    const { passwordHash, resetToken, verificationToken, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) { next(err); }
}

// PUT /api/admin/users/:id
async function updateUser(req, res, next) {
  try {
    const { firstName, lastName, role, isActive, emailVerified, gradeKey } = req.body;

    const data = {};
    if (firstName !== undefined)    data.firstName    = firstName;
    if (lastName  !== undefined)    data.lastName     = lastName;
    if (role)                        data.role         = role;
    if (isActive  !== undefined)    data.isActive     = isActive;
    if (emailVerified !== undefined) data.emailVerified = emailVerified;

    if (gradeKey) {
      const grade = await prisma.grade.findUnique({ where: { key: gradeKey } });
      if (!grade) return next(badReq('Invalid grade.'));
      data.gradeId = grade.id;
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, role: true, firstName: true, lastName: true, isActive: true },
    });

    res.json(user);
  } catch (err) { next(err); }
}

// DELETE /api/admin/users/:id  (hard delete)
async function deleteUser(req, res, next) {
  try {
    if (req.params.id === req.user.id) return next(badReq('Cannot delete your own account.'));
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted.' });
  } catch (err) { next(err); }
}

// POST /api/admin/users/:id/reset-password
async function adminResetPassword(req, res, next) {
  try {
    const { newPassword } = req.body;
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.params.id }, data: { passwordHash } });
    await prisma.refreshToken.deleteMany({ where: { userId: req.params.id } });
    res.json({ message: 'Password reset.' });
  } catch (err) { next(err); }
}

// ── Quiz Content ──────────────────────────────────────────────────────────────

// GET /api/admin/content/topics?subjectKey=&gradeKey=
async function listTopics(req, res, next) {
  try {
    const { subjectKey, gradeKey, page = '1', limit = '25' } = req.query;
    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (subjectKey) {
      const sub = await prisma.subject.findUnique({ where: { key: subjectKey } });
      if (sub) where.subjectId = sub.id;
    }
    if (gradeKey) {
      const grade = await prisma.grade.findUnique({ where: { key: gradeKey } });
      if (grade) where.gradeId = grade.id;
    }

    const [total, topics] = await Promise.all([
      prisma.topic.count({ where }),
      prisma.topic.findMany({
        where, skip, take: parseInt(limit),
        include: {
          subject: { select: { key: true, label: true } },
          grade:   { select: { key: true, label: true, order: true } },
          _count:  { select: { questions: true } },
        },
        orderBy: [{ grade: { order: 'asc' } }, { title: 'asc' }],
      }),
    ]);

    res.json({ total, page: parseInt(page), topics });
  } catch (err) { next(err); }
}

// POST /api/admin/content/topics
async function createTopic(req, res, next) {
  try {
    const { subjectKey, gradeKey, title, description } = req.body;

    const [subject, grade] = await Promise.all([
      prisma.subject.findUnique({ where: { key: subjectKey } }),
      prisma.grade.findUnique({ where: { key: gradeKey } }),
    ]);

    if (!subject) return next(badReq('Invalid subject.'));
    if (!grade)   return next(badReq('Invalid grade.'));

    const topic = await prisma.topic.create({
      data: { subjectId: subject.id, gradeId: grade.id, title, description },
      include: { subject: true, grade: true },
    });

    res.status(201).json(topic);
  } catch (err) { next(err); }
}

// PUT /api/admin/content/topics/:id
async function updateTopic(req, res, next) {
  try {
    const { title, description, isActive } = req.body;
    const topic = await prisma.topic.update({
      where: { id: req.params.id },
      data:  { title, description, isActive },
      include: { subject: true, grade: true },
    });
    res.json(topic);
  } catch (err) { next(err); }
}

// DELETE /api/admin/content/topics/:id
async function deleteTopic(req, res, next) {
  try {
    await prisma.topic.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Topic deactivated.' });
  } catch (err) { next(err); }
}

// GET /api/admin/content/questions?topicId=
async function listQuestions(req, res, next) {
  try {
    const { topicId, page = '1', limit = '25' } = req.query;
    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const where = topicId ? { topicId } : {};

    const [total, questions] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where, skip, take: parseInt(limit),
        include: { topic: { include: { subject: { select: { key: true } }, grade: { select: { key: true } } } } },
        orderBy: [{ topicId: 'asc' }, { difficulty: 'asc' }],
      }),
    ]);

    res.json({ total, page: parseInt(page), questions });
  } catch (err) { next(err); }
}

// POST /api/admin/content/questions
async function createQuestion(req, res, next) {
  try {
    const { topicId, type = 'MCQ', prompt, difficulty = 1, options, answer, hint, explanation } = req.body;

    if (!topicId || !prompt || !answer) return next(badReq('topicId, prompt, and answer are required.'));

    const question = await prisma.question.create({
      data: { topicId, type, prompt, difficulty, options: options || null, answer, hint, explanation },
    });

    res.status(201).json(question);
  } catch (err) { next(err); }
}

// PUT /api/admin/content/questions/:id
async function updateQuestion(req, res, next) {
  try {
    const { prompt, difficulty, options, answer, hint, explanation, isActive } = req.body;
    const question = await prisma.question.update({
      where: { id: req.params.id },
      data:  { prompt, difficulty, options, answer, hint, explanation, isActive },
    });
    res.json(question);
  } catch (err) { next(err); }
}

// DELETE /api/admin/content/questions/:id  (soft delete)
async function deleteQuestion(req, res, next) {
  try {
    await prisma.question.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Question deactivated.' });
  } catch (err) { next(err); }
}

// ── Admin Stats ───────────────────────────────────────────────────────────────

// GET /api/admin/stats
async function getStats(_req, res, next) {
  try {
    const [
      userCounts, sessionAgg, recentRegistrations, subscriptionCounts, topTopics,
    ] = await Promise.all([
      prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
      prisma.quizSession.aggregate({
        where: { completedAt: { not: null } },
        _count: { id: true },
        _sum:   { score: true, timeSpentSeconds: true },
        _avg:   { accuracyPct: true },
      }),
      prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.subscription.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.quizSession.groupBy({
        by: ['topicId'],
        where: { completedAt: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ]);

    const topTopicIds = topTopics.map(t => t.topicId);
    const topTopicDetails = await prisma.topic.findMany({
      where: { id: { in: topTopicIds } },
      include: { subject: { select: { label: true } }, grade: { select: { label: true } } },
    });

    const topicMap = new Map(topTopicDetails.map(t => [t.id, t]));

    res.json({
      users: {
        byRole:        Object.fromEntries(userCounts.map(r => [r.role, r._count.id])),
        newThisWeek:   recentRegistrations,
        total:         userCounts.reduce((s, r) => s + r._count.id, 0),
      },
      quizzes: {
        totalCompleted: sessionAgg._count.id     || 0,
        totalScore:     sessionAgg._sum.score     || 0,
        avgAccuracy:    Math.round(sessionAgg._avg.accuracyPct || 0),
        totalTimeHours: Math.round((sessionAgg._sum.timeSpentSeconds || 0) / 3600),
      },
      subscriptions: Object.fromEntries(subscriptionCounts.map(r => [r.status, r._count.id])),
      topTopics: topTopics.map(t => ({
        sessions: t._count.id,
        topic:    topicMap.get(t.topicId),
      })),
    });
  } catch (err) { next(err); }
}

module.exports = {
  listUsers, getUser, updateUser, deleteUser, adminResetPassword,
  listTopics, createTopic, updateTopic, deleteTopic,
  listQuestions, createQuestion, updateQuestion, deleteQuestion,
  getStats,
};
