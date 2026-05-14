# Running Gradely in VS Code

This guide covers every step from a fresh machine to a running app.

---

## 1. Install system dependencies

### Node.js (required)

Download and install from **https://nodejs.org** — choose the **LTS** version (18 or later).

Verify the install:

```
node --version    # should print v18.x.x or higher
npm --version     # should print 9.x.x or higher
```

### PostgreSQL (required for the API)

**Option A — Local install (Windows)**

1. Download from https://www.postgresql.org/download/windows
2. Run the installer, set a password for the `postgres` user, keep the default port `5432`
3. After install, open **pgAdmin** (installed with PostgreSQL) or use the `psql` terminal

**Option B — Free cloud database (easier, no install)**

Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app). Each gives you a free PostgreSQL instance and a ready-made `DATABASE_URL` connection string to paste into your `.env`.

---

## 2. Install VS Code extensions

Open VS Code, press `Ctrl+Shift+X` to open Extensions, and install:

| Extension | Publisher | Why |
|---|---|---|
| **ESLint** | Microsoft | Highlights JavaScript/React errors inline |
| **Prettier - Code formatter** | Prettier | Auto-formats code on save |
| **Prisma** | Prisma | Syntax highlighting for `schema.prisma` |
| **DotENV** | mikestead | Syntax highlighting for `.env` files |
| **Thunder Client** | Rangav | In-editor REST client for testing API endpoints |

Optional but useful:

| Extension | Publisher | Why |
|---|---|---|
| **GitLens** | GitKraken | Enhanced git history and blame |
| **Auto Rename Tag** | Jun Han | Renames matching JSX/HTML tags together |
| **Path Intellisense** | Christian Kohler | Autocompletes file paths in imports |

---

## 3. Open the project

1. In VS Code: **File → Open Folder**
2. Navigate to and select the `prai` folder
3. VS Code will open all three sub-folders (`learnquest`, `gradely-api`, etc.) together

---

## 4. Install project dependencies

Open the integrated terminal: **Terminal → New Terminal** (`Ctrl+`` ` ``)

**Frontend (learnquest):**

```bash
cd learnquest
npm install
```

**Backend API (gradely-api):**

```bash
cd gradely-api
npm install
```

---

## 5. Set up environment variables

Each sub-project needs its own `.env` file. Copy the examples and fill in your values.

**Frontend:**

```bash
cd learnquest
copy .env.example .env
```

Open `learnquest\.env` and set:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/wijs
JWT_SECRET=any-long-random-string
CLIENT_ORIGIN=http://localhost:3001
REACT_APP_API_BASE=http://localhost:4000/api
```

**Backend API:**

```bash
cd gradely-api
copy .env.example .env
```

Open `gradely-api\.env` and set:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/gradely
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
JWT_ACCESS_SECRET=any-long-random-string
JWT_REFRESH_SECRET=a-different-long-random-string
STRIPE_SECRET_KEY=sk_test_...        # from your Stripe dashboard
STRIPE_WEBHOOK_SECRET=whsec_...      # from your Stripe dashboard
```

To generate a random secret you can paste directly:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Stripe keys are only needed for billing features. The rest of the app works without them.

---

## 6. Set up the database

If you used a cloud database, skip the first two steps — your database already exists.

**Create a local database (pgAdmin or psql):**

```sql
CREATE DATABASE gradely;
CREATE DATABASE wijs;
```

**Run Prisma migrations (gradely-api):**

```bash
cd gradely-api
npx prisma migrate dev
npx prisma db seed
```

**Run SQL schema (learnquest):**

```bash
cd learnquest
psql -U postgres -d wijs -f database/schema.sql
psql -U postgres -d wijs -f database/seed.sql
```

---

## 7. Run the app

You need two terminals running at the same time — one for each server.

**Terminal 1 — Backend API:**

```bash
cd gradely-api
npm run dev
```

You should see:

```
🎓  Gradely API running on http://localhost:4000
    Environment : development
    DB          : ✓ configured
```

**Terminal 2 — Frontend:**

```bash
cd learnquest
npm start
```

The browser opens automatically at **http://localhost:3001**.

---

## 8. Run both servers with one click (VS Code Tasks)

A `.vscode/tasks.json` is included in this project. Use it to start both servers together:

1. Press `Ctrl+Shift+P`
2. Type **Run Task**
3. Select **Start Gradely (API + Frontend)**

Both terminals open side by side and both servers start automatically.

---

## 9. Useful VS Code shortcuts

| Shortcut | Action |
|---|---|
| `` Ctrl+` `` | Open / close integrated terminal |
| `Ctrl+Shift+`` ` `` | New terminal panel |
| `Ctrl+P` | Quick-open any file by name |
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+Shift+F` | Search across all files |
| `F5` | Start debugger |
| `Ctrl+Shift+X` | Extensions panel |

---

## 10. Troubleshooting

### `npm: command not found`
Node.js is not installed or not on your PATH. Re-install from nodejs.org and restart VS Code.

### `Port 3001 already in use`
Another process is using that port. Kill it or change the port:

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <pid> /F
```

### `DATABASE_URL not set` warning on API start
You didn't create the `.env` file or the `DATABASE_URL` value is missing. Follow step 5 again.

### `Cannot find module` errors
Run `npm install` again inside the affected folder. If it still fails, delete `node_modules` and reinstall:

```bash
rmdir /s /q node_modules
npm install
```

### Prisma errors on migration
Make sure PostgreSQL is running and `DATABASE_URL` points to an existing database. Then run:

```bash
npx prisma migrate reset   # drops and recreates all tables
```
