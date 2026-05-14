# Gradely

Gradely is a React learning app for Pre-K through Grade 12 with grade browsing, subject skills, adaptive practice, progress tracking, badges, and analytics.

## Scripts

- `npm start` runs the development server.
- `npm run build` creates a production build.
- `npm test` starts the test runner.

## Local URL

The dev server is currently configured to run at:

`http://localhost:3001`

## Database

Database requirements are defined in `database/schema.sql`, with starter catalog data in `database/seed.sql`.
The schema includes users, parent profiles, student profiles, grades, subjects, topics, quiz questions,
quiz attempts, progress tracking, badges, subscriptions, payments, and invoices.

The account API is in `server/server.js`. Configure `DATABASE_URL`, then run:

```bash
npm run start:api
```
