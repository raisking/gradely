const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { notFound, forbidden, badReq } = require('../utils/errors');

const prisma = new PrismaClient();

const SAFE_SELECT = {
  id: true, email: true, role: true, firstName: true, lastName: true,
  phoneNumber: true, timezone: true, locale: true,
  gradeId: true, avatarUrl: true, avatarColor: true,
  isActive: true, emailVerified: true,
  lastLoginAt: true, createdAt: true,
  grade: { select: { key: true, label: true, emoji: true, color: true } },
  studentProfile: true,
  parentProfile:  true,
  subscription: {
    select: {
      status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true, trialEnd: true,
      plan: { select: { name: true, interval: true, priceCents: true, currency: true } },
    },
  },
};

// GET /api/users/me
async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: SAFE_SELECT });
    if (!user) return next(notFound('User not found.'));
    res.json(user);
  } catch (err) { next(err); }
}

// PUT /api/users/me
async function updateMe(req, res, next) {
  try {
    const { firstName, lastName, gradeKey, avatarUrl } = req.body;

    const data = {};
    if (firstName)  data.firstName = firstName;
    if (lastName)   data.lastName  = lastName;
    if (avatarUrl)  data.avatarUrl = avatarUrl;

    if (gradeKey) {
      const grade = await prisma.grade.findUnique({ where: { key: gradeKey } });
      if (!grade) return next(badReq('Invalid grade.'));
      data.gradeId = grade.id;
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: SAFE_SELECT,
    });

    res.json(user);
  } catch (err) { next(err); }
}

// PUT /api/users/me/password
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return next(badReq('Current password is incorrect.'));

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });

    res.json({ message: 'Password changed.' });
  } catch (err) { next(err); }
}

// DELETE /api/users/me  (soft delete)
async function deleteMe(req, res, next) {
  try {
    await prisma.user.update({ where: { id: req.user.id }, data: { isActive: false } });
    res.json({ message: 'Account deactivated.' });
  } catch (err) { next(err); }
}

// ── Parent / Child ─────────────────────────────────────────────────────────────

// GET /api/users/me/children  (parent only)
async function getMyChildren(req, res, next) {
  try {
    const relations = await prisma.parentChild.findMany({
      where: { parentId: req.user.id },
      include: {
        child: {
          select: {
            ...SAFE_SELECT,
            _count: { select: { quizSessions: true } },
          },
        },
      },
    });
    res.json(relations.map(r => r.child));
  } catch (err) { next(err); }
}

// POST /api/users/link-child  body: { childEmail }
async function linkChild(req, res, next) {
  try {
    if (req.user.role !== 'PARENT' && req.user.role !== 'ADMIN') return next(forbidden());

    const { childEmail } = req.body;
    const child = await prisma.user.findUnique({ where: { email: childEmail } });
    if (!child) return next(notFound('No account found with that email.'));
    if (child.role !== 'STUDENT') return next(badReq('Linked account must be a student.'));
    if (child.id === req.user.id) return next(badReq('Cannot link yourself.'));

    const link = await prisma.parentChild.create({
      data: { parentId: req.user.id, childId: child.id },
    });

    res.status(201).json({ message: 'Child linked.', childId: child.id });
  } catch (err) { next(err); }
}

// DELETE /api/users/children/:childId
async function unlinkChild(req, res, next) {
  try {
    await prisma.parentChild.deleteMany({
      where: { parentId: req.user.id, childId: req.params.childId },
    });
    res.json({ message: 'Child unlinked.' });
  } catch (err) { next(err); }
}

// GET /api/users/children/:childId/progress  (parent viewing child)
async function getChildProgress(req, res, next) {
  try {
    const link = await prisma.parentChild.findFirst({
      where: { parentId: req.user.id, childId: req.params.childId },
    });
    if (!link && req.user.role !== 'ADMIN') return next(forbidden());

    const progress = await prisma.progress.findMany({
      where: { userId: req.params.childId },
      include: {
        topic: {
          include: {
            subject: { select: { key: true, label: true, color: true } },
            grade:   { select: { key: true, label: true } },
          },
        },
      },
      orderBy: { lastPracticed: 'desc' },
    });

    res.json(progress);
  } catch (err) { next(err); }
}

module.exports = { getMe, updateMe, changePassword, deleteMe, getMyChildren, linkChild, unlinkChild, getChildProgress };
