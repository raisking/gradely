export const databaseModels = {
  users: {
    description: 'Login identity and role for every Questly account.',
    fields: ['id', 'email', 'password_hash', 'display_name', 'role', 'avatar_url', 'is_active', 'last_login_at'],
    relationships: ['parent_profiles.user_id', 'student_profiles.user_id'],
  },
  parent_profiles: {
    description: 'Parent billing, notification, and family management profile.',
    fields: ['id', 'user_id', 'phone', 'billing_email', 'notification_preferences'],
    relationships: ['users.id', 'student_profiles.parent_profile_id', 'subscriptions.parent_profile_id'],
  },
  student_profiles: {
    description: 'Student learner profile connected to a user, grade, and optional parent.',
    fields: ['id', 'user_id', 'parent_profile_id', 'grade_id', 'first_name', 'date_of_birth', 'school_name', 'learning_goal'],
    relationships: ['users.id', 'parent_profiles.id', 'grades.id', 'quiz_attempts.student_profile_id', 'progress_tracking.student_profile_id'],
  },
  subjects: {
    description: 'Catalog subjects such as Math, Language arts, Science, Social studies, and Spanish.',
    fields: ['id', 'slug', 'name', 'description', 'display_order'],
    relationships: ['topics.subject_id'],
  },
  grades: {
    description: 'Grade levels from Pre-K through twelfth grade.',
    fields: ['id', 'code', 'name', 'display_order'],
    relationships: ['student_profiles.grade_id', 'topics.grade_id'],
  },
  topics: {
    description: 'Grade and subject skills that hold quiz questions.',
    fields: ['id', 'grade_id', 'subject_id', 'parent_topic_id', 'slug', 'title', 'description', 'category_code', 'display_order', 'is_published'],
    relationships: ['grades.id', 'subjects.id', 'quiz_questions.topic_id', 'progress_tracking.topic_id'],
  },
  quiz_questions: {
    description: 'Practice questions for each topic.',
    fields: ['id', 'topic_id', 'prompt', 'question_type', 'choices', 'correct_answer', 'explanation', 'difficulty', 'points', 'is_published'],
    relationships: ['topics.id', 'quiz_attempt_answers.quiz_question_id'],
  },
  quiz_attempts: {
    description: 'One student quiz session for one topic.',
    fields: ['id', 'student_profile_id', 'topic_id', 'status', 'score', 'total_points', 'correct_count', 'question_count', 'started_at', 'completed_at'],
    relationships: ['student_profiles.id', 'topics.id', 'quiz_attempt_answers.quiz_attempt_id'],
  },
  progress_tracking: {
    description: 'Rollup mastery, attempts, accuracy, and streak data per student/topic.',
    fields: ['id', 'student_profile_id', 'topic_id', 'attempts_count', 'correct_count', 'mastery_percent', 'best_score', 'current_streak', 'last_practiced_at'],
    relationships: ['student_profiles.id', 'topics.id'],
  },
  user_learning_state: {
    description: 'Saved React learning state for each account so dashboard progress is restored after login.',
    fields: ['user_id', 'progress_data', 'stats_data', 'updated_at'],
    relationships: ['users.id'],
  },
  badges: {
    description: 'Achievement definitions and unlock rules.',
    fields: ['id', 'slug', 'name', 'description', 'icon', 'criteria', 'points_awarded', 'is_active'],
    relationships: ['student_badges.badge_id'],
  },
  subscriptions: {
    description: 'Membership plans for parent accounts.',
    fields: ['id', 'parent_profile_id', 'plan_code', 'status', 'price_cents', 'currency', 'seats', 'provider', 'provider_subscription_id', 'current_period_start', 'current_period_end', 'cancel_at_period_end'],
    relationships: ['parent_profiles.id', 'payments.subscription_id', 'invoices.subscription_id'],
  },
  payments: {
    description: 'Payment transaction records.',
    fields: ['id', 'subscription_id', 'parent_profile_id', 'amount_cents', 'currency', 'status', 'provider', 'provider_payment_id', 'paid_at', 'failure_reason'],
    relationships: ['subscriptions.id', 'parent_profiles.id', 'invoices.payment_id'],
  },
  invoices: {
    description: 'Billing invoices and totals.',
    fields: ['id', 'subscription_id', 'payment_id', 'parent_profile_id', 'invoice_number', 'status', 'subtotal_cents', 'tax_cents', 'total_cents', 'currency', 'due_at', 'paid_at'],
    relationships: ['subscriptions.id', 'payments.id', 'parent_profiles.id', 'invoice_line_items.invoice_id'],
  },
};

export const requiredDatabaseTables = Object.keys(databaseModels);
