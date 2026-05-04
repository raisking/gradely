import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles, Trophy, Flame, Star, Target, BookOpen, Calculator, FlaskConical,
  Globe2, ChevronRight, ChevronLeft, Check, X, Lightbulb, RotateCcw, Menu,
  TrendingUp, BarChart3, GraduationCap,
  Heart, Crown, ArrowRight, Brain,
  Lock, CheckCircle2, Circle, Play, Settings, Users, Search, UserCircle
} from 'lucide-react';
import {
  clearSavedSession,
  createAccount,
  emptyStats,
  loadSavedSession,
  saveLearningState,
  signInAccount,
} from './services/accountStorage';

/* =========================================================================
   Gradely — A complete educational platform inspired by Gradely
   Single-file React app with working practice engine, progress tracking,
   gamification, and adaptive difficulty.
   ========================================================================= */

// ---------- DATA LAYER ----------
// In a production app this would come from an API. Structured to make
// content management trivial: just add to these objects.

const GRADES = [
  { id: 'prek', label: 'Pre-K', color: '#FF6B9D', emoji: '🌈' },
  { id: 'k',    label: 'Kindergarten', color: '#FF8C42', emoji: '🎨' },
  { id: '1',    label: 'Grade 1', color: '#FFB627', emoji: '⭐' },
  { id: '2',    label: 'Grade 2', color: '#7DCE82', emoji: '🌱' },
  { id: '3',    label: 'Grade 3', color: '#3DB2FF', emoji: '🚀' },
  { id: '4',    label: 'Grade 4', color: '#5C7AEA', emoji: '🔬' },
  { id: '5',    label: 'Grade 5', color: '#9B5DE5', emoji: '📚' },
  { id: '6',    label: 'Grade 6', color: '#F15BB5', emoji: '🎯' },
  { id: '7',    label: 'Grade 7', color: '#00BBF9', emoji: '💡' },
  { id: '8',    label: 'Grade 8', color: '#00F5D4', emoji: '🧪' },
  { id: '9',    label: 'Grade 9', color: '#FEE440', emoji: '🎓' },
  { id: '10',   label: 'Grade 10', color: '#FB5607', emoji: '🏆' },
  { id: '11',   label: 'Grade 11', color: '#8338EC', emoji: '🧠' },
  { id: '12',   label: 'Grade 12', color: '#3A86FF', emoji: '🌟' },
];

const SUBJECTS = {
  math:    { label: 'Math',           icon: Calculator,   color: '#2563EB', bg: '#EFF6FF', tagline: 'Numbers, shapes & patterns' },
  ela:     { label: 'ELA',            icon: BookOpen,     color: '#D946EF', bg: '#FDF4FF', tagline: 'Reading, writing & grammar' },
  science: { label: 'Science',        icon: FlaskConical, color: '#059669', bg: '#ECFDF5', tagline: 'Discover how the world works' },
  social:  { label: 'Social Studies', icon: Globe2,       color: '#D97706', bg: '#FFFBEB', tagline: 'History, geography & civics' },
};

