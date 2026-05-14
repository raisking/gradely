const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱  Seeding database...');

  // ── Grades ─────────────────────────────────────────────────────────────────
  const gradesData = [
    { key: 'prek', label: 'Pre-K',      color: '#EC4899', emoji: '🌈', order: 0 },
    { key: 'k',    label: 'Kindergarten', color: '#F97316', emoji: '🎨', order: 1 },
    { key: '1',    label: 'Grade 1',    color: '#EAB308', emoji: '⭐', order: 2 },
    { key: '2',    label: 'Grade 2',    color: '#22C55E', emoji: '🌱', order: 3 },
    { key: '3',    label: 'Grade 3',    color: '#06B6D4', emoji: '🚀', order: 4 },
    { key: '4',    label: 'Grade 4',    color: '#6366F1', emoji: '🔬', order: 5 },
    { key: '5',    label: 'Grade 5',    color: '#8B5CF6', emoji: '📚', order: 6 },
    { key: '6',    label: 'Grade 6',    color: '#EC4899', emoji: '🎯', order: 7 },
    { key: '7',    label: 'Grade 7',    color: '#0EA5E9', emoji: '💡', order: 8 },
    { key: '8',    label: 'Grade 8',    color: '#14B8A6', emoji: '🧪', order: 9 },
    { key: '9',    label: 'Grade 9',    color: '#EAB308', emoji: '🎓', order: 10 },
    { key: '10',   label: 'Grade 10',   color: '#F97316', emoji: '🏆', order: 11 },
    { key: '11',   label: 'Grade 11',   color: '#7C3AED', emoji: '🧠', order: 12 },
    { key: '12',   label: 'Grade 12',   color: '#2563EB', emoji: '🌟', order: 13 },
  ];

  for (const g of gradesData) {
    await prisma.grade.upsert({ where: { key: g.key }, update: g, create: g });
  }
  console.log('  ✓  Grades');

  // ── Subjects ────────────────────────────────────────────────────────────────
  const subjectsData = [
    { key: 'math',    label: 'Math',           iconName: 'Calculator',   color: '#2563EB', bgColor: '#EFF6FF', tagline: 'Numbers, shapes & patterns' },
    { key: 'ela',     label: 'ELA',            iconName: 'BookOpen',     color: '#D946EF', bgColor: '#FDF4FF', tagline: 'Reading, writing & grammar' },
    { key: 'science', label: 'Science',        iconName: 'FlaskConical', color: '#059669', bgColor: '#ECFDF5', tagline: 'Discover how the world works' },
    { key: 'social',  label: 'Social Studies', iconName: 'Globe2',       color: '#D97706', bgColor: '#FFFBEB', tagline: 'History, geography & civics' },
  ];

  for (const s of subjectsData) {
    await prisma.subject.upsert({ where: { key: s.key }, update: s, create: s });
  }
  console.log('  ✓  Subjects');

  // ── Sample Topics ──────────────────────────────────────────────────────────
  const mathSubject = await prisma.subject.findUnique({ where: { key: 'math' } });
  const elaSubject  = await prisma.subject.findUnique({ where: { key: 'ela' } });
  const sciSubject  = await prisma.subject.findUnique({ where: { key: 'science' } });
  const gradeK      = await prisma.grade.findUnique({ where: { key: 'k' } });
  const grade1      = await prisma.grade.findUnique({ where: { key: '1' } });
  const grade3      = await prisma.grade.findUnique({ where: { key: '3' } });

  const topicsData = [
    { subjectId: mathSubject.id, gradeId: gradeK.id,  title: 'Counting to 10',       description: 'Count objects up to 10' },
    { subjectId: mathSubject.id, gradeId: grade1.id,  title: 'Addition within 20',   description: 'Add two numbers with sum up to 20' },
    { subjectId: mathSubject.id, gradeId: grade3.id,  title: 'Multiplication basics', description: 'Multiply single-digit numbers' },
    { subjectId: elaSubject.id,  gradeId: gradeK.id,  title: 'Letter Recognition',   description: 'Identify uppercase and lowercase letters' },
    { subjectId: elaSubject.id,  gradeId: grade1.id,  title: 'Sight Words',          description: 'Read common high-frequency words' },
    { subjectId: sciSubject.id,  gradeId: grade3.id,  title: 'Animal Habitats',      description: 'Learn where different animals live' },
  ];

  const createdTopics = [];
  for (const t of topicsData) {
    const topic = await prisma.topic.upsert({
      where: { id: (await prisma.topic.findFirst({ where: { title: t.title, gradeId: t.gradeId } }))?.id || 'new' },
      update: t,
      create: t,
    });
    createdTopics.push(topic);
  }
  console.log('  ✓  Topics');

  // ── Sample Questions ────────────────────────────────────────────────────────
  const countingTopic = createdTopics.find(t => t.title === 'Counting to 10');
  const additionTopic = createdTopics.find(t => t.title === 'Addition within 20');
  const multiplyTopic = createdTopics.find(t => t.title === 'Multiplication basics');

  const questionsData = [
    // Counting to 10
    { topicId: countingTopic.id, type: 'MCQ',  prompt: 'How many apples? 🍎🍎🍎', difficulty: 'EASY',   options: ['2','3','4','5'], answer: '3', hint: 'Count each apple one by one.' },
    { topicId: countingTopic.id, type: 'MCQ',  prompt: 'What number comes after 7?', difficulty: 'EASY',   options: ['6','7','8','9'], answer: '8', hint: 'Count forward from 7.' },
    { topicId: countingTopic.id, type: 'FILL', prompt: 'Count the stars ⭐⭐⭐⭐⭐. Type the number.', difficulty: 'EASY',   answer: '5', hint: 'Count each star.' },

    // Addition within 20
    { topicId: additionTopic.id, type: 'MCQ',  prompt: '7 + 8 = ?', difficulty: 'EASY',   options: ['13','14','15','16'], answer: '15', hint: 'Try counting on from 8.' },
    { topicId: additionTopic.id, type: 'FILL', prompt: '9 + 6 = __', difficulty: 'EASY',   answer: '15', hint: 'Start at 9 and count 6 more.' },
    { topicId: additionTopic.id, type: 'MCQ',  prompt: '12 + 7 = ?', difficulty: 'MEDIUM', options: ['17','18','19','20'], answer: '19', hint: 'Add the ones: 2+7=9, bring down the 1.' },

    // Multiplication basics
    { topicId: multiplyTopic.id, type: 'MCQ',  prompt: '3 × 4 = ?', difficulty: 'EASY',   options: ['7','10','12','14'], answer: '12', hint: '3 groups of 4.' },
    { topicId: multiplyTopic.id, type: 'FILL', prompt: '6 × 7 = __', difficulty: 'MEDIUM', answer: '42', hint: '6 sevens: 7,14,21,28,35,42.' },
    { topicId: multiplyTopic.id, type: 'MCQ',  prompt: '9 × 8 = ?', difficulty: 'HARD',   options: ['63','72','81','70'], answer: '72', hint: '9 eights — or 8 nines.' },
  ];

  for (const q of questionsData) {
    await prisma.question.create({ data: q });
  }
  console.log('  ✓  Questions');

  // ── Badges ─────────────────────────────────────────────────────────────────
  const badgesData = [
    // ── Progress ──────────────────────────────────────────────────────────────
    { key: 'first_quiz',   name: 'First Steps',      emoji: '👣', category: 'Progress',     rarity: 'COMMON',    pointsValue: 10,  description: 'Complete your very first quiz',          requirementType: 'sessions',  requirementValue: 1    },
    { key: 'quiz_10',      name: 'Getting Started',  emoji: '🌱', category: 'Progress',     rarity: 'COMMON',    pointsValue: 25,  description: 'Complete 10 quizzes',                    requirementType: 'sessions',  requirementValue: 10   },
    { key: 'quiz_50',      name: 'On a Roll',        emoji: '🔥', category: 'Progress',     rarity: 'RARE',      pointsValue: 75,  description: 'Complete 50 quizzes',                    requirementType: 'sessions',  requirementValue: 50   },
    { key: 'quiz_100',     name: 'Century Club',     emoji: '💯', category: 'Progress',     rarity: 'EPIC',      pointsValue: 150, description: 'Complete 100 quizzes',                   requirementType: 'sessions',  requirementValue: 100  },
    { key: 'quiz_500',     name: 'Quiz Legend',      emoji: '🚀', category: 'Progress',     rarity: 'LEGENDARY', pointsValue: 500, description: 'Complete 500 quizzes',                   requirementType: 'sessions',  requirementValue: 500  },
    // ── Streak ────────────────────────────────────────────────────────────────
    { key: 'streak_3',     name: 'Hat Trick',        emoji: '🎩', category: 'Streak',       rarity: 'COMMON',    pointsValue: 20,  description: 'Practice 3 days in a row',               requirementType: 'streak',    requirementValue: 3    },
    { key: 'streak_7',     name: 'Week Warrior',     emoji: '⚔️', category: 'Streak',       rarity: 'RARE',      pointsValue: 60,  description: 'Practice 7 days in a row',               requirementType: 'streak',    requirementValue: 7    },
    { key: 'streak_30',    name: 'Monthly Master',   emoji: '📅', category: 'Streak',       rarity: 'EPIC',      pointsValue: 200, description: 'Practice 30 days in a row',              requirementType: 'streak',    requirementValue: 30   },
    { key: 'streak_100',   name: 'Unstoppable',      emoji: '⚡', category: 'Streak',       rarity: 'LEGENDARY', pointsValue: 750, description: 'Practice 100 days in a row',             requirementType: 'streak',    requirementValue: 100  },
    // ── Performance ───────────────────────────────────────────────────────────
    { key: 'accuracy_80',  name: 'Good Aim',         emoji: '🎯', category: 'Performance',  rarity: 'COMMON',    pointsValue: 15,  description: 'Score 80%+ accuracy in a single quiz',   requirementType: 'accuracy',  requirementValue: 80   },
    { key: 'accuracy_90',  name: 'Sharp Shooter',    emoji: '🏹', category: 'Performance',  rarity: 'RARE',      pointsValue: 40,  description: 'Score 90%+ accuracy in a single quiz',   requirementType: 'accuracy',  requirementValue: 90   },
    { key: 'accuracy_100', name: 'Perfect Score',    emoji: '⭐', category: 'Performance',  rarity: 'EPIC',      pointsValue: 100, description: 'Score 100% accuracy in a single quiz',   requirementType: 'accuracy',  requirementValue: 100  },
    // ── Mastery ───────────────────────────────────────────────────────────────
    { key: 'mastery_1',    name: 'Topic Master',     emoji: '👑', category: 'Mastery',      rarity: 'RARE',      pointsValue: 50,  description: 'Reach mastery level on 1 topic',         requirementType: 'mastery',   requirementValue: 1    },
    { key: 'mastery_5',    name: 'Knowledge Seeker', emoji: '🧠', category: 'Mastery',      rarity: 'EPIC',      pointsValue: 200, description: 'Reach mastery level on 5 topics',        requirementType: 'mastery',   requirementValue: 5    },
    { key: 'mastery_20',   name: 'Scholar',          emoji: '🎓', category: 'Mastery',      rarity: 'LEGENDARY', pointsValue: 600, description: 'Reach mastery level on 20 topics',       requirementType: 'mastery',   requirementValue: 20   },
    // ── Score ─────────────────────────────────────────────────────────────────
    { key: 'score_100',    name: 'Point Starter',    emoji: '🌟', category: 'Score',        rarity: 'COMMON',    pointsValue: 0,   description: 'Earn 100 total points',                  requirementType: 'score',     requirementValue: 100  },
    { key: 'score_500',    name: 'Point Collector',  emoji: '🏅', category: 'Score',        rarity: 'COMMON',    pointsValue: 0,   description: 'Earn 500 total points',                  requirementType: 'score',     requirementValue: 500  },
    { key: 'score_5000',   name: 'High Achiever',    emoji: '🏆', category: 'Score',        rarity: 'RARE',      pointsValue: 0,   description: 'Earn 5,000 total points',                requirementType: 'score',     requirementValue: 5000 },
    { key: 'score_25000',  name: 'Elite Scholar',    emoji: '💎', category: 'Score',        rarity: 'LEGENDARY', pointsValue: 0,   description: 'Earn 25,000 total points',               requirementType: 'score',     requirementValue: 25000},
  ];

  for (const b of badgesData) {
    await prisma.badge.upsert({ where: { key: b.key }, update: b, create: b });
  }
  console.log('  ✓  Badges');

  // ── Subscription Plans ──────────────────────────────────────────────────────
  // (moved up, kept identical — no change needed)

  // ── Subscription Plans ──────────────────────────────────────────────────────
  const plansData = [
    {
      stripePriceId:   process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
      stripeProductId: 'prod_gradely_placeholder',
      name:            'Gradely Monthly',
      interval:        'MONTHLY',
      priceCents:      1299,
      features:        JSON.stringify([
        'Unlimited practice across all subjects',
        'Access to all 17,000+ skills',
        'Real-time progress tracking',
        'Personalized recommendations',
        'Badge & achievement system',
        'Parent progress dashboard',
      ]),
    },
    {
      stripePriceId:   process.env.STRIPE_ANNUAL_PRICE_ID || 'price_annual_placeholder',
      stripeProductId: 'prod_gradely_placeholder',
      name:            'Gradely Annual',
      interval:        'ANNUAL',
      priceCents:      9900,
      features:        JSON.stringify([
        'Everything in Monthly',
        'Save 37% vs monthly',
        'Priority support',
        'Downloadable progress reports',
        'Early access to new features',
        'Multi-child family accounts',
      ]),
    },
  ];

  for (const p of plansData) {
    await prisma.subscriptionPlan.upsert({
      where:  { stripePriceId: p.stripePriceId },
      update: p,
      create: p,
    });
  }
  console.log('  ✓  Subscription plans');

  // ── Demo users ─────────────────────────────────────────────────────────────
  // grade3 was fetched above for topics — reuse it here.

  const demoUsers = [
    {
      email: 'admin@gradely.com',
      password: 'Admin@12345!',
      role: 'ADMIN',
      firstName: 'Gradely',
      lastName: 'Admin',
    },
    {
      email: 'parent@gradely.com',
      password: 'Parent@12345!',
      role: 'PARENT',
      firstName: 'Sarah',
      lastName: 'Johnson',
      profile: 'parent',
    },
    {
      email: 'student@gradely.com',
      password: 'Student@12345!',
      role: 'STUDENT',
      firstName: 'Emma',
      lastName: 'Johnson',
      gradeId: grade3?.id,
      profile: 'student',
    },
  ];

  for (const u of demoUsers) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } });
    if (exists) continue;

    const user = await prisma.user.create({
      data: {
        email:         u.email,
        passwordHash:  await bcrypt.hash(u.password, 12),
        role:          u.role,
        firstName:     u.firstName,
        lastName:      u.lastName,
        gradeId:       u.gradeId || null,
        emailVerified: true,
        isActive:      true,
        avatarColor:   u.role === 'STUDENT' ? '#2563EB' : u.role === 'PARENT' ? '#059669' : '#0C5CA8',
      },
    });

    // Create role-specific profile
    if (u.profile === 'student') {
      await prisma.studentProfile.create({
        data: {
          userId:               user.id,
          schoolName:           'Maple Street Elementary',
          teacherName:          'Ms. Rivera',
          learningGoalText:     'Get better at multiplication and reading comprehension',
          weeklyGoalMinutes:    45,
          preferredSubjects:    JSON.stringify(['math', 'science']),
          difficultyPreference: 2,
        },
      });
    }

    if (u.profile === 'parent') {
      await prisma.parentProfile.create({
        data: {
          userId:                  user.id,
          notifyOnQuizComplete:    true,
          notifyOnBadgeEarned:     true,
          notifyWeeklySummary:     true,
          notifyDailyReminder:     false,
          preferredContactMethod:  'EMAIL',
        },
      });
    }

    console.log(`  ✓  ${u.role.toLowerCase()} user  (${u.email} / ${u.password})`);
  }

  // Link demo parent → student
  const parentUser  = await prisma.user.findUnique({ where: { email: 'parent@gradely.com' } });
  const studentUser = await prisma.user.findUnique({ where: { email: 'student@gradely.com' } });
  if (parentUser && studentUser) {
    await prisma.parentChild.upsert({
      where:  { parentId_childId: { parentId: parentUser.id, childId: studentUser.id } },
      update: {},
      create: { parentId: parentUser.id, childId: studentUser.id },
    });
    console.log('  ✓  Parent→student link');
  }

  console.log('\n✅  Seed complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => prisma.$disconnect());
