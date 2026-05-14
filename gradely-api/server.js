require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit    = require('express-rate-limit');

const authRoutes         = require('./src/routes/auth');
const userRoutes         = require('./src/routes/users');
const quizRoutes         = require('./src/routes/quiz');
const progressRoutes     = require('./src/routes/progress');
const achievementRoutes  = require('./src/routes/achievements');
const subscriptionRoutes = require('./src/routes/subscription');
const adminRoutes        = require('./src/routes/admin');
const { errorHandler }   = require('./src/utils/errors');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods:     ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// ── Rate limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false });
const authLimiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 20,  standardHeaders: true, legacyHeaders: false, message: { error: 'TOO_MANY_REQUESTS', message: 'Too many login attempts. Try again in 15 minutes.' } });

app.use(globalLimiter);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());

// ── Stripe webhook (raw body — must come BEFORE express.json) ─────────────────
app.use('/api/subscription', subscriptionRoutes);

// ── JSON body parser ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',         authLimiter, authRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/quiz',         quizRoutes);
app.use('/api/progress',     progressRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/admin',        adminRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'NOT_FOUND', message: 'Route not found.' }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎓  Gradely API running on http://localhost:${PORT}`);
  console.log(`    Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`    DB          : ${process.env.DATABASE_URL ? '✓ configured' : '⚠ DATABASE_URL not set'}`);
  console.log(`    Stripe      : ${process.env.STRIPE_SECRET_KEY ? '✓ configured' : '⚠ STRIPE_SECRET_KEY not set'}\n`);
});

module.exports = app;