// Skill catalog. Each skill has a curated set of questions across types.
// Difficulty levels: 1 (easy) → 3 (hard). Adaptive engine selects accordingly.
const SKILLS = {
  // ============ MATH — PRE-K ============
  'math-prek-counting': {
    id: 'math-prek-counting', subject: 'math', grade: 'prek',
    title: 'Counting to 5', description: 'Count objects and recognize numbers up to 5',
    explanation: 'Counting helps us know "how many" of something we have. Point to each item as you count: 1, 2, 3, 4, 5!',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'How many apples? 🍎🍎🍎', options: ['2','3','4','5'], answer: '3', hint: 'Count each apple one at a time.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'How many stars? ⭐⭐', options: ['1','2','3','4'], answer: '2', hint: 'Touch each star as you count.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'How many balloons? 🎈', options: ['1','2','3','4'], answer: '1', hint: 'Just one balloon!' },
      { id: 'q4', type: 'mcq', difficulty: 1, prompt: 'How many cats? 🐱🐱🐱🐱', options: ['2','3','4','5'], answer: '4', hint: 'Count: one, two, three, four!' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'How many hearts? 💜💜💜💜💜', options: ['3','4','5','6'], answer: '5', hint: 'Count slowly: one, two, three, four, five.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'How many flowers? 🌸🌸🌸', options: ['1','2','3','4'], answer: '3', hint: 'Touch each flower.' },
      { id: 'q7', type: 'mcq', difficulty: 2, prompt: 'What number comes after 2?', options: ['1','3','4','5'], answer: '3', hint: 'Count: 1, 2, then…' },
      { id: 'q8', type: 'mcq', difficulty: 2, prompt: 'What number comes before 4?', options: ['2','3','5','6'], answer: '3', hint: 'Count backward from 4.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'Which group has MORE? 🐶🐶 or 🐱🐱🐱🐱?', options: ['Dogs','Cats'], answer: 'Cats', hint: 'Count each group, pick the bigger.' },
      { id: 'q10', type: 'mcq', difficulty: 3, prompt: 'Which is more: 4 or 2?', options: ['4','2'], answer: '4', hint: 'Bigger numbers mean more things.' },
      { id: 'q11', type: 'mcq', difficulty: 3, prompt: 'Which group has FEWER? 🍎🍎🍎🍎🍎 or 🍌🍌?', options: ['Apples','Bananas'], answer: 'Bananas', hint: 'Fewer means a smaller number.' },
    ],
  },
  'math-prek-shapes': {
    id: 'math-prek-shapes', subject: 'math', grade: 'prek',
    title: 'Basic Shapes', description: 'Recognize circles, squares, triangles, and more',
    explanation: 'Shapes are all around us! A circle is round like a ball. A square has 4 equal sides. A triangle has 3 sides.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which shape is round like a ball?', options: ['Square','Circle','Triangle','Star'], answer: 'Circle', hint: 'It has no corners.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'How many sides does a triangle have?', options: ['2','3','4','5'], answer: '3', hint: '"Tri" means three!' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which shape has 4 equal sides?', options: ['Circle','Triangle','Square','Oval'], answer: 'Square', hint: 'All sides are the same length.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'A pizza is shaped like a:', options: ['Square','Circle','Triangle','Rectangle'], answer: 'Circle', hint: 'A whole pizza is round.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A door is shaped like a:', options: ['Circle','Triangle','Rectangle','Star'], answer: 'Rectangle', hint: 'It is taller than it is wide.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'How many corners does a square have?', options: ['2','3','4','5'], answer: '4', hint: 'Count each pointy spot.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Which shape has NO corners?', options: ['Square','Triangle','Circle','Star'], answer: 'Circle', hint: 'It is smooth all the way around.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'A slice of pizza looks most like a:', options: ['Square','Circle','Triangle','Oval'], answer: 'Triangle', hint: 'It has a pointy end.' },
    ],
  },
  'math-prek-colors-patterns': {
    id: 'math-prek-colors-patterns', subject: 'math', grade: 'prek',
    title: 'Colors & Simple Patterns', description: 'Identify colors and continue easy patterns',
    explanation: 'A pattern is something that repeats. Red, blue, red, blue — the next color would be red again!',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'What color is the sun? ☀️', options: ['Blue','Yellow','Green','Purple'], answer: 'Yellow', hint: 'Bright like a banana!' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What color is grass? 🌱', options: ['Red','Green','Blue','Pink'], answer: 'Green', hint: 'Like leaves on a tree.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'What color is the sky on a sunny day?', options: ['Black','Yellow','Blue','Red'], answer: 'Blue', hint: 'Look up on a clear day!' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'What comes next? 🔴🔵🔴🔵🔴 ?', options: ['🔴','🔵','🟢','🟡'], answer: '🔵', hint: 'Red, blue, red, blue… then?' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'What comes next? ⭐🌙⭐🌙 ?', options: ['⭐','🌙','☀️','🌈'], answer: '⭐', hint: 'Star, moon, star, moon…' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'What comes next? 🍎🍎🍌🍎🍎🍌🍎🍎 ?', options: ['🍎','🍌','🍇','🍊'], answer: '🍌', hint: 'Two apples, then a banana — repeating!' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Which item does NOT belong? 🔴🔴🔵🔴', options: ['🔴 (red)','🔵 (blue)'], answer: '🔵 (blue)', hint: 'Most are red — find the odd one.' },
    ],
  },

  // ============ MATH — KINDERGARTEN ============
  'math-k-counting-10': {
    id: 'math-k-counting-10', subject: 'math', grade: 'k',
    title: 'Counting to 10', description: 'Count and compare numbers up to 10',
    explanation: 'You can count up to 10 on your fingers! 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Every number is one more than the last.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'How many fingers? ✋✋', options: ['8','9','10','11'], answer: '10', hint: 'Two whole hands!' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'How many dots? ⚫⚫⚫⚫⚫⚫⚫', options: ['5','6','7','8'], answer: '7', hint: 'Count each dot carefully.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'What number comes after 6?', options: ['5','7','8','9'], answer: '7', hint: 'Just one more than 6.' },
      { id: 'q4', type: 'mcq', difficulty: 1, prompt: 'What number comes before 9?', options: ['7','8','10','6'], answer: '8', hint: 'One less than 9.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which number is bigger: 8 or 5?', options: ['8','5'], answer: '8', hint: 'Bigger numbers come later when you count.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'Which number is smaller: 4 or 7?', options: ['4','7'], answer: '4', hint: 'Smaller numbers come first.' },
      { id: 'q7', type: 'mcq', difficulty: 2, prompt: 'Fill in: 5, 6, __, 8', options: ['7','9','4','10'], answer: '7', hint: 'Count up from 6.' },
      { id: 'q8', type: 'mcq', difficulty: 2, prompt: 'Fill in: 8, 9, __', options: ['7','10','11','6'], answer: '10', hint: 'After 9 comes 10.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'Which group has 9 stars?', options: ['⭐⭐⭐⭐⭐⭐⭐⭐','⭐⭐⭐⭐⭐⭐⭐⭐⭐','⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐','⭐⭐⭐⭐⭐⭐⭐'], answer: '⭐⭐⭐⭐⭐⭐⭐⭐⭐', hint: 'Count each row of stars.' },
      { id: 'q10', type: 'mcq', difficulty: 3, prompt: 'Tom has 6 marbles. Lily has 9. Who has MORE?', options: ['Tom','Lily'], answer: 'Lily', hint: '9 is bigger than 6.' },
    ],
  },
  'math-k-add-subtract-5': {
    id: 'math-k-add-subtract-5', subject: 'math', grade: 'k',
    title: 'Adding & Subtracting to 5', description: 'Simple add and take-away with small numbers',
    explanation: 'Adding (+) means putting groups together. Subtracting (−) means taking some away. 2 + 1 = 3. 4 − 1 = 3.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: '1 + 1 = ?', options: ['1','2','3','4'], answer: '2', hint: 'One plus one more.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: '2 + 2 = ?', options: ['3','4','5','6'], answer: '4', hint: 'Doubles! Two and two more.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: '3 + 1 = ?', options: ['2','3','4','5'], answer: '4', hint: 'Start at 3, add one more.' },
      { id: 'q4', type: 'mcq', difficulty: 1, prompt: '5 − 1 = ?', options: ['3','4','5','6'], answer: '4', hint: 'Take one away from 5.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: '2 + 3 = ?', options: ['4','5','6','7'], answer: '5', hint: 'Two plus three more.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: '4 − 2 = ?', options: ['1','2','3','4'], answer: '2', hint: 'Start with 4, take away 2.' },
      { id: 'q7', type: 'mcq', difficulty: 2, prompt: '🐶 + 🐶🐶 = how many dogs?', options: ['2','3','4','5'], answer: '3', hint: 'One dog plus two dogs.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'You have 5 cookies and eat 2. How many left? 🍪', options: ['1','2','3','4'], answer: '3', hint: '5 − 2.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: '3 + 2 is the same as:', options: ['4','5','6','7'], answer: '5', hint: 'Count up: 3, 4, 5.' },
      { id: 'q10', type: 'mcq', difficulty: 3, prompt: 'Sam has 4 cars. He gives 1 to a friend. How many now?', options: ['2','3','4','5'], answer: '3', hint: '4 − 1.' },
    ],
  },
  'math-k-shapes-2d': {
    id: 'math-k-shapes-2d', subject: 'math', grade: 'k',
    title: '2D Shapes', description: 'Identify shapes and their sides',
    explanation: '2D shapes are flat. Circles are round, squares have 4 equal sides, triangles have 3 sides, rectangles have 4 sides (2 long, 2 short).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'How many sides does a square have?', options: ['3','4','5','6'], answer: '4', hint: 'Count the edges.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'How many sides does a triangle have?', options: ['2','3','4','5'], answer: '3', hint: '"Tri" means three.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'A circle has how many corners?', options: ['0','1','3','4'], answer: '0', hint: 'It is smooth and round.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Which has 4 sides but is NOT a square?', options: ['Circle','Triangle','Rectangle','Star'], answer: 'Rectangle', hint: '2 long sides and 2 short sides.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which shape looks like a stop sign?', options: ['Circle','Square','Octagon','Triangle'], answer: 'Octagon', hint: '8 sides!' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'A clock face is most like a:', options: ['Square','Circle','Triangle','Rectangle'], answer: 'Circle', hint: 'It is round.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Which shape has more sides: square or triangle?', options: ['Square','Triangle'], answer: 'Square', hint: 'Square has 4, triangle has 3.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'A book cover is shaped like a:', options: ['Circle','Triangle','Rectangle','Star'], answer: 'Rectangle', hint: '4 sides — 2 long, 2 short.' },
    ],
  },

  // ============ MATH — GRADE 1 ============
  'math-1-addition': {
    id: 'math-1-addition', subject: 'math', grade: '1',
    title: 'Addition within 20', description: 'Add two numbers to make sums up to 20',
    explanation: 'When we add, we put two groups together. 3 + 2 means start with 3, then add 2 more, which gives us 5!',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: '3 + 4 = ?', options: ['5','6','7','8'], answer: '7', hint: 'Start at 3 and count up 4 more.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: '5 + 5 = ?', options: ['8','9','10','11'], answer: '10', hint: 'Doubles! Two hands of 5 fingers each.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: '6 + 2 = ?', options: ['7','8','9','10'], answer: '8', hint: 'Start at 6, count up 2.' },
      { id: 'q4', type: 'mcq', difficulty: 1, prompt: '4 + 4 = ?', options: ['6','7','8','9'], answer: '8', hint: 'Doubles trick!' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: '8 + 6 = ?', options: ['12','13','14','15'], answer: '14', hint: 'Try 8 + 2 = 10, then add 4 more.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: '7 + 5 = ?', options: ['10','11','12','13'], answer: '12', hint: '7 + 3 = 10, then add 2.' },
      { id: 'q7', type: 'mcq', difficulty: 2, prompt: '9 + 7 = ?', options: ['14','15','16','17'], answer: '16', hint: 'Make a 10: 9 + 1 = 10, then add 6.' },
      { id: 'q8', type: 'mcq', difficulty: 2, prompt: '6 + 6 = ?', options: ['10','11','12','13'], answer: '12', hint: 'Doubles: half a dozen plus half a dozen.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'Sara has 7 stickers. She gets 8 more. How many now?', options: ['13','14','15','16'], answer: '15', hint: 'Add 7 + 8.' },
      { id: 'q10', type: 'mcq', difficulty: 3, prompt: '13 + 6 = ?', options: ['18','19','20','21'], answer: '19', hint: 'Add the ones: 3 + 6 = 9, then add the ten.' },
      { id: 'q11', type: 'mcq', difficulty: 3, prompt: 'There are 9 birds in a tree and 4 more fly in. How many birds?', options: ['11','12','13','14'], answer: '13', hint: '9 + 4.' },
      { id: 'q12', type: 'mcq', difficulty: 3, prompt: 'Which two numbers add up to 15?', options: ['6 + 8','7 + 8','9 + 5','6 + 7'], answer: '7 + 8', hint: 'Try each pair.' },
    ],
  },
  'math-1-subtraction': {
    id: 'math-1-subtraction', subject: 'math', grade: '1',
    title: 'Subtraction within 20', description: 'Take away to find the difference',
    explanation: 'Subtraction means taking away. 8 − 3 means start with 8 and remove 3, leaving 5.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: '5 − 2 = ?', options: ['1','2','3','4'], answer: '3', hint: 'Start at 5, count back 2.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: '7 − 3 = ?', options: ['3','4','5','6'], answer: '4', hint: '7, 6, 5, 4 — count back 3.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: '10 − 5 = ?', options: ['3','4','5','6'], answer: '5', hint: 'Half of 10!' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: '12 − 4 = ?', options: ['6','7','8','9'], answer: '8', hint: 'Take 4 away from 12.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: '15 − 7 = ?', options: ['7','8','9','10'], answer: '8', hint: 'Think: 7 + ? = 15.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: '14 − 6 = ?', options: ['6','7','8','9'], answer: '8', hint: 'Count back from 14.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'There were 13 ducks. 5 swam away. How many left?', options: ['6','7','8','9'], answer: '8', hint: '13 − 5.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Sam had 18 candies. He gave 9 away. How many now?', options: ['7','8','9','10'], answer: '9', hint: '18 − 9 = half!' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'Which problem equals 6?', options: ['10 − 3','11 − 5','12 − 7','15 − 8'], answer: '11 − 5', hint: 'Calculate each one.' },
    ],
  },
  'math-1-place-value': {
    id: 'math-1-place-value', subject: 'math', grade: '1',
    title: 'Tens and Ones', description: 'Understand 2-digit numbers as tens and ones',
    explanation: 'Numbers like 24 have a "tens" place and a "ones" place. 24 = 2 tens (20) + 4 ones (4).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'In the number 23, what digit is in the tens place?', options: ['2','3','5','23'], answer: '2', hint: 'Tens is the first digit.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'In the number 47, what digit is in the ones place?', options: ['4','7','11','47'], answer: '7', hint: 'Ones is the last digit.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: '3 tens + 5 ones = ?', options: ['8','35','53','305'], answer: '35', hint: '3 tens is 30. 30 + 5 = ?' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: '1 ten + 8 ones = ?', options: ['9','18','81','108'], answer: '18', hint: '1 ten is 10. 10 + 8 = ?' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'How many tens are in 60?', options: ['0','6','16','60'], answer: '6', hint: '6 groups of 10.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Which is the same as 4 tens and 2 ones?', options: ['24','42','402','420'], answer: '42', hint: '40 + 2.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Which number is bigger: 39 or 41?', options: ['39','41'], answer: '41', hint: 'Compare the tens place first.' },
    ],
  },

  // ============ MATH — GRADE 2 ============
  'math-2-place-value-100': {
    id: 'math-2-place-value-100', subject: 'math', grade: '2',
    title: 'Place Value to 1,000', description: 'Understand hundreds, tens, and ones',
    explanation: 'A 3-digit number has hundreds, tens, and ones. 365 = 3 hundreds (300) + 6 tens (60) + 5 ones (5).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'In 247, what is in the hundreds place?', options: ['2','4','7','24'], answer: '2', hint: 'First digit on the left.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'In 538, what is in the tens place?', options: ['5','3','8','53'], answer: '3', hint: 'Middle digit.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: '4 hundreds + 0 tens + 9 ones = ?', options: ['49','409','490','940'], answer: '409', hint: '400 + 0 + 9.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Which is the same as 6 hundreds + 5 tens + 2 ones?', options: ['265','562','625','652'], answer: '652', hint: '600 + 50 + 2.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'How many tens are in 80?', options: ['0','8','18','80'], answer: '8', hint: 'Count by 10s: 10, 20, … 80.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Which is bigger: 432 or 423?', options: ['432','423'], answer: '432', hint: 'Compare the tens place.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'What is 100 more than 348?', options: ['349','358','438','448'], answer: '448', hint: 'Add 1 to the hundreds digit.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'What is 10 less than 526?', options: ['416','516','525','536'], answer: '516', hint: 'Subtract 1 from the tens digit.' },
    ],
  },
  'math-2-add-subtract-100': {
    id: 'math-2-add-subtract-100', subject: 'math', grade: '2',
    title: 'Add & Subtract within 100', description: 'Two-digit math with regrouping',
    explanation: 'Line up the tens and ones. Add ones first, then tens. If ones add to more than 9, carry a ten.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: '20 + 30 = ?', options: ['40','50','60','70'], answer: '50', hint: '2 tens + 3 tens.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: '45 + 10 = ?', options: ['46','54','55','65'], answer: '55', hint: 'Add 1 to the tens place.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: '36 + 25 = ?', options: ['51','61','62','71'], answer: '61', hint: '6 + 5 = 11. Carry the 1.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: '70 − 30 = ?', options: ['30','40','50','60'], answer: '40', hint: '7 tens − 3 tens.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: '54 − 18 = ?', options: ['34','35','36','46'], answer: '36', hint: 'Borrow from the tens place.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Mia read 28 pages on Monday and 35 on Tuesday. How many pages total?', options: ['53','62','63','73'], answer: '63', hint: '28 + 35.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'There were 82 cookies. 47 were eaten. How many left?', options: ['25','35','45','47'], answer: '35', hint: '82 − 47.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Which is closest to 50? 48, 41, 56, or 64?', options: ['48','41','56','64'], answer: '48', hint: 'Find the smallest difference from 50.' },
    ],
  },
  'math-2-time-money': {
    id: 'math-2-time-money', subject: 'math', grade: '2',
    title: 'Time & Money', description: 'Read clocks and count coins',
    explanation: 'Clocks: short hand = hours, long hand = minutes. Coins: penny=1¢, nickel=5¢, dime=10¢, quarter=25¢.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'How many cents is a dime worth?', options: ['1¢','5¢','10¢','25¢'], answer: '10¢', hint: 'A dime is small but worth more than a nickel.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'How many cents is a quarter worth?', options: ['10¢','15¢','25¢','50¢'], answer: '25¢', hint: 'A "quarter" of a dollar.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'How many minutes are in an hour?', options: ['30','45','60','100'], answer: '60', hint: 'A full circle around the clock.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'A nickel + a dime = ?', options: ['10¢','15¢','20¢','25¢'], answer: '15¢', hint: '5 + 10.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: '2 quarters = ?', options: ['25¢','50¢','75¢','$1'], answer: '50¢', hint: '25 + 25.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'How many quarters make $1.00?', options: ['2','3','4','5'], answer: '4', hint: '4 × 25¢ = 100¢.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: '3 dimes and 2 nickels = ?', options: ['25¢','30¢','40¢','50¢'], answer: '40¢', hint: '30¢ + 10¢.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'If it is 3:00 now, what time will it be in 2 hours?', options: ['4:00','5:00','6:00','3:30'], answer: '5:00', hint: 'Add 2 to the hour.' },
    ],
  },

  // ============ MATH — GRADE 3 ============
  'math-3-multiplication': {
    id: 'math-3-multiplication', subject: 'math', grade: '3',
    title: 'Multiplication Facts', description: 'Master multiplication tables 1–10',
    explanation: 'Multiplication is repeated addition. 4 × 3 means "4 groups of 3" or 3 + 3 + 3 + 3 = 12.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: '3 × 4 = ?', options: ['7','10','12','15'], answer: '12', hint: 'Three groups of 4: 4 + 4 + 4.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: '5 × 6 = ?', options: ['25','30','35','40'], answer: '30', hint: 'Count by 5s six times.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: '2 × 9 = ?', options: ['11','16','18','20'], answer: '18', hint: 'Doubles of 9.' },
      { id: 'q4', type: 'mcq', difficulty: 1, prompt: '4 × 5 = ?', options: ['15','20','25','30'], answer: '20', hint: '4 groups of 5.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: '7 × 8 = ?', options: ['54','56','58','64'], answer: '56', hint: 'A classic! 7 × 8 = 56.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: '9 × 6 = ?', options: ['45','48','54','56'], answer: '54', hint: 'Try 10 × 6 = 60, then subtract 6.' },
      { id: 'q7', type: 'mcq', difficulty: 2, prompt: '6 × 7 = ?', options: ['36','42','48','49'], answer: '42', hint: '6 × 7 = 42.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'A box holds 8 pencils. How many in 7 boxes?', options: ['49','54','56','64'], answer: '56', hint: 'Multiply 8 × 7.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: '12 × 4 = ?', options: ['44','46','48','52'], answer: '48', hint: 'Break it: 10 × 4 = 40, plus 2 × 4 = 8.' },
      { id: 'q10', type: 'mcq', difficulty: 3, prompt: 'Liam has 6 bags with 9 marbles each. How many marbles?', options: ['45','54','56','63'], answer: '54', hint: '6 × 9.' },
    ],
  },
  'math-3-division': {
    id: 'math-3-division', subject: 'math', grade: '3',
    title: 'Division Basics', description: 'Share equally and find how many in each group',
    explanation: 'Division splits into equal groups. 12 ÷ 3 means "split 12 into 3 equal groups" — each group has 4.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: '10 ÷ 2 = ?', options: ['3','4','5','6'], answer: '5', hint: 'Half of 10.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: '12 ÷ 4 = ?', options: ['2','3','4','6'], answer: '3', hint: '4 × ? = 12.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: '15 ÷ 5 = ?', options: ['2','3','4','5'], answer: '3', hint: '5 × ? = 15.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: '24 ÷ 6 = ?', options: ['3','4','5','6'], answer: '4', hint: '6 × 4 = 24.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: '36 ÷ 9 = ?', options: ['3','4','5','6'], answer: '4', hint: '9 × 4 = 36.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: '21 ÷ 3 = ?', options: ['6','7','8','9'], answer: '7', hint: '3 × 7 = 21.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: '20 cookies shared equally among 4 kids. Each gets:', options: ['4','5','6','8'], answer: '5', hint: '20 ÷ 4.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'A teacher splits 32 students into 4 equal teams. Team size?', options: ['6','7','8','9'], answer: '8', hint: '32 ÷ 4.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: '56 ÷ 8 = ?', options: ['6','7','8','9'], answer: '7', hint: '8 × 7 = 56.' },
    ],
  },
  'math-3-fractions-intro': {
    id: 'math-3-fractions-intro', subject: 'math', grade: '3',
    title: 'Intro to Fractions', description: 'Understand parts of a whole',
    explanation: 'A fraction has two parts. The bottom (denominator) is the total parts. The top (numerator) is how many we have. 1/4 means 1 part out of 4.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'In 3/4, what is the numerator?', options: ['3','4','7','12'], answer: '3', hint: 'Numerator is on top.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'In 2/5, what is the denominator?', options: ['2','5','7','10'], answer: '5', hint: 'Denominator is on the bottom.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'A pizza is cut into 8 equal pieces. Each piece is what fraction?', options: ['1/4','1/6','1/8','1/10'], answer: '1/8', hint: '1 piece out of 8.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Which fraction is bigger: 1/2 or 1/4?', options: ['1/2','1/4'], answer: '1/2', hint: 'Bigger denominators = smaller pieces.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which fraction equals one whole?', options: ['1/2','3/3','2/4','5/8'], answer: '3/3', hint: 'Top and bottom are the same.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'You eat 2 of 6 cookies. What fraction did you eat?', options: ['1/6','2/6','4/6','6/6'], answer: '2/6', hint: '2 out of 6.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Which is the SMALLEST? 1/3, 1/5, or 1/8?', options: ['1/3','1/5','1/8'], answer: '1/8', hint: 'Bigger denominator = smaller piece.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: '1/2 is the same as:', options: ['1/4','2/4','3/4','4/4'], answer: '2/4', hint: 'Half of 4 is 2.' },
    ],
  },
  'math-5-fractions': {
    id: 'math-5-fractions', subject: 'math', grade: '5',
    title: 'Adding Fractions', description: 'Add fractions with like and unlike denominators',
    explanation: 'To add fractions, the denominators (bottom numbers) must be the same. If they\'re different, find a common denominator first.',
    questions: [
      { id: 'q1', type: 'fill', difficulty: 1, prompt: '1/4 + 2/4 = ? (write as a fraction like 3/4)', answer: '3/4', hint: 'Same denominator: just add the tops.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: '1/2 + 1/4 = ?', options: ['2/6','3/4','2/4','1/4'], answer: '3/4', hint: 'Convert 1/2 to 2/4 first.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: '2/3 + 1/6 = ?', options: ['3/9','5/6','3/6','4/6'], answer: '5/6', hint: '2/3 equals 4/6. Then add 1/6.' },
      { id: 'q4', type: 'fill', difficulty: 3, prompt: '1/3 + 1/4 = ? (use a/b form, like 7/12)', answer: '7/12', hint: 'Common denominator is 12. 1/3 = 4/12, 1/4 = 3/12.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: '3/5 + 1/2 = ?', options: ['4/7','11/10','11/10','1 1/10'], answer: '11/10', hint: 'Common denominator: 10. 6/10 + 5/10.' },
    ],
  },
  'math-7-algebra': {
    id: 'math-7-algebra', subject: 'math', grade: '7',
    title: 'Solving One-Step Equations', description: 'Solve for x using inverse operations',
    explanation: 'To solve for x, do the opposite operation on both sides. If x + 5 = 12, subtract 5 from both sides to get x = 7.',
    questions: [
      { id: 'q1', type: 'fill', difficulty: 1, prompt: 'Solve: x + 8 = 15. x = ?', answer: '7', hint: 'Subtract 8 from both sides.' },
      { id: 'q2', type: 'fill', difficulty: 1, prompt: 'Solve: x - 4 = 9. x = ?', answer: '13', hint: 'Add 4 to both sides.' },
      { id: 'q3', type: 'fill', difficulty: 2, prompt: 'Solve: 3x = 21. x = ?', answer: '7', hint: 'Divide both sides by 3.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Solve: x/4 = 6. x = ?', options: ['10','24','2','1.5'], answer: '24', hint: 'Multiply both sides by 4.' },
      { id: 'q5', type: 'fill', difficulty: 3, prompt: 'Solve: -2x = 18. x = ?', answer: '-9', hint: 'Divide by -2. Watch the sign!' },
    ],
  },
  'math-9-geometry': {
    id: 'math-9-geometry', subject: 'math', grade: '9',
    title: 'Pythagorean Theorem', description: 'Find missing sides of right triangles',
    explanation: 'In a right triangle, a² + b² = c², where c is the hypotenuse (the longest side, across from the right angle).',
    questions: [
      { id: 'q1', type: 'fill', difficulty: 1, prompt: 'Legs 3 and 4. Find c (hypotenuse).', answer: '5', hint: '3² + 4² = 9 + 16 = 25. √25 = ?' },
      { id: 'q2', type: 'fill', difficulty: 1, prompt: 'Legs 6 and 8. Find c.', answer: '10', hint: 'A 3-4-5 triangle, doubled.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Legs 5 and 12. Find c.', options: ['13','15','17','7'], answer: '13', hint: '25 + 144 = 169. √169 = 13.' },
      { id: 'q4', type: 'fill', difficulty: 3, prompt: 'Hypotenuse 17, one leg 8. Find the other leg.', answer: '15', hint: '17² - 8² = 289 - 64 = 225. √225 = ?' },
    ],
  },

  'math-9-linear-relations': {
    id: 'math-9-linear-relations', subject: 'math', grade: '9',
    title: 'Linear Relations', description: 'Slope, y-intercept, and equations of lines',
    explanation: 'A linear relation has the form y = mx + b, where m is the slope (rate of change) and b is the y-intercept (starting value). Slope tells you how steep the line is; y-intercept tells you where the line crosses the y-axis.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'What is the y-intercept of the line y = 3x + 7?', options: ['3','7','-3','-7'], answer: '7', hint: 'In y = mx + b, b is the y-intercept.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What is the slope of the line y = -4x + 1?', options: ['1','-1','4','-4'], answer: '-4', hint: 'In y = mx + b, m is the slope.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'A canoe rental charges an initial fee of $5 plus $8 per hour. The equation is C = 8t + 5. What does the 5 represent?', options: ['The hourly rate','The initial charge','The total hours','The total cost'], answer: 'The initial charge', hint: 'In C = 8t + 5, the constant 5 is the flat starting cost.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'A bus trip costs $275 plus $2 per seat. Which equation gives total cost C for n seats?', options: ['C = 2n + 225','C = 2n + 275','C = -2n + 225','C = 275n + 2'], answer: 'C = 2n + 275', hint: 'Initial cost is $275; each extra seat adds $2.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A plumber charges C = 50t + 70. The hourly rate changes to $60 per hour but the flat fee stays the same. How does the graph change?', options: ['The slope increases','The slope decreases','The y-intercept increases','The y-intercept decreases'], answer: 'The slope increases', hint: 'Rate (slope) goes from 50 to 60 — a steeper line.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'A line passes through (0, 3) and (-1, 6). What is the slope?', options: ['-9','-3','3','9'], answer: '-3', hint: 'Slope = (6-3)/(-1-0) = 3/(-1) = -3.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Rewrite 3x - 2y + 16 = 0 in slope-intercept form. What are m and b?', options: ['m = 3/2, b = 8','m = -3/2, b = -8','m = 3, b = 16','m = 2/3, b = -8'], answer: 'm = 3/2, b = 8', hint: '2y = 3x + 16 → y = (3/2)x + 8.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Sarah runs a 40 km race at 10 km/h. Which equation gives the distance left, D, after t hours?', options: ['D = 40 - 10t','D = 40 + 10t','D = 10t - 40','D = 10 + 40t'], answer: 'D = 40 - 10t', hint: 'She starts at 40 km and reduces by 10 km each hour.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'At 5 PM the temperature is 4°C and drops 2°C every hour. What is the temperature at 11 PM?', options: ['2°C','-2°C','-6°C','-8°C'], answer: '-8°C', hint: '6 hours × 2°C = 12°C drop. 4 - 12 = -8°C.' },
      { id: 'q10', type: 'mcq', difficulty: 3, prompt: 'Which equation represents a linear relation?', options: ['y = x² - 5','y = 2x + 3','x² + y² = 25','y = x³'], answer: 'y = 2x + 3', hint: 'A linear relation has no exponents greater than 1 on variables.' },
    ],
  },

  'math-9-algebra-expressions': {
    id: 'math-9-algebra-expressions', subject: 'math', grade: '9',
    title: 'Algebraic Expressions', description: 'Evaluate, simplify, and expand polynomial expressions',
    explanation: 'To evaluate an expression, substitute the given value for the variable. To simplify, collect like terms. To expand, use the distributive property: a(b + c) = ab + ac.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'What is the value of 6x² when x = 1/3?', options: ['2/3','2','3','6'], answer: '2/3', hint: '6 × (1/3)² = 6 × 1/9 = 6/9 = 2/3.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What is the value of (x/3) + 2 when x = 18?', options: ['2','6','8','12'], answer: '8', hint: '18/3 + 2 = 6 + 2 = 8.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which expression represents the volume of a cube with side length x?', options: ['x²','3x','6x','x³'], answer: 'x³', hint: 'Volume = side × side × side = x³.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'The sum of two perimeters is 13x + 4y. One perimeter is 4x - 2y. What is the other perimeter?', options: ['9x + 6y','9x + 2y','17x + 6y','17x + 2y'], answer: '9x + 6y', hint: '(13x + 4y) - (4x - 2y) = 9x + 6y.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which is equivalent to 3x²(5x² - 2x + 1)?', options: ['8x² - 2x + 1','15x⁴ - 6x³ + 3x²','15x⁴ - 2x + 1','8x⁴ + x + 4'], answer: '15x⁴ - 6x³ + 3x²', hint: 'Distribute: 3x²·5x² = 15x⁴, 3x²·(-2x) = -6x³, 3x²·1 = 3x².' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'Simplify: 4a + 3b - 2a + b', options: ['2a + 4b','6a + 4b','2a + 2b','6a + 2b'], answer: '2a + 4b', hint: 'Collect like terms: (4a - 2a) + (3b + b) = 2a + 4b.' },
      { id: 'q7', type: 'mcq', difficulty: 2, prompt: 'What is the value of 2x² - 3x + 1 when x = 2?', options: ['1','3','5','7'], answer: '3', hint: '2(4) - 3(2) + 1 = 8 - 6 + 1 = 3.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Expand: 2x(3x - 4)', options: ['6x² - 8x','6x² - 4x','5x² - 2x','6x - 8'], answer: '6x² - 8x', hint: '2x × 3x = 6x²; 2x × (-4) = -8x.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'Simplify: (3x² + 5x - 2) - (x² - 2x + 4)', options: ['2x² + 7x - 6','2x² + 3x - 6','4x² + 3x + 2','2x² + 7x + 2'], answer: '2x² + 7x - 6', hint: 'Subtract each term: 3x²-x²=2x², 5x-(-2x)=7x, -2-4=-6.' },
    ],
  },

  'math-9-angles-polygons': {
    id: 'math-9-angles-polygons', subject: 'math', grade: '9',
    title: 'Angles & Polygons', description: 'Interior angles, polygon sums, and perimeter',
    explanation: 'The sum of interior angles of a polygon with n sides = (n - 2) × 180°. For example, a triangle (n=3) has 180°, a quadrilateral (n=4) has 360°, a pentagon (n=5) has 540°. Co-interior angles between parallel lines are supplementary (add to 180°).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'What is the sum of interior angles of a triangle?', options: ['90°','180°','270°','360°'], answer: '180°', hint: '(3 - 2) × 180° = 180°.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What is the sum of interior angles of a quadrilateral (4 sides)?', options: ['180°','270°','360°','450°'], answer: '360°', hint: '(4 - 2) × 180° = 360°.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'What is the sum of interior angles of a hexagon (6 sides)?', options: ['540°','720°','900°','1 080°'], answer: '720°', hint: '(6 - 2) × 180° = 4 × 180° = 720°.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'What is the sum of the interior angles of a 12-sided polygon?', options: ['1 080°','1 800°','1 980°','2 160°'], answer: '1 800°', hint: '(12 - 2) × 180° = 10 × 180° = 1 800°.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A rectangle has a perimeter of 100 cm. Which dimensions give the largest possible area?', options: ['10 cm × 40 cm','20 cm × 30 cm','25 cm × 25 cm','15 cm × 35 cm'], answer: '25 cm × 25 cm', hint: 'For a fixed perimeter, a square always gives the maximum area.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'In an isosceles triangle, one base angle is 52°. What is the vertex angle?', options: ['52°','76°','104°','128°'], answer: '76°', hint: '180° - 52° - 52° = 76°.' },
      { id: 'q7', type: 'mcq', difficulty: 2, prompt: 'Two parallel lines are cut by a transversal. One co-interior angle is 65°. What is the other co-interior angle?', options: ['65°','90°','115°','125°'], answer: '115°', hint: 'Co-interior angles add to 180°. 180° - 65° = 115°.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'A garden is a rectangle 20 m × 10 m with a semicircle of radius 7 m on one end. Which is closest to the total fencing needed (excluding the diameter side where the semicircle joins)?', options: ['60 m','70 m','75 m','85 m'], answer: '75 m', hint: 'Fence = 20 + 10 + 20 + half circumference (π×7 ≈ 22) ≈ 72 m → closest 75 m.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'Each interior angle of a regular polygon is 150°. How many sides does it have?', options: ['8','10','12','15'], answer: '12', hint: 'Each exterior angle = 180°-150° = 30°. Sides = 360°/30° = 12.' },
    ],
  },

  'math-9-cylinders-measurement': {
    id: 'math-9-cylinders-measurement', subject: 'math', grade: '9',
    title: 'Cylinders & Measurement', description: 'Calculate volume and surface area of cylinders',
    explanation: 'Volume of a cylinder: V = πr²h (π × radius² × height). Lateral surface area: A = 2πrh. Total surface area: A = 2πrh + 2πr². Remember: diameter = 2 × radius.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which formula gives the volume of a cylinder with radius r and height h?', options: ['V = πrh','V = 2πrh','V = πr²h','V = πr²'], answer: 'V = πr²h', hint: 'Volume = area of circular base × height = πr² × h.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'A cylinder has radius 3 cm and height 5 cm. What is closest to its volume?', options: ['47 cm³','94 cm³','141 cm³','188 cm³'], answer: '141 cm³', hint: 'V = π × 9 × 5 = 45π ≈ 141.4 cm³.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'A water container has radius 1.5 cm and height 5 cm. Which expression gives its volume?', options: ['V = π(3²)(5)','V = π(1.5)(5)','V = π(1.5²)(5)','V = π(2×1.5)(5)'], answer: 'V = π(1.5²)(5)', hint: 'V = πr²h = π(1.5²)(5).' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'A cylinder has volume 150 cm³ and diameter 8 cm. Which is closest to its lateral surface area (2πrh)?', options: ['38 cm²','75 cm²','150 cm²','300 cm²'], answer: '75 cm²', hint: 'r = 4; h = 150/(π×16) ≈ 2.98 cm. Lateral SA = 2π×4×2.98 ≈ 75 cm².' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A cylinder has radius 5 cm and height 12 cm. What is its volume to the nearest cm³?', options: ['188 cm³','377 cm³','942 cm³','1 885 cm³'], answer: '942 cm³', hint: 'V = π × 25 × 12 = 300π ≈ 942 cm³.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'A cylindrical case has diameter 40 mm and volume 25 120 mm³. Which is closest to its height?', options: ['2 mm','5 mm','10 mm','20 mm'], answer: '20 mm', hint: 'r = 20; h = 25 120 ÷ (π × 400) ≈ 20 mm.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: '50 identical playing chips fit tightly in the cylinder above (diameter 40 mm, height 20 mm). Which is closest to the thickness of one chip?', options: ['0.1 mm','0.4 mm','1.3 mm','2.5 mm'], answer: '0.4 mm', hint: 'Total height ÷ 50 = 20 ÷ 50 = 0.4 mm.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'A cylinder has volume 500 cm³ and height 10 cm. Which is closest to the radius?', options: ['2 cm','4 cm','8 cm','16 cm'], answer: '4 cm', hint: 'r² = 500 ÷ (π × 10) ≈ 15.9; r ≈ 4 cm.' },
    ],
  },

  'math-9-proportional-reasoning': {
    id: 'math-9-proportional-reasoning', subject: 'math', grade: '9',
    title: 'Proportional Reasoning', description: 'Ratios, proportions, unit rates, and percent problems',
    explanation: 'A proportion is two equal ratios: a/b = c/d. Cross-multiply to solve: ad = bc. Percent problems: use Part = Percent × Whole. Unit rate = total ÷ quantity (e.g. cost per gram).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Solve the proportion: 2/3 = x/120', options: ['40','80','180','240'], answer: '80', hint: 'x = 120 × (2/3) = 80.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'A recipe needs 3 cups of flour for every 2 cups of sugar. How many cups of flour for 6 cups of sugar?', options: ['4','6','9','12'], answer: '9', hint: '3/2 = x/6 → x = 9.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Four cookie brands: 200 g/$1.99, 250 g/$2.29, 300 g/$2.89, 450 g/$4.29. Which costs the least per gram?', options: ['200 g brand','250 g brand','300 g brand','450 g brand'], answer: '250 g brand', hint: '250g brand: $2.29÷250 ≈ $0.00916/g — cheapest of the four.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: '260 Grade 9 students attend school. 80% go to a school dance, and half of those buy tickets at the door. How many buy tickets at the door?', options: ['40','104','130','208'], answer: '104', hint: '260 × 0.80 = 208; 208 ÷ 2 = 104.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Movie treats total $9.76 before tax. With 13% tax and a $20 bill, what change do you receive?', options: ['$8.97','$9.76','$11.03','$11.55'], answer: '$8.97', hint: 'After tax: 9.76 × 1.13 ≈ $11.03. Change: $20 − $11.03 = $8.97.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'A phone call costs C = 0.35t + 0.60 dollars (t = minutes). How long is a call that costs $5.85?', options: ['3 min','6 min','15 min','18 min'], answer: '15 min', hint: '5.85 = 0.35t + 0.60 → 0.35t = 5.25 → t = 15.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'A map has a scale of 1:25 000. A distance on the map is 4.5 cm. What is the actual distance?', options: ['1.125 km','11.25 km','112.5 km','0.18 km'], answer: '1.125 km', hint: '4.5 cm × 25 000 = 112 500 cm = 1 125 m = 1.125 km.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'A car travels 300 km on 40 L of gasoline. How many litres are needed for 525 km?', options: ['52 L','60 L','70 L','75 L'], answer: '70 L', hint: 'Rate = 40/300 L/km. 525 × (40/300) = 70 L.' },
    ],
  },

  // ============ ELA — PRE-K ============
  'ela-prek-letters-az': {
    id: 'ela-prek-letters-az', subject: 'ela', grade: 'prek',
    title: 'Letters of the Alphabet', description: 'Learn to recognize all 26 letters',
    explanation: 'The alphabet has 26 letters. Every word is made of letters! A is the first letter, Z is the last.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'What is the FIRST letter of the alphabet?', options: ['A','B','C','Z'], answer: 'A', hint: 'A, B, C…' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What letter comes after B?', options: ['A','C','D','E'], answer: 'C', hint: 'A, B, then…' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'What letter comes after D?', options: ['B','C','E','F'], answer: 'E', hint: 'Sing the alphabet song!' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Which letter is uppercase?', options: ['a','b','C','d'], answer: 'C', hint: 'Uppercase letters are big!' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which letter is lowercase?', options: ['A','B','c','D'], answer: 'c', hint: 'Lowercase letters are small.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'What is the LAST letter of the alphabet?', options: ['X','Y','Z','A'], answer: 'Z', hint: 'It comes after Y.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'How many letters are in the alphabet?', options: ['10','20','26','30'], answer: '26', hint: 'A through Z.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Which letter looks the same uppercase and lowercase?', options: ['A/a','B/b','O/o','D/d'], answer: 'O/o', hint: 'A circle is a circle!' },
    ],
  },
  'ela-prek-rhyming': {
    id: 'ela-prek-rhyming', subject: 'ela', grade: 'prek',
    title: 'Rhyming Words', description: 'Find words that sound alike at the end',
    explanation: 'Rhyming words sound alike at the end. "Cat" and "hat" rhyme because they both end in "-at".',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which word rhymes with "cat"?', options: ['Dog','Hat','Sun','Tree'], answer: 'Hat', hint: 'Both end in "-at".' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Which word rhymes with "dog"?', options: ['Cat','Frog','Bird','Fish'], answer: 'Frog', hint: 'Both end in "-og".' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which word rhymes with "bug"?', options: ['Bee','Bat','Hug','Hop'], answer: 'Hug', hint: 'Listen for the "-ug" sound.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Which word rhymes with "star"?', options: ['Sun','Moon','Car','Bell'], answer: 'Car', hint: 'Both end with "-ar".' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which word rhymes with "tree"?', options: ['Bee','Run','Sky','Cup'], answer: 'Bee', hint: '"-ee" sound at the end.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'Which two words rhyme?', options: ['Cake & Lake','Cake & Cup','Lake & Sky','Cup & Bee'], answer: 'Cake & Lake', hint: 'Both end in "-ake".' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Which word does NOT rhyme with "fan"?', options: ['Man','Pan','Can','Dog'], answer: 'Dog', hint: 'Three end in "-an".' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Which word rhymes with "spring"?', options: ['Spoon','Ring','Frog','Snow'], answer: 'Ring', hint: 'Both end with "-ing".' },
    ],
  },

  // ============ ELA — KINDERGARTEN ============
  'ela-k-letters': {
    id: 'ela-k-letters', subject: 'ela', grade: 'k',
    title: 'Letter Sounds', description: 'Match letters to the sounds they make',
    explanation: 'Every letter makes a special sound. The letter B says "buh" like in "ball" or "banana".',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which word starts with the letter B?', options: ['Cat','Ball','Sun','Tree'], answer: 'Ball', hint: 'Listen for the "buh" sound.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Which word starts with the letter S?', options: ['Dog','Apple','Sun','Fish'], answer: 'Sun', hint: 'Listen for the "sss" sound.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which word starts with the letter D?', options: ['Cat','Dog','Sun','Tree'], answer: 'Dog', hint: 'Listen for "duh".' },
      { id: 'q4', type: 'mcq', difficulty: 1, prompt: 'Which word starts with M?', options: ['Cat','Moon','Pig','Hen'], answer: 'Moon', hint: 'M makes the "mmm" sound.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'What letter does "Tiger" start with?', options: ['T','D','P','G'], answer: 'T', hint: 'Tiger… tuh, tuh, T!' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'What letter does "Apple" start with?', options: ['B','A','E','O'], answer: 'A', hint: 'Apple starts with the "aa" sound.' },
      { id: 'q7', type: 'mcq', difficulty: 2, prompt: 'What letter does "Lion" start with?', options: ['I','N','L','R'], answer: 'L', hint: 'Lion makes a "luh" sound at the start.' },
      { id: 'q8', type: 'mcq', difficulty: 2, prompt: 'What letter does "Fish" start with?', options: ['F','S','H','I'], answer: 'F', hint: '"Fff…ish".' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'Which two words start with the same letter?', options: ['Frog & Fish','Dog & Cat','Sun & Moon','Tree & Apple'], answer: 'Frog & Fish', hint: 'Both start with the "fff" sound.' },
      { id: 'q10', type: 'mcq', difficulty: 3, prompt: 'Which word has the letter E in the MIDDLE?', options: ['Apple','Bed','Sun','Fox'], answer: 'Bed', hint: 'B-E-D.' },
    ],
  },
  'ela-k-sight-words': {
    id: 'ela-k-sight-words', subject: 'ela', grade: 'k',
    title: 'Sight Words', description: 'Common words to recognize at a glance',
    explanation: 'Sight words are words we see all the time. Words like "the", "and", "is" appear in almost every book!',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which is a sight word?', options: ['Elephant','The','Banana','Refrigerator'], answer: 'The', hint: 'A short, common word.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Fill in: "I ___ happy."', options: ['am','an','at','as'], answer: 'am', hint: 'I AM happy.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Fill in: "The cat ___ here."', options: ['is','it','if','in'], answer: 'is', hint: 'The cat IS here.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Fill in: "I see ___ dog."', options: ['a','an','of','to'], answer: 'a', hint: 'Use "a" before "dog".' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Fill in: "He ___ go to school."', options: ['can','cap','car','cat'], answer: 'can', hint: 'He IS ABLE to go.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'Fill in: "We are happy ___ play."', options: ['to','too','two','tip'], answer: 'to', hint: 'Happy TO play.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Fill in: "I have ___ apples."', options: ['two','too','to','tow'], answer: 'two', hint: 'A number word.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Which word means more than one?', options: ['He','She','They','It'], answer: 'They', hint: '"They" is for groups.' },
    ],
  },
  'ela-k-beginning-sounds': {
    id: 'ela-k-beginning-sounds', subject: 'ela', grade: 'k',
    title: 'Beginning Sounds', description: 'Identify the first sound in words',
    explanation: 'Every word has a first sound. Listen carefully when you say a word — what do you hear FIRST?',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'What sound does "Cat" start with?', options: ['/k/','/a/','/t/','/s/'], answer: '/k/', hint: '"Cuh"-at.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What sound does "Pig" start with?', options: ['/g/','/i/','/p/','/b/'], answer: '/p/', hint: '"Puh"-ig.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which word starts with the same sound as "Sun"?', options: ['Moon','Snake','Cat','Dog'], answer: 'Snake', hint: 'Both start with "sss".' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Which word starts with the same sound as "Boy"?', options: ['Apple','Banana','Tree','Cat'], answer: 'Banana', hint: 'Both start with "buh".' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which word starts with the same sound as "Dog"?', options: ['Fish','Duck','Cat','Hen'], answer: 'Duck', hint: 'Both start with "duh".' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Which word does NOT start with /m/?', options: ['Moon','Map','Mom','Cat'], answer: 'Cat', hint: 'Three start with "mmm".' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Which two words have the same beginning sound?', options: ['Hat & Hop','Hat & Cup','Hat & Sun','Cup & Hop'], answer: 'Hat & Hop', hint: 'Both start with /h/.' },
    ],
  },

  // ============ ELA — GRADE 1 ============
  'ela-1-cvc-words': {
    id: 'ela-1-cvc-words', subject: 'ela', grade: '1',
    title: 'Short Vowel Words (CVC)', description: 'Read three-letter words like cat, hop, sun',
    explanation: 'CVC words have a consonant, vowel, consonant. Like CAT (c-a-t) or RUN (r-u-n). The vowel makes a short sound.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which word has the short "a" sound?', options: ['Cat','Cake','Car','Cup'], answer: 'Cat', hint: 'Short A like in "apple".' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What is the missing letter? "p_g" (a baby pig)', options: ['a','e','i','o'], answer: 'i', hint: 'P-I-G.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which word has the short "o" sound?', options: ['Hop','Hope','Home','Hose'], answer: 'Hop', hint: 'Short O like "octopus".' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'What letters make the word? 🌞 (a yellow ball in the sky)', options: ['son','sun','sin','san'], answer: 'sun', hint: 'S-U-N.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which word rhymes with "bed"?', options: ['Bid','Bad','Red','Rod'], answer: 'Red', hint: 'Both end in "-ed".' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'Which word has 3 sounds? c-a-t', options: ['Cake (4 sounds)','Cat (3 sounds)','Car (2 sounds)','Cot (3 sounds)'], answer: 'Cat (3 sounds)', hint: 'C-A-T = 3.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Read: "The big dog ran." How many CVC words?', options: ['1','2','3','4'], answer: '3', hint: 'Big, dog, ran — all 3 letters with short vowels.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Change the "a" in "cat" to "u". What word do you make?', options: ['Cat','Cot','Cup','Cut'], answer: 'Cut', hint: 'C-U-T.' },
    ],
  },
  'ela-1-sentences': {
    id: 'ela-1-sentences', subject: 'ela', grade: '1',
    title: 'Building Sentences', description: 'Capital letters, punctuation, and word order',
    explanation: 'A sentence starts with a capital letter and ends with a period (.), question mark (?), or exclamation point (!).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which is a complete sentence?', options: ['Big dog','The dog runs.','Runs fast','Happy'], answer: 'The dog runs.', hint: 'It tells a complete idea.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What goes at the END of this sentence: "I see a cat"', options: ['?','!','.',','], answer: '.', hint: 'A telling sentence ends with a period.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which letter should be CAPITAL? "the boy ran fast."', options: ['the','boy','ran','fast'], answer: 'the', hint: 'First word of every sentence.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'What goes at the end of: "Where is my hat"', options: ['.','?','!',','], answer: '?', hint: 'It is a question.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'What goes at the end of: "I am so happy"', options: ['.','?','!',','], answer: '!', hint: 'It shows strong feeling.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'Which is correct?', options: ['the cat is fat.','The cat is fat.','The Cat Is Fat.','The cat is fat'], answer: 'The cat is fat.', hint: 'Capital first word, period at end.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Put in order: "fast / runs / The / dog"', options: ['Fast runs the dog.','The dog runs fast.','Runs the dog fast.','Dog the runs fast.'], answer: 'The dog runs fast.', hint: 'Who? What? How?' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Which sentence is a QUESTION?', options: ['I love pizza.','Do you like pizza?','Pizza is fun!','Eat the pizza.'], answer: 'Do you like pizza?', hint: 'Ends with a question mark.' },
    ],
  },
  'ela-1-word-families': {
    id: 'ela-1-word-families', subject: 'ela', grade: '1',
    title: 'Word Families', description: 'Words that share a common ending',
    explanation: 'Word families share a sound. The "-at" family includes cat, hat, bat, rat. They all rhyme!',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which word is in the "-at" family?', options: ['Bat','Big','Bus','Boy'], answer: 'Bat', hint: 'Look for "-at" at the end.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Which word is in the "-an" family?', options: ['Pin','Pan','Pet','Pot'], answer: 'Pan', hint: 'Ends in "-an".' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which word is in the "-op" family?', options: ['Mop','Map','Mat','Mug'], answer: 'Mop', hint: 'Ends in "-op".' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Which word does NOT belong with cat, hat, bat?', options: ['Mat','Sat','Rat','Run'], answer: 'Run', hint: 'Three end in "-at".' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which word does NOT belong with bug, hug, mug?', options: ['Rug','Tug','Bag','Jug'], answer: 'Bag', hint: 'Three end in "-ug".' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'Add the letter to make a word: "_at" (a flying mammal)', options: ['B','D','F','H'], answer: 'B', hint: 'Bat flies at night.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Which two are in the SAME word family?', options: ['Ring & King','Ring & Bag','King & Cup','Bag & Cup'], answer: 'Ring & King', hint: 'Both end in "-ing".' },
    ],
  },

  // ============ ELA — GRADE 2 ============
  'ela-2-grammar': {
    id: 'ela-2-grammar', subject: 'ela', grade: '2',
    title: 'Nouns and Verbs', description: 'Identify nouns (things) and verbs (actions)',
    explanation: 'A noun is a person, place, or thing (like "dog" or "school"). A verb is an action word (like "run" or "jump").',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which word is a noun?', options: ['Run','Jump','Cat','Quickly'], answer: 'Cat', hint: 'A noun names a person, place, or thing.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Which word is a verb?', options: ['Tree','Sing','Happy','Blue'], answer: 'Sing', hint: 'A verb is something you DO.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which is a noun?', options: ['Eat','School','Slow','Run'], answer: 'School', hint: 'A place is a noun.' },
      { id: 'q4', type: 'mcq', difficulty: 1, prompt: 'Which is a verb?', options: ['Park','Book','Read','Pencil'], answer: 'Read', hint: 'You can DO it.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'In "The dog barks", what is the verb?', options: ['The','dog','barks','None'], answer: 'barks', hint: 'What is the dog doing?' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'In "Sara reads books", what is the noun?', options: ['Sara only','books only','reads','Both Sara and books'], answer: 'Both Sara and books', hint: 'Sara is a person, books are things.' },
      { id: 'q7', type: 'mcq', difficulty: 2, prompt: 'In "The bird flies", what is the noun?', options: ['The','bird','flies','None'], answer: 'bird', hint: 'A bird is a thing.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Which sentence has both a noun and a verb?', options: ['Very fast','The bird flies','Big and red','Slowly'], answer: 'The bird flies', hint: 'Look for a thing AND an action.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'Pick the verb in: "The boy kicks the ball."', options: ['boy','kicks','ball','the'], answer: 'kicks', hint: 'What is the boy doing?' },
      { id: 'q10', type: 'mcq', difficulty: 3, prompt: 'How many nouns: "The cat chased the mouse"?', options: ['0','1','2','3'], answer: '2', hint: 'Cat and mouse — both things.' },
    ],
  },
  'ela-2-plurals': {
    id: 'ela-2-plurals', subject: 'ela', grade: '2',
    title: 'Singular & Plural', description: 'One thing vs. many',
    explanation: 'Singular means ONE. Plural means MORE than one. Most plurals add -s (cat → cats) or -es (box → boxes).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which is plural (more than one)?', options: ['Cat','Cats','Dog','Bird'], answer: 'Cats', hint: 'It ends in -s.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What is the plural of "dog"?', options: ['Dog','Dogs','Doges','Dogges'], answer: 'Dogs', hint: 'Just add -s.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which is singular (just one)?', options: ['Apples','Apple','Birds','Trees'], answer: 'Apple', hint: 'No -s at the end.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'What is the plural of "box"?', options: ['Boxs','Boxes','Box','Boxxes'], answer: 'Boxes', hint: 'Words ending in -x add -es.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'What is the plural of "bus"?', options: ['Buss','Bus','Buses','Busies'], answer: 'Buses', hint: 'Add -es to words ending in -s.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'What is the plural of "child"?', options: ['Childs','Children','Childes','Child'], answer: 'Children', hint: 'It changes completely!' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'What is the plural of "mouse"?', options: ['Mouses','Mices','Mice','Mousies'], answer: 'Mice', hint: 'Mouse changes to mice.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'What is the plural of "foot"?', options: ['Foots','Feet','Footes','Foots'], answer: 'Feet', hint: 'Special: foot → feet.' },
    ],
  },
  'ela-2-reading-basic': {
    id: 'ela-2-reading-basic', subject: 'ela', grade: '2',
    title: 'Reading Stories', description: 'Understand short passages',
    explanation: 'When you read, look for WHO is in the story, WHERE it happens, and WHAT they do.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Read: "Mia rode her bike to the park." Where did Mia go?', options: ['School','Park','Store','Home'], answer: 'Park', hint: 'Look at the last word.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Read: "Tom likes red apples." What does Tom like?', options: ['Green apples','Red apples','Bananas','Oranges'], answer: 'Red apples', hint: 'Look for the color word.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Read: "Lily played in the snow with her dog. They built a snowman." What did they build?', options: ['A house','A snowman','A fort','A castle'], answer: 'A snowman', hint: 'Read the second sentence.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Read: "Ben felt happy when he found his lost toy." How did Ben feel?', options: ['Sad','Angry','Happy','Tired'], answer: 'Happy', hint: 'The feeling word is right there.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Read: "It was raining, so Sam wore his boots." Why did Sam wear boots?', options: ['It was cold','It was raining','It was sunny','He wanted to'], answer: 'It was raining', hint: 'The word "so" gives the reason.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Read: "The puppy was tired after playing all day. He fell asleep on the rug." Where did the puppy sleep?', options: ['On a bed','Outside','On the rug','In a box'], answer: 'On the rug', hint: 'The last sentence tells you.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Read: "Kate wanted ice cream, but the store was closed." Did Kate get ice cream?', options: ['Yes','No','We don\'t know','Maybe'], answer: 'No', hint: 'The store was closed!' },
    ],
  },

  // ============ ELA — GRADE 3 ============
  'ela-3-vocabulary': {
    id: 'ela-3-vocabulary', subject: 'ela', grade: '3',
    title: 'Synonyms & Antonyms', description: 'Words that mean the same or opposite',
    explanation: 'Synonyms have similar meanings (happy/joyful). Antonyms have opposite meanings (hot/cold).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which word means the SAME as "big"?', options: ['Tiny','Large','Slow','Cold'], answer: 'Large', hint: 'Look for a similar meaning.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What is the OPPOSITE of "hot"?', options: ['Warm','Cold','Sunny','Spicy'], answer: 'Cold', hint: 'Think weather opposites.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'A synonym for "happy" is:', options: ['Sad','Angry','Joyful','Tired'], answer: 'Joyful', hint: 'A word that means the same as happy.' },
      { id: 'q4', type: 'mcq', difficulty: 1, prompt: 'An antonym for "fast" is:', options: ['Quick','Slow','Run','Move'], answer: 'Slow', hint: 'Opposite of fast.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which word means the SAME as "small"?', options: ['Big','Tiny','Tall','Wide'], answer: 'Tiny', hint: 'Both mean little.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'An antonym for "brave" is:', options: ['Bold','Fearful','Strong','Kind'], answer: 'Fearful', hint: 'Opposite of courageous.' },
      { id: 'q7', type: 'mcq', difficulty: 2, prompt: 'Which is a synonym for "shout"?', options: ['Whisper','Yell','Cry','Sit'], answer: 'Yell', hint: 'Both mean loud talking.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Which pair are antonyms?', options: ['Tiny & Small','Ancient & Modern','Quick & Fast','Begin & Start'], answer: 'Ancient & Modern', hint: 'Old vs new.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'Which pair are SYNONYMS?', options: ['Up & Down','Begin & Start','Hot & Cold','Big & Small'], answer: 'Begin & Start', hint: 'Both mean to start something.' },
      { id: 'q10', type: 'mcq', difficulty: 3, prompt: 'Which word is the OPPOSITE of "ancient"?', options: ['Old','Modern','Tiny','Wise'], answer: 'Modern', hint: 'Old vs new.' },
    ],
  },
  'ela-3-grammar': {
    id: 'ela-3-grammar', subject: 'ela', grade: '3',
    title: 'Adjectives & Adverbs', description: 'Words that describe nouns and verbs',
    explanation: 'Adjectives describe nouns (red ball, big dog). Adverbs describe verbs and often end in -ly (run quickly, sing loudly).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which word is an adjective in "The blue sky"?', options: ['The','blue','sky','None'], answer: 'blue', hint: 'It describes the sky.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Which is an adjective?', options: ['Run','Big','Eat','School'], answer: 'Big', hint: 'It describes how something is.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which word ends like most adverbs?', options: ['Quickly','Quick','Quicker','Quickness'], answer: 'Quickly', hint: 'Adverbs often end in -ly.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'In "She sings loudly", what is the adverb?', options: ['She','sings','loudly','None'], answer: 'loudly', hint: 'It tells HOW she sings.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'In "The fluffy cat sleeps", what is the adjective?', options: ['The','fluffy','cat','sleeps'], answer: 'fluffy', hint: 'It describes the cat.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'Which sentence has an adverb?', options: ['The dog ran.','The fast dog ran.','The dog ran quickly.','The big dog.'], answer: 'The dog ran quickly.', hint: 'Look for -ly.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Which word is an adjective in "The tired puppy slept softly"?', options: ['Tired','Slept','Softly','Puppy'], answer: 'Tired', hint: 'It describes the puppy.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Which word is an adverb in "The tired puppy slept softly"?', options: ['Tired','Puppy','Slept','Softly'], answer: 'Softly', hint: 'It describes HOW the puppy slept.' },
    ],
  },
  'ela-3-reading-comprehension': {
    id: 'ela-3-reading-comprehension', subject: 'ela', grade: '3',
    title: 'Reading Comprehension', description: 'Understand main ideas and details',
    explanation: 'The MAIN IDEA is what a story is mostly about. DETAILS are smaller facts that support it.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Read: "Sharks have many teeth. They lose them often. New ones grow back!" What is this about?', options: ['Sharks\' teeth','Where sharks live','What sharks eat','Shark colors'], answer: 'Sharks\' teeth', hint: 'Every sentence is about teeth.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'Read: "Bees live in groups called colonies. They make honey from flower nectar." What do bees make?', options: ['Flowers','Honey','Hives','Bread'], answer: 'Honey', hint: 'Look at the second sentence.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Read: "The library has thousands of books. You can borrow them for free with a library card." What do you need to borrow books?', options: ['Money','A library card','A backpack','Permission'], answer: 'A library card', hint: 'The second sentence tells you.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Read: "Lin loved space. Every night she set up her telescope on the roof and wrote down what she saw." What is Lin\'s hobby?', options: ['Cooking','Reading','Astronomy','Writing songs'], answer: 'Astronomy', hint: 'Telescope = stars and space.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'Read: "The cat darted under the porch as thunder rumbled overhead." How did the cat feel?', options: ['Excited','Frightened','Hungry','Sleepy'], answer: 'Frightened', hint: 'Why would a cat hide during thunder?' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Read: "Despite the rain, the team kept practicing." What does this tell us?', options: ['They hate rain','They are dedicated','They forgot umbrellas','They are losing'], answer: 'They are dedicated', hint: 'Practicing in bad weather shows commitment.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Read: "Marco brought his umbrella, even though it was sunny." Why might he have brought it?', options: ['He wanted to share','He thought it might rain later','He likes to carry things','He lost it'], answer: 'He thought it might rain later', hint: 'Umbrellas are for rain.' },
    ],
  },

  // ============ SCIENCE ============
  'science-1-animals': {
    id: 'science-1-animals', subject: 'science', grade: '1',
    title: 'Animal Habitats', description: 'Where different animals live',
    explanation: 'Animals live in different places called habitats. Fish live in water, birds live in trees, and polar bears live where it is cold.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Where does a fish live?', options: ['Tree','Water','Desert','Cave'], answer: 'Water', hint: 'Fish need to swim!' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Where does a polar bear live?', options: ['Jungle','Beach','Arctic (cold places)','Desert'], answer: 'Arctic (cold places)', hint: 'Polar bears love snow and ice.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Which animal lives in a desert?', options: ['Penguin','Camel','Whale','Frog'], answer: 'Camel', hint: 'It can survive without much water.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Which animal lives in trees?', options: ['Shark','Monkey','Crab','Snake (mostly)'], answer: 'Monkey', hint: 'Swings from branch to branch!' },
    ],
  },
  'science-3-plants': {
    id: 'science-3-plants', subject: 'science', grade: '3',
    title: 'Plant Life Cycle', description: 'How plants grow from seed to flower',
    explanation: 'Plants begin as seeds. With water, sunlight, and soil, they sprout, grow, and eventually produce flowers and new seeds.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'What do plants need to grow?', options: ['Only water','Water, sunlight, and soil','Only sunlight','Just air'], answer: 'Water, sunlight, and soil', hint: 'Plants need several things.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What does a plant start as?', options: ['Flower','Seed','Leaf','Root'], answer: 'Seed', hint: 'You plant it in the ground.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'What do roots do?', options: ['Make food','Take in water','Grow flowers','Make seeds'], answer: 'Take in water', hint: 'They are underground for a reason.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'What part of a plant makes food using sunlight?', options: ['Roots','Stem','Leaves','Petals'], answer: 'Leaves', hint: 'They are usually green.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'What is photosynthesis?', options: ['When plants drink water','When plants make food from sunlight','When seeds break open','When flowers bloom'], answer: 'When plants make food from sunlight', hint: 'Photo means light.' },
    ],
  },
  'science-5-states': {
    id: 'science-5-states', subject: 'science', grade: '5',
    title: 'States of Matter', description: 'Solids, liquids, and gases',
    explanation: 'Matter exists in three main states: solids hold their shape, liquids flow and take the shape of their container, gases spread out to fill any space.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which is a solid?', options: ['Water','Steam','Ice','Air'], answer: 'Ice', hint: 'It holds its shape.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Which is a gas?', options: ['Rock','Milk','Steam','Wood'], answer: 'Steam', hint: 'It floats up and disappears.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'When water boils, it changes from liquid to:', options: ['Solid','Gas','Plasma','Nothing'], answer: 'Gas', hint: 'You see steam rise up.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'What happens when liquid water freezes?', options: ['Becomes a gas','Becomes a solid','Disappears','Boils'], answer: 'Becomes a solid', hint: 'It turns into ice.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'Which property is true for liquids?', options: ['Fixed shape and volume','Takes shape of container, fixed volume','No fixed shape or volume','Always cold'], answer: 'Takes shape of container, fixed volume', hint: 'Pour water into different cups.' },
    ],
  },
  'science-8-cells': {
    id: 'science-8-cells', subject: 'science', grade: '8',
    title: 'Cell Biology Basics', description: 'Parts and functions of cells',
    explanation: 'All living things are made of cells. Plant and animal cells share parts like the nucleus and cell membrane, but plant cells also have cell walls and chloroplasts.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'What is the "control center" of a cell?', options: ['Membrane','Nucleus','Cytoplasm','Wall'], answer: 'Nucleus', hint: 'It contains DNA.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'Which part is found ONLY in plant cells?', options: ['Nucleus','Chloroplast','Membrane','Mitochondria'], answer: 'Chloroplast', hint: 'It makes food using sunlight.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'What do mitochondria do?', options: ['Store water','Produce energy','Make proteins','Hold DNA'], answer: 'Produce energy', hint: 'Often called the "powerhouse".' },
      { id: 'q4', type: 'mcq', difficulty: 3, prompt: 'Which structure controls what enters and exits a cell?', options: ['Nucleus','Cell membrane','Vacuole','Ribosome'], answer: 'Cell membrane', hint: 'It is the cell\'s outer boundary.' },
    ],
  },

  // ============ SOCIAL STUDIES ============
  'social-2-community': {
    id: 'social-2-community', subject: 'social', grade: '2',
    title: 'Community Helpers', description: 'People who help us in our community',
    explanation: 'Community helpers are people whose jobs help everyone. Doctors keep us healthy, firefighters keep us safe, teachers help us learn.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Who helps put out fires?', options: ['Teacher','Firefighter','Doctor','Chef'], answer: 'Firefighter', hint: 'They use water and big trucks.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Who helps you when you are sick?', options: ['Police','Doctor','Mail carrier','Farmer'], answer: 'Doctor', hint: 'They work in a hospital or clinic.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Who delivers letters and packages?', options: ['Chef','Mail carrier','Pilot','Builder'], answer: 'Mail carrier', hint: 'They wear a uniform and carry a bag.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Where would you find a librarian?', options: ['Bakery','Library','Hospital','Park'], answer: 'Library', hint: 'They help you find books.' },
    ],
  },
  'social-4-geography': {
    id: 'social-4-geography', subject: 'social', grade: '4',
    title: 'World Geography', description: 'Continents, oceans, and major landmarks',
    explanation: 'Earth has 7 continents and 5 oceans. Each continent has unique countries, cultures, and landmarks.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'How many continents are there?', options: ['5','6','7','8'], answer: '7', hint: 'Africa, Antarctica, Asia, Australia, Europe, North America, South America.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Which is the largest ocean?', options: ['Atlantic','Indian','Pacific','Arctic'], answer: 'Pacific', hint: 'It covers a third of Earth.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Which continent has the Sahara Desert?', options: ['Asia','Africa','Australia','South America'], answer: 'Africa', hint: 'A huge desert in the north.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Where is the Amazon Rainforest?', options: ['Africa','Asia','South America','Europe'], answer: 'South America', hint: 'Mostly in Brazil.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'Which is the longest river in the world?', options: ['Amazon','Nile','Mississippi','Yangtze'], answer: 'Nile', hint: 'It flows through Egypt.' },
    ],
  },
  'social-6-history': {
    id: 'social-6-history', subject: 'social', grade: '6',
    title: 'Ancient Civilizations', description: 'Egypt, Greece, Rome, and more',
    explanation: 'Ancient civilizations laid the foundation for modern society. They gave us writing, math, government systems, and ideas about democracy.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Where did the pyramids originate?', options: ['Greece','Egypt','Rome','China'], answer: 'Egypt', hint: 'Along the Nile River.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'Where did democracy originate?', options: ['Rome','Egypt','Greece','India'], answer: 'Greece', hint: 'Specifically in Athens.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'The Colosseum is found in:', options: ['Athens','Rome','Cairo','Babylon'], answer: 'Rome', hint: 'Romans held games there.' },
      { id: 'q4', type: 'mcq', difficulty: 3, prompt: 'Which civilization invented paper?', options: ['Greek','Egyptian','Chinese','Roman'], answer: 'Chinese', hint: 'Around 100 AD.' },
    ],
  },
  'social-8-civics': {
    id: 'social-8-civics', subject: 'social', grade: '8',
    title: 'U.S. Government', description: 'Branches of government and the Constitution',
    explanation: 'The U.S. government has three branches: Legislative (makes laws), Executive (enforces laws), and Judicial (interprets laws). This separation keeps power balanced.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'How many branches does the U.S. government have?', options: ['2','3','4','5'], answer: '3', hint: 'Legislative, Executive, Judicial.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'Which branch makes laws?', options: ['Executive','Judicial','Legislative','Military'], answer: 'Legislative', hint: 'Congress (Senate and House).' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Who heads the Executive branch?', options: ['Chief Justice','President','Speaker','Senator'], answer: 'President', hint: 'Lives in the White House.' },
      { id: 'q4', type: 'mcq', difficulty: 3, prompt: 'What is the Bill of Rights?', options: ['A list of taxes','First 10 amendments','A type of court','A speech by Lincoln'], answer: 'First 10 amendments', hint: 'It protects individual freedoms.' },
    ],
  },

  // ============ MATH — GRADE 4 ============
  'math-4-fractions': {
    id: 'math-4-fractions', subject: 'math', grade: '4',
    title: 'Fractions & Decimals', description: 'Compare, order, and convert fractions and decimals',
    explanation: 'A fraction like 3/4 means 3 parts out of 4. Decimals like 0.75 represent the same value. To compare fractions, find a common denominator or convert to decimals.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which fraction is equivalent to 2/4?', options: ['1/2','1/4','3/4','2/3'], answer: '1/2', hint: 'Divide both top and bottom by 2.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What decimal equals 1/2?', options: ['0.25','0.5','0.75','1.0'], answer: '0.5', hint: '1 divided by 2.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which is greater: 3/4 or 1/2?', options: ['3/4','1/2'], answer: '3/4', hint: 'Compare with a common denominator of 4.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: '1/4 + 2/4 = ?', options: ['1/4','2/4','3/4','4/4'], answer: '3/4', hint: 'Add numerators; keep denominator.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'What is 3/5 as a decimal?', options: ['0.3','0.35','0.6','0.65'], answer: '0.6', hint: '3 ÷ 5.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'Order from least to greatest: 1/4, 1/2, 1/3', options: ['1/4, 1/3, 1/2','1/2, 1/3, 1/4','1/3, 1/2, 1/4','1/4, 1/2, 1/3'], answer: '1/4, 1/3, 1/2', hint: 'Convert to decimals: 0.25, 0.33, 0.5.' },
      { id: 'q7', type: 'mcq', difficulty: 2, prompt: '5/8 − 3/8 = ?', options: ['1/4','1/8','2/8','3/8'], answer: '2/8', hint: 'Subtract numerators; keep denominator.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'Which is equivalent to 0.75?', options: ['1/2','2/3','3/4','4/5'], answer: '3/4', hint: '0.75 = 75/100 = 3/4.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'A recipe uses 2/3 cup sugar. Doubled, you need:', options: ['1 cup','4/3 cups','1 1/3 cups','2 cups'], answer: '4/3 cups', hint: '2 × 2/3 = 4/3.' },
      { id: 'q10', type: 'mcq', difficulty: 3, prompt: 'Which is larger: 0.6 or 5/9?', options: ['0.6','5/9'], answer: '0.6', hint: '5/9 ≈ 0.556, which is less than 0.6.' },
    ],
  },
  'math-4-multiplication': {
    id: 'math-4-multiplication', subject: 'math', grade: '4',
    title: 'Multi-Digit Multiplication', description: 'Multiply 2- and 3-digit numbers using place value',
    explanation: 'To multiply multi-digit numbers, break them into parts. 23 × 4 = (20 × 4) + (3 × 4) = 80 + 12 = 92. This is the distributive property.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: '12 × 4 = ?', options: ['44','48','52','56'], answer: '48', hint: '10 × 4 = 40, plus 2 × 4 = 8.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: '25 × 3 = ?', options: ['60','65','75','85'], answer: '75', hint: '25 + 25 + 25.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: '14 × 5 = ?', options: ['60','65','70','75'], answer: '70', hint: '10 × 5 = 50, plus 4 × 5 = 20.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: '36 × 7 = ?', options: ['242','252','256','266'], answer: '252', hint: '30 × 7 = 210, plus 6 × 7 = 42.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: '45 × 6 = ?', options: ['240','250','260','270'], answer: '270', hint: '40 × 6 + 5 × 6.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: '23 × 15 = ?', options: ['285','325','345','365'], answer: '345', hint: '23 × 10 = 230, plus 23 × 5 = 115.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: '124 × 3 = ?', options: ['362','372','382','392'], answer: '372', hint: '100 × 3 + 24 × 3.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'A school orders 48 boxes with 25 crayons each. How many crayons total?', options: ['1,100','1,200','1,300','1,400'], answer: '1,200', hint: '48 × 25.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: '203 × 4 = ?', options: ['802','812','820','832'], answer: '812', hint: '200 × 4 = 800, plus 3 × 4 = 12.' },
    ],
  },
  'math-4-geometry': {
    id: 'math-4-geometry', subject: 'math', grade: '4',
    title: 'Angles & 2D Shapes', description: 'Classify angles and identify polygon properties',
    explanation: 'Angles are measured in degrees. A right angle = 90°, acute angle < 90°, obtuse angle > 90°. The angles in any triangle always sum to 180°.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'A right angle measures:', options: ['45°','60°','90°','180°'], answer: '90°', hint: 'Think of the corner of a square.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'An acute angle is:', options: ['Exactly 90°','Greater than 90°','Less than 90°','Exactly 180°'], answer: 'Less than 90°', hint: '"Acute" means sharp and small.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'How many sides does a pentagon have?', options: ['4','5','6','8'], answer: '5', hint: '"Penta" means five.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'The sum of angles in a triangle equals:', options: ['90°','180°','270°','360°'], answer: '180°', hint: 'A flat straight line is 180°.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A triangle with all equal sides is:', options: ['Isosceles','Scalene','Equilateral','Right'], answer: 'Equilateral', hint: '"Equi" means equal.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'A quadrilateral with exactly one pair of parallel sides is a:', options: ['Rectangle','Parallelogram','Trapezoid','Rhombus'], answer: 'Trapezoid', hint: 'Only one pair of parallel sides.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'In a triangle, two angles are 60° and 80°. The third angle is:', options: ['30°','40°','50°','60°'], answer: '40°', hint: '180 − 60 − 80 = 40.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'How many degrees are in a full rotation?', options: ['90°','180°','270°','360°'], answer: '360°', hint: 'Think of a full circle.' },
    ],
  },

  // ============ MATH — GRADE 6 ============
  'math-6-ratios': {
    id: 'math-6-ratios', subject: 'math', grade: '6',
    title: 'Ratios & Proportions', description: 'Understand and apply ratios, rates, and unit rates',
    explanation: 'A ratio compares two quantities. 3 cats and 5 dogs → ratio is 3:5. A unit rate shows the rate per 1 unit, like 60 miles per hour. Proportions are equivalent ratios.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'What is the ratio of stars to circles? ⭐⭐⭐🔵🔵', options: ['2:3','3:2','3:5','5:3'], answer: '3:2', hint: 'Stars:circles = 3:2.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'A car travels 120 miles in 2 hours. What is the unit rate?', options: ['40 mph','60 mph','80 mph','100 mph'], answer: '60 mph', hint: '120 ÷ 2 = 60 miles per hour.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Which ratio is equivalent to 4:6?', options: ['1:2','2:3','3:4','4:5'], answer: '2:3', hint: 'Divide both by 2.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'If 5 pencils cost $2.50, how much is one pencil?', options: ['$0.40','$0.50','$0.60','$0.75'], answer: '$0.50', hint: '2.50 ÷ 5.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Scale: 1 cm = 5 m. A map shows 4 cm. The real distance is:', options: ['4 m','9 m','16 m','20 m'], answer: '20 m', hint: '4 × 5.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'A recipe uses 3 cups flour for 24 cookies. For 48 cookies, use:', options: ['4 cups','5 cups','6 cups','8 cups'], answer: '6 cups', hint: 'Double the recipe.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'In a class of 30, the ratio of girls to boys is 2:3. How many girls?', options: ['10','12','15','18'], answer: '12', hint: 'Girls = 2/5 × 30.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'You earn $42 in 6 hours. How much in 10 hours?', options: ['$60','$70','$75','$80'], answer: '$70', hint: 'Unit rate: $7/hr × 10.' },
    ],
  },
  'math-6-integers': {
    id: 'math-6-integers', subject: 'math', grade: '6',
    title: 'Integers & Number Line', description: 'Work with positive and negative integers',
    explanation: 'Integers include positive numbers, negative numbers, and zero. On a number line, negative numbers are left of zero. −3 is less than −1 because it is further left.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which is the lowest temperature? −5°, 0°, 3°, −2°', options: ['−5°','0°','3°','−2°'], answer: '−5°', hint: 'The most negative number is the lowest.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What is the opposite of −7?', options: ['−14','0','7','14'], answer: '7', hint: 'Opposite means switch the sign.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: '−3 + 5 = ?', options: ['−8','−2','2','8'], answer: '2', hint: 'Move 5 steps right from −3.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: '−4 + (−6) = ?', options: ['−10','−2','2','10'], answer: '−10', hint: 'Adding two negatives gives a more negative result.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: '8 − (−3) = ?', options: ['5','8','11','16'], answer: '11', hint: 'Subtracting a negative = adding a positive.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'What is the absolute value of −9?', options: ['−9','0','9','81'], answer: '9', hint: 'Absolute value is always the positive distance from 0.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Order from least to greatest: −6, 2, −1, 4', options: ['−6, −1, 2, 4','2, −1, 4, −6','4, 2, −1, −6','−6, 2, −1, 4'], answer: '−6, −1, 2, 4', hint: 'Start from farthest left on the number line.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'A submarine at −200 m rises 75 m. New depth?', options: ['−275 m','−125 m','−75 m','275 m'], answer: '−125 m', hint: '−200 + 75 = −125.' },
    ],
  },
  'math-6-expressions': {
    id: 'math-6-expressions', subject: 'math', grade: '6',
    title: 'Variable Expressions', description: 'Write, evaluate, and simplify algebraic expressions',
    explanation: 'A variable is a letter standing for an unknown number. In 3x + 5, if x = 4, the expression equals 3(4) + 5 = 17. Like terms (same variable, same exponent) can be combined.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'If x = 3, what is 2x + 1?', options: ['4','5','7','9'], answer: '7', hint: '2(3) + 1 = 6 + 1.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What expression means "5 more than n"?', options: ['5n','n − 5','n + 5','5 − n'], answer: 'n + 5', hint: '"More than" means add.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Evaluate 4a when a = 6:', options: ['10','14','24','46'], answer: '24', hint: '4 × 6.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Simplify: 3x + 2x', options: ['5','6x','5x','3x²'], answer: '5x', hint: 'Combine like terms.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'If y = 5, evaluate 2y² − 3:', options: ['22','37','47','97'], answer: '47', hint: '2(25) − 3 = 50 − 3.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'Which expression means "four less than three times k"?', options: ['4 − 3k','3k − 4','3k + 4','4 + 3k'], answer: '3k − 4', hint: '3 times k, then subtract 4.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Simplify: 5m + 3 − 2m + 7', options: ['3m + 10','7m + 10','3m + 4','7m + 4'], answer: '3m + 10', hint: 'Group m terms: 5m − 2m = 3m; constants: 3 + 7 = 10.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'A store sells items for $p each. You buy 4 and use a $3 coupon. Total cost expression:', options: ['4p + 3','4p − 3','p + 3','4(p − 3)'], answer: '4p − 3', hint: '4 items at price p, minus $3 off.' },
    ],
  },

  // ============ MATH — GRADE 8 ============
  'math-8-linear-equations': {
    id: 'math-8-linear-equations', subject: 'math', grade: '8',
    title: 'Linear Equations', description: 'Solve one- and two-step equations and inequalities',
    explanation: 'To solve an equation, perform inverse operations to isolate the variable. For 2x + 3 = 11: subtract 3 → 2x = 8, then divide by 2 → x = 4. For inequalities, flip the sign when multiplying or dividing by a negative.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Solve: x + 7 = 15', options: ['7','8','9','22'], answer: '8', hint: 'Subtract 7 from both sides.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Solve: 3x = 18', options: ['3','5','6','54'], answer: '6', hint: 'Divide both sides by 3.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Solve: 2x − 4 = 10', options: ['3','5','7','9'], answer: '7', hint: 'Add 4, then divide by 2.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Solve: x/5 + 3 = 8', options: ['20','25','35','40'], answer: '25', hint: 'Subtract 3, then multiply by 5.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which inequality means "x is at least 5"?', options: ['x < 5','x ≤ 5','x ≥ 5','x > 5'], answer: 'x ≥ 5', hint: '"At least" includes 5 itself.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: 'Solve: 4(x − 2) = 20', options: ['5','6','7','8'], answer: '7', hint: 'Distribute: 4x − 8 = 20, then solve.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Solve: 3x + 5 = 2x + 9', options: ['1','2','3','4'], answer: '4', hint: 'Move x terms to one side: x = 9 − 5.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: 'A gym charges $25/month plus a $50 join fee. At what month does total cost equal $175?', options: ['4','5','6','7'], answer: '5', hint: '50 + 25m = 175 → m = 5.' },
      { id: 'q9', type: 'mcq', difficulty: 3, prompt: 'Solve: 5 − 2x > 1', options: ['x > 2','x < 2','x > −2','x < −2'], answer: 'x < 2', hint: 'Subtract 5, divide by −2 (flip the inequality sign).' },
    ],
  },
  'math-8-pythagorean': {
    id: 'math-8-pythagorean', subject: 'math', grade: '8',
    title: 'Pythagorean Theorem', description: 'Find missing side lengths in right triangles',
    explanation: 'The Pythagorean Theorem: a² + b² = c², where c is the hypotenuse (longest side, opposite the right angle). To find a missing leg: a = √(c² − b²).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'In a right triangle with legs 3 and 4, the hypotenuse is:', options: ['5','6','7','8'], answer: '5', hint: '3² + 4² = 9 + 16 = 25. √25 = 5.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Which set forms a right triangle?', options: ['2, 3, 4','3, 4, 5','4, 5, 6','5, 6, 7'], answer: '3, 4, 5', hint: '9 + 16 = 25 ✓.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'A ladder 10 m long rests 6 m up a wall. How far from the wall is its base?', options: ['4 m','6 m','8 m','10 m'], answer: '8 m', hint: '6² + b² = 10² → b² = 64.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Legs are 5 and 12. Hypotenuse is:', options: ['13','14','15','17'], answer: '13', hint: '25 + 144 = 169. √169 = 13.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Hypotenuse = 17, one leg = 8. Find the other leg.', options: ['9','12','13','15'], answer: '15', hint: '17² − 8² = 289 − 64 = 225. √225 = 15.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'A square has side length 5. Its diagonal is closest to:', options: ['5','7','8','10'], answer: '7', hint: '5² + 5² = 50. √50 ≈ 7.07.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Two streets meet at 90°. One is 9 m and another is 40 m. The diagonal path is:', options: ['41 m','43 m','45 m','49 m'], answer: '41 m', hint: '9² + 40² = 81 + 1600 = 1681. √1681 = 41.' },
    ],
  },
  'math-8-functions': {
    id: 'math-8-functions', subject: 'math', grade: '8',
    title: 'Functions & Graphs', description: 'Understand slope, y-intercept, and linear equations y = mx + b',
    explanation: 'A linear function graphs as a straight line: y = mx + b, where m is the slope (steepness) and b is the y-intercept (where the line crosses the y-axis). Slope = rise/run = (y₂ − y₁)/(x₂ − x₁).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'In y = 3x + 2, the slope is:', options: ['−2','2','3','5'], answer: '3', hint: 'm is the coefficient of x.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'In y = 3x + 2, the y-intercept is:', options: ['−2','2','3','5'], answer: '2', hint: 'b is the constant term.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'Is (3, 7) a solution to y = 2x + 1?', options: ['Yes','No'], answer: 'Yes', hint: '2(3) + 1 = 7 ✓.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Slope between points (2, 5) and (4, 11) is:', options: ['2','3','4','6'], answer: '3', hint: '(11−5)/(4−2) = 6/2 = 3.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A line through (0, −3) with slope 2. Its equation is:', options: ['y = 2x − 3','y = −3x + 2','y = 2x + 3','y = −2x − 3'], answer: 'y = 2x − 3', hint: 'y = mx + b; b = −3, m = 2.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Which is a function? (Each x has exactly one y)', options: ['x² + y² = 9','y = 3x + 1','x = 4','y = ±x'], answer: 'y = 3x + 1', hint: 'Each x gives exactly one y value.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'A phone plan: $20 flat + $0.05/text. 100 texts = total cost:', options: ['$22','$25','$27','$30'], answer: '$25', hint: '20 + 0.05 × 100 = 20 + 5.' },
    ],
  },

  // ============ MATH — GRADE 10 ============
  'math-10-algebra2': {
    id: 'math-10-algebra2', subject: 'math', grade: '10',
    title: 'Quadratic Functions', description: 'Solve quadratic equations and analyze parabolas',
    explanation: 'A quadratic has the form ax² + bx + c = 0. Solutions can be found by factoring or the quadratic formula: x = (−b ± √(b²−4ac)) / 2a. The vertex is at x = −b/2a.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'The graph of a quadratic function is called a:', options: ['Line','Parabola','Circle','Hyperbola'], answer: 'Parabola', hint: 'It is U-shaped (or ∩-shaped).' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Solve: x² − 9 = 0', options: ['x = 3','x = ±3','x = 9','x = ±9'], answer: 'x = ±3', hint: 'x² = 9; take the square root of both sides.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Solve by factoring: x² + 5x + 6 = 0', options: ['x = 2, 3','x = −2, −3','x = −2, 3','x = 2, −3'], answer: 'x = −2, −3', hint: 'Find two numbers that multiply to 6 and add to 5.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'In y = x² − 4x + 4, the vertex is at:', options: ['(0, 4)','(2, 0)','(4, 4)','(−2, 0)'], answer: '(2, 0)', hint: 'x = −b/2a = 4/2 = 2; y(2) = 4 − 8 + 4 = 0.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'When the discriminant b²−4ac = 0, there is/are:', options: ['Two real solutions','One real solution','No real solutions','Infinite solutions'], answer: 'One real solution', hint: 'The parabola touches the x-axis at exactly one point.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Solve using the quadratic formula: x² − 5x + 6 = 0', options: ['x = 2, 3','x = −2, 3','x = 2, −3','x = −2, −3'], answer: 'x = 2, 3', hint: 'a=1, b=−5, c=6. Discriminant = 25−24=1.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Height h = −16t² + 32t. When does the ball hit the ground?', options: ['t = 1 s','t = 2 s','t = 3 s','t = 4 s'], answer: 't = 2 s', hint: 'Set h = 0: −16t(t − 2) = 0. t = 0 (launch) or t = 2.' },
    ],
  },

  // ============ MATH — GRADE 11 ============
  'math-11-trigonometry': {
    id: 'math-11-trigonometry', subject: 'math', grade: '11',
    title: 'Trigonometry', description: 'Use sine, cosine, and tangent in right triangles and the unit circle',
    explanation: 'In a right triangle: sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, tan(θ) = opposite/adjacent. Remember SOH-CAH-TOA.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'SOH in SOH-CAH-TOA stands for:', options: ['Sine = Opposite / Hypotenuse','Sine = Opposite × Hypotenuse','Sum Of Hypotenuse','Sine Over Hyperbola'], answer: 'Sine = Opposite / Hypotenuse', hint: 'SOH = Sine, Opposite, Hypotenuse.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'sin(30°) = ?', options: ['0.25','0.5','0.75','1'], answer: '0.5', hint: 'A key angle to memorize.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'cos(60°) = ?', options: ['0.25','0.5','0.75','0.866'], answer: '0.5', hint: 'cos(60°) = sin(30°) = 0.5.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'tan(45°) = ?', options: ['0','0.5','1','√2'], answer: '1', hint: 'At 45°, opposite = adjacent, so tan = 1.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'In a right triangle, opposite = 3, hypotenuse = 5. Find sin(θ):', options: ['3/5','4/5','3/4','5/3'], answer: '3/5', hint: 'sin = opposite/hypotenuse.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'A ramp is 10 m long at 30° to the ground. Its height is:', options: ['4 m','5 m','6 m','8 m'], answer: '5 m', hint: 'height = 10 × sin(30°) = 10 × 0.5.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'The Law of Cosines is used when:', options: ['You have a right triangle','You know all three angles','You know two sides and the included angle','You only know one side'], answer: 'You know two sides and the included angle', hint: 'c² = a² + b² − 2ab·cos(C).' },
    ],
  },

  // ============ MATH — GRADE 12 ============
  'math-12-calculus': {
    id: 'math-12-calculus', subject: 'math', grade: '12',
    title: 'Intro to Calculus', description: 'Understand limits, derivatives, and basic integrals',
    explanation: 'A derivative measures instantaneous rate of change (slope of a curve). Power rule: d/dx(xⁿ) = n·xⁿ⁻¹. An integral finds area under a curve. ∫xⁿdx = xⁿ⁺¹/(n+1) + C.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'A derivative measures:', options: ['Area under a curve','Rate of change','Total distance','Sum of a series'], answer: 'Rate of change', hint: 'It gives the instantaneous slope at any point.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Using the power rule, d/dx(x³) = ?', options: ['x²','3x²','3x³','x⁴/4'], answer: '3x²', hint: 'Bring down the exponent, reduce by 1.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'd/dx(5x² + 3x − 2) = ?', options: ['5x + 3','10x + 3','10x − 2','5x² + 3'], answer: '10x + 3', hint: 'Differentiate term by term; constants disappear.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'The limit as x→2 of (x² − 4)/(x − 2) is:', options: ['0','2','4','Undefined'], answer: '4', hint: 'Factor: (x+2)(x−2)/(x−2) = x+2. At x=2: 4.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: '∫x dx = ?', options: ['1','x','x²','x²/2 + C'], answer: 'x²/2 + C', hint: 'Reverse power rule: add 1 to exponent, divide.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'If f(x) = 3x² − 6x, find f\'(2):', options: ['0','3','6','12'], answer: '6', hint: 'f\'(x) = 6x − 6. f\'(2) = 12 − 6 = 6.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'The definite integral ∫₀² x² dx equals:', options: ['4/3','8/3','4','8'], answer: '8/3', hint: '[x³/3]₀² = 8/3 − 0 = 8/3.' },
    ],
  },

  // ============ ELA — GRADE 4 ============
  'ela-4-figurative-language': {
    id: 'ela-4-figurative-language', subject: 'ela', grade: '4',
    title: 'Figurative Language', description: 'Identify and interpret similes, metaphors, and idioms',
    explanation: 'Figurative language goes beyond literal meaning. A simile compares using "like" or "as." A metaphor says something IS something else. An idiom is a phrase with a special cultural meaning. Hyperbole is an extreme exaggeration.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: '"She ran like the wind." This is a:', options: ['Metaphor','Simile','Idiom','Hyperbole'], answer: 'Simile', hint: 'Uses "like" to compare.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: '"The classroom was a zoo." This is a:', options: ['Simile','Idiom','Metaphor','Alliteration'], answer: 'Metaphor', hint: 'No "like" or "as" — it says the room IS a zoo.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: '"It\'s raining cats and dogs" is an:', options: ['Simile','Metaphor','Idiom','Onomatopoeia'], answer: 'Idiom', hint: 'Animals are not literally falling from the sky!' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: '"Her smile was as bright as the sun." This uses:', options: ['Metaphor','Simile','Alliteration','Hyperbole'], answer: 'Simile', hint: '"As … as" is a simile structure.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'What does "break a leg" mean?', options: ['Get hurt','Good luck','Run fast','Sit down'], answer: 'Good luck', hint: 'A common theater idiom meaning good luck.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: '"I\'ve told you a million times!" is an example of:', options: ['Simile','Metaphor','Hyperbole','Alliteration'], answer: 'Hyperbole', hint: 'An extreme exaggeration for emphasis.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: '"The stars are diamonds scattered across the sky." This is a:', options: ['Simile','Metaphor','Idiom','Personification'], answer: 'Metaphor', hint: 'The stars ARE diamonds (no "like" or "as").' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: '"The wind whispered through the trees." What is this?', options: ['Simile','Hyperbole','Personification','Idiom'], answer: 'Personification', hint: 'The wind is given a human action (whispering).' },
    ],
  },
  'ela-4-reading-comprehension': {
    id: 'ela-4-reading-comprehension', subject: 'ela', grade: '4',
    title: 'Reading Comprehension', description: 'Identify main ideas, details, and text structure',
    explanation: 'When reading, ask: What is the main idea? What details support it? Texts can be structured as sequence, cause/effect, compare/contrast, or problem/solution. Theme is the big life lesson.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'The main idea of a paragraph is:', options: ['A supporting detail','The most important point','The title','The first sentence'], answer: 'The most important point', hint: 'All other sentences support the main idea.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'A text describing events in time order uses which structure?', options: ['Compare/Contrast','Cause/Effect','Sequence','Problem/Solution'], answer: 'Sequence', hint: 'Sequence = events in order.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Words like "because," "as a result," and "therefore" signal:', options: ['Compare/Contrast','Sequence','Cause/Effect','Problem/Solution'], answer: 'Cause/Effect', hint: 'These words connect a reason to its outcome.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'A biography is BEST described as:', options: ['A made-up story','A poem','The story of a real person\'s life','A set of instructions'], answer: 'The story of a real person\'s life', hint: '"Bio" = life; "graphy" = writing.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'What question helps find the THEME of a story?', options: ['Who is the main character?','What is the setting?','What lesson does the story teach?','What happens first?'], answer: 'What lesson does the story teach?', hint: 'Theme is the big message or universal lesson.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'An author uses bold font for a word. Why?', options: ['To show it is a verb','To highlight an important or key term','To show the setting','To show dialogue'], answer: 'To highlight an important or key term', hint: 'Text features like bold draw the reader\'s attention.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Which text feature helps a reader find information quickly?', options: ['Introduction','Table of contents','Conclusion','Dialogue'], answer: 'Table of contents', hint: 'Lists chapters and their page numbers.' },
    ],
  },

  // ============ ELA — GRADE 5 ============
  'ela-5-vocabulary': {
    id: 'ela-5-vocabulary', subject: 'ela', grade: '5',
    title: 'Context Clues & Vocabulary', description: 'Use context clues and word parts to determine meaning',
    explanation: 'When you find an unfamiliar word, look at surrounding sentences for clues. Prefixes (un-, re-, pre-) and suffixes (-ful, -less, -tion) also hint at meaning.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: '"The gigantic bear towered over the trees." What does GIGANTIC mean?', options: ['Small','Very large','Angry','Friendly'], answer: 'Very large', hint: 'It towered over trees — it must be enormous!' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'The prefix "un-" means:', options: ['Again','Before','Not','After'], answer: 'Not', hint: 'Unhappy = not happy.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'The suffix "-less" means:', options: ['Full of','Without','The act of','To do again'], answer: 'Without', hint: 'Careless = without care.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: '"Despite being reluctant, she agreed to go." RELUCTANT means:', options: ['Excited','Willing','Unwilling','Confused'], answer: 'Unwilling', hint: '"Despite" signals contrast — she did NOT want to go.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'What is a synonym for COURAGEOUS?', options: ['Timid','Brave','Reckless','Curious'], answer: 'Brave', hint: 'Synonyms share the same meaning.' },
      { id: 'q6', type: 'mcq', difficulty: 2, prompt: '"The benevolent teacher helped every struggling student." BENEVOLENT means:', options: ['Strict','Careless','Kind and generous','Confused'], answer: 'Kind and generous', hint: '"Bene-" means good/well.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'What is an antonym for TRANSPARENT?', options: ['Clear','See-through','Opaque','Bright'], answer: 'Opaque', hint: 'Antonyms are opposites. Opaque = not see-through.' },
      { id: 'q8', type: 'mcq', difficulty: 3, prompt: '"The intricate lace took months to create." INTRICATE means:', options: ['Simple','Detailed and complex','Large','Old-fashioned'], answer: 'Detailed and complex', hint: 'It took months — it must be very detailed.' },
    ],
  },
  'ela-5-writing': {
    id: 'ela-5-writing', subject: 'ela', grade: '5',
    title: 'Essay Structure & Writing', description: 'Plan and write structured paragraphs and essays',
    explanation: 'A paragraph has a topic sentence, supporting details, and a concluding sentence. An essay adds an introduction (with a thesis statement) and a conclusion that restates the main idea.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'The sentence that states the main idea of a paragraph is the:', options: ['Concluding sentence','Topic sentence','Detail sentence','Transition'], answer: 'Topic sentence', hint: 'It usually comes first and sets up the paragraph.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'A concluding sentence in a paragraph should:', options: ['Introduce a new topic','Restate the main idea','Give a new example','Ask a question'], answer: 'Restate the main idea', hint: 'It wraps up what the paragraph said.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Which transition word shows contrast?', options: ['Furthermore','In addition','However','For example'], answer: 'However', hint: '"However" = but; it introduces an opposing idea.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'The purpose of an introduction is to:', options: ['Summarize the conclusion','Introduce the topic and thesis','List all evidence','Explain each body paragraph'], answer: 'Introduce the topic and thesis', hint: 'It hooks the reader and states the main argument.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A thesis statement is:', options: ['A supporting detail','The title','The writer\'s main argument','The final sentence'], answer: 'The writer\'s main argument', hint: 'Everything in the essay supports this claim.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Which is the BEST topic sentence for a paragraph about dogs?', options: ['Dogs bark.','There are many types of dogs.','Dogs make ideal pets because they are loyal, trainable, and loving.','My dog is named Max.'], answer: 'Dogs make ideal pets because they are loyal, trainable, and loving.', hint: 'A good topic sentence is specific and states a claim.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Body paragraphs of a persuasive essay should contain:', options: ['Only personal opinions','Unrelated stories','Evidence and reasoning supporting the thesis','Summaries of other essays'], answer: 'Evidence and reasoning supporting the thesis', hint: 'You need facts and logic, not just feelings.' },
    ],
  },

  // ============ ELA — GRADE 6 ============
  'ela-6-literary-devices': {
    id: 'ela-6-literary-devices', subject: 'ela', grade: '6',
    title: 'Literary Devices', description: 'Identify foreshadowing, flashback, irony, and allusion',
    explanation: 'Authors use literary devices to deepen meaning. Foreshadowing hints at future events. Flashback revisits earlier events. Irony is when the opposite of what is expected occurs. Allusion references something well-known.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'When an author hints about what will happen later, it is called:', options: ['Flashback','Foreshadowing','Irony','Allusion'], answer: 'Foreshadowing', hint: '"Fore" means before — a hint of things to come.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'A scene that interrupts the story to show an earlier event is a:', options: ['Foreshadowing','Climax','Flashback','Resolution'], answer: 'Flashback', hint: 'You "flash back" to a past moment in time.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'A character says "Great, another rainy day" with a frustrated tone. This is:', options: ['Sarcasm/Verbal Irony','Simile','Foreshadowing','Alliteration'], answer: 'Sarcasm/Verbal Irony', hint: 'They say the opposite of what they mean.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Situational irony is when:', options: ['A character says the opposite of what they mean','The audience knows more than characters','The opposite of what is expected happens','The story jumps to the past'], answer: 'The opposite of what is expected happens', hint: 'Reality surprises us by contradicting expectations.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A reference to Spider-Man in a novel would be an example of:', options: ['Alliteration','An allusion','Onomatopoeia','A simile'], answer: 'An allusion', hint: 'An allusion is a reference to a well-known story, person, or event.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: '"Dark, stormy clouds gathered as the hero began his journey." This is:', options: ['Flashback','Allusion','Foreshadowing','Irony'], answer: 'Foreshadowing', hint: 'Dark clouds hint that trouble lies ahead.' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Dramatic irony means:', options: ['The audience knows more than the characters','Characters say the opposite of what they mean','An unexpected event occurs','Comparing two unlike things'], answer: 'The audience knows more than the characters', hint: 'Like knowing a villain is sneaking up on a character who is unaware.' },
    ],
  },
  'ela-6-grammar': {
    id: 'ela-6-grammar', subject: 'ela', grade: '6',
    title: 'Advanced Grammar', description: 'Master subject-verb agreement, clauses, and pronoun usage',
    explanation: 'Subject-verb agreement: singular subjects take singular verbs ("He runs"), plural subjects take plural verbs ("They run"). An independent clause can stand alone; a dependent clause cannot.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which sentence has correct subject-verb agreement?', options: ['The dogs runs fast.','The dog run fast.','The dog runs fast.','The dogs run fastly.'], answer: 'The dog runs fast.', hint: 'Singular subject + singular verb.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: '"Although it rained" is a:', options: ['Independent clause','Dependent clause','Complete sentence','Simple sentence'], answer: 'Dependent clause', hint: '"Although" makes it incomplete — it needs more.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Which pronoun correctly completes: "Each of the students must bring ___ book."', options: ['their','his or her','its','our'], answer: 'his or her', hint: '"Each" is singular, so use a singular pronoun.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'The independent clause in "She smiled when she saw the surprise" is:', options: ['When she saw the surprise','She smiled','She smiled when','Saw the surprise'], answer: 'She smiled', hint: 'An independent clause can stand alone as a complete sentence.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A run-on sentence is:', options: ['Too short','Two sentences incorrectly joined without punctuation','A sentence with many adjectives','A dependent clause'], answer: 'Two sentences incorrectly joined without punctuation', hint: 'Two independent clauses need a period, semicolon, or conjunction.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Correct verb: "Neither the students nor the teacher ___ ready."', options: ['are','were','was','been'], answer: 'was', hint: 'With neither/nor, the verb agrees with the subject closest to it (teacher = singular).' },
      { id: 'q7', type: 'mcq', difficulty: 3, prompt: 'Which sentence uses a semicolon correctly?', options: ['I love pizza; but not anchovies.','She was tired; however, she kept running.','We went to; the store.','He said; "hello."'], answer: 'She was tired; however, she kept running.', hint: 'A semicolon + conjunctive adverb joins two independent clauses.' },
    ],
  },

  // ============ ELA — GRADE 7 ============
  'ela-7-argumentative': {
    id: 'ela-7-argumentative', subject: 'ela', grade: '7',
    title: 'Argumentative Writing', description: 'Build arguments with claims, evidence, and counterclaims',
    explanation: 'An effective argument has: a clear claim (your position), supporting evidence (facts, data, quotes), and addresses counterclaims (opposing views) to show balanced thinking.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'The main position in an argument is called the:', options: ['Evidence','Counterclaim','Claim','Conclusion'], answer: 'Claim', hint: 'It is the statement you are trying to prove.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'A counterclaim is:', options: ['Your main argument','An opposing viewpoint','A supporting fact','A rhetorical question'], answer: 'An opposing viewpoint', hint: '"Counter" means against.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Which type of evidence is strongest in an argument?', options: ['Personal feelings','Statistics from a reliable study','A friend\'s opinion','A rumor'], answer: 'Statistics from a reliable study', hint: 'Evidence should be factual and verifiable.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Why should an argumentative essay address counterclaims?', options: ['To confuse readers','To make the essay longer','To show balanced thinking and refute opposing views','To change the topic'], answer: 'To show balanced thinking and refute opposing views', hint: 'Acknowledging and countering other views strengthens your argument.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'An author who appeals to emotion to persuade is using:', options: ['Logos','Ethos','Pathos','Kairos'], answer: 'Pathos', hint: 'Pathos = emotional appeal.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Logos in an argument refers to:', options: ['Emotional appeal','Appeal to credibility','Logical appeal using facts and reasoning','Timing of the argument'], answer: 'Logical appeal using facts and reasoning', hint: 'Logos = logic and reasoning.' },
    ],
  },

  // ============ ELA — GRADE 8 ============
  'ela-8-literary-analysis': {
    id: 'ela-8-literary-analysis', subject: 'ela', grade: '8',
    title: 'Literary Analysis', description: 'Analyze theme, character development, and author\'s craft',
    explanation: 'Literary analysis goes beyond plot to examine HOW and WHY an author makes choices. Dynamic characters change; static characters don\'t. Theme is the central message. Tone is the author\'s attitude.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'A dynamic character is one who:', options: ['Never appears again','Stays exactly the same','Changes significantly during the story','Is always positive'], answer: 'Changes significantly during the story', hint: '"Dynamic" = changing, evolving.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'A static character is one who:', options: ['Changes throughout the story','Remains essentially unchanged','Appears in every scene','Has special powers'], answer: 'Remains essentially unchanged', hint: '"Static" = unchanging.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: '"First person" point of view means:', options: ['Three narrators tell the story','The narrator uses "I" and is a character','An omniscient narrator knows everything','A "you" narrative'], answer: 'The narrator uses "I" and is a character', hint: '"I went to the store" — the narrator participates in the story.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'In literature, "tone" refers to:', options: ['The main conflict','The author\'s attitude toward the subject','The rhyme scheme','The setting'], answer: 'The author\'s attitude toward the subject', hint: 'Tone can be serious, humorous, critical, nostalgic, etc.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: '"The Great Gatsby" is said to explore the corruption of the American Dream. This is its:', options: ['Plot','Setting','Theme','Character'], answer: 'Theme', hint: 'Theme is the universal idea beneath the surface story.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'An author repeats a symbol (like a green light) throughout a novel to:', options: ['Fill word count','Show character movement','Reinforce a theme','Provide comic relief'], answer: 'Reinforce a theme', hint: 'Repeated symbols carry deeper meaning and emphasize the author\'s message.' },
    ],
  },

  // ============ ELA — GRADE 9 ============
  'ela-9-rhetoric': {
    id: 'ela-9-rhetoric', subject: 'ela', grade: '9',
    title: 'Rhetoric & Persuasion', description: 'Analyze rhetorical appeals and persuasive techniques',
    explanation: 'Rhetoric is the art of persuasion. The three main appeals: Ethos (credibility/authority), Pathos (emotion), Logos (logic/facts). Rhetorical devices include anaphora (repetition at clause start) and rhetorical questions.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'A doctor saying "As a physician, I recommend..." uses:', options: ['Pathos','Logos','Ethos','Kairos'], answer: 'Ethos', hint: 'Establishing authority or credibility.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'An ad showing a crying child to raise charity funds uses:', options: ['Logos','Ethos','Pathos','Anaphora'], answer: 'Pathos', hint: 'Emotional appeal targeting the audience\'s feelings.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: '"Ask not what your country can do for you; ask what you can do for your country" repeats "ask." This is:', options: ['Antithesis','Anaphora','Alliteration','Hyperbole'], answer: 'Anaphora', hint: 'Repetition of a word/phrase at the beginning of successive clauses.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'A rhetorical question is one that:', options: ['Requires a detailed answer','Has no answer','Is meant to make a point, not get an answer','Only experts can answer'], answer: 'Is meant to make a point, not get an answer', hint: '"Is that really what we want for our children?" — the answer is implied.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'Analyzing a speech for "purpose, audience, and context" is part of:', options: ['STEAL analysis','SOAPSTone analysis','SWOT analysis','CRAAP analysis'], answer: 'SOAPSTone analysis', hint: 'Speaker, Occasion, Audience, Purpose, Subject, Tone.' },
    ],
  },

  // ============ ELA — GRADE 10 ============
  'ela-10-shakespeare': {
    id: 'ela-10-shakespeare', subject: 'ela', grade: '10',
    title: 'Shakespeare & Drama', description: 'Understand dramatic structure and Shakespeare\'s language',
    explanation: 'Shakespeare wrote in Elizabethan English using iambic pentameter (10 syllables/line: da-DUM × 5). Five-act plays follow: exposition, rising action, climax, falling action, resolution. A soliloquy reveals inner thoughts.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Iambic pentameter has how many syllables per line?', options: ['8','10','12','14'], answer: '10', hint: '5 iambs × 2 syllables each = 10.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'A soliloquy is when a character:', options: ['Speaks to another character','Speaks alone on stage to reveal inner thoughts','Sings a song','Argues in court'], answer: 'Speaks alone on stage to reveal inner thoughts', hint: 'Like Hamlet\'s "To be or not to be..."' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: '"Star-crossed lovers" in Romeo and Juliet suggests their fate is controlled by:', options: ['Their families','Destiny/chance','The Prince','Their wealth'], answer: 'Destiny/chance', hint: '"Star-crossed" = opposed by the stars (fate).' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'The moment of highest tension in a play is the:', options: ['Exposition','Falling action','Climax','Resolution'], answer: 'Climax', hint: 'The turning point where everything changes.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'A tragic hero\'s "fatal flaw" is called:', options: ['Hubris','Nemesis','Catharsis','Hamartia'], answer: 'Hamartia', hint: 'Greek for the character flaw that leads to a hero\'s downfall.' },
    ],
  },

  // ============ ELA — GRADE 11 ============
  'ela-11-american-literature': {
    id: 'ela-11-american-literature', subject: 'ela', grade: '11',
    title: 'American Literature', description: 'Analyze major periods and works of American literary history',
    explanation: 'American literature spans Puritan writings, Romanticism (Emerson, Thoreau), Realism (Twain), Modernism (Fitzgerald, Hemingway), and the Harlem Renaissance (Hughes, Hurston).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'The Harlem Renaissance was primarily associated with:', options: ['Western expansion','African American cultural expression','Puritan religious writing','The Industrial Revolution'], answer: 'African American cultural expression', hint: 'A flowering of Black art, literature, and music in 1920s Harlem, New York.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: '"Self-Reliance" by Emerson promotes:', options: ['Dependence on government','Conformity to society','Individual thought and trust in oneself','Religious devotion above all'], answer: 'Individual thought and trust in oneself', hint: 'Transcendentalism valued self-reliance and nature.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'The "Lost Generation" writers (Hemingway, Fitzgerald) were disillusioned by:', options: ['The Civil War','World War I','The Great Depression','World War II'], answer: 'World War I', hint: 'They felt abandoned by a world that promised progress but delivered carnage.' },
      { id: 'q4', type: 'mcq', difficulty: 3, prompt: 'In "The Great Gatsby," the green light symbolizes:', options: ['Money','Jealousy','The unattainable American Dream','Environmental ideals'], answer: 'The unattainable American Dream', hint: 'Gatsby reaches toward a dream he can never quite grasp.' },
    ],
  },

  // ============ ELA — GRADE 12 ============
  'ela-12-ap-skills': {
    id: 'ela-12-ap-skills', subject: 'ela', grade: '12',
    title: 'AP Language & Composition', description: 'Master rhetorical analysis, synthesis essays, and diction',
    explanation: 'AP Language focuses on analyzing how writers use rhetorical strategies. Key terms: diction (word choice), syntax (sentence structure), anaphora (repeated phrases), and juxtaposition (placing contrasting ideas side by side).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 2, prompt: 'In a rhetorical analysis, your primary job is to:', options: ['Agree or disagree with the author','Explain the plot','Analyze HOW the author uses language to achieve their purpose','Summarize the text'], answer: 'Analyze HOW the author uses language to achieve their purpose', hint: 'Focus on strategies (how), not content (what).' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'A synthesis essay requires you to:', options: ['Write a personal narrative','Analyze a single text deeply','Combine multiple sources to support your argument','Summarize an argument'], answer: 'Combine multiple sources to support your argument', hint: 'You weave cited sources together to build your own argument.' },
      { id: 'q3', type: 'mcq', difficulty: 3, prompt: 'Diction refers to:', options: ['Sentence length','Word choice','Paragraph structure','Punctuation patterns'], answer: 'Word choice', hint: 'Diction = the specific words an author selects.' },
      { id: 'q4', type: 'mcq', difficulty: 3, prompt: 'Syntax refers to:', options: ['Word choice','Sentence structure and arrangement','The tone of a piece','The use of imagery'], answer: 'Sentence structure and arrangement', hint: 'How sentences are built and ordered affects meaning and rhythm.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'Short, fragmented sentences create a tone of:', options: ['Calm reflection','Urgency or tension','Humor','Formality'], answer: 'Urgency or tension', hint: 'Short sentences speed up the reader\'s pace and heighten tension.' },
    ],
  },

  // ============ SCIENCE — GRADE 2 ============
  'science-2-weather': {
    id: 'science-2-weather', subject: 'science', grade: '2',
    title: 'Weather & Seasons', description: 'Observe weather patterns and understand seasonal change',
    explanation: 'Weather is the daily atmospheric condition: sunny, cloudy, rainy, snowy. Seasons change because Earth\'s axis tilts as it orbits the Sun. In summer, your hemisphere tilts toward the Sun.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which tool measures temperature?', options: ['Rain gauge','Thermometer','Wind vane','Barometer'], answer: 'Thermometer', hint: 'It measures how hot or cold the air is.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'What type of weather brings snow?', options: ['Hot and sunny','Warm and rainy','Cold and wet','Hot and windy'], answer: 'Cold and wet', hint: 'Snow needs freezing temperatures and moisture.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'In which season do many trees lose their leaves?', options: ['Spring','Summer','Fall/Autumn','Winter'], answer: 'Fall/Autumn', hint: 'Leaves change color and fall in autumn.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'What causes day and night?', options: ['The Moon orbiting Earth','Earth\'s rotation on its axis','The Sun moving','Clouds blocking sunlight'], answer: 'Earth\'s rotation on its axis', hint: 'Earth spins once every 24 hours.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Dark gray, low clouds usually mean:', options: ['Sunny weather coming','Rain or storms are coming','A hot day','Extreme cold'], answer: 'Rain or storms are coming', hint: 'Dark clouds hold a lot of water.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Why is summer hotter than winter in the United States?', options: ['Earth is closer to the Sun','The Sun moves north','Earth tilts toward the Sun','Days and nights are equal'], answer: 'Earth tilts toward the Sun', hint: 'Earth\'s axial tilt determines how directly sunlight hits each hemisphere.' },
    ],
  },

  // ============ SCIENCE — GRADE 4 ============
  'science-4-ecosystems': {
    id: 'science-4-ecosystems', subject: 'science', grade: '4',
    title: 'Ecosystems & Food Chains', description: 'Understand how organisms interact in ecosystems',
    explanation: 'An ecosystem includes all living things and their environment. Food chains show energy flow. Producers (plants) make food via photosynthesis. Consumers eat other organisms. Decomposers recycle nutrients.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Plants are called PRODUCERS because they:', options: ['Eat other animals','Make their own food through photosynthesis','Break down dead matter','Pollinate flowers'], answer: 'Make their own food through photosynthesis', hint: 'They produce food from sunlight, water, and CO₂.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'In grass → rabbit → fox, the rabbit is a:', options: ['Producer','Primary consumer','Secondary consumer','Decomposer'], answer: 'Primary consumer', hint: 'It eats the producer (grass) directly.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Fungi that break down fallen logs are:', options: ['Producers','Primary consumers','Decomposers','Predators'], answer: 'Decomposers', hint: 'They recycle nutrients back into the soil.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'What would happen if all plants disappeared from an ecosystem?', options: ['Only herbivores would survive','All consumers would eventually die','Decomposers would take over','Nothing would change'], answer: 'All consumers would eventually die', hint: 'Without producers, there is no energy source for the food chain.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A habitat provides animals with:', options: ['Only food','Only water','Food, water, shelter, and space','Just a place to sleep'], answer: 'Food, water, shelter, and space', hint: 'All four are needed for animal survival.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'A predator-prey relationship means:', options: ['Both animals help each other','One hunts and the other is hunted','Animals compete for the same food','Two animals living peacefully'], answer: 'One hunts and the other is hunted', hint: 'The predator hunts; the prey is hunted.' },
    ],
  },

  // ============ SCIENCE — GRADE 6 ============
  'science-6-chemistry': {
    id: 'science-6-chemistry', subject: 'science', grade: '6',
    title: 'Matter & Chemistry', description: 'Classify matter and distinguish physical from chemical changes',
    explanation: 'Physical changes alter form but not substance (cutting, melting). Chemical changes create new substances (burning, rusting). Elements contain one type of atom. Compounds chemically combine two or more elements.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'A physical change:', options: ['Creates a new substance','Changes form but not composition','Cannot be reversed','Always produces a gas'], answer: 'Changes form but not composition', hint: 'Cutting paper is physical — it\'s still paper.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Which is a chemical change?', options: ['Cutting wood','Melting ice','Burning paper','Tearing cloth'], answer: 'Burning paper', hint: 'Burning creates ash — a new substance.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'An element is a pure substance made of:', options: ['Two or more types of atoms','Only one type of atom','Molecules and compounds','Water and air'], answer: 'Only one type of atom', hint: 'Gold, oxygen, carbon are elements — only one atom type each.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Water (H₂O) is an example of a:', options: ['Element','Mixture','Compound','Pure element'], answer: 'Compound', hint: 'Two or more elements chemically combined in a fixed ratio.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A mixture differs from a compound because:', options: ['Mixtures contain only one element','Mixtures can be separated physically','Compounds are easily separated','Compounds have no fixed composition'], answer: 'Mixtures can be separated physically', hint: 'Saltwater can be separated by evaporation — no chemical change needed.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Signs of a chemical reaction include:', options: ['Only temperature change','Color change, gas, light/heat, precipitate','Melting and freezing only','Change in shape'], answer: 'Color change, gas, light/heat, precipitate', hint: 'New substances form with multiple observable changes.' },
    ],
  },

  // ============ SCIENCE — GRADE 7 ============
  'science-7-physics': {
    id: 'science-7-physics', subject: 'science', grade: '7',
    title: 'Force & Motion', description: 'Apply Newton\'s Laws to real-world motion problems',
    explanation: 'Newton\'s 3 Laws: (1) Inertia — objects stay at rest or in motion unless a net force acts. (2) F = ma — force equals mass times acceleration. (3) Every action has an equal and opposite reaction.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Newton\'s First Law is called the law of:', options: ['Action-Reaction','Acceleration','Inertia','Gravity'], answer: 'Inertia', hint: 'Objects resist changes in their state of motion.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'F = ma means force equals:', options: ['Mass × Acceleration','Mass + Acceleration','Mass − Acceleration','Mass / Acceleration'], answer: 'Mass × Acceleration', hint: 'Newton\'s Second Law.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'A ball rolling on a floor slows due to:', options: ['Gravity','Inertia','Friction','Newton\'s Third Law'], answer: 'Friction', hint: 'The floor resists the ball\'s motion.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'A 10 kg object accelerates at 3 m/s². The force is:', options: ['3 N','7 N','13 N','30 N'], answer: '30 N', hint: 'F = 10 × 3 = 30 N.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'A gun recoils when fired. This is Newton\'s:', options: ['First Law','Second Law','Third Law','Law of Gravity'], answer: 'Third Law', hint: 'Every action has an equal and opposite reaction.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'On the Moon, gravity is weaker. An object\'s MASS would:', options: ['Decrease','Increase','Stay the same','Become zero'], answer: 'Stay the same', hint: 'Mass is the amount of matter — it doesn\'t change with gravity. Weight does.' },
    ],
  },

  // ============ SCIENCE — GRADE 9 ============
  'science-9-biology': {
    id: 'science-9-biology', subject: 'science', grade: '9',
    title: 'Cell Biology & Genetics', description: 'Understand cell structure, DNA, and Mendelian genetics',
    explanation: 'Cells are the basic unit of life. DNA stores genetic information in the nucleus. Genes determine traits. Dominant alleles mask recessive ones. Mitosis creates identical daughter cells; meiosis creates sex cells.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'The "powerhouse of the cell" is the:', options: ['Nucleus','Ribosome','Mitochondria','Cell wall'], answer: 'Mitochondria', hint: 'It produces ATP through cellular respiration.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'DNA is stored in the:', options: ['Mitochondria','Ribosome','Nucleus','Cell membrane'], answer: 'Nucleus', hint: 'The nucleus is the cell\'s control center.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'In a Punnett square, if both parents are Bb, the probability of BB offspring is:', options: ['0%','25%','50%','75%'], answer: '25%', hint: 'Bb × Bb gives BB, Bb, Bb, bb. Only 1 in 4 is BB.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Mitosis results in:', options: ['2 identical daughter cells','4 cells with half the chromosomes','Genetic variation only','Sex cells'], answer: '2 identical daughter cells', hint: 'Mitosis = growth and repair; meiosis = sex cells.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'A plant with genotype Tt (tall dominant over short) has which phenotype?', options: ['Short','Tall','Medium','Cannot determine'], answer: 'Tall', hint: 'One dominant allele (T) is enough to express the dominant trait.' },
    ],
  },

  // ============ SCIENCE — GRADE 10 ============
  'science-10-chemistry': {
    id: 'science-10-chemistry', subject: 'science', grade: '10',
    title: 'Chemical Reactions & Stoichiometry', description: 'Balance equations and calculate moles and mass',
    explanation: 'A balanced chemical equation has equal numbers of atoms on each side. Stoichiometry uses molar ratios to calculate products/reactants. One mole = 6.02 × 10²³ particles (Avogadro\'s number).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'In a chemical equation, coefficients represent:', options: ['Number of atoms in one molecule','Number of molecules or moles','Type of bond','Energy released'], answer: 'Number of molecules or moles', hint: '2H₂ + O₂ → 2H₂O: 2 moles of H₂ react with 1 mole of O₂.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'Balance: H₂ + O₂ → H₂O. Correct coefficients are:', options: ['1, 1, 1','2, 1, 2','1, 2, 2','2, 2, 1'], answer: '2, 1, 2', hint: '2H₂ + O₂ → 2H₂O: 4 H and 2 O on each side.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'One mole of any substance contains approximately:', options: ['6.02 × 10²³ particles','1000 particles','6.02 × 10¹² particles','1 × 10⁶ particles'], answer: '6.02 × 10²³ particles', hint: 'Avogadro\'s number.' },
      { id: 'q4', type: 'mcq', difficulty: 3, prompt: 'In 2H₂ + O₂ → 2H₂O, how many moles of water form from 4 moles of H₂?', options: ['2','4','6','8'], answer: '4', hint: 'Ratio is 2H₂ : 2H₂O = 1:1, so 4 mol H₂ → 4 mol H₂O.' },
    ],
  },

  // ============ SCIENCE — GRADE 11 ============
  'science-11-physics': {
    id: 'science-11-physics', subject: 'science', grade: '11',
    title: 'Kinematics & Dynamics', description: 'Analyze motion, velocity, acceleration, and energy',
    explanation: 'Velocity = displacement/time (vector). Acceleration = Δvelocity/time. Kinetic energy KE = ½mv². Potential energy PE = mgh. The Law of Conservation of Energy: total energy remains constant.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Velocity is:', options: ['Speed in any direction','Speed with a specific direction','Just distance','Just time'], answer: 'Speed with a specific direction', hint: 'Velocity is a vector — it includes both magnitude and direction.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'A car goes from 0 to 60 m/s in 10 s. Its acceleration is:', options: ['6 m/s²','60 m/s²','600 m/s²','0.6 m/s²'], answer: '6 m/s²', hint: 'a = Δv/t = 60/10 = 6 m/s².' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Kinetic energy depends on:', options: ['Mass and height','Mass and velocity','Weight and speed','Force and distance'], answer: 'Mass and velocity', hint: 'KE = ½mv².' },
      { id: 'q4', type: 'mcq', difficulty: 3, prompt: 'A 2 kg ball at 3 m/s has kinetic energy of:', options: ['6 J','9 J','12 J','18 J'], answer: '9 J', hint: 'KE = ½ × 2 × 3² = 1 × 9 = 9 J.' },
    ],
  },

  // ============ SCIENCE — GRADE 12 ============
  'science-12-ap-biology': {
    id: 'science-12-ap-biology', subject: 'science', grade: '12',
    title: 'AP Biology', description: 'Evolution, ecology, and advanced cellular processes',
    explanation: 'Evolution occurs through natural selection: organisms with favorable traits survive and reproduce. Hardy-Weinberg equilibrium describes non-evolving populations. Cellular respiration (mitochondria) and photosynthesis (chloroplasts) are complementary energy processes.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 2, prompt: 'Natural selection acts directly on:', options: ['Genotypes','Phenotypes','Allele frequencies alone','Random mutations'], answer: 'Phenotypes', hint: 'The environment selects for observable traits, not hidden genotypes.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'Hardy-Weinberg equilibrium requires:', options: ['Large population, no migration, no mutation, no selection, random mating','Small population with lots of mutation','Natural selection and genetic drift','Migration and mutation only'], answer: 'Large population, no migration, no mutation, no selection, random mating', hint: 'Five conditions — if all met, allele frequencies don\'t change (no evolution).' },
      { id: 'q3', type: 'mcq', difficulty: 3, prompt: 'The electron transport chain occurs in the:', options: ['Cytoplasm','Nucleus','Inner mitochondrial membrane','Ribosome'], answer: 'Inner mitochondrial membrane', hint: 'The ETC is embedded in the inner mitochondrial membrane, driving ATP synthesis.' },
    ],
  },

  // ============ SOCIAL STUDIES — GRADE 1 ============
  'social-1-community': {
    id: 'social-1-community', subject: 'social', grade: '1',
    title: 'My Community', description: 'Learn about community helpers, neighborhoods, and maps',
    explanation: 'A community is a place where people live, work, and play together. Community helpers (firefighters, doctors, teachers) keep us safe and healthy. Maps show places from above.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which community helper puts out fires?', options: ['Doctor','Firefighter','Teacher','Baker'], answer: 'Firefighter', hint: 'They use hoses and fire trucks.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Where do you go to borrow books for free?', options: ['Bank','Library','Hospital','Fire station'], answer: 'Library', hint: 'Books are organized on shelves for everyone to borrow.' },
      { id: 'q3', type: 'mcq', difficulty: 1, prompt: 'A map shows:', options: ['How things taste','A view of a place from above','The weather','How people feel'], answer: 'A view of a place from above', hint: 'Maps show streets, buildings, and landmarks from a bird\'s-eye view.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: '"Urban" means:', options: ['Countryside with farms','Small villages','A city or densely populated area','Forest or jungle'], answer: 'A city or densely populated area', hint: 'Urban = city; rural = countryside.' },
      { id: 'q5', type: 'mcq', difficulty: 2, prompt: 'Which area has the most people per square mile?', options: ['Rural','Suburban','Urban','Wilderness'], answer: 'Urban', hint: 'Cities are the most densely populated.' },
      { id: 'q6', type: 'mcq', difficulty: 3, prompt: 'Rules in a community help people:', options: ['Stay inside all day','Live safely and fairly together','Ignore their neighbors','Avoid all laws'], answer: 'Live safely and fairly together', hint: 'Rules protect everyone\'s rights and safety.' },
    ],
  },

  // ============ SOCIAL STUDIES — GRADE 3 ============
  'social-3-us-history': {
    id: 'social-3-us-history', subject: 'social', grade: '3',
    title: 'Early American History', description: 'Learn about Native Americans, colonists, and the Revolution',
    explanation: 'Native Americans were the first people in North America. European colonists arrived starting in the 1400s. The colonists declared independence from Britain on July 4, 1776.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Who were the first people to live in North America?', options: ['Colonists','Native Americans','Pilgrims','Vikings'], answer: 'Native Americans', hint: 'They lived here long before Europeans arrived.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'The Pilgrims sailed to America on which ship?', options: ['Santa Maria','Mayflower','Niña','Pinta'], answer: 'Mayflower', hint: 'They landed at Plymouth Rock in 1620.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'The Declaration of Independence was signed in:', options: ['1492','1620','1776','1865'], answer: '1776', hint: 'July 4, 1776 — now celebrated as Independence Day!' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'The American Revolution was a conflict between:', options: ['North and South America','Colonists and Great Britain','Spain and France','Native Americans and colonists'], answer: 'Colonists and Great Britain', hint: 'The colonists wanted freedom from British rule and taxation.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'Who was the first President of the United States?', options: ['Abraham Lincoln','Thomas Jefferson','Benjamin Franklin','George Washington'], answer: 'George Washington', hint: 'He led the Continental Army and became president in 1789.' },
    ],
  },

  // ============ SOCIAL STUDIES — GRADE 5 ============
  'social-5-us-geography': {
    id: 'social-5-us-geography', subject: 'social', grade: '5',
    title: 'U.S. Geography', description: 'Identify U.S. regions, rivers, mountains, and landmarks',
    explanation: 'The U.S. has five major regions: Northeast, Southeast, Midwest, Southwest, and West. Key features: Rocky Mountains (West), Mississippi River (Midwest/South), and the Great Plains (Midwest).',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'The longest river in the United States is the:', options: ['Colorado River','Hudson River','Mississippi River','Ohio River'], answer: 'Mississippi River', hint: 'It runs from Minnesota to the Gulf of Mexico.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Which ocean is on the West Coast of the U.S.?', options: ['Atlantic Ocean','Arctic Ocean','Indian Ocean','Pacific Ocean'], answer: 'Pacific Ocean', hint: 'Pacific = west; Atlantic = east.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'The Rocky Mountains are in which region?', options: ['Northeast','Southeast','Midwest','West'], answer: 'West', hint: 'They run through Colorado, Wyoming, and Montana.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'Which Great Lake is the largest by surface area?', options: ['Lake Ontario','Lake Erie','Lake Michigan','Lake Superior'], answer: 'Lake Superior', hint: 'Superior is the largest of all five Great Lakes.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'The Great Plains are known for:', options: ['Dense forests','Flat land used for farming and ranching','Towering mountains','A desert climate'], answer: 'Flat land used for farming and ranching', hint: 'Often called the "breadbasket of America" — vast farms and cattle ranches.' },
    ],
  },

  // ============ SOCIAL STUDIES — GRADE 7 ============
  'social-7-world-history': {
    id: 'social-7-world-history', subject: 'social', grade: '7',
    title: 'Ancient Civilizations', description: 'Study ancient Egypt, Greece, Rome, and Mesopotamia',
    explanation: 'Ancient civilizations developed near rivers where farming thrived. Mesopotamia ("between two rivers") is the "Cradle of Civilization." Greece gave us democracy. Rome built a republic that became an empire.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Which river was central to ancient Egyptian civilization?', options: ['Amazon','Nile','Ganges','Tigris'], answer: 'Nile', hint: 'Annual Nile floods enriched the farmland.' },
      { id: 'q2', type: 'mcq', difficulty: 1, prompt: 'Mesopotamia was located between which two rivers?', options: ['Nile and Congo','Amazon and Parana','Tigris and Euphrates','Yangtze and Yellow'], answer: 'Tigris and Euphrates', hint: 'Mesopotamia means "between two rivers" in Greek.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Ancient Greece is considered the birthplace of:', options: ['Writing','Democracy','Monotheism','Paper'], answer: 'Democracy', hint: 'Athenian citizens voted on laws and leaders.' },
      { id: 'q4', type: 'mcq', difficulty: 2, prompt: 'The Roman Republic became an empire when:', options: ['Greece was conquered','Julius Caesar was elected','Augustus became the first emperor','Rome was sacked'], answer: 'Augustus became the first emperor', hint: 'Augustus (Octavian) became emperor after Caesar\'s assassination in 44 BCE.' },
      { id: 'q5', type: 'mcq', difficulty: 3, prompt: 'The Code of Hammurabi was significant because it was:', options: ['A Greek epic poem','One of the earliest written legal codes','An Egyptian religious text','A Roman military manual'], answer: 'One of the earliest written legal codes', hint: 'Created in ancient Babylon around 1754 BCE.' },
    ],
  },

  // ============ SOCIAL STUDIES — GRADE 9 ============
  'social-9-economics': {
    id: 'social-9-economics', subject: 'social', grade: '9',
    title: 'Economics Basics', description: 'Understand supply, demand, scarcity, and economic systems',
    explanation: 'Economics studies how people use limited resources. Scarcity means wants exceed available resources. Supply and demand determine prices: high demand + low supply → higher prices. Opportunity cost is what you give up when making a choice.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Scarcity in economics means:', options: ['Everything is free','Wants exceed available resources','There is enough of everything','Prices are always high'], answer: 'Wants exceed available resources', hint: 'Resources (time, money, goods) are always limited.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'If demand rises but supply stays the same, the price will:', options: ['Fall','Stay the same','Rise','Become zero'], answer: 'Rise', hint: 'More buyers competing for the same amount → sellers charge more.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'Opportunity cost is:', options: ['The price of a product','The next best alternative given up when making a choice','A type of tax','The cost of production'], answer: 'The next best alternative given up when making a choice', hint: 'Every choice means giving up something else.' },
      { id: 'q4', type: 'mcq', difficulty: 3, prompt: 'In a market economy, prices are primarily determined by:', options: ['Government decisions','Supply and demand','Business owners alone','International trade'], answer: 'Supply and demand', hint: 'Buyers and sellers interact freely to set prices.' },
    ],
  },

  // ============ SOCIAL STUDIES — GRADE 10 ============
  'social-10-world-history': {
    id: 'social-10-world-history', subject: 'social', grade: '10',
    title: 'World War Era', description: 'Analyze the causes and consequences of WWI and WWII',
    explanation: 'WWI (1914-1918) was caused by MAIN: Militarism, Alliances, Imperialism, Nationalism. WWII (1939-1945) arose from the Great Depression, fascism, and unresolved WWI tensions. The Holocaust was the systematic genocide of 6 million Jews.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'MAIN stands for causes of WWI. The "M" stands for:', options: ['Money','Militarism','Migration','Manufacturing'], answer: 'Militarism', hint: 'Nations were rapidly building up massive armies and navies.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'The immediate trigger for WWI was:', options: ['Germany invading Poland','The assassination of Archduke Franz Ferdinand','The bombing of Pearl Harbor','The Treaty of Versailles'], answer: 'The assassination of Archduke Franz Ferdinand', hint: 'Shot in Sarajevo in June 1914 by a Serbian nationalist.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'The Holocaust refers to:', options: ['Allied bombing campaigns','The German invasion of France','The Nazi genocide of approximately 6 million Jews','The destruction of Hiroshima'], answer: 'The Nazi genocide of approximately 6 million Jews', hint: 'A systematic murder program carried out by Nazi Germany 1941-1945.' },
      { id: 'q4', type: 'mcq', difficulty: 3, prompt: 'The Treaty of Versailles (1919) contributed to WWII by:', options: ['Creating the United Nations','Promoting European prosperity','Placing harsh penalties on Germany that fueled resentment','Giving Germany new territories'], answer: 'Placing harsh penalties on Germany that fueled resentment', hint: 'Reparations and humiliation created conditions for Hitler\'s rise.' },
    ],
  },

  // ============ SOCIAL STUDIES — GRADE 11 ============
  'social-11-government': {
    id: 'social-11-government', subject: 'social', grade: '11',
    title: 'U.S. Government & Politics', description: 'Understand the Constitution, civil rights, and political processes',
    explanation: 'The U.S. Constitution created three branches with checks and balances. The Bill of Rights protects individual freedoms. The Civil Rights Movement fought to extend constitutional rights to all Americans.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 1, prompt: 'Checks and balances means:', options: ['Balancing the federal budget','Each branch limits the others\' power','States check federal power only','Citizens vote on all laws'], answer: 'Each branch limits the others\' power', hint: 'No single branch has unchecked authority.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'The First Amendment protects:', options: ['The right to bear arms','Freedom of speech, religion, press, assembly, and petition','The right to a jury trial','Protection against unreasonable searches'], answer: 'Freedom of speech, religion, press, assembly, and petition', hint: 'The 1st Amendment covers five fundamental freedoms.' },
      { id: 'q3', type: 'mcq', difficulty: 2, prompt: 'The Civil Rights Act of 1964 banned:', options: ['Segregation in schools only','Discrimination based on race, color, religion, sex, or national origin','Employment discrimination only','All voting restrictions'], answer: 'Discrimination based on race, color, religion, sex, or national origin', hint: 'It applied broadly to public places, employment, and more.' },
      { id: 'q4', type: 'mcq', difficulty: 3, prompt: 'Judicial review — the Supreme Court\'s power to strike down laws — was established in:', options: ['The Constitution itself','Marbury v. Madison','McCulloch v. Maryland','Brown v. Board of Education'], answer: 'Marbury v. Madison', hint: '1803 case that established this foundational principle of constitutional law.' },
    ],
  },

  // ============ SOCIAL STUDIES — GRADE 12 ============
  'social-12-ap-us-history': {
    id: 'social-12-ap-us-history', subject: 'social', grade: '12',
    title: 'AP U.S. History', description: 'Advanced analysis of American historical themes and causation',
    explanation: 'AP US History requires analyzing primary sources, understanding causation, and writing evidence-based arguments. Key themes: American identity, migration and settlement, work and exchange, politics and power.',
    questions: [
      { id: 'q1', type: 'mcq', difficulty: 2, prompt: 'Manifest Destiny was the belief that:', options: ['Native Americans should be assimilated','The U.S. was destined to expand across North America','States had rights over the federal government','America should avoid foreign affairs'], answer: 'The U.S. was destined to expand across North America', hint: 'The "obvious fate" to stretch from sea to shining sea.' },
      { id: 'q2', type: 'mcq', difficulty: 2, prompt: 'The primary cause of the Civil War was:', options: ['Economic differences between North and South','Slavery and its expansion into new territories','States\' rights to nullify federal law','Lincoln\'s election alone'], answer: 'Slavery and its expansion into new territories', hint: 'Slavery underpinned all other sectional conflicts.' },
      { id: 'q3', type: 'mcq', difficulty: 3, prompt: 'The New Deal (1933-1939) was primarily a response to:', options: ['WWI debt','The Great Depression','Soviet expansionism','An immigration crisis'], answer: 'The Great Depression', hint: 'FDR\'s programs aimed to relieve suffering, recover the economy, and reform institutions.' },
      { id: 'q4', type: 'mcq', difficulty: 3, prompt: 'A primary source is:', options: ['A textbook summary','A document or artifact from the time period being studied','A historian\'s interpretation','A recent encyclopedia entry'], answer: 'A document or artifact from the time period being studied', hint: 'Letters, newspapers, photographs, speeches from the era itself are primary sources.' },
    ],
  },
};

