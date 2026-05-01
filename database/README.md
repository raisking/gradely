# Gradely Database

This folder defines the relational database foundation for Gradely.

The current React app still runs in demo mode with session state, but these
tables are ready for the backend/API layer that will persist accounts, quiz
practice, progress, achievements, subscriptions, payments, and invoices.

## Files

- `schema.sql` - PostgreSQL schema with tables, foreign keys, indexes, and
  update triggers.
- `seed.sql` - Starter grade and subject records used by the learning catalog.

## Suggested Setup

```bash
createdb gradely
psql gradely -f database/schema.sql
psql gradely -f database/seed.sql
```

## Core Tables

- `users`
- `parent_profiles`
- `student_profiles`
- `grades`
- `subjects`
- `topics`
- `quiz_questions`
- `quiz_attempts`
- `quiz_attempt_answers`
- `progress_tracking`
- `badges`
- `student_badges`
- `subscriptions`
- `payments`
- `invoices`
- `invoice_line_items`
- `user_learning_state`

## Local API

The React app will try to save accounts and progress through `http://localhost:4000/api`.

```bash
set DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/gradely
npm run start:api
```

If the API is not running, Gradely keeps a browser-local fallback so the UI can
still be tested. With the API running, new accounts and progress are saved to
PostgreSQL.
