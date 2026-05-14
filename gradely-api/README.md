# Gradely API

Express REST API for the Gradely educational platform. Handles authentication, the quiz engine, progress tracking, achievements, and Stripe billing.

## Stack

- **Runtime:** Node.js
- **Framework:** Express 4
- **ORM:** Prisma 5
- **Database:** PostgreSQL
- **Auth:** JWT (access + refresh tokens stored in HTTP-only cookies)
- **Billing:** Stripe

## Setup

```bash
npm install
cp .env.example .env   # add DATABASE_URL, JWT secrets, Stripe keys
npx prisma migrate dev
npm run dev            # starts on http://localhost:4000
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Production server |
| `npm run dev` | Dev server with auto-reload (nodemon) |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed initial catalog data |
| `npm run db:studio` | Open Prisma Studio |

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Signing secret for access tokens |
| `JWT_REFRESH_SECRET` | Signing secret for refresh tokens |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret |
| `FRONTEND_URL` | Allowed CORS origin (default: `http://localhost:3001`) |
| `PORT` | Server port (default: 4000) |
| `NODE_ENV` | `development` or `production` |

## Source layout

```
src/
├── routes/          Express routers (one file per domain)
├── controllers/     Request handlers
├── services/        Business logic (auth, stripe)
├── middleware/       authenticate, requireRole, stripe webhook
└── utils/           Error classes, shared helpers
```

## API reference

All routes are prefixed with `/api`. Authentication uses JWT access tokens delivered via `Authorization: Bearer <token>` header or HTTP-only cookie. Refresh tokens live in an HTTP-only cookie.

Rate limits: 300 req / 15 min globally; 20 req / 15 min on auth endpoints.

---

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Create account. Body: `email`, `password`, `firstName`, `lastName`, `role` (`STUDENT`/`PARENT`/`TEACHER`), optional `gradeKey` |
| POST | `/login` | — | Sign in. Returns access token + sets refresh cookie |
| POST | `/refresh` | Cookie | Exchange refresh token for new access token |
| POST | `/logout` | Cookie | Revoke refresh token |
| POST | `/forgot-password` | — | Send reset email |
| POST | `/reset-password` | — | Confirm reset with token + new password |
| GET | `/verify-email` | — | Confirm email address via link token |

---

### Users — `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/me` | Required | Current user profile |
| PATCH | `/me` | Required | Update profile fields |
| PATCH | `/me/password` | Required | Change password |
| DELETE | `/me` | Required | Delete account |

---

### Quiz engine — `/api/quiz`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/subjects` | — | List all subjects |
| GET | `/grades` | — | List all grade levels |
| GET | `/topics` | — | List topics (filterable by `?grade=&subject=`) |
| GET | `/topics/:id` | — | Single topic with questions |
| GET | `/questions` | Required | Fetch questions for a session |
| POST | `/sessions` | Required | Start a quiz session |
| POST | `/sessions/:id/answer` | Required | Submit an answer |
| POST | `/sessions/:id/complete` | Required | Finish a session and record results |
| GET | `/sessions/history` | Required | Past session history |

---

### Progress — `/api/progress`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Required | Full progress record for the current user |
| GET | `/summary` | Required | Aggregated stats (accuracy, mastery, streaks) |
| GET | `/topic/:topicId` | Required | Progress for a single topic |
| GET | `/subject/:subjectKey` | Required | Progress for an entire subject |

---

### Achievements — `/api/achievements`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Required | All achievements + earned status |
| GET | `/earned` | Required | Only earned achievements |

---

### Subscription — `/api/subscription`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/webhook` | Stripe sig | Stripe webhook receiver (raw body — registered before JSON parser) |
| GET | `/plans` | Required | Available subscription plans |
| GET | `/status` | Required | Current subscription status |
| POST | `/checkout` | Required | Create Stripe Checkout session |
| POST | `/cancel` | Required | Cancel subscription |
| POST | `/reactivate` | Required | Reactivate canceled subscription |
| POST | `/change-plan` | Required | Switch billing tier or interval |
| GET | `/invoices` | Required | Invoice history |
| GET | `/portal` | Required | Stripe customer portal URL |

---

### Admin — `/api/admin`

Requires `ADMIN` role.

| Method | Path | Description |
|---|---|---|
| GET | `/users` | List all users |
| GET | `/users/:id` | Get a user |
| PATCH | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |
| GET | `/stats` | Platform-wide statistics |

---

## Data model overview

Key Prisma models:

| Model | Description |
|---|---|
| `User` | Core identity — email, password hash, role, name |
| `StudentProfile` | Grade level, XP, streak, linked parent |
| `ParentProfile` | Linked children, notification preferences |
| `Subject` | e.g. Math, ELA, Science, Social Studies |
| `Grade` | Grade level (Pre-K → 12) |
| `Topic` | Skill within a subject/grade |
| `Question` | Question with type (MCQ/FILL/TRUE_FALSE), difficulty, options, answer |
| `QuizSession` | A practice session tied to a user and topic |
| `QuizAnswer` | Individual answer within a session |
| `Progress` | Running accuracy and mastery per user per topic |
| `Achievement` | Badge definition (type, rarity, unlock condition) |
| `UserAchievement` | Junction: which user earned which achievement |
| `Subscription` | Stripe subscription record |
| `Payment` | Payment / invoice record |

## Health check

```
GET /health
→ { "status": "ok", "time": "..." }
```
