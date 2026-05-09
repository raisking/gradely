-- Questly database schema
-- Run this once against your PostgreSQL database to create all tables.
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS and CREATE INDEX IF NOT EXISTS.

-- Enable UUID generation (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text        UNIQUE NOT NULL,
  password_hash   text        NOT NULL,
  display_name    text        NOT NULL DEFAULT '',
  role            text        NOT NULL DEFAULT 'student'
                              CHECK (role IN ('student','parent','teacher','admin')),
  avatar_url      text,
  is_active       boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  last_login_at   timestamptz
);

-- ─── Student profiles ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_profiles (
  user_id          uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  first_name       text NOT NULL DEFAULT '',
  date_of_birth    date,
  school_name      text,
  learning_goal    text,
  grade_id         text   -- e.g. 'k', '1', '2' … '5'
);

-- ─── Parent profiles ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parent_profiles (
  user_id                  uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  phone                    text,
  billing_email            text NOT NULL DEFAULT '',
  notification_preferences jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- ─── Learning state (React progress blob per user) ────────────────────────────
CREATE TABLE IF NOT EXISTS user_learning_state (
  user_id       uuid        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  progress_data jsonb       NOT NULL DEFAULT '{}'::jsonb,
  stats_data    jsonb       NOT NULL DEFAULT '{}'::jsonb,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ─── Subscriptions ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_code                text        NOT NULL DEFAULT 'free'
                                       CHECK (plan_code IN ('free','family','school')),
  status                   text        NOT NULL DEFAULT 'active'
                                       CHECK (status IN ('active','cancelled','past_due','trialing')),
  price_cents              integer     NOT NULL DEFAULT 0,
  currency                 text        NOT NULL DEFAULT 'usd',
  seats                    integer     NOT NULL DEFAULT 1,
  provider                 text,                      -- e.g. 'stripe'
  provider_subscription_id text,
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean     NOT NULL DEFAULT false,
  created_at               timestamptz NOT NULL DEFAULT now()
);

-- ─── Payments ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id     uuid        REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id             uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_cents        integer     NOT NULL,
  currency            text        NOT NULL DEFAULT 'usd',
  status              text        NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending','succeeded','failed','refunded')),
  provider            text,
  provider_payment_id text,
  paid_at             timestamptz,
  failure_reason      text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email            ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role             ON users(role);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user     ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status   ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user          ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_state_updated ON user_learning_state(updated_at);
