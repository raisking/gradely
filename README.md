# Gradely

An educational platform for Pre-K through Grade 12. Students practice skills across Math, ELA, Science, and Social Studies with adaptive quizzes, progress tracking, badges, and a subscription tier.

## Repository layout

```
prai/
├── learnquest/      React frontend (Create React App)
├── gradely-api/     Node.js / Express REST API + Prisma ORM
└── learnquest.jsx   Original single-file prototype (reference only)
```

## Quick start

### Frontend

```bash
cd learnquest
npm install
npm start          # http://localhost:3001
```

### Backend API

```bash
cd gradely-api
npm install
cp .env.example .env   # fill in DATABASE_URL and STRIPE_SECRET_KEY
npx prisma migrate dev
npm run dev            # http://localhost:4000
```

The frontend talks to `http://localhost:4000` by default (`FRONTEND_URL` env var controls CORS).

## Environment variables

### `gradely-api/.env`

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Yes | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Yes | Secret for refresh tokens |
| `STRIPE_SECRET_KEY` | Yes | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `FRONTEND_URL` | No | Allowed CORS origin (default: `http://localhost:3001`) |
| `PORT` | No | API port (default: 4000) |
| `NODE_ENV` | No | `development` or `production` |

### `learnquest/.env`

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend base URL (default: `http://localhost:4000`) |

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Lucide React, CSS-in-JS |
| Backend | Node.js, Express 4, Prisma 5 |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens), bcrypt |
| Billing | Stripe |

## Further reading

- [VS Code setup guide](VSCODE_SETUP.md) — step-by-step: install dependencies, extensions, run both servers
- [Frontend docs](learnquest/README.md)
- [Frontend quick start](learnquest/QUICK_START.md)
- [Frontend implementation guide](learnquest/IMPLEMENTATION_GUIDE.md)
- [API docs](gradely-api/README.md)
