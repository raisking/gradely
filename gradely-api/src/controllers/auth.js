const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { signAccess, generateRefreshToken, refreshExpiresAt } = require('../utils/jwt');
const { verifyRefresh } = require('../utils/jwt');
const { badReq, conflict, unauth } = require('../utils/errors');

const prisma = new PrismaClient();

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { email, password, firstName, lastName, role = 'STUDENT', gradeKey } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return next(conflict('Email already registered.'));

    // CRIT-4: TEACHER/ADMIN roles must be provisioned by an existing admin, never self-registered.
    const allowedRoles = ['STUDENT', 'PARENT'];
    if (!allowedRoles.includes(role)) return next(badReq('Invalid role.'));

    let gradeId = null;
    if (gradeKey) {
      const grade = await prisma.grade.findUnique({ where: { key: gradeKey } });
      if (grade) gradeId = grade.id;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, role, gradeId, verificationToken },
      select: { id: true, email: true, role: true, firstName: true, lastName: true, gradeId: true, emailVerified: true, createdAt: true },
    });

    // Auto-create role-specific profile
    if (role === 'STUDENT') {
      await prisma.studentProfile.create({ data: { userId: user.id } });
    } else if (role === 'PARENT') {
      await prisma.parentProfile.create({ data: { userId: user.id } });
    }

    const accessToken  = signAccess({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: refreshExpiresAt() },
    });

    // TODO: send verification email with verificationToken

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) { next(err); }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return next(unauth('Invalid credentials.'));

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return next(unauth('Invalid credentials.'));

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const accessToken  = signAccess({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: refreshExpiresAt() },
    });

    const { passwordHash: _, verificationToken: __, resetToken: ___, ...safeUser } = user;
    res.json({ user: safeUser, accessToken, refreshToken });
  } catch (err) { next(err); }
}

// POST /api/auth/refresh
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(badReq('Refresh token required.'));

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } });
      return next(unauth('Refresh token expired or invalid.'));
    }

    const { user } = stored;
    if (!user.isActive) return next(unauth('Account deactivated.'));

    // Rotate: delete old, create new
    await prisma.refreshToken.delete({ where: { id: stored.id } });

    const newRefresh = generateRefreshToken();
    await prisma.refreshToken.create({
      data: { token: newRefresh, userId: user.id, expiresAt: refreshExpiresAt() },
    });

    const accessToken = signAccess({ id: user.id, email: user.email, role: user.role });
    res.json({ accessToken, refreshToken: newRefresh });
  } catch (err) { next(err); }
}

// POST /api/auth/logout
async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.json({ message: 'Logged out.' });
  } catch (err) { next(err); }
}

// POST /api/auth/forgot-password
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return 200 to avoid user enumeration
    if (user) {
      const resetToken  = crypto.randomBytes(32).toString('hex');
      const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry: resetExpiry },
      });

      // TODO: send email with resetToken link
      // C-6: Never log tokens in production — they are account-takeover primitives.
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
      }
    }

    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) { next(err); }
}

// POST /api/auth/reset-password
async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });
    if (!user) return next(badReq('Reset token is invalid or has expired.'));

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExpiry: null },
    });

    // Revoke all refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    res.json({ message: 'Password reset successfully.' });
  } catch (err) { next(err); }
}

// GET /api/auth/verify-email?token=...
async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) return next(badReq('Invalid verification token.'));

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null },
    });

    res.json({ message: 'Email verified.' });
  } catch (err) { next(err); }
}

module.exports = { register, login, refresh, logout, forgotPassword, resetPassword, verifyEmail };