const GRADE_8_MATH_GROUPS = [
  {
    letter: 'A',
    title: 'Integers',
    skills: [
      'Compare and order integers',
      'Integer addition and subtraction rules',
      'Add and subtract integers using counters',
      'Add and subtract integers',
      'Add and subtract three or more integers',
      'Add and subtract integers: word problems',
      'Integer multiplication and division rules',
      'Multiply and divide integers',
      'Evaluate numerical expressions involving integers',
    ],
  },
  {
    letter: 'B',
    title: 'Rational numbers',
    skills: [
      'Convert between repeating decimals and fractions',
      'Convert between decimals and fractions or mixed numbers',
      'Compare rational numbers',
      'Put rational numbers in order',
      'Reciprocals and multiplicative inverses',
      'Add and subtract rational numbers',
      'Add and subtract rational numbers: word problems',
      'Apply addition and subtraction rules',
      'Multiply and divide rational numbers',
      'Multiply and divide rational numbers: word problems',
    ],
  },
  {
    letter: 'M',
    title: 'One-variable equations',
    skills: [
      'Which x satisfies an equation?',
      'Write an equation from words',
      'Model and solve equations using algebra tiles',
      'Write and solve equations that represent diagrams',
      'Properties of equality',
      'Identify equivalent equations',
      'Solve one-step equations',
      'Solve two-step equations',
      'Solve two-step equations: complete the solution',
      'Solve one-step and two-step equations: word problems',
      'Solve equations involving like terms',
      'Solve equations with variables on both sides',
      'Solve equations with variables on both sides: fractional coefficients',
      'Solve equations with variables on both sides: word problems',
      'Solve equations using the distributive property',
      'Solve multi-step equations',
      'Solve multi-step equations with fractional coefficients',
      'Solve equations: mixed review',
    ],
  },
  {
    letter: 'X',
    title: 'Proportional relationships',
    skills: [
      'Find the constant of proportionality from a table',
      'Write equations for proportional relationships from tables',
      'Identify proportional relationships by graphing',
      'Find the constant of proportionality from a graph',
      'Write equations for proportional relationships from graphs',
      'Identify proportional relationships from graphs and equations',
      'Identify proportional relationships from tables',
      'Identify proportional relationships: word problems',
      'Graph proportional relationships and find the slope',
      'Interpret graphs of proportional relationships',
      'Write and solve equations for proportional relationships',
      'Compare proportional relationships represented in different ways',
    ],
  },
  {
    letter: 'Y',
    title: 'Direct variation',
    skills: [
      'Find the constant of variation',
    ],
  },
];

const GRADE_6_SCIENCE_GROUPS = [
  {
    letter: 'A',
    title: 'Science practices and tools',
    skills: [
      'The process of scientific inquiry',
      'Identify laboratory tools',
      'Laboratory safety equipment',
    ],
  },
  {
    letter: 'B',
    title: 'Designing experiments',
    skills: [
      'Identify control and experimental groups',
      'Identify independent and dependent variables',
      'Identify the experimental question',
      'Identify questions that can be investigated with a set of materials',
      'Understand an experimental protocol about plant growth',
      'Understand an experimental protocol about diffusion',
      'Understand an experimental protocol about evaporation',
    ],
  },
  {
    letter: 'C',
    title: 'Engineering practices',
    skills: [
      'Identify parts of the engineering-design process',
      'Evaluate tests of engineering-design solutions',
      'Use data from tests to compare engineering-design solutions',
      'Explore the engineering-design process: going to the Moon!',
    ],
  },
  {
    letter: 'D',
    title: 'Matter and mass',
    skills: [
      'Compare the density of substances',
      'Calculate density',
      'Understand conservation of matter using graphs',
    ],
  },
  {
    letter: 'F',
    title: 'Atoms and molecules',
    skills: [
      'What are atoms and chemical elements?',
      'How are substances represented by chemical formulas and models?',
      'Match chemical formulas to ball-and-stick models',
      'Complete chemical formulas for ball-and-stick models',
      'Describe the atomic composition of molecules',
      'Classify elementary substances and compounds using chemical formulas',
      'Identify elementary substances and compounds',
    ],
  },
  {
    letter: 'J',
    title: 'Thermal energy',
    skills: [
      'Predict heat flow and temperature changes',
      'How are temperature and mass related to thermal energy?',
      'Compare thermal energy transfers',
    ],
  },
  {
    letter: 'K',
    title: 'Particle motion and energy',
    skills: [
      'How does particle motion affect temperature?',
      'Particle motion and changes of state',
      'How does particle motion affect gas pressure?',
      'Identify how particle motion affects temperature and pressure',
    ],
  },
  {
    letter: 'L',
    title: 'Waves',
    skills: [
      'Transverse waves',
      'Longitudinal waves',
      'Compare amplitudes, wavelengths, and frequencies of waves',
      'Compare energy of waves',
      'Transmission, reflection, and absorption of waves',
      'Electromagnetic waves',
      'Applications of infrared waves',
      'Effects of ultraviolet waves',
    ],
  },
  {
    letter: 'M',
    title: 'Solutions',
    skills: [
      'Compare concentrations of solutions',
      'Diffusion across membranes',
    ],
  },
  {
    letter: 'N',
    title: 'Classification and scientific names',
    skills: [
      'Describe, classify, and compare kingdoms',
      'Identify common and scientific names',
      'Origins of scientific names',
      'Use scientific names to classify organisms',
    ],
  },
  {
    letter: 'O',
    title: 'Biochemistry',
    skills: [
      'Structure and function: carbohydrates, lipids, proteins, and nucleic acids',
      'The chemistry of cellular respiration',
    ],
  },
  {
    letter: 'P',
    title: 'Cells',
    skills: [
      'Identify functions of plant cell parts',
      'Identify functions of animal cell parts',
      'Compare plant and animal cells',
    ],
  },
  {
    letter: 'W',
    title: 'Ecosystems',
    skills: [
      'Describe populations, communities, and ecosystems',
      'Identify ecosystems',
      'Describe ecosystems',
    ],
  },
  {
    letter: 'X',
    title: 'Ecological interactions',
    skills: [
      'How does matter move in food chains?',
      'Interpret food webs I',
      'Interpret food webs II',
      'Use food chains to predict changes in populations',
      'Classify symbiotic relationships',
      'Investigate primary succession on a volcanic island',
    ],
  },
  {
    letter: 'Y',
    title: 'Conservation',
    skills: [
      'Coral reef biodiversity and human uses: explore a problem',
      'Coral reef biodiversity and human uses: evaluate solutions',
    ],
  },
  {
    letter: 'Z',
    title: 'Natural resources and human impacts',
    skills: [
      'Petroleum formation and distribution on Earth',
      'Evaluate claims about natural resource use: groundwater',
      'Evaluate claims about natural resource use: fossil fuels',
    ],
  },
  {
    letter: 'AA',
    title: 'Rocks',
    skills: [
      'Identify rocks and minerals',
      'Introduction to the rock cycle',
      'Classify rocks as igneous, sedimentary, or metamorphic',
      'How do rock layers form?',
      'Label parts of rock cycle diagrams',
      'Select parts of rock cycle diagrams',
    ],
  },
  {
    letter: 'BB',
    title: "Earth's features",
    skills: [
      'Label Earth layers',
    ],
  },
];

const slugify = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const makeGrade8MathQuestions = (title, groupTitle) => [
  {
    id: 'q1',
    type: 'mcq',
    difficulty: 1,
    prompt: `Which topic does "${title}" belong to?`,
    options: [groupTitle, 'Geometry transformations', 'Data displays', 'Probability models'],
    answer: groupTitle,
    hint: `This skill is part of ${groupTitle}.`,
  },
  {
    id: 'q2',
    type: 'mcq',
    difficulty: 2,
    prompt: `What should you focus on when practicing "${title}"?`,
    options: ['Choose a strategy and justify each step', 'Ignore signs and units', 'Guess from the largest number', 'Use only mental math'],
    answer: 'Choose a strategy and justify each step',
    hint: 'Eighth grade math rewards clear reasoning and checking each step.',
  },
  {
    id: 'q3',
    type: 'mcq',
    difficulty: 3,
    prompt: `A student is reviewing "${title}". What is the best next action?`,
    options: ['Try examples, check work, and explain the rule', 'Skip all examples', 'Change the problem topic', 'Use the answer before reading'],
    answer: 'Try examples, check work, and explain the rule',
    hint: 'Practice, verification, and explanation build mastery.',
  },
];

const GRADE_8_MATH_SKILLS = Object.fromEntries(
  GRADE_8_MATH_GROUPS.flatMap(group =>
    group.skills.map((title, index) => {
      const id = `math-8-${group.letter.toLowerCase()}-${slugify(title)}`;
      return [id, {
        id,
        subject: 'math',
        grade: '8',
        title,
        description: `${group.title}: ${title}`,
        explanation: `This eighth grade math skill is part of ${group.title}. Practice the concept, check each step, and explain why the result makes sense.`,
        categoryLetter: group.letter,
        categoryTitle: group.title,
        categoryIndex: index + 1,
        questions: makeGrade8MathQuestions(title, group.title),
      }];
    })
  )
);

const makeGrade6ScienceQuestions = (title, groupTitle) => [
  {
    id: 'q1',
    type: 'mcq',
    difficulty: 1,
    prompt: `Which science topic does "${title}" belong to?`,
    options: [groupTitle, 'Ancient history', 'Sentence structure', 'Number patterns'],
    answer: groupTitle,
    hint: `This skill is part of ${groupTitle}.`,
  },
  {
    id: 'q2',
    type: 'mcq',
    difficulty: 2,
    prompt: `What is the best way to study "${title}"?`,
    options: ['Use evidence and scientific vocabulary', 'Ignore observations', 'Guess without reading', 'Choose the longest answer'],
    answer: 'Use evidence and scientific vocabulary',
    hint: 'Science practice is strongest when you use evidence and precise terms.',
  },
  {
    id: 'q3',
    type: 'mcq',
    difficulty: 3,
    prompt: `A student is explaining "${title}". What should the explanation include?`,
    options: ['A claim supported by evidence', 'Only an opinion', 'A random example', 'No reasoning'],
    answer: 'A claim supported by evidence',
    hint: 'Scientific explanations connect claims, evidence, and reasoning.',
  },
];

const GRADE_6_SCIENCE_SKILLS = Object.fromEntries(
  GRADE_6_SCIENCE_GROUPS.flatMap(group =>
    group.skills.map((title, index) => {
      const id = `science-6-${group.letter.toLowerCase()}-${slugify(title)}`;
      return [id, {
        id,
        subject: 'science',
        grade: '6',
        title,
        description: `${group.title}: ${title}`,
        explanation: `This sixth grade science quiz is part of ${group.title}. Use observations, evidence, and scientific vocabulary as you practice.`,
        categoryLetter: group.letter,
        categoryTitle: group.title,
        categoryIndex: index + 1,
        questions: makeGrade6ScienceQuestions(title, group.title),
      }];
    })
  )
);

Object.assign(SKILLS, GRADE_8_MATH_SKILLS, GRADE_6_SCIENCE_SKILLS);

// Helper: get skills for a given grade + subject
const getSkillsFor = (grade, subject) =>
  Object.values(SKILLS).filter(s => s.grade === grade && s.subject === subject);

// Adaptive engine: pick next question based on recent performance
const pickAdaptiveQuestion = (questions, history, askedIds) => {
  const remaining = questions.filter(q => !askedIds.includes(q.id));
  if (remaining.length === 0) return null;
  const recent = history.slice(-3);
  const correctRate = recent.length ? recent.filter(Boolean).length / recent.length : 0.5;
  let targetDiff = 2;
  if (correctRate >= 0.75) targetDiff = 3;
  else if (correctRate <= 0.34) targetDiff = 1;
  const exact = remaining.filter(q => q.difficulty === targetDiff);
  if (exact.length) return exact[Math.floor(Math.random() * exact.length)];
  return remaining[Math.floor(Math.random() * remaining.length)];
};

// Mastery calculation: 0–100 score
const calcMastery = (skillProgress) => {
  if (!skillProgress || skillProgress.attempts === 0) return 0;
  const accuracy = skillProgress.correct / skillProgress.attempts;
  const volume = Math.min(skillProgress.attempts / 10, 1); // 10 attempts → full volume credit
  return Math.round(accuracy * 70 + volume * 30);
};

const masteryLabel = (m) => {
  if (m >= 85) return { label: 'Mastery', color: '#059669', icon: Crown };
  if (m >= 60) return { label: 'Proficient', color: '#2563EB', icon: Star };
  if (m >= 30) return { label: 'Developing', color: '#D97706', icon: TrendingUp };
  if (m > 0)   return { label: 'Beginner', color: '#D946EF', icon: Circle };
  return { label: 'Not Started', color: '#9CA3AF', icon: Circle };
};

// Badge definitions
const BADGES = [
  { id: 'first_steps', name: 'First Steps', icon: '🎯', desc: 'Answer your first question', check: (s) => s.totalAnswered >= 1 },
  { id: 'streak_3',    name: 'On a Roll',    icon: '🔥', desc: '3-day learning streak',   check: (s) => s.streak >= 3 },
  { id: 'streak_7',    name: 'Week Warrior', icon: '⚡', desc: '7-day learning streak',   check: (s) => s.streak >= 7 },
  { id: 'perfect_5',   name: 'Perfect Five', icon: '💎', desc: 'Get 5 in a row correct',   check: (s) => s.bestStreak >= 5 },
  { id: 'points_100',  name: 'Century',      icon: '💯', desc: 'Earn 100 points',         check: (s) => s.points >= 100 },
  { id: 'points_500',  name: 'High Scorer',  icon: '🏆', desc: 'Earn 500 points',         check: (s) => s.points >= 500 },
  { id: 'master_one',  name: 'Skill Master', icon: '👑', desc: 'Master your first skill', check: (s) => s.masteredSkills >= 1 },
  { id: 'master_five', name: 'Quintuple',    icon: '🌟', desc: 'Master 5 skills',         check: (s) => s.masteredSkills >= 5 },
  { id: 'explorer',    name: 'Explorer',     icon: '🗺️', desc: 'Try all 4 subjects',      check: (s) => s.subjectsTried >= 4 },
];

// ---------- MAIN APP ----------
export default function GradelyApp() {
  // Persistent app state (in-memory only — instructions explicitly forbid storage APIs in artifacts)
  const [view, setView] = useState('home'); // home | learning | practice | reports | dashboard | parent | admin | subscription | grade | subject | skill | badges
  const [user, setUser] = useState({ name: 'Learner', role: 'student' });
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeSkill, setActiveSkill] = useState(null);

  // Progress is keyed by skillId → { attempts, correct, history, asked }
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState(emptyStats);
  const [authReady, setAuthReady] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const pushToast = useCallback((msg, kind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  useEffect(() => {
    const saved = loadSavedSession();
    if (saved) {
      setUser(saved.user);
      setProgress(saved.progress || {});
      setStats({ ...emptyStats, ...(saved.stats || {}) });
      pushToast(`Welcome back, ${saved.user.name || saved.user.username}!`, 'success');
    }
    setAuthReady(true);
  }, [pushToast]);

  useEffect(() => {
    if (!authReady || !user?.username) return;
    saveLearningState(user, progress, stats);
  }, [authReady, user, progress, stats]);

  const recordAnswer = (skillId, questionId, correct, difficulty) => {
    // 1. Update skill progress
    setProgress(prev => {
      const sp = prev[skillId] || { attempts: 0, correct: 0, history: [], asked: [] };
      return {
        ...prev,
        [skillId]: {
          attempts: sp.attempts + 1,
          correct: sp.correct + (correct ? 1 : 0),
          history: [...sp.history, correct],
          asked: sp.asked.includes(questionId) ? sp.asked : [...sp.asked, questionId],
        },
      };
    });

    // 2. Update global stats
    setStats(prev => {
      const newRunStreak = correct ? prev.currentRunStreak + 1 : 0;
      const points = correct ? (5 + difficulty * 3) : 1; // even wrong attempts get 1 point for trying
      return {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        points: prev.points + points,
        currentRunStreak: newRunStreak,
        bestStreak: Math.max(prev.bestStreak, newRunStreak),
      };
    });
  };

  // Recalculate mastered skills + subjects tried whenever progress changes
  useEffect(() => {
    const masteredCount = Object.entries(progress)
      .filter(([id, p]) => calcMastery(p) >= 85).length;
    const subjects = new Set(Object.keys(progress).map(id => SKILLS[id]?.subject).filter(Boolean));
    setStats(prev => {
      if (prev.masteredSkills === masteredCount && prev.subjectsTried === subjects.size) return prev;
      return { ...prev, masteredSkills: masteredCount, subjectsTried: subjects.size };
    });
  }, [progress]);

  // Badge awarding
  useEffect(() => {
    const newlyEarned = BADGES.filter(b => b.check(stats) && !stats.earnedBadges.includes(b.id));
    if (newlyEarned.length) {
      setStats(prev => ({ ...prev, earnedBadges: [...prev.earnedBadges, ...newlyEarned.map(b => b.id)] }));
      newlyEarned.forEach(b => pushToast(`🏅 Badge unlocked: ${b.name}!`, 'success'));
    }
  }, [stats, pushToast]);

  // ----- ROUTING HANDLERS -----
  const goHome = () => { setView('home'); setSelectedGrade(null); setSelectedSubject(null); setActiveSkill(null); };
  const goLearning = () => { setView('learning'); setSelectedGrade(null); setSelectedSubject(null); setActiveSkill(null); };
  const goSignIn = () => { setView('signin'); setSelectedGrade(null); setSelectedSubject(null); setActiveSkill(null); };
  const applyAccountSession = (session, verb = 'Signed in') => {
    setUser(session.user);
    setProgress(session.progress || {});
    setStats({ ...emptyStats, ...(session.stats || {}) });
    setView('dashboard');
    pushToast(`${verb} as ${session.user.name || session.user.username}. Progress is saved.`, 'success');
  };
  const handleSignIn = async (credentials) => {
    const session = await signInAccount(credentials);
    applyAccountSession(session, 'Signed in');
  };
  const handleCreateAccount = async (details) => {
    const session = await createAccount(details);
    applyAccountSession(session, 'Account created');
  };
  const handleRoleChange = (role) => {
    setUser(prev => ({ ...(prev || { name: 'Learner' }), role }));
    const name = user?.name;
    pushToast(`Welcome, ${name || 'Learner'}! 🎉`, 'success');
  };
  const handleLogout = () => {
    clearSavedSession();
    setUser({ name: 'Learner', role: 'student' });
    setProgress({});
    setStats(emptyStats);
    goHome();
  };

  // ----- RENDER -----
  return (
    <div style={styles.app}>
      <StyleInjector />

      <Header
        user={user}
        view={view}
        onHome={goHome}
        onLearning={goLearning}
        onSignIn={goSignIn}
        onRoleChange={handleRoleChange}
        onPractice={() => setView('practice')}
        onDashboard={() => setView('dashboard')}
        onParent={() => setView('parent')}
        onReports={() => setView('reports')}
        onAdmin={() => setView('admin')}
        onBadges={() => setView('badges')}
        onSubscribe={() => setView('subscription')}
        onReset={handleLogout}
      />

      <main style={styles.main}>
        {view === 'learning'  && <LearningCatalogScreen
                                    progress={progress}
                                    onGoToSubject={(grade, subject) => {
                                      setSelectedGrade(grade);
                                      setSelectedSubject(subject);
                                      setView('subject');
                                    }}
                                  />}
        {view === 'practice'  && <PracticeHub
                                    progress={progress}
                                    onPickSkill={(skill) => {
                                      setSelectedGrade(GRADES.find(g => g.id === skill.grade));
                                      setSelectedSubject(skill.subject);
                                      setActiveSkill(skill);
                                      setView('skill');
                                    }}
                                  />}
        {view === 'home'      && <HomeScreen
                                    user={user}
                                    stats={stats}
                                    progress={progress}
                                    onSelectGrade={(g) => { setSelectedGrade(g); setView('grade'); }}
                                    onDashboard={() => setView('dashboard')}
                                  />}
        {view === 'grade'     && selectedGrade && <GradeScreen
                                    grade={selectedGrade}
                                    onBack={goHome}
                                    onSelectSubject={(s) => { setSelectedSubject(s); setView('subject'); }}
                                    progress={progress}
                                  />}
        {view === 'subject'   && selectedGrade && selectedSubject && <SubjectScreen
                                    grade={selectedGrade}
                                    subject={selectedSubject}
                                    onBack={() => setView('grade')}
                                    onSelectSkill={(skill) => { setActiveSkill(skill); setView('skill'); }}
                                    progress={progress}
                                  />}
        {view === 'skill'     && activeSkill && <SkillScreen
                                    skill={activeSkill}
                                    progress={progress[activeSkill.id]}
                                    onBack={() => setView('subject')}
                                    onAnswer={recordAnswer}
                                    onComplete={(msg) => pushToast(msg, 'success')}
                                  />}
        {view === 'dashboard' && <Dashboard
                                    title="Student Dashboard"
                                    stats={stats}
                                    progress={progress}
                                    onPickSkill={(skill) => {
                                      setSelectedGrade(GRADES.find(g => g.id === skill.grade));
                                      setSelectedSubject(skill.subject);
                                      setActiveSkill(skill);
                                      setView('skill');
                                    }}
                                  />}
        {view === 'parent'    && <ParentDashboard
                                    stats={stats}
                                    progress={progress}
                                    onReports={() => setView('reports')}
                                    onPractice={() => setView('practice')}
                                  />}
        {view === 'reports'   && <ProgressReports
                                    stats={stats}
                                    progress={progress}
                                    onPractice={() => setView('practice')}
                                  />}
        {view === 'subscription' && <SubscriptionScreen
                                    onBack={goHome}
                                    onJoin={() => pushToast('Subscription selected. Payment flow ready for checkout.', 'success')}
                                  />}
        {view === 'admin'     && <AdminContentManagement
                                    onPractice={() => setView('practice')}
                                    onReports={() => setView('reports')}
                                  />}
        {view === 'badges'    && <BadgesScreen stats={stats} onBack={goHome} />}
        {view === 'signin'    && <SignInScreen onSignIn={handleSignIn} onCreateAccount={handleCreateAccount} onJoin={() => setView('subscription')} onBack={goHome} />}
      </main>

      {/* Toasts */}
      <div style={styles.toastContainer}>
        {toasts.map(t => (
          <div key={t.id} style={{
            ...styles.toast,
            background: t.kind === 'success' ? '#059669' : t.kind === 'error' ? '#DC2626' : '#0891B2',
          }}>
            {t.msg}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

// ---------- HEADER ----------
function Header({ user, view, onHome, onLearning, onSignIn, onRoleChange, onPractice, onDashboard, onParent, onReports, onAdmin, onBadges, onSubscribe, onReset }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const learningViews = new Set(['learning', 'grade', 'subject', 'skill']);
  const navItems = [
    { label: 'Learning',   onClick: onLearning,  active: learningViews.has(view) },
    { label: 'Practice',   onClick: onPractice,  active: view === 'practice' },
    { label: 'Student',    onClick: onDashboard, active: view === 'dashboard' },
    { label: 'Parent',     onClick: onParent,    active: view === 'parent' },
    { label: 'Reports',    onClick: onReports,   active: view === 'reports' },
    { label: 'Admin',      onClick: onAdmin,     active: view === 'admin' },
    { label: 'Takeoff',    onClick: onBadges,    active: view === 'badges', icon: <Sparkles size={15} /> },
  ];

  const closeMenu = (fn) => { fn(); setMenuOpen(false); };

  return (
    <header style={styles.header}>
      <div style={styles.headerInner}>
        {/* Top row: logo | search | actions | hamburger */}
        <div style={styles.headerTopRow} className="header-top-row">
          <button onClick={onHome} style={styles.logo}>
            <span style={styles.logoMark}>
              <span style={styles.logoCapSection}>🎓</span>
              <span style={styles.logoWordmark}>Gradely</span>
            </span>
          </button>

          <label style={styles.searchWrap} className="header-search">
            <span style={styles.searchIcon}><Search size={18} color="white" /></span>
            <input style={styles.searchInput} placeholder="Search topics, skills, and more" />
            <button type="button" style={styles.searchSubmit}><ChevronRight size={22} color="#9CA3AF" /></button>
          </label>

          <div style={styles.headerActions} className="header-desktop-actions">
            <div style={styles.topRoleGroup}>
              {[
                { id: 'student', label: 'Student', icon: GraduationCap, onClick: onDashboard },
                { id: 'parent',  label: 'Parent',  icon: Heart,          onClick: onParent },
                { id: 'admin',   label: 'Admin',   icon: Settings,       onClick: onAdmin },
              ].map(role => {
                const Icon = role.icon;
                const active = user?.role === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => { onRoleChange(role.id); role.onClick(); }}
                    style={{ ...styles.topRoleBtn, ...(active ? styles.topRoleBtnActive : {}) }}
                  >
                    <Icon size={13} />
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={onSignIn} style={styles.signInBtn}>
              <UserCircle size={17} /> Sign in
            </button>
            <button onClick={onSubscribe} style={styles.membershipBtn}>Membership</button>
            <button onClick={onReset} style={styles.resetBtn} title="Reset session"><RotateCcw size={14} /></button>
          </div>

          {/* Hamburger — shown on mobile via CSS */}
          <button
            className="header-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={styles.hamburgerBtn}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} color="white" /> : <Menu size={22} color="white" />}
          </button>
        </div>

        {/* Desktop nav row — hidden on mobile via CSS */}
        <nav style={styles.headerNav} className="header-desktop-nav" aria-label="Primary">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={item.onClick}
              style={{ ...styles.navLink, ...(item.active ? styles.navLinkActive : {}) }}
            >
              {item.label}
              {item.icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{item.icon}</span>}
              {item.active && <span style={styles.navActiveCaret} />}
            </button>
          ))}
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav style={styles.mobileMenu} aria-label="Mobile navigation">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => closeMenu(item.onClick)}
                style={{ ...styles.mobileNavLink, ...(item.active ? styles.mobileNavLinkActive : {}) }}
              >
                {item.label}
                {item.icon && <span style={{ marginLeft: 6, display: 'inline-flex', alignItems: 'center' }}>{item.icon}</span>}
              </button>
            ))}
            <div style={styles.mobileMenuDivider} />
            <button onClick={() => closeMenu(onSignIn)}    style={styles.mobileNavLink}>Sign in</button>
            <button onClick={() => closeMenu(onDashboard)} style={styles.mobileNavLink}>Student</button>
            <button onClick={() => closeMenu(onParent)}    style={styles.mobileNavLink}>Parent</button>
            <button onClick={() => closeMenu(onSubscribe)} style={{ ...styles.mobileNavLink, color: '#FFE566', fontWeight: 900 }}>Membership</button>
          </nav>
        )}
      </div>
    </header>
  );
}

// eslint-disable-next-line no-unused-vars
function StatChip({ icon, value, label, color }) {
  return (
    <div style={{ ...styles.statChip, borderColor: color, color }}>
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
      <strong style={{ marginLeft: 4 }}>{value}</strong>
      <span style={{ marginLeft: 4, color: '#6B7280', fontSize: 12, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ---------- LOGIN ----------
// eslint-disable-next-line no-unused-vars
function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  return (
    <div style={styles.loginWrap}>
      <div style={styles.loginCard}>
        <div style={styles.loginHero}>
          <div style={styles.loginLogo}>
            <Sparkles size={36} strokeWidth={2.5} />
          </div>
          <h1 style={styles.loginTitle}>Gradely</h1>
          <p style={styles.loginSub}>Where every kid becomes a learning champion</p>
        </div>

        <div style={{ marginTop: 32 }}>
          <label style={styles.fieldLabel}>What's your name?</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Type your first name"
            style={styles.input}
            onKeyDown={e => e.key === 'Enter' && onLogin(name, role)}
          />

          <label style={{ ...styles.fieldLabel, marginTop: 16 }}>I'm a...</label>
          <div style={styles.roleGrid}>
            {[
              { id: 'student', label: 'Student', icon: GraduationCap, color: '#0C5CA8' },
              { id: 'parent',  label: 'Parent',  icon: Heart, color: '#D946EF' },
              { id: 'teacher', label: 'Teacher', icon: Users, color: '#059669' },
              { id: 'admin',   label: 'Admin',   icon: Settings, color: '#FFB627' },
            ].map(r => {
              const Icon = r.icon;
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  style={{
                    ...styles.roleBtn,
                    borderColor: active ? r.color : '#E5E7EB',
                    background: active ? r.color : 'white',
                    color: active ? 'white' : '#374151',
                  }}
                >
                  <Icon size={20} />
                  <span style={{ marginTop: 6, fontSize: 13, fontWeight: 600 }}>{r.label}</span>
                </button>
              );
            })}
          </div>

          <button onClick={() => onLogin(name, role)} style={styles.primaryBtn}>
            Start Learning <ArrowRight size={18} />
          </button>

          <p style={styles.loginNote}>
            Demo mode — all progress is saved for this session.
          </p>
        </div>
      </div>

      <div style={styles.loginBg}>
        <FloatingShape style={{ top: '10%', left: '8%', background: '#0C5CA8', size: 80 }} delay={0} />
        <FloatingShape style={{ top: '20%', right: '12%', background: '#0891B2', size: 110 }} delay={1.5} />
        <FloatingShape style={{ bottom: '15%', left: '15%', background: '#F59E0B', size: 70 }} delay={0.8} />
        <FloatingShape style={{ bottom: '25%', right: '8%', background: '#059669', size: 95 }} delay={2.2} />
      </div>
    </div>
  );
}

function FloatingShape({ style, delay }) {
  return (
    <div style={{
      position: 'absolute',
      width: style.size, height: style.size,
      borderRadius: '50%',
      background: style.background,
      opacity: 0.18,
      top: style.top, left: style.left, right: style.right, bottom: style.bottom,
      animation: `float 6s ease-in-out ${delay}s infinite`,
      filter: 'blur(2px)',
    }}/>
  );
}

// ---------- HOME ----------
function HomeScreen({ user, stats, progress, onSelectGrade, onDashboard }) {
  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0;
  const useScreenshotRedesign = true;

  if (useScreenshotRedesign) {
    return (
      <RedesignedHomeScreen
        user={user}
        stats={stats}
        progress={progress}
        accuracy={accuracy}
        onSelectGrade={onSelectGrade}
        onDashboard={onDashboard}
      />
    );
  }

  return (
    <div style={styles.container}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>
            <Sparkles size={14} /> <span>Welcome back!</span>
          </div>
          <h1 style={styles.heroTitle}>
            Hi <span style={styles.heroName}>{user?.name}</span> —<br />
            ready to <span style={styles.heroEmphasis}>level up</span>?
          </h1>
          <p style={styles.heroDesc}>
            Pick your grade, choose a subject, and start practicing. Earn points, unlock badges,
            and track your mastery on every skill.
          </p>
          <div style={styles.heroStats}>
            <HeroStat value={stats.points} label="Total Points" color="#D97706" />
            <HeroStat value={`${accuracy}%`} label="Accuracy" color="#7DCE82" />
            <HeroStat value={stats.streak} label="Day Streak" color="#FB5607" />
          </div>
        </div>
        <div style={styles.heroRight}>
          <DashboardPreview stats={stats} progress={progress} onClick={onDashboard} />
        </div>
      </section>

      {/* Grade selector */}
      <section style={{ marginTop: 56 }}>
        <SectionHeader title="Choose your grade" subtitle="From Pre-K all the way to Grade 12" />
        <div style={styles.gradeGrid}>
          {GRADES.map(g => {
            const skillCount = Object.values(SKILLS).filter(s => s.grade === g.id).length;
            const completedCount = Object.values(SKILLS)
              .filter(s => s.grade === g.id)
              .filter(s => calcMastery(progress[s.id]) > 0).length;
            return (
              <button
                key={g.id}
                onClick={() => onSelectGrade(g)}
                style={{ ...styles.gradeCard, '--grade-color': g.color }}
                className="grade-card"
              >
                <div style={{ ...styles.gradeEmoji, background: `${g.color}22` }}>{g.emoji}</div>
                <div style={styles.gradeLabel}>{g.label}</div>
                <div style={styles.gradeMeta}>
                  {skillCount > 0 ? `${completedCount}/${skillCount} started` : 'Coming soon'}
                </div>
                <div style={{ ...styles.gradeAccent, background: g.color }} />
              </button>
            );
          })}
        </div>
      </section>

      {/* Subject overview */}
      <section style={{ marginTop: 56 }}>
        <SectionHeader title="Subjects we offer" subtitle="Comprehensive curriculum across all four core areas" />
        <div style={styles.subjectGrid}>
          {Object.entries(SUBJECTS).map(([key, sub]) => {
            const Icon = sub.icon;
            return (
              <div key={key} style={{ ...styles.subjectCard, background: sub.bg }}>
                <div style={{ ...styles.subjectIcon, background: sub.color }}>
                  <Icon size={28} color="white" strokeWidth={2.2} />
                </div>
                <h3 style={styles.subjectTitle}>{sub.label}</h3>
                <p style={styles.subjectTag}>{sub.tagline}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Motivational strip */}
      <section style={styles.motivStrip}>
        <div style={styles.motivItem}>
          <Trophy size={28} color="#FFB627" />
          <div>
            <div style={styles.motivLabel}>{BADGES.length} Badges to Earn</div>
            <div style={styles.motivSub}>Unlock by hitting milestones</div>
          </div>
        </div>
        <div style={styles.motivItem}>
          <Flame size={28} color="#FB5607" />
          <div>
            <div style={styles.motivLabel}>Daily Streaks</div>
            <div style={styles.motivSub}>Practice every day to keep it growing</div>
          </div>
        </div>
        <div style={styles.motivItem}>
          <Crown size={28} color="#059669" />
          <div>
            <div style={styles.motivLabel}>Skill Mastery</div>
            <div style={styles.motivSub}>Reach 85%+ to fully master a skill</div>
          </div>
        </div>
        <div style={styles.motivItem}>
          <Brain size={28} color="#0891B2" />
          <div>
            <div style={styles.motivLabel}>Adaptive Practice</div>
            <div style={styles.motivSub}>Questions adjust to your skill level</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RedesignedHomeScreen({ user, stats, progress, accuracy, onSelectGrade, onDashboard }) {
  const [openFaq, setOpenFaq] = useState(null);

  const artS = {
    page: { background: '#FAFAF9', color: '#1a1a2e' },
    hero: { background: '#fff', padding: '72px 24px 80px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 64, flexWrap: 'wrap' },
    heroLeft: { maxWidth: 560, flex: '1 1 320px' },
    welcomePill: { display: 'inline-flex', alignItems: 'center', gap: 8, background: '#C8F0D4', color: '#1a6632', borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 700, marginBottom: 20 },
    h1: { fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 8px', color: '#1a1a2e' },
    h1em: { fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#3DAF52' },
    heroPara: { fontSize: 17, color: '#6B7280', margin: '16px 0 28px', lineHeight: 1.6 },
    heroBtn: { background: '#3DAF52', color: '#fff', border: 'none', borderRadius: 999, padding: '14px 32px', fontSize: 16, fontWeight: 800, cursor: 'pointer' },
    tagsRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 },
    tag: { borderRadius: 999, padding: '5px 14px', fontSize: 13, fontWeight: 700 },
    avatarRing: { width: 220, height: 220, borderRadius: '50%', background: '#C8F0D4', border: '5px solid #3DAF52', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 96, position: 'relative', boxShadow: '0 12px 40px rgba(61,175,82,0.2)', flexShrink: 0 },
    badgePill: { position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', background: '#FFE566', color: '#1a1a2e', borderRadius: 999, padding: '6px 18px', fontSize: 12, fontWeight: 900, letterSpacing: 1, whiteSpace: 'nowrap' },
    programSec: { background: '#F7F3FF', padding: '64px 24px' },
    secWrap: { maxWidth: 1100, margin: '0 auto' },
    secLabel: { fontSize: 12, fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9333EA', marginBottom: 8 },
    secTitle: { fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, margin: '0 0 8px', color: '#1a1a2e' },
    secEm: { fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#3DAF52' },
    secDesc: { fontSize: 16, color: '#6B7280', margin: '0 0 40px', maxWidth: 560 },
    cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
    card: { borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden', cursor: 'pointer', border: 'none', textAlign: 'left', minHeight: 240 },
    cardGradeTag: { display: 'inline-block', background: 'rgba(255,255,255,0.55)', borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 700, alignSelf: 'flex-start' },
    cardTitle: { fontSize: 22, fontWeight: 900, margin: 0, color: '#1a1a2e' },
    cardSub: { fontSize: 14, color: '#4B5563', margin: 0, fontStyle: 'italic', fontFamily: 'Georgia, serif' },
    cardArrow: { width: 36, height: 36, borderRadius: '50%', background: '#1a1a2e', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, alignSelf: 'flex-start', marginTop: 'auto', pointerEvents: 'none' },
    cardEmoji: { position: 'absolute', right: 20, bottom: 16, fontSize: 56, opacity: 0.28, pointerEvents: 'none' },
    gradesSec: { background: '#fff', padding: '56px 24px' },
    gradesRow: { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 },
    gradeChip: { borderRadius: 999, padding: '8px 20px', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' },
    whySec: { background: '#FAFAF9', padding: '64px 24px' },
    whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 40 },
    whyCard: { background: '#fff', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12 },
    whyIcon: { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 },
    whyTitle: { fontSize: 18, fontWeight: 800, margin: 0, color: '#1a1a2e' },
    whyText: { fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.6 },
    startSec: { background: '#fff', padding: '64px 24px' },
    startInner: { maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' },
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 28 },
    statCard: { background: '#F7F3FF', borderRadius: 14, padding: '20px 18px' },
    statVal: { fontSize: 28, fontWeight: 900, color: '#3DAF52', margin: 0 },
    statLabel: { fontSize: 13, color: '#6B7280', margin: '4px 0 0' },
    readCard: { background: '#C4B3F5', borderRadius: 20, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 16 },
    readTitle: { fontSize: 26, fontWeight: 900, margin: 0, color: '#1a1a2e' },
    readSub: { fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 },
    readBtn: { alignSelf: 'flex-start', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 999, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
    ctaSec: { background: '#FAFAF9', padding: '64px 24px' },
    ctaCard: { maxWidth: 680, margin: '0 auto', background: '#C4B3F5', borderRadius: 24, padding: '52px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
    ctaTitle: { fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 900, margin: 0, color: '#1a1a2e' },
    ctaSub: { fontSize: 15, color: '#4B5563', margin: 0 },
    ctaBtn: { background: '#3DAF52', color: '#fff', border: 'none', borderRadius: 999, padding: '14px 32px', fontSize: 16, fontWeight: 800, cursor: 'pointer' },
    contactSec: { background: '#fff', padding: '64px 24px', textAlign: 'center' },
    avatarsRow: { fontSize: 36, display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 },
    contactTitle: { fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, margin: '0 0 8px', color: '#1a1a2e' },
    contactSub: { fontSize: 15, color: '#6B7280', margin: '0 0 28px' },
    contactBtns: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
    contactBtn: { borderRadius: 999, padding: '12px 28px', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' },
    faqSec: { background: '#FAFAF9', padding: '64px 24px 80px' },
    faqInner: { maxWidth: 720, margin: '40px auto 0' },
    faqItem: { background: '#fff', borderRadius: 14, marginBottom: 10, overflow: 'hidden' },
    faqQ: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 15, color: '#1a1a2e', background: 'none', border: 'none', width: '100%', textAlign: 'left', gap: 12 },
    faqA: { padding: '0 20px 16px', fontSize: 14, color: '#6B7280', lineHeight: 1.7, margin: 0 },
  };

  const gradeColors = ['#FFD6D6','#FFE4C4','#FFF3C4','#E4F4D0','#C8F0D4','#C8EFF8','#D4E4FF','#E4D8FF','#F9D4FF','#FFD6EE','#C8F0D4','#D4E4FF','#FFF3C4','#FFD6D6'];

  const faqs = [
    { q: 'What grades does Gradely cover?', a: 'Gradely covers Pre-Kindergarten through Grade 12 across all major subjects including Math, Language Arts, Science, and Social Studies.' },
    { q: 'Is Gradely free to use?', a: 'Gradely offers free practice access. Premium plans unlock full curriculum, detailed analytics, and personalized learning paths.' },
    { q: 'How does adaptive learning work?', a: 'Gradely tracks every answer and adjusts question difficulty in real time, so students are always challenged at the right level for maximum growth.' },
  ];

  return (
    <div style={artS.page}>

      {/* ── Hero ── */}
      <section style={artS.hero} className="art-hero">
        <div style={artS.heroLeft} className="art-hero-left">
          <div style={artS.welcomePill}>✳ Welcome to Gradely Academy</div>
          <h1 style={artS.h1}>
            Learn<br /><em style={artS.h1em}>With Gradely</em>
          </h1>
          <p style={artS.heroPara}>
            A personalized K–12 learning platform with thousands of practice skills across Math, Language Arts, Science, and Social Studies.
          </p>
          <button onClick={() => onSelectGrade(GRADES[0])} style={artS.heroBtn}>
            Start learning ↗
          </button>
          <div style={artS.tagsRow} className="art-tags-row">
            {[['#Math','#FFE566'],['#Science','#C8F0D4'],['#ELA','#C4B3F5'],['#History','#F9B8C4']].map(([tag, bg]) => (
              <span key={tag} style={{ ...artS.tag, background: bg }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', paddingBottom: 20 }} className="art-hero-right">
          <div style={artS.avatarRing}>
            👩‍🎓
            <span style={artS.badgePill}>✳ GRADELY ACADEMY</span>
          </div>
        </div>
      </section>

      {/* ── Program cards ── */}
      <section style={artS.programSec} className="art-section">
        <div style={artS.secWrap} className="art-section-wrap">
          <div style={artS.secLabel}>Our Programs</div>
          <h2 style={artS.secTitle}>Browse subjects &amp; <em style={artS.secEm}>grade levels</em></h2>
          <p style={artS.secDesc}>Every skill is aligned to standards and built to help students master core concepts at their own pace.</p>
          <div style={artS.cardsGrid} className="art-cards-grid">
            {[
              { bg: '#C8F0D4', grade: 'Grades Pre-K – 3', title: 'Math', sub: 'Numbers, geometry & problem solving', emoji: '🔢' },
              { bg: '#C4B3F5', grade: 'Grades 4 – 8', title: 'Language Arts', sub: 'Reading, writing & comprehension', emoji: '📖' },
              { bg: '#FFE566', grade: 'Grade 6 & up', title: 'Science', sub: 'Life, earth, chemistry & physics', emoji: '🔬' },
            ].map((card) => (
              <button key={card.title} style={{ ...artS.card, background: card.bg }} onClick={() => onSelectGrade(GRADES[0])}>
                <span style={artS.cardGradeTag}>{card.grade}</span>
                <div>
                  <p style={artS.cardTitle}>{card.title}</p>
                  <p style={artS.cardSub}>{card.sub}</p>
                </div>
                <div style={artS.cardArrow}>↗</div>
                <span style={artS.cardEmoji}>{card.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Grades ── */}
      <section style={artS.gradesSec} className="art-section">
        <div style={artS.secWrap} className="art-section-wrap">
          <div style={artS.secLabel}>All Grade Levels</div>
          <h2 style={artS.secTitle}>From Pre-K to <em style={artS.secEm}>Grade 12</em></h2>
          <div style={artS.gradesRow} className="art-grades-row">
            {GRADES.map((g, i) => (
              <button key={g.id} style={{ ...artS.gradeChip, background: gradeColors[i] || '#E5E7EB', color: '#1a1a2e' }} onClick={() => onSelectGrade(g)}>
                {g.name}
              </button>
            ))}
            <span style={{ ...artS.gradeChip, background: '#FFE4B5', color: '#92400E', cursor: 'default' }}>
              Spanish (coming soon)
            </span>
          </div>
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section style={artS.whySec} className="art-section">
        <div style={artS.secWrap} className="art-section-wrap">
          <div style={artS.secLabel}>Why Gradely</div>
          <h2 style={artS.secTitle}>Built for every <em style={artS.secEm}>learner</em></h2>
          <div style={artS.whyGrid} className="art-why-grid">
            {[
              { icon: '📚', bg: '#C8F0D4', title: 'Full K–12 Curriculum', text: 'Every subject, every grade. Math, Language Arts, Science, and Social Studies with thousands of practice questions.' },
              { icon: '🎯', bg: '#E9D8FD', title: 'Adaptive Learning', text: 'Gradely adjusts question difficulty in real time based on student responses for maximum growth.' },
              { icon: '⭐', bg: '#FEF3C7', title: 'Expert Content', text: 'All questions are built and reviewed by certified educators and aligned to Common Core and state standards.' },
            ].map((item) => (
              <div key={item.title} style={artS.whyCard}>
                <div style={{ ...artS.whyIcon, background: item.bg }}>{item.icon}</div>
                <h3 style={artS.whyTitle}>{item.title}</h3>
                <p style={artS.whyText}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Start Now + Stats ── */}
      <section style={artS.startSec} className="art-section">
        <div style={artS.startInner} className="art-start-inner">
          <div>
            <div style={artS.secLabel}>Get Started</div>
            <h2 style={artS.secTitle}>Start practicing <em style={artS.secEm}>today</em></h2>
            <p style={{ ...artS.secDesc, marginBottom: 0 }}>Thousands of skills available across all grades. Track progress, earn badges, and build mastery.</p>
            <div style={artS.statsGrid} className="art-stats-row">
              {[
                { val: '66+',  label: 'Skills available' },
                { val: '14',   label: 'Grade levels' },
                { val: stats.points || 0,        label: 'Your points' },
                { val: stats.totalAnswered || 0, label: 'Questions answered' },
              ].map((s) => (
                <div key={s.label} style={artS.statCard}>
                  <p style={artS.statVal}>{s.val}</p>
                  <p style={artS.statLabel}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={artS.readCard}>
            <div style={{ fontSize: 40 }}>🎓</div>
            <h3 style={artS.readTitle}>Ready to <em style={{ fontStyle: 'italic', fontFamily: 'Georgia,serif', color: '#3DAF52' }}>explore</em> skills?</h3>
            <p style={artS.readSub}>Pick a grade level to see all available practice skills and begin your learning journey.</p>
            <button onClick={() => onSelectGrade(GRADES[0])} style={artS.readBtn}>Browse all grades ↗</button>
          </div>
        </div>
      </section>

      {/* ── Sign Up CTA ── */}
      <section style={artS.ctaSec} className="art-section">
        <div style={artS.ctaCard} className="art-cta-card">
          <div style={{ fontSize: 52 }}>👧</div>
          <h2 style={artS.ctaTitle}>Sign up for <em style={{ fontStyle: 'italic', fontFamily: 'Georgia,serif', color: '#3DAF52' }}>Free Practice</em></h2>
          <p style={artS.ctaSub}>Join thousands of students already learning with Gradely.</p>
          <button onClick={onDashboard} style={artS.ctaBtn}>Get started ↗</button>
        </div>
      </section>

      {/* ── Contact ── */}
      <section style={artS.contactSec} className="art-section">
        <div style={artS.avatarsRow}><span>👩‍🏫</span><span>👦</span><span>👧</span></div>
        <h2 style={artS.contactTitle}>We are open <em style={{ fontStyle: 'italic', fontFamily: 'Georgia,serif', color: '#3DAF52' }}>to talking</em></h2>
        <p style={artS.contactSub}>Have questions about Gradely? Reach out — we're here to help.</p>
        <div style={artS.contactBtns}>
          <button onClick={onDashboard} style={{ ...artS.contactBtn, background: '#3DAF52', color: '#fff' }}>Contact us</button>
          <button onClick={onDashboard} style={{ ...artS.contactBtn, background: '#C4B3F5', color: '#1a1a2e' }}>Call us</button>
          <button onClick={onDashboard} style={{ ...artS.contactBtn, background: '#C8F0D4', color: '#1a6632' }}>Video chat</button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={artS.faqSec} className="art-section">
        <div style={{ ...artS.secWrap, textAlign: 'center' }}>
          <div style={artS.secLabel}>FAQ</div>
          <h2 style={artS.secTitle}>Common <em style={artS.secEm}>questions</em></h2>
        </div>
        <div style={artS.faqInner}>
          {faqs.map((faq, i) => (
            <div key={i} style={artS.faqItem}>
              <button style={artS.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: openFaq === i ? '#3DAF52' : '#E5E7EB', color: openFaq === i ? '#fff' : '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              {openFaq === i && <p style={artS.faqA}>{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

// ---------- SIGN IN ----------
function SignInScreen({ onSignIn, onCreateAccount, onJoin, onBack }) {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submitAccount = async () => {
    setError('');
    setBusy(true);
    try {
      if (mode === 'create') {
        await onCreateAccount({ username, password, name, role });
      } else {
        await onSignIn({ username, password });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const features = [
    { icon: '🌐', color: '#0C5CA8', title: 'Comprehensive K-12 Curriculum',
      text: 'More than 17,000 adaptive skills designed to support and challenge every learner' },
    { icon: '📊', color: '#0891B2', title: 'Real-Time Diagnostic',
      text: "Up-to-date, accurate assessment of students' knowledge levels in math and language arts" },
    { icon: '🎯', color: '#8B5CF6', title: 'Personalized Guidance',
      text: 'Targeted skill recommendations help address learning gaps and accelerate growth' },
    { icon: '📈', color: '#F59E0B', title: 'Actionable Analytics',
      text: 'Easy-to-use reports provide real-time insight into student progress' },
  ];

  const footerLinks = ['Company','Membership','Blog','Help center','Tell us what you think','Testimonials','Careers','Contact us','Terms of service','Privacy policy'];

  return (
    <div>
      {/* ── Hero with illustrated landscape ── */}
      <div style={styles.siHero}>
        {/* Left decorations */}
        <span style={{ ...styles.siDeco, left: '7%',  top: '18%', fontSize: 52 }}>🌍</span>
        <span style={{ ...styles.siDeco, left: '16%', top: '4%',  fontSize: 42 }}>🎈</span>
        <span style={{ ...styles.siDeco, left: '4%',  bottom: '22%', fontSize: 48 }}>🎡</span>
        <span style={{ ...styles.siDeco, left: '24%', bottom: '14%', fontSize: 36 }}>🌲</span>
        <span style={{ ...styles.siDeco, left: '12%', bottom: '10%', fontSize: 32 }}>🏙️</span>
        {/* Right decorations */}
        <span style={{ ...styles.siDeco, right: '14%', top: '6%',   fontSize: 42 }}>✈️</span>
        <span style={{ ...styles.siDeco, right: '6%',  top: '28%',  fontSize: 38 }}>📖</span>
        <span style={{ ...styles.siDeco, right: '22%', top: '16%',  fontSize: 32 }}>🧬</span>
        <span style={{ ...styles.siDeco, right: '18%', bottom: '14%', fontSize: 38 }}>🏠</span>
        <span style={{ ...styles.siDeco, right: '5%',  bottom: '18%', fontSize: 42 }}>🔬</span>
        <span style={{ ...styles.siDeco, right: '10%', bottom: '10%', fontSize: 36 }}>🔭</span>

        {/* Sign-in card */}
        <div style={styles.siCard}>
          <h2 style={styles.siCardTitle}>{mode === 'create' ? 'Create your account' : 'Sign in'}</h2>
          <p style={{ margin: '-8px 0 18px', color: '#64748B', fontSize: 14 }}>
            {mode === 'create'
              ? 'Choose a username and password to save your Gradely progress.'
              : 'Log in to keep practicing where you left off.'}
          </p>

          {mode === 'create' && (
            <>
              <div style={styles.siField}>
                <label style={styles.siLabel}>Display name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={styles.siInput}
                  autoComplete="name"
                  placeholder="Your name"
                />
              </div>
              <div style={styles.siField}>
                <label style={styles.siLabel}>Account type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {['student', 'parent', 'admin'].map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRole(option)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 10,
                        border: role === option ? '2px solid #3DB2FF' : '1px solid #D1D5DB',
                        background: role === option ? '#EFF8FF' : 'white',
                        color: role === option ? '#0369A1' : '#334155',
                        fontWeight: 800,
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div style={styles.siField}>
            <div style={styles.siFieldRow}>
              <label style={styles.siLabel}>Username</label>
              {mode === 'signin' && <span style={styles.siForgot}>Forgot username?</span>}
            </div>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={styles.siInput}
              autoComplete="username"
              placeholder="Choose a username"
            />
          </div>

          <div style={styles.siField}>
            <div style={styles.siFieldRow}>
              <label style={styles.siLabel}>Password</label>
              <span style={styles.siForgot}>Forgot password?</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitAccount()}
              style={styles.siInput}
              autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
              placeholder={mode === 'create' ? 'At least 6 characters' : ''}
            />
          </div>

          {error && (
            <div style={{ padding: 10, borderRadius: 10, background: '#FEF2F2', color: '#B91C1C', fontSize: 13, marginBottom: 12 }}>
              {error}
            </div>
          )}

          <div style={styles.siBtnRow}>
            <button onClick={submitAccount} disabled={busy} style={{ ...styles.siBtn, opacity: busy ? 0.65 : 1 }}>
              {busy ? 'Please wait...' : mode === 'create' ? 'Create account' : 'Sign in'}
            </button>
            <label style={styles.siRemember}>
              <input type="checkbox" style={{ marginRight: 5 }} />
              Remember
            </label>
          </div>

          <div style={styles.siLaunchCard}>
            {mode === 'create' ? 'Already have an account?' : 'New to Gradely?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'create' ? 'signin' : 'create'); setError(''); }}
              style={{ border: 0, background: 'transparent', color: '#0076C0', fontWeight: 800, cursor: 'pointer' }}
            >
              {mode === 'create' ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </div>

        {/* Green hills at base */}
        <div style={styles.siHills} />
      </div>

      {/* ── Not a member yet? ── */}
      <div style={styles.siMemberSection}>
        <h2 style={styles.siNotMemberTitle}>Not a member yet?</h2>
        <p style={styles.siNotMemberSub}>Experience personalized learning with Gradely!</p>

        <div style={styles.siFeatureList}>
          {features.map(f => (
            <div key={f.title} style={styles.siFeatureRow}>
              <div style={{ ...styles.siFeatureIcon, background: f.color + '18', border: `2px solid ${f.color}33` }}>
                <span style={{ fontSize: 26 }}>{f.icon}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ ...styles.siFeatureTitle, color: f.color }}>{f.title}</div>
                <div style={styles.siFeatureText}>{f.text}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={styles.siCelebrate}>
          Plus, celebrate success with <strong>fun awards</strong>, and much more!
        </p>
        <button onClick={onJoin} style={styles.siJoinBtn}>Join Gradely today</button>
      </div>

      {/* ── Sign-in footer ── */}
      <div style={styles.siFooter}>
        <div style={styles.siFooterLinks}>
          {footerLinks.map((link, i) => (
            <span key={link}>
              {i > 0 && <span style={{ color: '#D1D5DB', margin: '0 5px' }}>|</span>}
              <span style={styles.siFooterLink}>{link}</span>
            </span>
          ))}
        </div>
        <div style={styles.siFooterCopy}>
          🎓 &nbsp;Gradely &nbsp;·&nbsp; © {new Date().getFullYear()} Gradely, LLC. All rights reserved.
        </div>
      </div>
    </div>
  );
}

// ---------- LEARNING CATALOG (IXL-style) ----------
function LearningCatalogScreen({ progress, onGoToSubject }) {
  const [activeSubject, setActiveSubject] = useState('math');
  const [activeView, setActiveView] = useState('Grades');

  const GRADE_DISPLAY = {
    prek: { name: 'Pre-K', badge: 'P' },
    k: { name: 'Kindergarten', badge: 'K' },
    '1': { name: 'First grade', badge: '1' },
    '2': { name: 'Second grade', badge: '2' },
    '3': { name: 'Third grade', badge: '3' },
    '4': { name: 'Fourth grade', badge: '4' },
    '5': { name: 'Fifth grade', badge: '5' },
    '6': { name: 'Sixth grade', badge: '6' },
    '7': { name: 'Seventh grade', badge: '7' },
    '8': { name: 'Eighth grade', badge: '8' },
    '9': { name: 'Ninth grade', badge: '9' },
    '10': { name: 'Tenth grade', badge: '10' },
    '11': { name: 'Eleventh grade', badge: '11' },
    '12': { name: 'Twelfth grade', badge: '12' },
  };

  const subjectTabs = [
    { id: 'math', label: 'Math', icon: Calculator },
    { id: 'ela', label: 'Language arts', icon: BookOpen },
    { id: 'science', label: 'Science', icon: FlaskConical },
    { id: 'social', label: 'Social studies', icon: Globe2 },
    { id: 'spanish', label: 'Spanish', icon: Globe2, disabled: true },
    { id: 'recommendations', label: 'Recommendations', icon: Star, special: true },
    { id: 'skillplans', label: 'Skill plans', icon: BarChart3, special: true },
    { id: 'awards', label: 'Awards', icon: Trophy, special: true },
  ];

  const viewTabs = ['Grades', 'Topics', 'Week by week', 'Skill plans'];

  const heroConfigs = {
    math: {
      title: 'Gradely Math',
      desc: 'Gain fluency and confidence in math! Gradely helps students master essential skills at their own pace through fun and interactive questions, built-in support, and motivating awards.',
      bg: 'linear-gradient(160deg, #C8EEFF 0%, #E0F8FF 50%, #B8F0E0 100%)',
      accent: '#1A8FD1',
      decoLeft: '🏰',
      decoRight: ['⛵', '📐', '🐟'],
      hillColor: '#5CBF72',
    },
    ela: {
      title: 'Gradely Language Arts',
      desc: 'Build strong reading, writing, and communication skills! Explore phonics, grammar, comprehension, and more through engaging interactive practice.',
      bg: 'linear-gradient(160deg, #FFE0EF 0%, #FFD0EC 50%, #FFE8F5 100%)',
      accent: '#C2147A',
      decoLeft: '📚',
      decoRight: ['✍️', '🖊️', '🦋'],
      hillColor: '#E84D9F',
    },
    science: {
      title: 'Gradely Science',
      desc: 'Explore the natural world! Discover living things, earth science, physics, and chemistry through hands-on practice questions.',
      bg: 'linear-gradient(160deg, #C8F0D0 0%, #D8F5DC 50%, #B8EBC8 100%)',
      accent: '#2A8C2E',
      decoLeft: '🔬',
      decoRight: ['⚗️', '🌿', '🧬'],
      hillColor: '#4CAF50',
    },
    social: {
      title: 'Gradely Social Studies',
      desc: 'Understand the world and its history! Geography, civics, economics, and history — all the knowledge you need to be an informed citizen.',
      bg: 'linear-gradient(160deg, #FFF0C0 0%, #FFF5CC 50%, #FFE8A0 100%)',
      accent: '#A06800',
      decoLeft: '🌍',
      decoRight: ['🏛️', '🗺️', '📜'],
      hillColor: '#DBA32A',
    },
  };

  const hero = heroConfigs[activeSubject] || heroConfigs.math;
  const subjectColor = SUBJECTS[activeSubject]?.color || '#3DB2FF';

  const getGradeSkills = (gradeId) =>
    Object.values(SKILLS).filter(s => s.grade === gradeId && s.subject === activeSubject);

  return (
    <div>
      {/* Subject Tabs */}
      <div style={styles.lcSubjectBar}>
        <div style={{ ...styles.lcBarInner, alignItems: 'stretch' }}>
          {subjectTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = tab.id === activeSubject;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveSubject(tab.id)}
                disabled={tab.disabled}
                style={{
                  ...styles.lcSubjectTab,
                  ...(isActive ? { borderBottomColor: subjectColor, color: subjectColor, fontWeight: 700 } : {}),
                  ...(tab.disabled ? styles.lcSubjectTabDisabled : {}),
                }}
              >
                {Icon && <Icon size={14} />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* View By Bar */}
      <div style={styles.lcViewBar}>
        <div style={{ ...styles.lcBarInner, gap: 2, padding: '6px 24px' }}>
          <span style={styles.lcViewLabel}>View by:</span>
          {viewTabs.map(v => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              style={{
                ...styles.lcViewTab,
                ...(activeView === v ? styles.lcViewTabActive : {}),
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ ...styles.lcHero, background: hero.bg }}>
        <div style={styles.lcHeroDecoLeft}>{hero.decoLeft}</div>
        <div style={styles.lcHeroCenter}>
          <h1 style={{ ...styles.lcHeroTitle, color: hero.accent }}>{hero.title}</h1>
          <p style={styles.lcHeroDesc}>{hero.desc}</p>
        </div>
        <div style={styles.lcHeroDecoRight}>
          {hero.decoRight.map((d, i) => (
            <span key={i} style={{ ...styles.lcDecoItem, animationDelay: `${i * 0.6}s` }}>{d}</span>
          ))}
        </div>
        <div style={{ ...styles.lcHeroHill, background: hero.hillColor }} />
      </div>

      {/* Grade List */}
      <div style={styles.lcGradeList}>
        {GRADES.map(grade => {
          const display = GRADE_DISPLAY[grade.id];
          if (!display) return null;
          const skills = getGradeSkills(grade.id);
          return (
            <GradeSkillRow
              key={grade.id}
              grade={grade}
              display={display}
              skills={skills}
              onSelect={() => onGoToSubject(grade, activeSubject)}
            />
          );
        })}
      </div>
    </div>
  );
}

function GradeSkillRow({ grade, display, skills, onSelect }) {
  const sampleTitles = skills.slice(0, 6).map(s => s.title);
  return (
    <div style={styles.lcGradeRow} className="lc-grade-row">
      <div style={styles.lcGradeLeft}>
        <div style={{ ...styles.lcGradeBadge, background: grade.color }}>{display.badge}</div>
        <div style={styles.lcGradeInfo}>
          <div style={styles.lcGradeName}>{display.name}</div>
          <div style={styles.lcGradeSkills}>
            {sampleTitles.length > 0 ? (
              <>
                <span style={styles.lcIncludesLabel}>Includes: </span>
                {sampleTitles.map((title, i) => (
                  <span key={i}>
                    {i > 0 && <span style={styles.lcSkillSep}> | </span>}
                    <span style={styles.lcSkillLink}>{title}</span>
                  </span>
                ))}
              </>
            ) : (
              <span style={{ color: '#9CA3AF' }}>New skills coming soon</span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={onSelect}
        disabled={skills.length === 0}
        style={{ ...styles.lcSeeAllBtn, background: skills.length ? grade.color : '#E5E7EB', color: skills.length ? 'white' : '#9CA3AF' }}
      >
        See all {skills.length} skills &rsaquo;
      </button>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function LearningCloud({ title, color, lines }) {
  return (
    <div style={{ ...styles.learningCloud, borderColor: color }}>
      <strong style={{ color }}>{title}</strong>
      <span>{lines.join(' • ')}</span>
      <ChevronRight size={28} color={color} style={{ transform: 'rotate(90deg)', marginTop: 4 }} />
    </div>
  );
}


// eslint-disable-next-line no-unused-vars
function SkillTile({ skill, index }) {
  const subject = SUBJECTS[skill.subject];
  const Icon = subject.icon;
  return (
    <div style={styles.skillTile}>
      <div style={{ ...styles.skillTileIcon, background: subject.color }}>
        <Icon size={22} color="white" />
      </div>
      <strong>{skill.title}</strong>
      <span>{GRADES.find(g => g.id === skill.grade)?.label || 'Skill'} {index + 1}</span>
    </div>
  );
}


// eslint-disable-next-line no-unused-vars
function ImpactCard({ card }) {
  return (
    <div style={styles.impactCard}>
      <div style={styles.impactAvatar}><Users size={28} /></div>
      <h3>{card.title}</h3>
      <p>{card.text}</p>
      <button style={styles.impactButton}>Read more</button>
    </div>
  );
}

function HeroStat({ value, label, color }) {
  return (
    <div style={styles.heroStatCard}>
      <div style={{ ...styles.heroStatValue, color }}>{value}</div>
      <div style={styles.heroStatLabel}>{label}</div>
    </div>
  );
}

function DashboardPreview({ stats, progress, onClick }) {
  const skillCount = Object.keys(progress).length;
  const totalSkills = Object.keys(SKILLS).length;
  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0;

  return (
    <button onClick={onClick} style={styles.dashPreview}>
      <div style={styles.dashPreviewHead}>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>Your Progress</span>
        <BarChart3 size={16} color="#6B7280" />
      </div>
      <div style={styles.dashRing}>
        <ProgressRing percentage={accuracy} size={130} />
        <div style={styles.dashRingLabel}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1F2937' }}>{accuracy}%</div>
          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>Accuracy</div>
        </div>
      </div>
      <div style={styles.dashStats}>
        <div style={styles.dashStatRow}>
          <span style={{ color: '#6B7280', fontSize: 13 }}>Skills explored</span>
          <strong>{skillCount}/{totalSkills}</strong>
        </div>
        <div style={styles.dashStatRow}>
          <span style={{ color: '#6B7280', fontSize: 13 }}>Mastered</span>
          <strong style={{ color: '#059669' }}>{stats.masteredSkills}</strong>
        </div>
        <div style={styles.dashStatRow}>
          <span style={{ color: '#6B7280', fontSize: 13 }}>Best run</span>
          <strong style={{ color: '#0C5CA8' }}>{stats.bestStreak} in a row</strong>
        </div>
      </div>
      <div style={styles.dashCTA}>View full dashboard <ChevronRight size={14} /></div>
    </button>
  );
}

function ProgressRing({ percentage, size = 80, stroke = 10, color = '#059669' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percentage / 100) * c;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} stroke="#F3F4F6" strokeWidth={stroke} fill="none" />
      <circle
        cx={size/2} cy={size/2} r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

// ---------- GRADE SCREEN ----------
function GradeScreen({ grade, onBack, onSelectSubject, progress }) {
  return (
    <div style={styles.container}>
      <BackBtn onClick={onBack} label="Back to grades" />
      <div style={{ ...styles.gradeHeader, background: `linear-gradient(135deg, ${grade.color} 0%, ${grade.color}cc 100%)` }}>
        <div style={styles.gradeHeaderEmoji}>{grade.emoji}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, letterSpacing: 1 }}>YOU'RE EXPLORING</div>
          <h1 style={styles.gradeHeaderTitle}>{grade.label}</h1>
          <p style={styles.gradeHeaderSub}>Choose a subject to dive into.</p>
        </div>
      </div>

      <div style={styles.subjectGrid}>
        {Object.entries(SUBJECTS).map(([key, sub]) => {
          const skills = getSkillsFor(grade.id, key);
          const Icon = sub.icon;
          const completed = skills.filter(s => calcMastery(progress[s.id]) >= 85).length;
          return (
            <button
              key={key}
              onClick={() => skills.length > 0 && onSelectSubject(key)}
              disabled={skills.length === 0}
              style={{
                ...styles.bigSubjectCard,
                background: skills.length === 0 ? '#F3F4F6' : sub.bg,
                cursor: skills.length === 0 ? 'not-allowed' : 'pointer',
                opacity: skills.length === 0 ? 0.6 : 1,
              }}
            >
              <div style={{ ...styles.subjectIcon, background: sub.color, width: 56, height: 56 }}>
                <Icon size={28} color="white" strokeWidth={2.2} />
              </div>
              <h3 style={styles.subjectTitle}>{sub.label}</h3>
              <p style={styles.subjectTag}>{sub.tagline}</p>
              {skills.length > 0 ? (
                <>
                  <div style={styles.subjectStats}>
                    <span><strong>{skills.length}</strong> skills</span>
                    <span><strong style={{ color: '#7DCE82' }}>{completed}</strong> mastered</span>
                  </div>
                  <div style={styles.miniProgressBar}>
                    <div style={{
                      width: skills.length ? `${(completed / skills.length) * 100}%` : '0%',
                      background: sub.color,
                      ...styles.miniProgressFill,
                    }}/>
                  </div>
                  <span style={{ ...styles.subjectCTA, color: sub.color }}>
                    Start practicing <ArrowRight size={14} />
                  </span>
                </>
              ) : (
                <div style={{ ...styles.subjectStats, color: '#9CA3AF', fontStyle: 'italic' }}>Coming soon!</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- SUBJECT SCREEN ----------
function SubjectScreen({ grade, subject, onBack, onSelectSkill, progress }) {
  const sub = SUBJECTS[subject];
  const skills = getSkillsFor(grade.id, subject);
  const Icon = sub.icon;

  if (grade.id === '8' && subject === 'math') {
    return (
      <EighthGradeMathScreen
        grade={grade}
        subject={sub}
        skills={skills}
        progress={progress}
        onBack={onBack}
        onSelectSkill={onSelectSkill}
      />
    );
  }

  if (grade.id === '6' && subject === 'science') {
    return (
      <GroupedSkillPlanScreen
        title="Sixth grade science"
        intro="Explore sixth grade science skills by category. Select a skill to begin a short adaptive Gradely science quiz."
        accent="#F97316"
        groups={GRADE_6_SCIENCE_GROUPS}
        skills={skills}
        progress={progress}
        onBack={onBack}
        onSelectSkill={onSelectSkill}
        backLabel={`Back to ${grade.label}`}
        stats={[
          { icon: <GemIcon />, value: skills.length, label: 'skills' },
          { icon: <BookOpen size={22} />, value: Math.max(30, Math.round(skills.length * 1.3)), label: 'lessons' },
          { icon: <Play size={22} />, value: Math.max(100, skills.length * 5), label: 'videos' },
        ]}
      />
    );
  }

  return (
    <div style={styles.container}>
      <BackBtn onClick={onBack} label={`Back to ${grade.label}`} />
      <div style={{ ...styles.subjectBanner, background: sub.bg, borderColor: sub.color }}>
        <div style={{ ...styles.subjectIcon, background: sub.color, width: 64, height: 64 }}>
          <Icon size={32} color="white" strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>{grade.label} · {sub.label}</div>
          <h1 style={styles.subjectBannerTitle}>{sub.label} Skills</h1>
          <p style={styles.subjectBannerSub}>{skills.length} skill{skills.length !== 1 ? 's' : ''} ready for you</p>
        </div>
      </div>

      <div style={styles.skillList}>
        {skills.map((skill, idx) => {
          const sp = progress[skill.id];
          const mastery = calcMastery(sp);
          const ml = masteryLabel(mastery);
          const MIcon = ml.icon;

          return (
            <button
              key={skill.id}
              onClick={() => onSelectSkill(skill)}
              style={styles.skillCard}
              className="skill-card"
            >
              <div style={{ ...styles.skillNumber, background: sub.color }}>{idx + 1}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <h3 style={styles.skillTitle}>{skill.title}</h3>
                <p style={styles.skillDesc}>{skill.description}</p>
                <div style={styles.skillMeta}>
                  <span style={{ ...styles.masteryPill, color: ml.color, borderColor: ml.color }}>
                    <MIcon size={12} /> {ml.label}
                  </span>
                  {sp && (
                    <>
                      <span style={styles.skillMetaDot}>·</span>
                      <span style={styles.skillMetaText}>{sp.attempts} attempts</span>
                      <span style={styles.skillMetaDot}>·</span>
                      <span style={styles.skillMetaText}>{Math.round((sp.correct / sp.attempts) * 100)}% accuracy</span>
                    </>
                  )}
                </div>
              </div>
              <div style={styles.skillRight}>
                <div style={styles.skillMasteryRing}>
                  <ProgressRing percentage={mastery} size={48} stroke={5} color={ml.color} />
                  <div style={styles.skillRingLabel}>{mastery}</div>
                </div>
                <ChevronRight size={20} color="#9CA3AF" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EighthGradeMathScreen({ grade, subject, skills, progress, onBack, onSelectSkill }) {
  return (
    <GroupedSkillPlanScreen
      title="Eighth grade math"
      intro="Explore eighth grade math skills by category. Select a skill to begin a short adaptive Gradely practice quiz."
      accent="#E6B400"
      groups={GRADE_8_MATH_GROUPS}
      skills={skills}
      progress={progress}
      onBack={onBack}
      onSelectSkill={onSelectSkill}
      backLabel={`Back to ${grade.label}`}
      stats={[
        { icon: <GemIcon />, value: skills.length, label: 'skills' },
        { icon: <BookOpen size={22} />, value: Math.max(24, Math.round(skills.length * 1.5)), label: 'lessons' },
        { icon: <Play size={22} />, value: Math.max(120, skills.length * 6), label: 'videos' },
      ]}
    />
  );
}

function GroupedSkillPlanScreen({ title, intro, accent, groups, skills, progress, onBack, onSelectSkill, backLabel, stats }) {
  const grouped = groups.map(group => ({
    ...group,
    skills: skills
      .filter(skill => skill.categoryLetter === group.letter)
      .sort((a, b) => a.categoryIndex - b.categoryIndex),
  })).filter(group => group.skills.length > 0);

  return (
    <div style={styles.grade8MathPage}>
      <BackBtn onClick={onBack} label={backLabel} />

      <div style={styles.grade8TopTabs}>
        {['Grades', 'Topics', 'Week by week', 'Skill plans'].map((tab, index) => (
          <span key={tab} style={index === 0 ? { ...styles.grade8TabActive, background: '#3DB2FF' } : styles.grade8Tab}>{tab}</span>
        ))}
      </div>

      <div style={styles.grade8Header}>
        <div>
          <h1 style={{ ...styles.grade8Title, color: accent }}>{title}</h1>
          <p style={styles.grade8Intro}>{intro}</p>
          <p style={styles.grade8Switch}>Prefer to view by week? <span>Switch now</span> <ChevronRight size={14} /></p>
        </div>
        <div style={styles.grade8Stats}>
          {stats.map(stat => (
            <div key={stat.label} style={{ ...styles.grade8StatPill, color: accent, borderColor: accent }}>
              {stat.icon} <strong>{stat.value}</strong><span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.grade8SkillColumns} className="grade8-skill-columns">
        {grouped.map(group => (
          <section key={group.letter} style={styles.grade8Group}>
            <h2 style={styles.grade8GroupTitle}>
              <span>{group.letter}.</span> {group.title}
            </h2>
            <ol style={styles.grade8SkillList}>
              {group.skills.map(skill => {
                const mastery = calcMastery(progress[skill.id]);
                return (
                  <li key={skill.id} style={styles.grade8SkillItem}>
                    <button onClick={() => onSelectSkill(skill)} style={styles.grade8SkillLink}>
                      {skill.categoryIndex} <span>{skill.title}</span>
                      <span style={styles.grade8Icons}>✎ ⊙</span>
                      {mastery > 0 && <strong style={styles.grade8Mastery}>{mastery}%</strong>}
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function GemIcon() {
  return <span style={{ fontSize: 22, lineHeight: 1 }}>◇</span>;
}

// ---------- SKILL PRACTICE SCREEN ----------
function SkillScreen({ skill, progress, onBack, onAnswer, onComplete }) {
  const [phase, setPhase] = useState('intro'); // intro | practice | result
  const [currentQ, setCurrentQ] = useState(null);
  const [askedIds, setAskedIds] = useState([]);
  const [history, setHistory] = useState([]); // local session history
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // { correct, message, hint }
  const [showHint, setShowHint] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [questionsToAnswer] = useState(5);

  const startPractice = () => {
    setPhase('practice');
    nextQuestion([]);
  };

  const nextQuestion = (currentHistory = history, currentAsked = askedIds) => {
    const q = pickAdaptiveQuestion(skill.questions, currentHistory, currentAsked);
    if (!q || sessionStats.total >= questionsToAnswer) {
      setPhase('result');
      onComplete?.(`Practice complete! ${sessionStats.correct}/${sessionStats.total} correct`);
      return;
    }
    setCurrentQ(q);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
  };

  const submit = () => {
    if (!userAnswer && userAnswer !== '0') return;
    const normUser = String(userAnswer).trim().toLowerCase();
    const normCorrect = String(currentQ.answer).trim().toLowerCase();
    const correct = normUser === normCorrect;

    setFeedback({
      correct,
      message: correct ? randomCheer() : 'Not quite!',
      hint: currentQ.hint,
    });

    onAnswer(skill.id, currentQ.id, correct, currentQ.difficulty);

    const newHistory = [...history, correct];
    const newAsked = askedIds.includes(currentQ.id) ? askedIds : [...askedIds, currentQ.id];
    setHistory(newHistory);
    setAskedIds(newAsked);
    setSessionStats(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const handleNext = () => {
    if (sessionStats.total >= questionsToAnswer) {
      setPhase('result');
      onComplete?.(`Great session — ${sessionStats.correct}/${sessionStats.total} correct!`);
    } else {
      nextQuestion(history, askedIds);
    }
  };

  const restart = () => {
    setPhase('intro');
    setHistory([]);
    setAskedIds([]);
    setSessionStats({ correct: 0, total: 0 });
    setCurrentQ(null);
    setFeedback(null);
  };

  const sub = SUBJECTS[skill.subject];

  return (
    <div style={styles.container}>
      <BackBtn onClick={onBack} label="Exit practice" />

      {phase === 'intro' && (
        <div style={styles.skillIntro}>
          <div style={{ ...styles.skillIntroIcon, background: sub.color }}>
            <BookOpen size={36} color="white" />
          </div>
          <h1 style={styles.skillIntroTitle}>{skill.title}</h1>
          <p style={styles.skillIntroDesc}>{skill.description}</p>

          <div style={styles.explainBox}>
            <div style={styles.explainHead}>
              <Lightbulb size={18} color="#FFB627" /> <strong>How it works</strong>
            </div>
            <p style={styles.explainText}>{skill.explanation}</p>
          </div>

          <div style={styles.skillMetaRow}>
            <div style={styles.skillMetaItem}>
              <Target size={16} color="#3DB2FF" /> <span>{questionsToAnswer} questions</span>
            </div>
            <div style={styles.skillMetaItem}>
              <Brain size={16} color="#0891B2" /> <span>Adaptive difficulty</span>
            </div>
            <div style={styles.skillMetaItem}>
              <Lightbulb size={16} color="#FFB627" /> <span>Hints available</span>
            </div>
          </div>

          <button onClick={startPractice} style={{ ...styles.primaryBtn, background: sub.color }}>
            <Play size={18} fill="white" /> Start Practice
          </button>
        </div>
      )}

      {phase === 'practice' && currentQ && (
        <div style={styles.practiceWrap}>
          {/* Progress bar */}
          <div style={styles.practiceHeader}>
            <div style={styles.practiceProgressBar}>
              {Array.from({ length: questionsToAnswer }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.progressDot,
                    background: i < sessionStats.total
                      ? (history[i] ? '#059669' : '#DC2626')
                      : i === sessionStats.total ? sub.color : '#E5E7EB',
                    transform: i === sessionStats.total ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
            <div style={styles.practiceCounter}>
              Question {sessionStats.total + 1} of {questionsToAnswer}
            </div>
          </div>

          {/* Question card */}
          <div style={styles.questionCard}>
            <div style={styles.questionMeta}>
              <span style={{ ...styles.diffBadge, background: difficultyColor(currentQ.difficulty) }}>
                {difficultyLabel(currentQ.difficulty)}
              </span>
              <span style={styles.questionType}>
                {currentQ.type === 'mcq' ? 'Multiple choice' : 'Type your answer'}
              </span>
            </div>

            <h2 style={styles.questionPrompt}>{currentQ.prompt}</h2>

            {/* Answer input */}
            {currentQ.type === 'mcq' && (
              <div style={styles.mcqGrid}>
                {currentQ.options.map(opt => {
                  const isSelected = userAnswer === opt;
                  const isCorrect  = feedback && opt === currentQ.answer;
                  const isWrong    = feedback && isSelected && !feedback.correct;
                  return (
                    <button
                      key={opt}
                      disabled={!!feedback}
                      onClick={() => setUserAnswer(opt)}
                      style={{
                        ...styles.mcqBtn,
                        borderColor: isCorrect ? '#059669' : isWrong ? '#DC2626' : isSelected ? sub.color : '#E5E7EB',
                        background: isCorrect ? '#F0FDF4' : isWrong ? '#FEF2F2' : isSelected ? `${sub.color}15` : 'white',
                        color: isCorrect ? '#065F46' : isWrong ? '#991B1B' : '#1F2937',
                      }}
                    >
                      <span style={{ flex: 1, textAlign: 'left' }}>{opt}</span>
                      {isCorrect && <Check size={20} color="#059669" />}
                      {isWrong && <X size={20} color="#DC2626" />}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQ.type === 'fill' && (
              <div>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  disabled={!!feedback}
                  placeholder="Type your answer..."
                  style={{
                    ...styles.fillInput,
                    borderColor: feedback ? (feedback.correct ? '#059669' : '#DC2626') : '#E5E7EB',
                    background: feedback ? (feedback.correct ? '#F0FDF4' : '#FEF2F2') : 'white',
                  }}
                  onKeyDown={e => e.key === 'Enter' && !feedback && submit()}
                  autoFocus
                />
              </div>
            )}

            {/* Hint */}
            {showHint && !feedback && (
              <div style={styles.hintBox}>
                <Lightbulb size={16} color="#FFB627" /> <span>{currentQ.hint}</span>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div style={{
                ...styles.feedback,
                background: feedback.correct ? '#F0FDF4' : '#FEF2F2',
                borderColor: feedback.correct ? '#059669' : '#DC2626',
              }}>
                <div style={styles.feedbackTop}>
                  <div style={{
                    ...styles.feedbackIcon,
                    background: feedback.correct ? '#059669' : '#DC2626',
                  }}>
                    {feedback.correct ? <Check size={20} color="white" /> : <X size={20} color="white" />}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: 700, fontSize: 16,
                      color: feedback.correct ? '#15803D' : '#B91C1C',
                    }}>
                      {feedback.message}
                    </div>
                    <div style={{ fontSize: 14, color: '#374151', marginTop: 4 }}>
                      {feedback.correct
                        ? `+${5 + currentQ.difficulty * 3} points!`
                        : <>The correct answer is <strong>{currentQ.answer}</strong>.</>}
                    </div>
                  </div>
                </div>
                {!feedback.correct && (
                  <div style={styles.solutionBox}>
                    <strong style={{ fontSize: 13 }}>💡 Step-by-step:</strong>
                    <p style={{ marginTop: 4, fontSize: 14, color: '#374151' }}>{feedback.hint}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div style={styles.questionActions}>
              {!feedback && !showHint && (
                <button onClick={() => setShowHint(true)} style={styles.hintBtn}>
                  <Lightbulb size={16} /> Need a hint?
                </button>
              )}
              {!feedback ? (
                <button
                  onClick={submit}
                  disabled={!userAnswer && userAnswer !== '0'}
                  style={{
                    ...styles.primaryBtn,
                    background: sub.color,
                    opacity: (!userAnswer && userAnswer !== '0') ? 0.5 : 1,
                    marginLeft: 'auto',
                  }}
                >
                  Check Answer
                </button>
              ) : (
                <button onClick={handleNext} style={{ ...styles.primaryBtn, background: sub.color, marginLeft: 'auto' }}>
                  {sessionStats.total >= questionsToAnswer ? 'See Results' : 'Next Question'} <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <ResultsScreen
          stats={sessionStats}
          skill={skill}
          color={sub.color}
          onRestart={restart}
          onBack={onBack}
        />
      )}
    </div>
  );
}

function ResultsScreen({ stats, skill, color, onRestart, onBack }) {
  const accuracy = Math.round((stats.correct / stats.total) * 100);
  const message =
    accuracy === 100 ? { title: 'Perfect score! 🎉', sub: 'You absolutely crushed this!' } :
    accuracy >= 80   ? { title: 'Excellent work! 🌟', sub: "You're getting really good!" } :
    accuracy >= 60   ? { title: 'Nice effort! 👏',     sub: 'Keep practicing — mastery is close.' } :
                       { title: 'Good try! 💪',        sub: 'Practice makes perfect. Try again!' };

  return (
    <div style={styles.resultWrap}>
      <div style={styles.resultEmoji}>{accuracy === 100 ? '🏆' : accuracy >= 80 ? '⭐' : accuracy >= 60 ? '👍' : '💪'}</div>
      <h1 style={styles.resultTitle}>{message.title}</h1>
      <p style={styles.resultSub}>{message.sub}</p>

      <div style={styles.resultStats}>
        <div style={styles.resultStat}>
          <div style={{ ...styles.resultStatValue, color }}>{stats.correct}</div>
          <div style={styles.resultStatLabel}>Correct</div>
        </div>
        <div style={styles.resultDivider} />
        <div style={styles.resultStat}>
          <div style={{ ...styles.resultStatValue, color: '#1F2937' }}>{stats.total}</div>
          <div style={styles.resultStatLabel}>Questions</div>
        </div>
        <div style={styles.resultDivider} />
        <div style={styles.resultStat}>
          <div style={{ ...styles.resultStatValue, color: '#059669' }}>{accuracy}%</div>
          <div style={styles.resultStatLabel}>Accuracy</div>
        </div>
      </div>

      <div style={styles.resultActions}>
        <button onClick={onRestart} style={styles.secondaryBtn}>
          <RotateCcw size={16} /> Practice Again
        </button>
        <button onClick={onBack} style={{ ...styles.primaryBtn, background: color }}>
          Back to Skills <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------- PRACTICE HUB ----------
function PracticeHub({ progress, onPickSkill }) {
  const featured = Object.values(SKILLS).slice(0, 12);
  const started = Object.entries(progress)
    .map(([id, p]) => ({ skill: SKILLS[id], progress: p }))
    .filter(x => x.skill)
    .slice(-4)
    .reverse();

  return (
    <div style={styles.container}>
      <div style={styles.productHero}>
        <div>
          <div style={styles.eyebrow}>QUIZ PRACTICE</div>
          <h1 style={styles.dashHeroTitle}>Practice skills by grade and subject</h1>
          <p style={styles.dashHeroSub}>Start a short adaptive quiz, review hints, and earn points as you go.</p>
        </div>
        <div style={styles.heroMiniPanel}>
          <strong>5-question sessions</strong>
          <span>Adaptive difficulty, instant feedback, and step-by-step support.</span>
        </div>
      </div>

      {started.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <SectionHeader title="Continue practicing" subtitle="Pick up from recent skills" />
          <div style={styles.responsiveGrid} className="responsive-grid">
            {started.map(({ skill, progress: p }) => (
              <SkillActionCard key={skill.id} skill={skill} meta={`${calcMastery(p)}% mastery`} action="Resume quiz" onClick={() => onPickSkill(skill)} />
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: 36 }}>
        <SectionHeader title="Quiz library" subtitle="A curated set of skills ready for practice" />
        <div style={styles.responsiveGrid} className="responsive-grid">
          {featured.map(skill => (
            <SkillActionCard
              key={skill.id}
              skill={skill}
              meta={`${GRADES.find(g => g.id === skill.grade)?.label} · ${SUBJECTS[skill.subject].label}`}
              action="Start quiz"
              onClick={() => onPickSkill(skill)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function SkillActionCard({ skill, meta, action, onClick }) {
  const subject = SUBJECTS[skill.subject];
  const Icon = subject.icon;
  return (
    <button onClick={onClick} style={styles.actionCard}>
      <div style={{ ...styles.actionIcon, background: subject.color }}>
        <Icon size={22} color="white" />
      </div>
      <div style={{ textAlign: 'left', flex: 1 }}>
        <h3 style={styles.actionTitle}>{skill.title}</h3>
        <p style={styles.actionText}>{skill.description}</p>
        <div style={styles.actionMeta}>{meta}</div>
      </div>
      <span style={styles.actionCta}>{action} <ChevronRight size={15} /></span>
    </button>
  );
}

// ---------- PARENT DASHBOARD ----------
function ParentDashboard({ stats, progress, onReports, onPractice }) {
  const accuracy = stats.totalAnswered ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;
  const activeSkills = Object.keys(progress).length;
  const weeklyRows = [
    ['Mon', 12, '#0C5CA8'],
    ['Tue', 18, '#0891B2'],
    ['Wed', 8, '#F59E0B'],
    ['Thu', 24, '#059669'],
    ['Fri', 15, '#8B5CF6'],
  ];

  return (
    <div style={styles.container}>
      <div style={styles.productHero}>
        <div>
          <div style={styles.eyebrow}>PARENT DASHBOARD</div>
          <h1 style={styles.dashHeroTitle}>Family progress overview</h1>
          <p style={styles.dashHeroSub}>See what your learner is practicing, where they are growing, and what to try next.</p>
        </div>
        <div style={styles.parentSummary}>
          <div style={styles.parentAvatar}>L</div>
          <div>
            <strong>Learner</strong>
            <span>Grade path: mixed · Plan: Family</span>
          </div>
        </div>
      </div>

      <div style={styles.dashHeroStats}>
        <BigStat icon={<Target size={22}/>} value={stats.totalAnswered} label="Questions answered" color="#0C5CA8" />
        <BigStat icon={<TrendingUp size={22}/>} value={`${accuracy}%`} label="Accuracy" color="#059669" />
        <BigStat icon={<BookOpen size={22}/>} value={activeSkills} label="Skills practiced" color="#0891B2" />
        <BigStat icon={<Crown size={22}/>} value={stats.masteredSkills} label="Mastered" color="#F59E0B" />
      </div>

      <section style={{ marginTop: 36 }}>
        <SectionHeader title="Weekly activity" subtitle="Practice volume by day" />
        <div style={styles.reportPanel}>
          {weeklyRows.map(([day, value, color]) => (
          <div key={day} style={styles.activityRow} className="activity-row">
              <span>{day}</span>
              <div style={styles.activityTrack}>
                <div style={{ ...styles.activityFill, width: `${value * 3}%`, background: color }} />
              </div>
              <strong>{value} min</strong>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.quickActions}>
        <button onClick={onReports} style={styles.primaryAction}>Open progress reports</button>
        <button onClick={onPractice} style={styles.secondaryAction}>Assign practice</button>
      </div>
    </div>
  );
}

// ---------- PROGRESS REPORTS ----------
function ProgressReports({ stats, progress, onPractice }) {
  const subjectRows = Object.entries(SUBJECTS).map(([key, subject]) => {
    const skills = Object.values(SKILLS).filter(s => s.subject === key);
    const attempted = skills.filter(s => progress[s.id]?.attempts > 0);
    const mastered = attempted.filter(s => calcMastery(progress[s.id]) >= 85);
    const attempts = attempted.reduce((sum, s) => sum + (progress[s.id]?.attempts || 0), 0);
    return { key, subject, attempted: attempted.length, mastered: mastered.length, total: skills.length, attempts };
  });

  return (
    <div style={styles.container}>
      <div style={styles.productHero}>
        <div>
          <div style={styles.eyebrow}>PROGRESS REPORTS</div>
          <h1 style={styles.dashHeroTitle}>Progress reports</h1>
          <p style={styles.dashHeroSub}>Printable-style summaries for mastery, activity, and subject coverage.</p>
        </div>
        <button onClick={onPractice} style={styles.primaryAction}>Practice recommended skills</button>
      </div>

      <div style={styles.reportPanel}>
        <div style={styles.reportHeader}>
          <strong>Overall summary</strong>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div style={styles.dashHeroStats}>
          <BigStat icon={<Target size={22}/>} value={stats.totalAnswered} label="Answered" color="#0C5CA8" />
          <BigStat icon={<CheckCircle2 size={22}/>} value={stats.totalCorrect} label="Correct" color="#059669" />
          <BigStat icon={<Flame size={22}/>} value={stats.bestStreak} label="Best streak" color="#F59E0B" />
          <BigStat icon={<AwardIcon />} value={stats.earnedBadges.length} label="Badges" color="#8B5CF6" />
        </div>
      </div>

      <section style={{ marginTop: 32 }}>
        <SectionHeader title="Subject report" subtitle="Coverage and mastery by curriculum area" />
        <div style={styles.reportTable}>
          <div style={{ ...styles.reportRow, ...styles.reportRowHead }} className="report-row">
            <span>Subject</span><span>Started</span><span>Mastered</span><span>Attempts</span><span>Coverage</span>
          </div>
          {subjectRows.map(row => (
            <div key={row.key} style={styles.reportRow} className="report-row">
              <span style={{ fontWeight: 800, color: row.subject.color }}>{row.subject.label}</span>
              <span>{row.attempted}</span>
              <span>{row.mastered}</span>
              <span>{row.attempts}</span>
              <span>{row.total ? Math.round((row.attempted / row.total) * 100) : 0}%</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AwardIcon() {
  return <Trophy size={22} />;
}

// ---------- SUBSCRIPTION / PAYMENT ----------
function SubscriptionScreen({ onBack, onJoin }) {
  const plans = [
    { name: 'Learner', price: '$9', desc: 'For one student practicing at home.', features: ['Adaptive quizzes', 'Progress dashboard', 'Badges and streaks'] },
    { name: 'Family', price: '$19', desc: 'For parents supporting multiple learners.', features: ['Parent dashboard', 'Progress reports', 'Practice assignments'], featured: true },
    { name: 'School', price: '$49', desc: 'For classrooms and content teams.', features: ['Admin management', 'Class analytics', 'Curriculum tools'] },
  ];

  return (
    <div style={styles.container}>
      <BackBtn onClick={onBack} label="Back home" />
      <div style={styles.productHero}>
        <div>
          <div style={styles.eyebrow}>SUBSCRIPTION</div>
          <h1 style={styles.dashHeroTitle}>Choose a Gradely plan</h1>
          <p style={styles.dashHeroSub}>A payment-ready subscription page with plan selection and checkout details.</p>
        </div>
      </div>

      <div style={styles.pricingGrid} className="responsive-grid">
        {plans.map(plan => (
          <div key={plan.name} style={{ ...styles.planCard, ...(plan.featured ? styles.planFeatured : {}) }}>
            {plan.featured && <div style={styles.planBadge}>Best value</div>}
            <h2 style={styles.planName}>{plan.name}</h2>
            <div style={styles.planPrice}>{plan.price}<span>/mo</span></div>
            <p style={styles.actionText}>{plan.desc}</p>
            {plan.features.map(feature => (
              <div key={feature} style={styles.planFeature}><Check size={16} /> {feature}</div>
            ))}
            <button onClick={onJoin} style={plan.featured ? styles.primaryAction : styles.secondaryAction}>
              Select {plan.name}
            </button>
          </div>
        ))}
      </div>

      <section style={{ marginTop: 34 }}>
        <SectionHeader title="Payment details" subtitle="Demo checkout fields for card billing" />
        <div style={styles.paymentForm} className="payment-form">
          <label>Cardholder name<input placeholder="Alex Learner" /></label>
          <label>Card number<input placeholder="4242 4242 4242 4242" /></label>
          <label>Expiration<input placeholder="MM / YY" /></label>
          <label>CVC<input placeholder="123" /></label>
        </div>
      </section>
    </div>
  );
}

// ---------- ADMIN CONTENT MANAGEMENT ----------
function AdminContentManagement({ onPractice, onReports }) {
  const catalogStats = [
    ['Grades', GRADES.length],
    ['Subjects', Object.keys(SUBJECTS).length],
    ['Skills', Object.keys(SKILLS).length],
    ['Questions', Object.values(SKILLS).reduce((sum, skill) => sum + skill.questions.length, 0)],
  ];
  const sampleSkills = Object.values(SKILLS).slice(0, 6);

  return (
    <div style={styles.container}>
      <div style={styles.productHero}>
        <div>
          <div style={styles.eyebrow}>ADMIN CONTENT MANAGEMENT</div>
          <h1 style={styles.dashHeroTitle}>Curriculum control center</h1>
          <p style={styles.dashHeroSub}>Review content coverage, manage skill status, and prepare quizzes for learners.</p>
        </div>
        <div style={styles.quickActions}>
          <button onClick={onPractice} style={styles.primaryAction}>Preview practice</button>
          <button onClick={onReports} style={styles.secondaryAction}>View reports</button>
        </div>
      </div>

      <div style={styles.dashHeroStats}>
        {catalogStats.map(([label, value], idx) => (
          <BigStat
            key={label}
            icon={[<GraduationCap size={22}/>, <BookOpen size={22}/>, <Target size={22}/>, <CheckCircle2 size={22}/>][idx]}
            value={value}
            label={label}
            color={['#0C5CA8', '#0891B2', '#059669', '#F59E0B'][idx]}
          />
        ))}
      </div>

      <section style={{ marginTop: 36 }}>
        <SectionHeader title="Content queue" subtitle="Sample administrative skill table" />
        <div style={styles.reportTable}>
          <div style={{ ...styles.reportRow, ...styles.reportRowHead }} className="report-row">
            <span>Skill</span><span>Grade</span><span>Subject</span><span>Questions</span><span>Status</span>
          </div>
          {sampleSkills.map(skill => (
            <div key={skill.id} style={styles.reportRow} className="report-row">
              <span style={{ fontWeight: 800 }}>{skill.title}</span>
              <span>{GRADES.find(g => g.id === skill.grade)?.label}</span>
              <span>{SUBJECTS[skill.subject].label}</span>
              <span>{skill.questions.length}</span>
              <span style={styles.statusPill}>Published</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 34 }}>
        <SectionHeader title="Create content" subtitle="Fast editor controls for future API integration" />
        <div style={styles.adminForm} className="admin-form">
          <label>Skill title<input placeholder="Add a new skill title" /></label>
          <label>Grade<select><option>Pre-K</option><option>Grade 1</option><option>Grade 6</option><option>Grade 12</option></select></label>
          <label>Subject<select><option>Math</option><option>Language arts</option><option>Science</option><option>Social studies</option></select></label>
          <label>Question prompt<textarea placeholder="Write a quiz prompt..." /></label>
          <button style={styles.primaryAction}>Save draft</button>
        </div>
      </section>
    </div>
  );
}

// ---------- DASHBOARD ----------
function Dashboard({ title = 'Dashboard', stats, progress, onPickSkill }) {
  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0;

  // Per-subject breakdown
  const bySubject = useMemo(() => {
    const out = {};
    Object.keys(SUBJECTS).forEach(key => {
      const subjectSkills = Object.values(SKILLS).filter(s => s.subject === key);
      const explored = subjectSkills.filter(s => progress[s.id]?.attempts > 0).length;
      const mastered = subjectSkills.filter(s => calcMastery(progress[s.id]) >= 85).length;
      out[key] = { explored, mastered, total: subjectSkills.length };
    });
    return out;
  }, [progress]);

  // Recommendations: skills with attempts but not yet mastered (weak areas first)
  const recommendations = useMemo(() => {
    const weak = Object.entries(progress)
      .map(([id, p]) => ({ skill: SKILLS[id], mastery: calcMastery(p), p }))
      .filter(x => x.skill && x.mastery > 0 && x.mastery < 85)
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, 3);
    if (weak.length >= 3) return weak.map(x => x.skill);
    // Fill with not-yet-tried skills
    const untried = Object.values(SKILLS).filter(s => !progress[s.id]).slice(0, 3 - weak.length);
    return [...weak.map(x => x.skill), ...untried];
  }, [progress]);

  // Recent skills
  const recent = Object.entries(progress)
    .map(([id, p]) => ({ skill: SKILLS[id], p }))
    .filter(x => x.skill)
    .slice(-3)
    .reverse();

  return (
    <div style={styles.container}>
      <div style={styles.dashHero}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0C5CA8', letterSpacing: 1 }}>YOUR LEARNING JOURNEY</div>
          <h1 style={styles.dashHeroTitle}>{title}</h1>
          <p style={styles.dashHeroSub}>Track your progress and find what to learn next.</p>
        </div>
        <div style={styles.dashHeroStats}>
          <BigStat icon={<Target size={22}/>} value={stats.totalAnswered} label="Questions answered" color="#3DB2FF" />
          <BigStat icon={<TrendingUp size={22}/>} value={`${accuracy}%`} label="Overall accuracy" color="#7DCE82" />
          <BigStat icon={<Crown size={22}/>} value={stats.masteredSkills} label="Skills mastered" color="#059669" />
          <BigStat icon={<Flame size={22}/>} value={stats.bestStreak} label="Best streak" color="#FB5607" />
        </div>
      </div>

      {/* Subject breakdown */}
      <section style={{ marginTop: 40 }}>
        <SectionHeader title="Performance by subject" subtitle="See how you're doing in each area" />
        <div style={styles.subjectAnalytics}>
          {Object.entries(SUBJECTS).map(([key, sub]) => {
            const data = bySubject[key];
            const Icon = sub.icon;
            const pct = data.total ? (data.mastered / data.total) * 100 : 0;
            return (
              <div key={key} style={styles.subjectAnalyticCard}>
                <div style={styles.analyticHead}>
                  <div style={{ ...styles.analyticIcon, background: sub.color }}>
                    <Icon size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{sub.label}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{data.mastered} mastered · {data.explored} started</div>
                  </div>
                </div>
                <div style={styles.analyticBar}>
                  <div style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${sub.color}, ${sub.color}dd)`,
                    ...styles.analyticBarFill,
                  }}/>
                </div>
                <div style={styles.analyticPct}>{Math.round(pct)}% mastered</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommendations */}
      <section style={{ marginTop: 40 }}>
        <SectionHeader
          title="Recommended for you"
          subtitle="Based on your weak areas and unexplored skills"
          icon={<Brain size={20} color="#0891B2" />}
        />
        <div style={styles.recList}>
          {recommendations.length === 0 ? (
            <div style={styles.emptyState}>Start practicing to get recommendations!</div>
          ) : (
            recommendations.map(skill => {
              const sub = SUBJECTS[skill.subject];
              const mastery = calcMastery(progress[skill.id]);
              const reason = mastery > 0 ? 'Improve weak area' : 'New skill to try';
              return (
                <button key={skill.id} onClick={() => onPickSkill(skill)} style={styles.recCard}>
                  <div style={{ ...styles.recIcon, background: sub.color }}>
                    {React.createElement(sub.icon, { size: 20, color: 'white' })}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={styles.recReason}>{reason}</div>
                    <div style={styles.recTitle}>{skill.title}</div>
                    <div style={styles.recMeta}>
                      {GRADES.find(g => g.id === skill.grade)?.label} · {sub.label}
                      {mastery > 0 && ` · ${mastery}% mastery`}
                    </div>
                  </div>
                  <ArrowRight size={20} color="#6B7280" />
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* Recent activity */}
      {recent.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <SectionHeader title="Recent activity" subtitle="Skills you've been working on" />
          <div style={styles.recentGrid}>
            {recent.map(({ skill, p }) => {
              const sub = SUBJECTS[skill.subject];
              const mastery = calcMastery(p);
              const ml = masteryLabel(mastery);
              return (
                <button key={skill.id} onClick={() => onPickSkill(skill)} style={styles.recentCard}>
                  <div style={{ ...styles.recentIcon, background: sub.bg, color: sub.color }}>
                    {React.createElement(sub.icon, { size: 18 })}
                  </div>
                  <h4 style={styles.recentTitle}>{skill.title}</h4>
                  <div style={styles.recentBar}>
                    <div style={{ width: `${mastery}%`, background: ml.color, height: '100%', borderRadius: 4 }}/>
                  </div>
                  <div style={styles.recentMeta}>
                    <span style={{ color: ml.color, fontWeight: 700 }}>{ml.label}</span>
                    <span style={{ color: '#6B7280' }}>{p.attempts} attempts</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function BigStat({ icon, value, label, color }) {
  return (
    <div style={styles.bigStat}>
      <div style={{ ...styles.bigStatIcon, color, background: `${color}15` }}>{icon}</div>
      <div>
        <div style={styles.bigStatValue}>{value}</div>
        <div style={styles.bigStatLabel}>{label}</div>
      </div>
    </div>
  );
}

// ---------- BADGES ----------
function BadgesScreen({ stats, onBack }) {
  return (
    <div style={styles.container}>
      <BackBtn onClick={onBack} label="Back home" />
      <div style={styles.badgesHero}>
        <Trophy size={48} color="#FFB627" />
        <div>
          <h1 style={styles.dashHeroTitle}>Badges & Achievements</h1>
          <p style={styles.dashHeroSub}>
            You've earned {stats.earnedBadges.length} of {BADGES.length} badges so far!
          </p>
        </div>
      </div>

      <div style={styles.badgeGrid}>
        {BADGES.map(b => {
          const earned = stats.earnedBadges.includes(b.id);
          return (
            <div key={b.id} style={{
              ...styles.badgeCard,
              background: earned ? 'linear-gradient(135deg, #FFF8E1, #FFE082)' : '#F9FAFB',
              borderColor: earned ? '#FFB627' : '#E5E7EB',
            }}>
              <div style={{
                ...styles.badgeEmoji,
                filter: earned ? 'none' : 'grayscale(1)',
                opacity: earned ? 1 : 0.4,
              }}>
                {b.icon}
              </div>
              <h3 style={{ ...styles.badgeName, color: earned ? '#1F2937' : '#6B7280' }}>{b.name}</h3>
              <p style={styles.badgeDesc}>{b.desc}</p>
              {earned ? (
                <div style={styles.badgeEarned}><CheckCircle2 size={14} /> Earned</div>
              ) : (
                <div style={styles.badgeLocked}><Lock size={12} /> Locked</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- SHARED COMPONENTS ----------
function SectionHeader({ title, subtitle, icon }) {
  return (
    <div style={styles.sectionHeader}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon}
        <h2 style={styles.sectionTitle}>{title}</h2>
      </div>
      <p style={styles.sectionSub}>{subtitle}</p>
    </div>
  );
}

function BackBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={styles.backBtn}>
      <ChevronLeft size={18} /> {label}
    </button>
  );
}

function Footer() {
  const cols = [
    {
      heading: 'What we offer',
      links: ['For schools', 'For teachers', 'For students', 'For parents', 'For high schools', 'For homeschools', 'Gradely Analytics', 'Gradely ELA'],
    },
    {
      heading: 'Resources',
      links: ['Skill plans', 'Awards', 'Diagnostic', 'Real-Time Diagnostic', 'State standards', 'Common Core', 'Site map'],
    },
    {
      heading: 'About',
      links: ['About us', 'Blog', 'Careers', 'Contact us', 'Privacy policy'],
    },
    {
      heading: 'International',
      links: ['Australia', 'Canada', 'India', 'New Zealand', 'Singapore', 'South Africa', 'United Kingdom'],
    },
  ];
  return (
    <footer style={styles.footer}>
      <div style={styles.footerInner}>
        <div style={styles.footerTop} className="footer-top">
          <div style={styles.footerBrand}>
            <span style={styles.footerLogo}>
              <span style={styles.logoCapSection}>🎓</span>
              <span style={styles.logoWordmark}>Gradely</span>
            </span>
            <p style={styles.footerTagline}>
              Personalized learning for Pre-K through Grade 12.
            </p>
            <button style={styles.footerJoinBtn}>Join now</button>
          </div>
          <div style={styles.footerCols} className="footer-cols">
            {cols.map(col => (
              <div key={col.heading} style={styles.footerCol}>
                <h4 style={styles.footerColHead}>{col.heading}</h4>
                {col.links.map(link => (
                  <div key={link} style={styles.footerLink}>{link}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Gradely, LLC. All rights reserved.</span>
          <span style={{ color: '#9CA3AF', marginLeft: 16 }}>Privacy policy · Terms of service</span>
        </div>
      </div>
    </footer>
  );
}

// ---------- HELPERS ----------
function difficultyLabel(d) { return d === 1 ? 'Easy' : d === 2 ? 'Medium' : 'Hard'; }
function difficultyColor(d) { return d === 1 ? '#059669' : d === 2 ? '#D97706' : '#DC2626'; }
function randomCheer() {
  const cheers = ['Great job! 🎉', 'Awesome! ⭐', 'You got it! 🌟', 'Excellent! 💯', 'Nailed it! 🚀', 'Brilliant! ✨'];
  return cheers[Math.floor(Math.random() * cheers.length)];
}

// ---------- CSS INJECTION ----------
function StyleInjector() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      html { overflow-x: hidden; }
      body { margin: 0; overflow-x: hidden; -webkit-text-size-adjust: 100%; }
      *, *::before, *::after { box-sizing: border-box; }
      img, video, iframe, svg { max-width: 100%; height: auto; }

      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0); }
        50% { transform: translateY(-20px) rotate(8deg); }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pop {
        0% { transform: scale(0.8); opacity: 0; }
        80% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      .grade-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
      .skill-card:hover { transform: translateX(4px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      .lc-grade-row:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }

      input:focus, button:focus-visible { outline: 3px solid #0C5CA844; outline-offset: 2px; }
      button { font-family: inherit; }
      input, select, textarea { max-width: 100%; }

      /* ── HEADER RESPONSIVE (mobile-first) ── */
      /* Mobile default: hamburger visible, desktop elements hidden */
      .header-hamburger { display: flex !important; }
      .header-desktop-nav { display: none !important; }
      .header-desktop-actions { display: none !important; }
      .header-search { display: none !important; }

      /* 769px+: show desktop layout */
      @media (min-width: 769px) {
        .header-hamburger { display: none !important; }
        .header-desktop-nav { display: flex !important; }
        .header-desktop-actions { display: flex !important; }
        .header-search { display: flex !important; }
      }

      /* Mobile top row: logo left, hamburger right */
      @media (max-width: 768px) {
        .header-top-row {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding-bottom: 10px !important;
        }
      }

      /* ── HOME SCREEN ── */
      /* Hero stacks on tablet/mobile */
      @media (max-width: 900px) {
        .art-hero {
          gap: 40px !important;
          padding: 52px 20px 60px !important;
        }
        .art-cards-grid,
        .art-why-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        .hero-clouds, .grade-catalog-grid, .grade8-skill-columns,
        .support-grid, .impact-grid, .home-stats, .promo-cards, .responsive-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
      }

      @media (max-width: 768px) {
        .art-hero {
          flex-direction: column !important;
          padding: 40px 16px 48px !important;
          gap: 28px !important;
          text-align: center !important;
        }
        .art-hero-left { max-width: 100% !important; }
        .art-hero-right { display: none !important; }
        .art-tags-row { justify-content: center !important; }

        .art-section { padding: 40px 16px !important; }
        .art-section-wrap { padding-left: 16px !important; padding-right: 16px !important; }

        .art-cards-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        .art-why-grid   { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
        .art-start-inner { grid-template-columns: 1fr !important; gap: 20px !important; }
        .art-cta-card { padding: 36px 20px !important; }

        .footer-top { display: flex !important; flex-direction: column !important; gap: 28px !important; }
        .footer-cols { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }

        .grade-card { min-width: 0 !important; }
        input { min-width: 0; }
      }

      @media (max-width: 640px) {
        .art-why-grid { grid-template-columns: 1fr !important; }
        .art-stats-row { grid-template-columns: 1fr 1fr !important; }

        .hero-clouds, .grade-catalog-grid, .grade8-skill-columns,
        .support-grid, .impact-grid, .home-stats, .promo-cards, .responsive-grid,
        .art-cards-grid, .art-why-grid, .art-start-inner {
          grid-template-columns: 1fr !important;
        }
        .payment-form, .admin-form { grid-template-columns: 1fr !important; }
        .report-row { display: flex !important; flex-direction: column !important; gap: 4px !important; }
        .activity-row { grid-template-columns: 40px 1fr !important; }
      }

      @media (max-width: 480px) {
        .art-cta-card { padding: 28px 14px !important; }
        .footer-cols { grid-template-columns: 1fr !important; }
        .art-grades-row button,
        .art-grades-row span { padding: 6px 10px !important; font-size: 12px !important; }
      }

      /* ── MISC COMPONENTS ── */
      .test-stack span {
        position: absolute; top: 8px; width: 58px; height: 76px;
        border-radius: 6px;
        background: linear-gradient(160deg, #58c9e8, #2563eb);
        color: white; display: flex; align-items: center; justify-content: center;
        font-weight: 900; box-shadow: 0 8px 14px rgba(0,0,0,0.15); border: 3px solid white;
      }
      .test-stack span:first-child { left: 10px; transform: rotate(-14deg); }
      .test-stack span:last-child  { left: 58px; transform: rotate(9deg); }

      .promo-cards strong {
        display: block; font-family: ${FONT_DISPLAY};
        font-size: 26px; color: #00913c; margin-bottom: 4px; font-weight: 700;
      }
      .promo-cards p  { margin: 0 0 10px; font-size: 14px; color: #2f4a36; }
      .promo-cards em {
        display: inline-flex; align-items: center; gap: 6px;
        font-style: normal; color: #008C2E; font-weight: 700;
      }

      .payment-form label, .admin-form label {
        display: flex; flex-direction: column; gap: 7px;
        font-size: 13px; font-weight: 800; color: #334155;
      }
      label input, label select, label textarea {
        width: 100%; border: 2px solid #D9E7FF; border-radius: 10px;
        padding: 11px 12px; font-family: ${FONT_BODY}; font-size: 14px; background: #F8FBFF;
      }
      label textarea { min-height: 92px; resize: vertical; }
    `}</style>
  );
}

// ---------- STYLES ----------
const FONT_BODY = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_DISPLAY = "'Fraunces', Georgia, serif";

const styles = {
  app: {
    minHeight: '100vh',
    fontFamily: FONT_BODY,
    background: '#F0F6FF',
    color: '#0D2040',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  main: { flex: 1, paddingBottom: 0 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' },
  productHero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    background: 'white',
    border: '1px solid #D9E7FF',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 12px 30px rgba(12,92,168,0.08)',
    flexWrap: 'wrap',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.2,
    color: '#0C5CA8',
    textTransform: 'uppercase',
  },
  heroMiniPanel: {
    minWidth: 240,
    maxWidth: 320,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: 14,
    padding: 16,
    color: '#1E3A8A',
  },
  responsiveGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 16,
  },
  actionCard: {
    background: 'white',
    border: '1px solid #D9E7FF',
    borderRadius: 14,
    padding: 16,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 8px 18px rgba(12,92,168,0.06)',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 900,
    color: '#0D2040',
  },
  actionText: {
    margin: '6px 0',
    fontSize: 13,
    lineHeight: 1.45,
    color: '#64748B',
  },
  actionMeta: {
    fontSize: 12,
    color: '#0C5CA8',
    fontWeight: 800,
  },
  actionCta: {
    marginLeft: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    color: '#0C5CA8',
    fontSize: 12,
    fontWeight: 900,
    whiteSpace: 'nowrap',
  },
  parentSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    minWidth: 240,
  },
  parentAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: '#0C5CA8',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
  },
  reportPanel: {
    background: 'white',
    border: '1px solid #D9E7FF',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 8px 22px rgba(12,92,168,0.06)',
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    color: '#334155',
  },
  activityRow: {
    display: 'grid',
    gridTemplateColumns: '48px 1fr 64px',
    gap: 12,
    alignItems: 'center',
    padding: '10px 0',
  },
  activityTrack: {
    height: 12,
    borderRadius: 999,
    background: '#E2E8F0',
    overflow: 'hidden',
  },
  activityFill: {
    height: '100%',
    borderRadius: 999,
  },
  quickActions: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
  },
  primaryAction: {
    background: '#0C5CA8',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    padding: '12px 18px',
    fontSize: 14,
    fontWeight: 900,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryAction: {
    background: 'white',
    color: '#0C5CA8',
    border: '2px solid #BFDBFE',
    borderRadius: 10,
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 900,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  reportTable: {
    background: 'white',
    border: '1px solid #D9E7FF',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 8px 22px rgba(12,92,168,0.06)',
  },
  reportRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
    gap: 12,
    alignItems: 'center',
    padding: '14px 18px',
    borderTop: '1px solid #E2E8F0',
    fontSize: 14,
  },
  reportRowHead: {
    borderTop: 'none',
    background: '#EFF6FF',
    color: '#0C5CA8',
    fontWeight: 900,
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 18,
    marginTop: 28,
  },
  planCard: {
    position: 'relative',
    background: 'white',
    border: '1px solid #D9E7FF',
    borderRadius: 18,
    padding: 24,
    boxShadow: '0 8px 24px rgba(12,92,168,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  planFeatured: {
    border: '2px solid #0C5CA8',
    transform: 'translateY(-4px)',
  },
  planBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    background: '#F59E0B',
    color: 'white',
    borderRadius: 999,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 900,
  },
  planName: {
    margin: 0,
    fontFamily: FONT_DISPLAY,
    fontSize: 28,
    color: '#0C5CA8',
  },
  planPrice: {
    fontSize: 42,
    fontWeight: 900,
    color: '#0D2040',
  },
  planFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#334155',
    fontSize: 14,
  },
  paymentForm: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 14,
    background: 'white',
    border: '1px solid #D9E7FF',
    borderRadius: 16,
    padding: 20,
  },
  adminForm: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 14,
    background: 'white',
    border: '1px solid #D9E7FF',
    borderRadius: 16,
    padding: 20,
  },
  statusPill: {
    display: 'inline-flex',
    width: 'fit-content',
    borderRadius: 999,
    background: '#DCFCE7',
    color: '#15803D',
    padding: '4px 10px',
    fontSize: 12,
    fontWeight: 900,
  },

  // Header
  header: {
    background: '#0C5CA8',
    borderBottom: 'none',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxShadow: '0 2px 12px rgba(12,92,168,0.35)',
  },
  headerInner: {
    maxWidth: 1120, margin: '0 auto', padding: '10px 20px 0',
    display: 'flex', flexDirection: 'column',
    gap: 8,
  },
  headerTopRow: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    display: 'flex', alignItems: 'center',
    background: 'transparent', border: 'none', cursor: 'pointer',
    padding: 0, flexShrink: 0,
  },
  logoMark: {
    height: 38, borderRadius: 8,
    display: 'inline-flex', alignItems: 'stretch',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.28)',
  },
  logoCapSection: {
    background: '#06397A',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 9px',
    fontSize: 18,
    borderRight: '2px solid rgba(255,255,255,0.15)',
    flexShrink: 0,
  },
  logoWordmark: {
    background: 'linear-gradient(135deg, #0A4F8A 0%, #1668C7 100%)',
    display: 'flex', alignItems: 'center',
    padding: '0 14px 0 9px',
    color: '#FFD740',
    fontWeight: 900, fontSize: 17,
    fontFamily: FONT_DISPLAY,
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
  },
  logoIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: 'linear-gradient(135deg, #0C5CA8 0%, #0891B2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 12px rgba(12,92,168,0.3)',
  },
  logoText: { fontFamily: FONT_BODY, fontSize: 14, fontWeight: 800, color: 'white', lineHeight: 1 },
  logoTag: { fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: 500 },

  headerNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
    width: '100%',
    paddingBottom: 4,
  },
  navLink: {
    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.92)',
    fontSize: 21, fontWeight: 500, cursor: 'pointer',
    padding: '2px 0 10px',
    fontFamily: FONT_DISPLAY,
    display: 'inline-flex', alignItems: 'center', gap: 5,
    position: 'relative',
    transition: 'color 0.15s',
  },
  navLinkActive: {
    color: 'white',
    fontWeight: 700,
  },
  navActiveCaret: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: '9px solid white',
  },
  searchWrap: {
    height: 36, borderRadius: 999, background: 'white',
    display: 'flex', alignItems: 'center',
    padding: 0, border: 'none',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  searchInput: {
    border: 'none', outline: 'none', flex: 1,
    fontSize: 14, color: '#374151', fontFamily: FONT_BODY,
    padding: '0 8px',
    background: 'transparent',
  },
  searchIcon: {
    width: 38,
    height: 36,
    background: '#5BC700',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: '999px 0 0 999px',
  },
  searchSubmit: {
    width: 36,
    height: 34,
    background: 'transparent',
    border: 'none',
    borderLeft: '1px solid #D1D5DB',
    color: '#9CA3AF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },

  headerStats: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  statChip: {
    display: 'inline-flex', alignItems: 'center',
    padding: '4px 8px', borderRadius: 999,
    border: '1px solid', background: 'white',
    fontSize: 12, fontWeight: 800,
  },

  headerActions: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  topRoleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: 3,
    borderRadius: 6,
    background: 'rgba(255,255,255,0.2)',
  },
  topRoleBtn: {
    height: 24,
    padding: '0 7px',
    borderRadius: 4,
    border: '1px solid rgba(255,255,255,0.45)',
    background: 'rgba(255,255,255,0.12)',
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    fontWeight: 800,
    cursor: 'pointer',
  },
  topRoleBtnActive: {
    background: 'white',
    color: '#118BCB',
    borderColor: 'white',
  },
  iconBtn: {
    width: 34, height: 34, borderRadius: 5,
    background: '#1586d1', border: '1px solid rgba(255,255,255,0.5)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', transition: 'all 0.15s',
  },
  resetBtn: {
    width: 32, height: 32, borderRadius: 5,
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.35)',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white',
  },
  hamburgerBtn: {
    width: 36, height: 36, borderRadius: 6,
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.35)',
    cursor: 'pointer',
    display: 'none',
    alignItems: 'center', justifyContent: 'center',
    color: 'white', flexShrink: 0,
  },
  mobileMenu: {
    display: 'flex', flexDirection: 'column',
    background: '#0A4F8A',
    borderTop: '1px solid rgba(255,255,255,0.15)',
    paddingBottom: 8,
  },
  mobileNavLink: {
    background: 'none', border: 'none',
    color: 'rgba(255,255,255,0.88)',
    fontSize: 17, fontWeight: 600,
    padding: '13px 20px', textAlign: 'left', cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    fontFamily: FONT_DISPLAY,
    width: '100%',
  },
  mobileNavLinkActive: {
    color: 'white', background: 'rgba(255,255,255,0.08)', fontWeight: 800,
  },
  mobileMenuDivider: {
    height: 1, background: 'rgba(255,255,255,0.18)', margin: '6px 0',
  },
  signInBtn: {
    height: 36,
    padding: '0 18px',
    border: 'none',
    borderRadius: 6,
    background: '#00B5D4',
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: 0.1,
  },
  membershipBtn: {
    height: 36,
    padding: '0 18px',
    border: '1.5px solid #9AE6B4',
    borderRadius: 6,
    background: '#F0FFF4',
    color: '#276749',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: 0.1,
  },
  userBadge: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '4px 8px', borderRadius: 4, background: '#E6F7FF',
    border: '1px solid rgba(255,255,255,0.75)', color: '#0B7CB8',
  },
  avatar: {
    width: 20, height: 20, borderRadius: '50%',
    background: '#13B5EA',
    color: 'white', fontWeight: 700, fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  // Login
  loginWrap: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24, position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #E0F2FE 100%)',
  },
  loginBg: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 },
  loginCard: {
    background: 'white', borderRadius: 24, padding: 40,
    boxShadow: '0 24px 64px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.04)',
    maxWidth: 480, width: '100%', position: 'relative', zIndex: 1,
    animation: 'slideUp 0.5s ease',
  },
  loginHero: { textAlign: 'center' },
  loginLogo: {
    width: 72, height: 72, margin: '0 auto', borderRadius: 20,
    background: 'linear-gradient(135deg, #0C5CA8 0%, #0891B2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white',
    boxShadow: '0 8px 24px rgba(12,92,168,0.35)',
  },
  loginTitle: {
    fontFamily: FONT_DISPLAY, fontSize: 42, fontWeight: 900,
    margin: '20px 0 8px', color: '#1F2937', letterSpacing: '-0.02em',
  },
  loginSub: { fontSize: 15, color: '#6B7280', margin: 0 },
  fieldLabel: { display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 },
  input: {
    width: '100%', padding: '14px 16px', borderRadius: 12,
    border: '2px solid #E5E7EB', fontSize: 16, fontFamily: FONT_BODY,
    transition: 'border-color 0.15s', background: '#FAFBFF',
  },
  roleGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8 },
  roleBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '14px 8px', borderRadius: 12, border: '2px solid',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  primaryBtn: {
    width: '100%', marginTop: 24, padding: '14px 20px',
    background: 'linear-gradient(135deg, #0C5CA8 0%, #0891B2 100%)',
    color: 'white', border: 'none', borderRadius: 14,
    fontSize: 16, fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 8px 20px rgba(12,92,168,0.35)',
    transition: 'transform 0.1s',
  },
  loginNote: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 16 },

  // Hero
  hero: {
    display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48,
    alignItems: 'center',
  },
  heroLeft: {},
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', borderRadius: 999,
    background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    fontSize: 12, fontWeight: 700, color: '#1E40AF',
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: FONT_DISPLAY, fontSize: 'clamp(36px, 5vw, 56px)',
    fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.025em',
    margin: 0, color: '#1F2937',
  },
  heroName: {
    background: 'linear-gradient(135deg, #0C5CA8 0%, #0891B2 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroEmphasis: {
    fontStyle: 'italic',
    color: '#FB5607',
  },
  heroDesc: { fontSize: 17, color: '#4B5563', marginTop: 16, lineHeight: 1.6, maxWidth: 540 },
  heroStats: { display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' },
  heroStatCard: {
    padding: '14px 20px', borderRadius: 14, background: 'white',
    border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  },
  heroStatValue: { fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 900, lineHeight: 1 },
  heroStatLabel: { fontSize: 12, color: '#6B7280', fontWeight: 600, marginTop: 4 },

  heroRight: {},

  redesignHero: {
    position: 'relative',
    minHeight: 398,
    background: 'linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 55%, #BAE6FD 70%, #7DD3FC 80%, #0C5CA8 83%, #094987 100%)',
    overflow: 'hidden',
    borderBottom: 'none',
  },
  heroSkyline: {
    position: 'absolute',
    left: 0,
    bottom: 42,
    width: '38%',
    height: 120,
    opacity: 1,
    background: 'linear-gradient(120deg, transparent 0 22%, #BAE6FD 22% 30%, transparent 30%), linear-gradient(90deg, #DBEAFE 0 22%, transparent 22% 28%, #DBEAFE 28% 50%, transparent 50% 56%, #DBEAFE 56% 78%, transparent 78%)',
    borderBottom: '12px solid #0C5CA8',
  },
  heroHills: {
    position: 'absolute',
    left: -90,
    right: -90,
    bottom: -54,
    height: 150,
    background: 'radial-gradient(ellipse at 20% 68%, #094987 0 28%, transparent 29%), radial-gradient(ellipse at 66% 74%, #0C5CA8 0 31%, transparent 32%), radial-gradient(ellipse at 94% 66%, #1A73C8 0 28%, transparent 29%)',
  },
  heroBalloon: {
    position: 'absolute',
    left: 70,
    top: 18,
    width: 88,
    height: 136,
    borderRadius: '50% 50% 45% 45%',
    background: 'radial-gradient(circle at 30% 30%, #FFE169 0 10%, transparent 11%), repeating-linear-gradient(90deg, #FACC15 0 15px, #D6A919 15px 18px)',
    border: '2px solid #6B8C42',
    boxShadow: '0 100px 0 -36px #8B5E34',
  },
  heroSun: {
    position: 'absolute',
    left: 244,
    top: 32,
    width: 70,
    height: 70,
    borderRadius: '50%',
    background: 'radial-gradient(circle, #FFF6B8 0 30%, #FFD56B 31% 62%, rgba(255,213,107,0.25) 63%)',
    boxShadow: '0 0 0 12px rgba(255,190,62,0.25)',
  },
  heroRocket: {
    position: 'absolute',
    right: 154,
    top: 46,
    width: 82,
    height: 82,
    background: 'linear-gradient(135deg, transparent 0 46%, #FF9F6E 47% 54%, transparent 55%), linear-gradient(35deg, transparent 0 45%, #FF7B46 46% 54%, transparent 55%)',
    transform: 'rotate(-12deg)',
  },
  heroKid: {
    position: 'absolute',
    right: 76,
    top: 108,
    fontSize: 74,
    transform: 'rotate(8deg)',
  },
  heroRider: {
    position: 'absolute',
    left: 170,
    bottom: 38,
    fontSize: 80,
    transform: 'rotate(-7deg)',
  },
  heroInner: {
    position: 'relative',
    maxWidth: 940,
    margin: '0 auto',
    padding: '12px 16px 78px',
    textAlign: 'center',
    zIndex: 2,
  },
  heroKicker: {
    margin: '0 0 26px',
    color: '#0C5CA8',
    fontSize: 42,
    fontFamily: FONT_DISPLAY,
    fontWeight: 500,
  },
  heroClouds: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.05fr 1fr',
    gap: 0,
    alignItems: 'start',
    maxWidth: 780,
    margin: '0 auto 28px',
  },
  learningCloud: {
    minHeight: 160,
    padding: '26px 26px 20px',
    background: 'rgba(255,255,255,0.88)',
    border: '1.5px solid',
    borderRadius: '44% 56% 50% 50% / 46% 48% 52% 54%',
    boxShadow: '0 8px 18px rgba(0,117,156,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    fontSize: 16,
    lineHeight: 1.45,
  },
  heroGreeting: {
    margin: '10px 0 12px',
    fontSize: 13,
    color: '#0C5CA8',
    fontWeight: 700,
  },
  heroCta: {
    background: '#0C5CA8',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    padding: '10px 24px',
    fontSize: 16,
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 2px 0 #094987',
  },
  ixlHero: {
    position: 'relative',
    background: 'linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 35%, #BAE6FD 70%, #7DD3FC 100%)',
    overflow: 'hidden',
    padding: '48px 220px 110px',
    minHeight: 360,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  ixlDeco: {
    position: 'absolute',
    lineHeight: 1,
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 1,
    filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))',
  },
  ixlHeroContent: {
    position: 'relative',
    zIndex: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  ixlHeroTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 46,
    fontWeight: 400,
    color: '#0C5CA8',
    textAlign: 'center',
    margin: '0 0 28px',
    letterSpacing: '-0.01em',
  },
  ixlHeroIs: {
    fontWeight: 900,
    fontStyle: 'italic',
    color: '#0C5CA8',
  },
  ixlCloudsRow: {
    display: 'flex',
    gap: 18,
    justifyContent: 'center',
    marginBottom: 28,
    alignItems: 'flex-start',
  },
  ixlCloud: {
    background: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: '22px 22px 16px',
    textAlign: 'center',
    width: 228,
    boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
  },
  ixlCloudCenter: {
    marginTop: 24,
  },
  ixlCloudTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 19,
    fontWeight: 700,
    margin: '0 0 10px',
    lineHeight: 1.3,
  },
  ixlCloudBody: {
    fontSize: 13,
    color: '#374151',
    margin: '0 0 12px',
    lineHeight: 1.6,
  },
  ixlMemberBtn: {
    background: '#F59E0B',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    padding: '13px 38px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 3px 0 #B45309',
    position: 'relative',
    zIndex: 4,
  },
  ixlWater: {
    position: 'absolute',
    bottom: 58,
    left: '35%',
    right: '35%',
    height: 28,
    background: '#38BDF8',
    borderRadius: '50%',
    opacity: 0.7,
    zIndex: 2,
  },
  ixlHillBack: {
    position: 'absolute',
    bottom: 0,
    left: '-15%',
    right: '-15%',
    height: 85,
    background: '#0C5CA8',
    borderRadius: '55% 55% 0 0',
    zIndex: 2,
  },
  ixlHillFront: {
    position: 'absolute',
    bottom: 0,
    left: '-25%',
    right: '-25%',
    height: 58,
    background: '#1A73C8',
    borderRadius: '45% 45% 0 0',
    zIndex: 3,
  },
  homePromoBand: {
    background: '#EFF6FF',
    borderBottom: 'none',
    padding: '30px 16px',
  },
  promoCards: {
    maxWidth: 1030,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 14,
  },
  promoCard: {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 14,
    minHeight: 132,
    padding: '22px 28px',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    textAlign: 'left',
    color: '#1F2937',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  promoIcon: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: '#84D63D',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  testStack: {
    position: 'relative',
    width: 126,
    height: 94,
    flexShrink: 0,
  },
  gradeCatalogSection: {
    background: '#F4F4F4',
    padding: '0 16px 38px',
  },
  gradeCatalogGrid: {
    maxWidth: 1030,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '30px 24px',
  },
  catalogCard: {
    background: 'white',
    border: '1px solid',
    borderRadius: 4,
    minHeight: 248,
    padding: '20px 20px 18px',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  catalogHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  catalogNumber: {
    width: 44,
    height: 38,
    borderRadius: '0 18px 18px 0',
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: 18,
    marginLeft: -24,
  },
  catalogTitle: {
    color: '#0881C4',
    fontSize: 30,
    fontFamily: FONT_DISPLAY,
    fontWeight: 500,
  },
  catalogDesc: {
    minHeight: 64,
    margin: '0 0 14px',
    color: '#273746',
    fontSize: 14,
    lineHeight: 1.48,
    borderBottom: '1px solid #DADADA',
    paddingBottom: 12,
  },
  catalogRows: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 8,
    fontSize: 14,
    color: '#2D4B57',
  },
  catalogRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 6,
    borderBottom: 'none',
    paddingBottom: 0,
  },
  catalogProgress: {
    marginTop: 'auto',
    paddingTop: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#0C8EC7',
    fontSize: 12,
    fontWeight: 800,
  },
  skillsBand: {
    background: '#DDF6FA',
    padding: '36px 16px',
    textAlign: 'center',
  },
  bandTitle: {
    margin: 0,
    color: '#118BCB',
    fontFamily: FONT_DISPLAY,
    fontSize: 28,
    fontWeight: 800,
  },
  bandSub: {
    margin: '6px auto 20px',
    maxWidth: 620,
    color: '#4B7A86',
    fontSize: 13,
  },
  skillCarousel: {
    maxWidth: 820,
    margin: '0 auto 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  skillTile: {
    width: 82,
    minHeight: 112,
    background: 'white',
    border: '1px solid #A4DCEA',
    borderRadius: 4,
    padding: 8,
    boxShadow: '0 5px 10px rgba(0,98,128,0.12)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: 10,
    color: '#37515A',
  },
  skillTileIcon: {
    width: 46,
    height: 46,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenCta: {
    background: '#0C5CA8',
    color: 'white',
    border: 'none',
    borderRadius: 3,
    padding: '8px 18px',
    fontSize: 12,
    fontWeight: 900,
    cursor: 'pointer',
  },
  supportBand: {
    background: 'linear-gradient(180deg, #0C5CA8 0%, #094987 100%)',
    padding: '32px 16px 38px',
    textAlign: 'center',
    color: 'white',
  },
  supportTitle: {
    margin: 0,
    fontFamily: FONT_DISPLAY,
    fontSize: 24,
    fontWeight: 800,
  },
  supportSub: {
    margin: '6px auto 20px',
    maxWidth: 700,
    fontSize: 13,
    opacity: 0.95,
  },
  supportGrid: {
    maxWidth: 980,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 0,
  },
  supportCard: {
    background: 'white',
    color: '#2D4B57',
    minHeight: 190,
    padding: '20px 16px',
    border: '1px solid #0B8FB9',
  },
  supportIcon: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: '2px solid',
    margin: '0 auto 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportCta: {
    marginTop: 18,
    background: '#F59E0B',
    color: 'white',
    border: 'none',
    borderRadius: 3,
    padding: '8px 22px',
    fontSize: 12,
    fontWeight: 900,
    cursor: 'pointer',
  },
  impactBand: {
    background: 'linear-gradient(180deg, #00A6D6 0%, #0095C6 100%)',
    padding: '28px 16px 42px',
    textAlign: 'center',
    color: 'white',
    borderTop: '1px solid rgba(255,255,255,0.7)',
  },
  impactTitle: {
    margin: '0 auto 22px',
    maxWidth: 720,
    fontFamily: FONT_DISPLAY,
    fontSize: 22,
    fontWeight: 800,
  },
  impactGrid: {
    maxWidth: 820,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 32,
  },
  impactCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  impactAvatar: {
    width: 66,
    height: 66,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FDE68A, #FCA5A5)',
    border: '3px solid white',
    color: '#0B7CB8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactButton: {
    background: '#007FB7',
    color: 'white',
    border: '1px solid white',
    borderRadius: 2,
    padding: '5px 12px',
    fontSize: 11,
    fontWeight: 800,
    cursor: 'pointer',
  },
  homeStats: {
    maxWidth: 760,
    margin: '28px auto 0',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 12,
  },

  // Dashboard preview
  dashPreview: {
    width: '100%', background: 'white', borderRadius: 20, padding: 24,
    border: '1px solid #E5E7EB', cursor: 'pointer', textAlign: 'left',
    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  dashPreviewHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20,
  },
  dashRing: {
    position: 'relative', width: 130, height: 130, margin: '0 auto 20px',
  },
  dashRingLabel: {
    position: 'absolute', inset: 0, display: 'flex',
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  },
  dashStats: { display: 'flex', flexDirection: 'column', gap: 10 },
  dashStatRow: {
    display: 'flex', justifyContent: 'space-between',
    paddingBottom: 8, borderBottom: '1px dashed #E5E7EB',
  },
  dashCTA: {
    marginTop: 12, padding: '10px 14px', borderRadius: 10,
    background: 'linear-gradient(135deg, #DBEAFE, #E0F2FE)',
    color: '#0C5CA8', fontWeight: 700, fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },

  // Section header
  sectionHeader: { marginBottom: 20 },
  sectionTitle: {
    fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 800,
    margin: 0, color: '#1F2937', letterSpacing: '-0.02em',
  },
  sectionSub: { fontSize: 15, color: '#6B7280', margin: '4px 0 0' },

  // Grade grid
  gradeGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 16,
  },
  gradeCard: {
    position: 'relative', overflow: 'hidden',
    background: 'white', borderRadius: 18, padding: 20,
    border: '1px solid #E5E7EB', cursor: 'pointer', textAlign: 'left',
    transition: 'transform 0.2s, box-shadow 0.2s',
    minHeight: 140,
  },
  gradeEmoji: {
    width: 50, height: 50, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26,
  },
  gradeLabel: {
    marginTop: 14, fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 800, color: '#1F2937',
  },
  gradeMeta: { fontSize: 12, color: '#6B7280', fontWeight: 500, marginTop: 4 },
  gradeAccent: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4 },

  // Subjects
  subjectGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },
  subjectCard: {
    padding: 24, borderRadius: 18, textAlign: 'left',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  bigSubjectCard: {
    padding: 24, borderRadius: 18, textAlign: 'left',
    border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  subjectIcon: {
    width: 48, height: 48, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  subjectTitle: {
    fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 800,
    margin: '14px 0 4px', color: '#1F2937',
  },
  subjectTag: { fontSize: 13, color: '#6B7280', margin: 0 },
  subjectStats: {
    display: 'flex', gap: 16, marginTop: 14, fontSize: 13, color: '#374151',
  },
  miniProgressBar: {
    height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 4,
    marginTop: 12, overflow: 'hidden',
  },
  miniProgressFill: { height: '100%', borderRadius: 4, transition: 'width 0.4s' },
  subjectCTA: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 13, fontWeight: 700, marginTop: 12,
  },

  // Motivational strip
  motivStrip: {
    marginTop: 56, padding: 24, borderRadius: 20,
    background: 'linear-gradient(135deg, #fffbe5 0%, #ffeef5 100%)',
    border: '1px solid #FEE440',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
  },
  motivItem: { display: 'flex', alignItems: 'center', gap: 14 },
  motivLabel: { fontWeight: 800, fontSize: 15, color: '#1F2937' },
  motivSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  // Grade screen
  gradeHeader: {
    color: 'white', padding: 32, borderRadius: 24,
    display: 'flex', alignItems: 'center', gap: 24,
    marginBottom: 32, marginTop: 16,
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
  },
  gradeHeaderEmoji: { fontSize: 64 },
  gradeHeaderTitle: { fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 900, margin: '4px 0', letterSpacing: '-0.02em' },
  gradeHeaderSub: { fontSize: 16, opacity: 0.9, margin: 0 },

  // Subject screen
  subjectBanner: {
    padding: 24, borderRadius: 20, border: '2px solid',
    display: 'flex', alignItems: 'center', gap: 20,
    marginTop: 16, marginBottom: 24,
  },
  subjectBannerTitle: { fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 900, margin: '4px 0' },
  subjectBannerSub: { fontSize: 14, color: '#6B7280', margin: 0 },

  grade8MathPage: {
    maxWidth: 1220,
    margin: '0 auto',
    padding: '16px 24px 42px',
    background: 'white',
  },
  grade8TopTabs: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    borderTop: '1px solid #D1D5DB',
    background: '#F3F4F6',
    margin: '-16px -24px 24px',
    paddingLeft: 48,
    overflowX: 'auto',
  },
  grade8Tab: {
    padding: '11px 18px',
    color: '#0088D2',
    fontSize: 14,
    whiteSpace: 'nowrap',
  },
  grade8TabActive: {
    padding: '11px 24px',
    color: 'white',
    background: '#3DB2FF',
    fontSize: 14,
    fontWeight: 800,
    clipPath: 'polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)',
    whiteSpace: 'nowrap',
  },
  grade8Header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 24,
    alignItems: 'flex-start',
    marginBottom: 26,
  },
  grade8Title: {
    margin: 0,
    fontFamily: FONT_DISPLAY,
    fontSize: 48,
    fontWeight: 500,
    color: '#E6B400',
  },
  grade8Intro: {
    maxWidth: 790,
    margin: '10px 0 20px',
    fontSize: 14,
    lineHeight: 1.45,
    color: '#374151',
  },
  grade8Switch: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    margin: 0,
    color: '#374151',
    fontSize: 14,
  },
  grade8Stats: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  grade8StatPill: {
    minWidth: 126,
    minHeight: 52,
    border: '1.5px solid #E6B400',
    borderRadius: 999,
    color: '#E6B400',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '8px 14px',
    fontSize: 12,
    fontWeight: 700,
  },
  grade8SkillColumns: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    columnGap: 52,
    rowGap: 28,
  },
  grade8Group: {
    minWidth: 0,
    breakInside: 'avoid',
  },
  grade8GroupTitle: {
    margin: '0 0 8px',
    fontFamily: FONT_BODY,
    fontSize: 20,
    lineHeight: 1.2,
    color: '#169000',
  },
  grade8SkillList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },
  grade8SkillItem: {
    minWidth: 0,
  },
  grade8SkillLink: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '22px 1fr auto auto',
    alignItems: 'start',
    gap: 6,
    background: 'transparent',
    border: 'none',
    padding: 0,
    textAlign: 'left',
    color: '#315800',
    fontSize: 14,
    lineHeight: 1.25,
    cursor: 'pointer',
  },
  grade8Icons: {
    color: '#668A50',
    whiteSpace: 'nowrap',
    fontSize: 12,
  },
  grade8Mastery: {
    color: '#0C5CA8',
    fontSize: 11,
    whiteSpace: 'nowrap',
  },

  skillList: { display: 'flex', flexDirection: 'column', gap: 12 },
  skillCard: {
    background: 'white', borderRadius: 16, padding: 20,
    border: '1px solid #E5E7EB', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 20,
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  skillNumber: {
    width: 44, height: 44, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 800, fontSize: 18,
    flexShrink: 0,
  },
  skillTitle: { fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 800, margin: 0, color: '#1F2937' },
  skillDesc: { fontSize: 13, color: '#6B7280', margin: '4px 0 0' },
  skillMeta: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  masteryPill: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', borderRadius: 999,
    border: '1.5px solid', fontSize: 11, fontWeight: 700,
    background: 'white',
  },
  skillMetaDot: { color: '#D1D5DB' },
  skillMetaText: { fontSize: 12, color: '#6B7280' },
  skillRight: { display: 'flex', alignItems: 'center', gap: 12 },
  skillMasteryRing: { position: 'relative', width: 48, height: 48 },
  skillRingLabel: {
    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 800, color: '#1F2937',
  },

  // Skill intro
  skillIntro: {
    background: 'white', borderRadius: 24, padding: '48px 32px',
    textAlign: 'center', maxWidth: 720, margin: '24px auto 0',
    boxShadow: '0 12px 32px rgba(0,0,0,0.04)',
    border: '1px solid #E5E7EB',
  },
  skillIntroIcon: {
    width: 72, height: 72, borderRadius: 20, margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },
  skillIntroTitle: {
    fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 900,
    margin: '20px 0 8px', letterSpacing: '-0.02em',
  },
  skillIntroDesc: { fontSize: 16, color: '#6B7280', margin: '0 auto', maxWidth: 480 },
  explainBox: {
    marginTop: 32, padding: 20, borderRadius: 14,
    background: '#FFFBEB', border: '1px solid #FDE68A', textAlign: 'left',
  },
  explainHead: { display: 'flex', alignItems: 'center', gap: 8, color: '#92400E', marginBottom: 8 },
  explainText: { margin: 0, fontSize: 15, color: '#374151', lineHeight: 1.6 },
  skillMetaRow: {
    display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, flexWrap: 'wrap',
  },
  skillMetaItem: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 14, color: '#374151', fontWeight: 600,
  },

  // Practice
  practiceWrap: { maxWidth: 720, margin: '24px auto 0' },
  practiceHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16, padding: '0 4px',
  },
  practiceProgressBar: { display: 'flex', gap: 6 },
  progressDot: {
    width: 12, height: 12, borderRadius: '50%',
    transition: 'all 0.3s', flexShrink: 0,
  },
  practiceCounter: { fontSize: 13, fontWeight: 700, color: '#6B7280' },

  questionCard: {
    background: 'white', borderRadius: 20, padding: 32,
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
    animation: 'slideUp 0.3s ease',
  },
  questionMeta: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  diffBadge: {
    padding: '4px 10px', borderRadius: 999,
    color: 'white', fontSize: 11, fontWeight: 800, letterSpacing: 0.5,
  },
  questionType: { fontSize: 12, color: '#6B7280', fontWeight: 600 },
  questionPrompt: {
    fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 800,
    color: '#1F2937', margin: '0 0 24px', lineHeight: 1.3,
  },

  mcqGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 },
  mcqBtn: {
    padding: '16px 20px', borderRadius: 12, border: '2px solid',
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 12,
    transition: 'all 0.15s', fontFamily: FONT_BODY,
  },

  fillInput: {
    width: '100%', padding: '16px 20px', borderRadius: 12,
    border: '2px solid', fontSize: 18, fontWeight: 600,
    fontFamily: FONT_BODY, transition: 'all 0.15s',
  },

  hintBox: {
    marginTop: 16, padding: '12px 16px', borderRadius: 10,
    background: '#FFFBEB', border: '1px solid #FDE68A',
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 14, color: '#92400E', fontWeight: 500,
  },

  feedback: {
    marginTop: 16, padding: 16, borderRadius: 12,
    border: '2px solid', animation: 'pop 0.3s ease',
  },
  feedbackTop: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  feedbackIcon: {
    width: 36, height: 36, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  solutionBox: {
    marginTop: 12, paddingTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)',
  },

  questionActions: {
    marginTop: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
  },
  hintBtn: {
    padding: '10px 16px', borderRadius: 10, border: '2px solid #FDE68A',
    background: '#FFFBEB', color: '#92400E', fontWeight: 700, fontSize: 14,
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
  },

  // Results
  resultWrap: {
    maxWidth: 600, margin: '40px auto 0',
    background: 'white', borderRadius: 24, padding: 48,
    textAlign: 'center', border: '1px solid #E5E7EB',
    boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
    animation: 'pop 0.5s ease',
  },
  resultEmoji: { fontSize: 80 },
  resultTitle: { fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 900, margin: '8px 0', letterSpacing: '-0.02em' },
  resultSub: { fontSize: 16, color: '#6B7280', margin: 0 },
  resultStats: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 24, marginTop: 32, padding: '24px 0',
    borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB',
  },
  resultStat: { textAlign: 'center' },
  resultStatValue: { fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 900, lineHeight: 1 },
  resultStatLabel: { fontSize: 12, color: '#6B7280', fontWeight: 600, marginTop: 6, letterSpacing: 0.5, textTransform: 'uppercase' },
  resultDivider: { width: 1, height: 50, background: '#E5E7EB' },
  resultActions: { display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' },
  secondaryBtn: {
    padding: '12px 20px', borderRadius: 12,
    background: '#F3F4F6', border: '2px solid #E5E7EB',
    color: '#374151', fontWeight: 700, fontSize: 14,
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
  },

  // Dashboard
  dashHero: { marginTop: 16 },
  dashHeroTitle: { fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 900, margin: '6px 0', letterSpacing: '-0.025em' },
  dashHeroSub: { fontSize: 16, color: '#6B7280', margin: 0 },
  dashHeroStats: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 12, marginTop: 28,
  },
  bigStat: {
    display: 'flex', alignItems: 'center', gap: 14,
    background: 'white', padding: 18, borderRadius: 16,
    border: '1px solid #E5E7EB',
  },
  bigStatIcon: {
    width: 48, height: 48, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  bigStatValue: { fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 900, color: '#1F2937', lineHeight: 1 },
  bigStatLabel: { fontSize: 12, color: '#6B7280', fontWeight: 600, marginTop: 4 },

  subjectAnalytics: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16,
  },
  subjectAnalyticCard: {
    background: 'white', padding: 20, borderRadius: 16,
    border: '1px solid #E5E7EB',
  },
  analyticHead: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
  analyticIcon: {
    width: 36, height: 36, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  analyticBar: {
    height: 10, background: '#F3F4F6', borderRadius: 6, overflow: 'hidden',
  },
  analyticBarFill: { height: '100%', borderRadius: 6, transition: 'width 0.6s' },
  analyticPct: { marginTop: 8, fontSize: 12, fontWeight: 700, color: '#374151' },

  recList: { display: 'flex', flexDirection: 'column', gap: 10 },
  recCard: {
    background: 'white', padding: 18, borderRadius: 14,
    border: '1px solid #E5E7EB', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 16,
    transition: 'all 0.15s',
  },
  recIcon: {
    width: 44, height: 44, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  recReason: { fontSize: 11, fontWeight: 700, color: '#0891B2', textTransform: 'uppercase', letterSpacing: 0.5 },
  recTitle: { fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 800, color: '#1F2937', marginTop: 2 },
  recMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },

  recentGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12,
  },
  recentCard: {
    background: 'white', padding: 18, borderRadius: 14,
    border: '1px solid #E5E7EB', cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.15s',
  },
  recentIcon: {
    width: 36, height: 36, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  recentTitle: { fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 800, margin: '12px 0 8px' },
  recentBar: {
    height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden', marginBottom: 8,
  },
  recentMeta: { display: 'flex', justifyContent: 'space-between', fontSize: 12 },

  // Badges
  badgesHero: {
    display: 'flex', alignItems: 'center', gap: 20,
    background: 'linear-gradient(135deg, #FFF8E1 0%, #FCE4EC 100%)',
    padding: 32, borderRadius: 24, marginTop: 16, marginBottom: 32,
    border: '2px solid #FFE082',
  },
  badgeGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16,
  },
  badgeCard: {
    padding: 24, borderRadius: 18, border: '2px solid', textAlign: 'center',
    transition: 'transform 0.15s',
  },
  badgeEmoji: { fontSize: 56, marginBottom: 8 },
  badgeName: { fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 800, margin: '8px 0 4px' },
  badgeDesc: { fontSize: 12, color: '#6B7280', margin: 0, minHeight: 32 },
  badgeEarned: {
    marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', borderRadius: 999,
    background: '#059669', color: 'white', fontSize: 11, fontWeight: 700,
  },
  badgeLocked: {
    marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', borderRadius: 999,
    background: '#E5E7EB', color: '#6B7280', fontSize: 11, fontWeight: 700,
  },

  // Empty state
  emptyState: {
    padding: 32, textAlign: 'center', borderRadius: 14,
    background: '#F9FAFB', border: '1px dashed #E5E7EB',
    color: '#6B7280', fontSize: 14,
  },

  // Sign In page
  siHero: {
    position: 'relative',
    background: 'linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 55%, #0C5CA8 100%)',
    minHeight: 320,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '44px 24px 80px',
    overflow: 'hidden',
  },
  siDeco: {
    position: 'absolute',
    lineHeight: 1,
    pointerEvents: 'none',
    userSelect: 'none',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))',
  },
  siCard: {
    background: 'white',
    borderRadius: 10,
    padding: '28px 32px 0',
    width: 340,
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    position: 'relative',
    zIndex: 2,
    flexShrink: 0,
  },
  siCardTitle: {
    textAlign: 'center',
    color: '#0C5CA8',
    fontFamily: FONT_DISPLAY,
    fontSize: 26,
    fontWeight: 700,
    margin: '0 0 22px',
  },
  siField: { marginBottom: 14 },
  siFieldRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  siLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: 500,
  },
  siForgot: {
    fontSize: 12,
    color: '#F59E0B',
    cursor: 'pointer',
    fontWeight: 500,
  },
  siInput: {
    width: '100%',
    height: 34,
    border: '1px solid #D1D5DB',
    borderRadius: 3,
    padding: '0 9px',
    fontSize: 14,
    fontFamily: FONT_BODY,
    outline: 'none',
    display: 'block',
    boxSizing: 'border-box',
  },
  siBtnRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    margin: '18px 0 0',
  },
  siBtn: {
    background: '#0C5CA8',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    padding: '10px 28px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 0 #094987',
  },
  siRemember: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    color: '#374151',
    cursor: 'pointer',
    fontWeight: 500,
  },
  siLaunchCard: {
    borderTop: '1px dashed #E5E7EB',
    margin: '18px -32px 0',
    padding: '13px 32px',
    textAlign: 'center',
    fontSize: 13,
    color: '#0070CC',
    cursor: 'pointer',
    borderRadius: '0 0 10px 10px',
    background: '#FAFAFA',
  },
  siHills: {
    position: 'absolute',
    bottom: 0,
    left: '-10%',
    right: '-10%',
    height: 56,
    background: '#094987',
    borderRadius: '60% 60% 0 0',
  },
  siMemberSection: {
    background: 'white',
    padding: '52px 24px 48px',
    textAlign: 'center',
  },
  siNotMemberTitle: {
    color: '#0C5CA8',
    fontFamily: FONT_DISPLAY,
    fontSize: 30,
    fontWeight: 700,
    margin: '0 0 6px',
  },
  siNotMemberSub: {
    color: '#6B7280',
    fontSize: 14,
    margin: '0 0 36px',
  },
  siFeatureList: {
    maxWidth: 520,
    margin: '0 auto 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  siFeatureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    textAlign: 'left',
  },
  siFeatureIcon: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  siFeatureTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 5,
    fontFamily: FONT_DISPLAY,
  },
  siFeatureText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 1.55,
  },
  siCelebrate: {
    fontSize: 14,
    color: '#374151',
    margin: '0 0 22px',
  },
  siJoinBtn: {
    background: '#F59E0B',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    padding: '13px 44px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 0 #B45309',
  },
  siFooter: {
    background: '#F9FAFB',
    borderTop: '1px solid #E5E7EB',
    padding: '18px 24px',
    textAlign: 'center',
  },
  siFooterLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    marginBottom: 8,
    fontSize: 12,
  },
  siFooterLink: {
    color: '#0070CC',
    cursor: 'pointer',
    fontSize: 12,
  },
  siFooterCopy: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  // Skill plan cards (exact-skills band)
  skillPlanGrid: {
    maxWidth: 700,
    margin: '0 auto 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
    gap: 10,
  },
  skillPlanCard: {
    border: 'none',
    borderRadius: 6,
    padding: '14px 8px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
    transition: 'transform 0.15s',
  },
  skillPlanIcon: { fontSize: 26, lineHeight: 1 },
  skillPlanLabel: {
    fontSize: 10,
    fontWeight: 800,
    color: 'white',
    textAlign: 'center',
    lineHeight: 1.2,
  },

  // New impact card layout
  impactIconCircle: {
    width: 72, height: 72, borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    border: '3px solid rgba(255,255,255,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 30, marginBottom: 4,
  },
  impactCardTitle: {
    fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 800,
    color: 'white', margin: '0 0 6px',
  },
  impactCardText: {
    fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 1.5,
    margin: '0 0 12px',
  },

  // Testimonials
  testimonialsBand: {
    background: 'white',
    padding: '48px 24px',
    borderTop: '1px solid #E5E7EB',
  },
  testimonialsInner: {
    maxWidth: 720,
    margin: '0 auto',
    textAlign: 'center',
  },
  testimonialStars: {
    fontSize: 22,
    color: '#FFB627',
    letterSpacing: 3,
    marginBottom: 16,
  },
  testimonialQuote: {
    fontFamily: FONT_DISPLAY,
    fontSize: 22,
    fontWeight: 500,
    color: '#1F2937',
    lineHeight: 1.6,
    margin: '0 0 16px',
    fontStyle: 'italic',
  },
  testimonialAttrib: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: 600,
    margin: '0 0 16px',
  },
  testimonialLink: {
    background: 'transparent',
    border: '1.5px solid #0C5CA8',
    borderRadius: 4,
    color: '#0C5CA8',
    fontSize: 13,
    fontWeight: 700,
    padding: '7px 18px',
    cursor: 'pointer',
  },

  // Footer (IXL-style multi-column)
  footerInner: {
    maxWidth: 1120,
    margin: '0 auto',
    padding: '0 24px',
  },
  footerTop: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: 48,
    padding: '40px 0 28px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minWidth: 160,
  },
  footerLogo: {
    height: 34,
    borderRadius: 7,
    display: 'inline-flex',
    alignItems: 'stretch',
    overflow: 'hidden',
    width: 'fit-content',
    boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
  },
  footerTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    margin: 0,
    lineHeight: 1.5,
    maxWidth: 180,
  },
  footerJoinBtn: {
    background: '#F59E0B',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  footerCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 24,
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  footerColHead: {
    color: 'white',
    fontSize: 13,
    fontWeight: 800,
    margin: '0 0 4px',
    letterSpacing: 0.3,
  },
  footerLink: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    cursor: 'pointer',
    lineHeight: 1.4,
    transition: 'color 0.15s',
  },
  footerBottom: {
    padding: '16px 0',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },

  // Learning Catalog
  lcSubjectBar: {
    background: 'white',
    borderBottom: '1px solid #E5E7EB',
    overflowX: 'auto',
  },
  lcBarInner: {
    maxWidth: 1120,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
  },
  lcSubjectTab: {
    background: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    padding: '14px 18px',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    whiteSpace: 'nowrap',
    fontFamily: FONT_BODY,
    transition: 'color 0.15s, border-color 0.15s',
  },
  lcSubjectTabDisabled: {
    color: '#9CA3AF',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  lcViewBar: {
    background: 'white',
    borderBottom: '1px solid #E5E7EB',
    fontSize: 13,
  },
  lcViewLabel: {
    fontWeight: 700,
    color: '#374151',
    marginRight: 8,
    fontSize: 13,
  },
  lcViewTab: {
    background: 'transparent',
    border: 'none',
    padding: '5px 16px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
    cursor: 'pointer',
    fontFamily: FONT_BODY,
  },
  lcViewTabActive: {
    background: '#E8F5E9',
    color: '#2D8E00',
    fontWeight: 700,
  },
  lcHero: {
    position: 'relative',
    minHeight: 210,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 180px 80px',
  },
  lcHeroDecoLeft: {
    position: 'absolute',
    left: '6%',
    bottom: 30,
    fontSize: 88,
    lineHeight: 1,
    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.10))',
  },
  lcHeroCenter: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    maxWidth: 600,
  },
  lcHeroTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 42,
    fontWeight: 700,
    margin: '0 0 12px',
    lineHeight: 1.1,
  },
  lcHeroDesc: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.65,
    margin: 0,
  },
  lcHeroDecoRight: {
    position: 'absolute',
    right: '7%',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    alignItems: 'center',
  },
  lcDecoItem: {
    fontSize: 38,
    display: 'block',
    animation: 'float 3s ease-in-out infinite',
  },
  lcHeroHill: {
    position: 'absolute',
    bottom: 0,
    left: '-10%',
    right: '-10%',
    height: 48,
    borderRadius: '60% 60% 0 0',
    opacity: 0.25,
  },
  lcGradeList: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '28px 24px 48px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  lcGradeRow: {
    background: 'white',
    borderRadius: 12,
    border: '1px solid #E5E7EB',
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    transition: 'box-shadow 0.15s, transform 0.15s',
  },
  lcGradeLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    flex: 1,
    minWidth: 0,
  },
  lcGradeBadge: {
    width: 52,
    height: 52,
    borderRadius: 10,
    flexShrink: 0,
    color: 'white',
    fontFamily: FONT_DISPLAY,
    fontSize: 22,
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lcGradeInfo: {
    flex: 1,
    minWidth: 0,
  },
  lcGradeName: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827',
    fontFamily: FONT_DISPLAY,
    marginBottom: 4,
  },
  lcGradeSkills: {
    fontSize: 12.5,
    color: '#4B5563',
    lineHeight: 1.55,
    overflow: 'hidden',
  },
  lcIncludesLabel: {
    fontWeight: 600,
    color: '#374151',
  },
  lcSkillLink: {
    color: '#0070CC',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  lcSkillSep: {
    color: '#D1D5DB',
  },
  lcSeeAllBtn: {
    flexShrink: 0,
    border: 'none',
    borderRadius: 999,
    padding: '10px 22px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
    whiteSpace: 'nowrap',
    transition: 'opacity 0.15s',
  },

  // Misc
  backBtn: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: '#6B7280', fontSize: 14, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '6px 0', marginBottom: 8,
  },

  toastContainer: {
    position: 'fixed', bottom: 24, right: 24, zIndex: 100,
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  toast: {
    color: 'white', padding: '12px 20px', borderRadius: 12,
    fontWeight: 700, fontSize: 14,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    animation: 'slideUp 0.3s ease',
  },

  footer: {
    background: '#0F1A2B',
    borderTop: 'none',
  },
};
