import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles, Trophy, Flame, Star, Target, BookOpen, Calculator, FlaskConical,
  Globe2, ChevronRight, ChevronLeft, Check, X, Lightbulb, RotateCcw,
  TrendingUp, BarChart3, GraduationCap,
  Heart, Crown, ArrowRight, Brain,
  Lock, CheckCircle2, Circle, Play, Settings, Users, Search, UserCircle
} from 'lucide-react';

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
  math:    { label: 'Math',           icon: Calculator,   color: '#3DB2FF', bg: '#E3F2FD', tagline: 'Numbers, shapes & patterns' },
  ela:     { label: 'ELA',            icon: BookOpen,     color: '#F15BB5', bg: '#FCE4EC', tagline: 'Reading, writing & grammar' },
  science: { label: 'Science',        icon: FlaskConical, color: '#7DCE82', bg: '#E8F5E9', tagline: 'Discover how the world works' },
  social:  { label: 'Social Studies', icon: Globe2,       color: '#FFB627', bg: '#FFF8E1', tagline: 'History, geography & civics' },
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
};

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
  if (m >= 85) return { label: 'Mastery', color: '#7DCE82', icon: Crown };
  if (m >= 60) return { label: 'Proficient', color: '#3DB2FF', icon: Star };
  if (m >= 30) return { label: 'Developing', color: '#FFB627', icon: TrendingUp };
  if (m > 0)   return { label: 'Beginner', color: '#F15BB5', icon: Circle };
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
  const [view, setView] = useState('home'); // home | learning | grade | subject | skill | dashboard | badges
  const [user, setUser] = useState({ name: 'Learner', role: 'student' });
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeSkill, setActiveSkill] = useState(null);

  // Progress is keyed by skillId → { attempts, correct, history, asked }
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState({
    points: 0,
    streak: 1, // simulated daily streak
    bestStreak: 0,
    currentRunStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    masteredSkills: 0,
    subjectsTried: 0,
    earnedBadges: [],
  });

  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const pushToast = useCallback((msg, kind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

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
  const handleRoleChange = (role) => {
    setUser(prev => ({ ...(prev || { name: 'Learner' }), role }));
    const name = user?.name;
    pushToast(`Welcome, ${name || 'Learner'}! 🎉`, 'success');
  };
  const handleLogout = () => {
    setUser({ name: 'Learner', role: 'student' });
    setProgress({});
    setStats({ points: 0, streak: 1, bestStreak: 0, currentRunStreak: 0, totalAnswered: 0, totalCorrect: 0, masteredSkills: 0, subjectsTried: 0, earnedBadges: [] });
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
        onDashboard={() => setView('dashboard')}
        onBadges={() => setView('badges')}
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
                                    stats={stats}
                                    progress={progress}
                                    onPickSkill={(skill) => {
                                      setSelectedGrade(GRADES.find(g => g.id === skill.grade));
                                      setSelectedSubject(skill.subject);
                                      setActiveSkill(skill);
                                      setView('skill');
                                    }}
                                  />}
        {view === 'badges'    && <BadgesScreen stats={stats} onBack={goHome} />}
      </main>

      {/* Toasts */}
      <div style={styles.toastContainer}>
        {toasts.map(t => (
          <div key={t.id} style={{
            ...styles.toast,
            background: t.kind === 'success' ? '#7DCE82' : t.kind === 'error' ? '#FF6B6B' : '#3DB2FF',
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
function Header({ user, view, onHome, onLearning, onDashboard, onBadges, onReset }) {
  const learningViews = new Set(['learning', 'grade', 'subject', 'skill']);
  const navItems = [
    { label: 'Learning',   onClick: onLearning,  active: learningViews.has(view) },
    { label: 'Assessment', onClick: onDashboard, active: view === 'dashboard' },
    { label: 'Analytics',  onClick: onDashboard, active: false },
    { label: 'Takeoff',    onClick: onBadges,    active: view === 'badges', icon: <Sparkles size={15} /> },
    { label: 'Inspiration',onClick: onHome,      active: view === 'home' },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.headerInner}>
        {/* Top row: logo | search | actions */}
        <div style={styles.headerTopRow}>
          <button onClick={onLearning} style={styles.logo}>
            <span style={styles.logoMark}>
              <span style={styles.logoCapSection}>🎓</span>
              <span style={styles.logoWordmark}>Gradely</span>
            </span>
          </button>

          <label style={styles.searchWrap}>
            <span style={styles.searchIcon}><Search size={18} color="white" /></span>
            <input style={styles.searchInput} placeholder="Search topics, skills, and more" />
            <button type="button" style={styles.searchSubmit}><ChevronRight size={22} color="#9CA3AF" /></button>
          </label>

          <div style={styles.headerActions}>
            <button onClick={onDashboard} style={styles.signInBtn}>
              <UserCircle size={17} /> Sign in
            </button>
            <button onClick={onBadges} style={styles.membershipBtn}>Membership</button>
            <button onClick={onReset} style={styles.resetBtn} title="Reset session"><RotateCcw size={14} /></button>
          </div>
        </div>

        {/* Nav row */}
        <nav style={styles.headerNav} aria-label="Primary">
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
              { id: 'student', label: 'Student', icon: GraduationCap, color: '#3DB2FF' },
              { id: 'parent',  label: 'Parent',  icon: Heart, color: '#F15BB5' },
              { id: 'teacher', label: 'Teacher', icon: Users, color: '#7DCE82' },
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
        <FloatingShape style={{ top: '10%', left: '8%', background: '#FF6B9D', size: 80 }} delay={0} />
        <FloatingShape style={{ top: '20%', right: '12%', background: '#3DB2FF', size: 110 }} delay={1.5} />
        <FloatingShape style={{ bottom: '15%', left: '15%', background: '#FFB627', size: 70 }} delay={0.8} />
        <FloatingShape style={{ bottom: '25%', right: '8%', background: '#7DCE82', size: 95 }} delay={2.2} />
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
            <HeroStat value={stats.points} label="Total Points" color="#9B5DE5" />
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
          <Crown size={28} color="#9B5DE5" />
          <div>
            <div style={styles.motivLabel}>Skill Mastery</div>
            <div style={styles.motivSub}>Reach 85%+ to fully master a skill</div>
          </div>
        </div>
        <div style={styles.motivItem}>
          <Brain size={28} color="#3DB2FF" />
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
  const supportCards = [
    { icon: Brain,      title: 'Comprehensive curriculum', text: 'Pre-K through grade 12 skills across math, language arts, science, and social studies.', color: '#00A8E8', link: 'Browse skills ›' },
    { icon: Settings,   title: 'Assessment suite',         text: 'Pinpoint exactly what students know and don\'t know with our adaptive diagnostic tools.', color: '#72B01D', link: 'Explore suite ›' },
    { icon: Target,     title: 'Personalized guidance',    text: 'Gradely\'s adaptive algorithm identifies each learner\'s strengths and fills their gaps.', color: '#7C3AED', link: 'Learn more ›' },
    { icon: TrendingUp, title: 'Actionable analytics',     text: 'Get real-time data and actionable insights to help students reach their full potential.', color: '#F7941D', link: 'Explore analytics ›' },
  ];
  const impactCards = [
    { emoji: '📊', title: 'Proven effective',          text: 'Research consistently shows Gradely practice positively impacts student results.',          btn: 'View our research' },
    { emoji: '🏫', title: 'Flexible for any classroom', text: 'Gradely works for every student across all levels — whether in class or learning at home.',  btn: 'Start their journey' },
    { emoji: '⭐', title: 'Trusted by top teachers',   text: 'With millions of students using Gradely, educators worldwide rely on our platform daily.',    btn: 'Join today' },
  ];
  const skillPlanCards = [
    { label: 'MAP Growth',       icon: '📈', bg: '#4A90D9' },
    { label: 'AP Courses',       icon: '🎓', bg: '#7C3AED' },
    { label: 'SAT Prep',         icon: '📝', bg: '#E53E3E' },
    { label: 'State Standards',  icon: '🏛️', bg: '#2F855A' },
    { label: 'Common Core',      icon: '⭐', bg: '#DD6B20' },
    { label: 'ACT Prep',         icon: '✏️', bg: '#3182CE' },
  ];

  return (
    <>
      {/* ── Promo band ── */}
      <div style={styles.homePromoBand}>
        <div style={styles.promoCards} className="promo-cards">
          <button onClick={() => onSelectGrade(GRADES[8])} style={styles.promoCard}>
            <div style={styles.testStack} className="test-stack">
              <span>ACT</span><span>SAT</span>
            </div>
            <div>
              <strong>Gradely for high school</strong>
              <p>Gradely helps high schoolers create their own path to success.</p>
              <em>Take a look <ChevronRight size={14} /></em>
            </div>
          </button>
          <button onClick={onDashboard} style={styles.promoCard}>
            <div style={styles.testStack} className="test-stack">
              <span>GED</span><span>HiSET</span>
            </div>
            <div>
              <strong>Gradely for independent learners</strong>
              <p>Yes, Gradely is for adults, too!</p>
              <em>Take a look <ChevronRight size={14} /></em>
            </div>
          </button>
        </div>
      </div>

      {/* ── Grade catalog ── */}
      <section style={styles.gradeCatalogSection}>
        <div style={styles.gradeCatalogGrid} className="grade-catalog-grid">
          {GRADES.map((g, index) => (
            <GradeCatalogCard key={g.id} grade={g} index={index} progress={progress} onSelectGrade={onSelectGrade} />
          ))}
          <div style={{ ...styles.catalogCard, cursor: 'default', borderColor: '#FF8C42' }}>
            <div style={styles.catalogHead}>
              <span style={{ ...styles.catalogNumber, background: '#FF8C42', fontSize: 11, width: 48 }}>ES</span>
              <span style={{ ...styles.catalogTitle, color: '#FF8C42' }}>Spanish</span>
            </div>
            <p style={styles.catalogDesc}>Basic Spanish vocabulary, conversation, and grammar skills coming soon.</p>
            <div style={{ ...styles.catalogProgress, color: '#FF8C42', marginTop: 'auto' }}>
              <span>Coming soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Exact skills band ── */}
      <section style={styles.skillsBand}>
        <h2 style={styles.bandTitle}>The exact skills you need.</h2>
        <p style={styles.bandSub}>We've custom-built Gradely skills to perfectly meet each standard within your textbooks, state standards, and assessments.</p>
        <div style={styles.skillPlanGrid}>
          {skillPlanCards.map(card => (
            <button key={card.label} onClick={() => onSelectGrade(GRADES[0])} style={{ ...styles.skillPlanCard, background: card.bg }}>
              <span style={styles.skillPlanIcon}>{card.icon}</span>
              <span style={styles.skillPlanLabel}>{card.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => onSelectGrade(GRADES[0])} style={styles.greenCta}>Find your skill plan!</button>
      </section>

      {/* ── Supports success band ── */}
      <section style={styles.supportBand}>
        <h2 style={styles.supportTitle}>Discover how Gradely supports success for every learner</h2>
        <p style={styles.supportSub}>Gradely gives teachers everything they need to personalize instruction.</p>
        <div style={styles.supportGrid} className="support-grid">
          {supportCards.map(card => <SupportCard key={card.title} card={card} />)}
        </div>
        <button onClick={onDashboard} style={styles.supportCta}>See more</button>
      </section>

      {/* ── Impact band ── */}
      <section style={styles.impactBand}>
        <h2 style={styles.impactTitle}>See the impact Gradely has made on student learning!</h2>
        <div style={styles.impactGrid} className="impact-grid">
          {impactCards.map(card => (
            <div key={card.title} style={styles.impactCard}>
              <div style={styles.impactIconCircle}>{card.emoji}</div>
              <h3 style={styles.impactCardTitle}>{card.title}</h3>
              <p style={styles.impactCardText}>{card.text}</p>
              <button onClick={onDashboard} style={styles.impactButton}>{card.btn}</button>
            </div>
          ))}
        </div>
        <div style={styles.homeStats} className="home-stats">
          <HeroStat value="18M+" label="Students worldwide" color="#118BCB" />
          <HeroStat value="200B+" label="Questions answered" color="#72B01D" />
          <HeroStat value={stats.points || 0} label="Your points" color="#F7941D" />
          <HeroStat value={stats.earnedBadges.length} label="Badges earned" color="#7C3AED" />
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={styles.testimonialsBand}>
        <div style={styles.testimonialsInner}>
          <div style={styles.testimonialStars}>{'★★★★★'}</div>
          <p style={styles.testimonialQuote}>
            "With Gradely, our math confidence has risen a lot of points. We now seem to be{' '}
            <em>comprehending more than just functioning.</em>"
          </p>
          <p style={styles.testimonialAttrib}>— Gradely parent</p>
          <button onClick={onDashboard} style={styles.testimonialLink}>Read more →</button>
        </div>
      </section>
    </>
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

      {/* View By Bar */}
      <div style={styles.lcViewBar}>
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

function LearningCloud({ title, color, lines }) {
  return (
    <div style={{ ...styles.learningCloud, borderColor: color }}>
      <strong style={{ color }}>{title}</strong>
      <span>{lines.join(' • ')}</span>
      <ChevronRight size={28} color={color} style={{ transform: 'rotate(90deg)', marginTop: 4 }} />
    </div>
  );
}

function GradeCatalogCard({ grade, index, progress, onSelectGrade }) {
  const skills = Object.values(SKILLS).filter(s => s.grade === grade.id);
  const started = skills.filter(s => calcMastery(progress[s.id]) > 0).length;
  const subjects = [
    { key: 'math', label: 'Math' },
    { key: 'ela', label: 'Language arts' },
    { key: 'science', label: 'Science' },
    { key: 'social', label: 'Social studies' },
  ];

  return (
    <button
      onClick={() => onSelectGrade(grade)}
      style={{ ...styles.catalogCard, borderColor: grade.color }}
      className="grade-card"
    >
      <div style={styles.catalogHead}>
        <span style={{ ...styles.catalogNumber, background: grade.color }}>{grade.id === 'prek' ? 'P' : grade.id === 'k' ? 'K' : index - 1}</span>
        <span style={{ ...styles.catalogTitle, color: grade.color }}>{grade.label}</span>
      </div>
      <p style={styles.catalogDesc}>
        {skills.length ? skills.slice(0, 2).map(s => s.title.toLowerCase()).join(', ') : 'New learning paths coming soon'}
      </p>
      <div style={styles.catalogRows}>
        {subjects.map(subject => {
          const count = skills.filter(skill => skill.subject === subject.key).length;
          const skillCount = count ? 60 + count * 37 + index * 11 : 65 + index;
          const videoCount = count ? 40 + count * 31 + index * 7 : 0;
          return (
            <div key={subject.key} style={styles.catalogRow}>
              <span>{subject.label}</span>
              <span style={{ color: '#0088D2' }}>{count ? `${skillCount} skills ›   |   ${videoCount} videos ›` : `${skillCount} skills ›`}</span>
            </div>
          );
        })}
      </div>
      <div style={styles.catalogProgress}>
        <span>{started}/{skills.length || 1} started</span>
        <ChevronRight size={14} />
      </div>
    </button>
  );
}

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

function SupportCard({ card }) {
  const Icon = card.icon;
  return (
    <div style={styles.supportCard}>
      <div style={{ ...styles.supportIcon, color: card.color, borderColor: card.color }}>
        <Icon size={24} />
      </div>
      <h3>{card.title}</h3>
      <p>{card.text}</p>
      <span style={{ color: card.color }}>Learn more</span>
    </div>
  );
}

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
          <strong style={{ color: '#7DCE82' }}>{stats.masteredSkills}</strong>
        </div>
        <div style={styles.dashStatRow}>
          <span style={{ color: '#6B7280', fontSize: 13 }}>Best run</span>
          <strong style={{ color: '#9B5DE5' }}>{stats.bestStreak} in a row</strong>
        </div>
      </div>
      <div style={styles.dashCTA}>View full dashboard <ChevronRight size={14} /></div>
    </button>
  );
}

function ProgressRing({ percentage, size = 80, stroke = 10, color = '#7DCE82' }) {
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
              <Brain size={16} color="#9B5DE5" /> <span>Adaptive difficulty</span>
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
                      ? (history[i] ? '#7DCE82' : '#FF6B6B')
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
                        borderColor: isCorrect ? '#7DCE82' : isWrong ? '#FF6B6B' : isSelected ? sub.color : '#E5E7EB',
                        background: isCorrect ? '#F0FDF4' : isWrong ? '#FEF2F2' : isSelected ? `${sub.color}15` : 'white',
                        color: isCorrect ? '#15803D' : isWrong ? '#B91C1C' : '#1F2937',
                      }}
                    >
                      <span style={{ flex: 1, textAlign: 'left' }}>{opt}</span>
                      {isCorrect && <Check size={20} color="#7DCE82" />}
                      {isWrong && <X size={20} color="#FF6B6B" />}
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
                    borderColor: feedback ? (feedback.correct ? '#7DCE82' : '#FF6B6B') : '#E5E7EB',
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
                borderColor: feedback.correct ? '#7DCE82' : '#FF6B6B',
              }}>
                <div style={styles.feedbackTop}>
                  <div style={{
                    ...styles.feedbackIcon,
                    background: feedback.correct ? '#7DCE82' : '#FF6B6B',
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
          <div style={{ ...styles.resultStatValue, color: '#7DCE82' }}>{accuracy}%</div>
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

// ---------- DASHBOARD ----------
function Dashboard({ stats, progress, onPickSkill }) {
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
          <div style={{ fontSize: 13, fontWeight: 600, color: '#9B5DE5', letterSpacing: 1 }}>YOUR LEARNING JOURNEY</div>
          <h1 style={styles.dashHeroTitle}>Dashboard</h1>
          <p style={styles.dashHeroSub}>Track your progress and find what to learn next.</p>
        </div>
        <div style={styles.dashHeroStats}>
          <BigStat icon={<Target size={22}/>} value={stats.totalAnswered} label="Questions answered" color="#3DB2FF" />
          <BigStat icon={<TrendingUp size={22}/>} value={`${accuracy}%`} label="Overall accuracy" color="#7DCE82" />
          <BigStat icon={<Crown size={22}/>} value={stats.masteredSkills} label="Skills mastered" color="#9B5DE5" />
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
          icon={<Brain size={20} color="#9B5DE5" />}
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
        <div style={styles.footerTop}>
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
          <div style={styles.footerCols}>
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
function difficultyColor(d) { return d === 1 ? '#7DCE82' : d === 2 ? '#FFB627' : '#FF6B6B'; }
function randomCheer() {
  const cheers = ['Great job! 🎉', 'Awesome! ⭐', 'You got it! 🌟', 'Excellent! 💯', 'Nailed it! 🚀', 'Brilliant! ✨'];
  return cheers[Math.floor(Math.random() * cheers.length)];
}

// ---------- CSS INJECTION ----------
function StyleInjector() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      * { box-sizing: border-box; }
      body { margin: 0; }

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
      .grade-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      }
      .skill-card:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      }
      .lc-grade-row:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        transform: translateY(-1px);
      }
      input:focus, button:focus-visible {
        outline: 3px solid #9B5DE544;
        outline-offset: 2px;
      }
      button { font-family: inherit; }
      .test-stack span {
        position: absolute;
        top: 8px;
        width: 58px;
        height: 76px;
        border-radius: 6px;
        background: linear-gradient(160deg, #58c9e8, #2563eb);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        box-shadow: 0 8px 14px rgba(0,0,0,0.15);
        border: 3px solid white;
      }
      .test-stack span:first-child {
        left: 10px;
        transform: rotate(-14deg);
      }
      .test-stack span:last-child {
        left: 58px;
        transform: rotate(9deg);
      }
      .promo-cards strong {
        display: block;
        font-family: ${FONT_DISPLAY};
        font-size: 26px;
        color: #00913c;
        margin-bottom: 4px;
        font-weight: 700;
      }
      .promo-cards p {
        margin: 0 0 10px;
        font-size: 14px;
        color: #2f4a36;
      }
      .promo-cards em {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-style: normal;
        color: #008C2E;
        font-weight: 700;
      }

      @media (max-width: 768px) {
        .grade-card { min-width: 0 !important; }
        input { min-width: 0; }
      }
      @media (max-width: 900px) {
        .hero-clouds,
        .grade-catalog-grid,
        .support-grid,
        .impact-grid,
        .home-stats,
        .promo-cards {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
      }
      @media (max-width: 640px) {
        .hero-clouds,
        .grade-catalog-grid,
        .support-grid,
        .impact-grid,
        .home-stats,
        .promo-cards {
          grid-template-columns: 1fr !important;
        }
      }
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
    background: '#F3F7F8',
    color: '#1F2937',
    display: 'flex',
    flexDirection: 'column',
  },
  main: { flex: 1, paddingBottom: 0 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' },

  // Header
  header: {
    background: '#43B900',
    borderBottom: 'none',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
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
    background: '#0D47A1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 9px',
    fontSize: 18,
    borderRight: '2px solid rgba(255,255,255,0.18)',
    flexShrink: 0,
  },
  logoWordmark: {
    background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
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
    background: 'linear-gradient(135deg, #9B5DE5 0%, #F15BB5 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 12px rgba(155,93,229,0.3)',
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
    background: 'linear-gradient(135deg, #FFF8F0 0%, #F5F0FF 50%, #F0F8FF 100%)',
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
    background: 'linear-gradient(135deg, #9B5DE5 0%, #F15BB5 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white',
    boxShadow: '0 8px 24px rgba(155,93,229,0.4)',
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
    background: 'linear-gradient(135deg, #9B5DE5 0%, #F15BB5 100%)',
    color: 'white', border: 'none', borderRadius: 14,
    fontSize: 16, fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 8px 20px rgba(155,93,229,0.3)',
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
    background: 'linear-gradient(135deg, #FEE440 0%, #FFB627 100%)',
    fontSize: 12, fontWeight: 700, color: '#7C2D12',
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: FONT_DISPLAY, fontSize: 'clamp(36px, 5vw, 56px)',
    fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.025em',
    margin: 0, color: '#1F2937',
  },
  heroName: {
    background: 'linear-gradient(135deg, #9B5DE5 0%, #F15BB5 100%)',
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
    background: 'linear-gradient(180deg, #BDF8D7 0%, #D5FBC8 70%, #86DCEF 71%, #68CDE9 82%, #51B454 83%, #51B454 100%)',
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
    background: 'linear-gradient(120deg, transparent 0 22%, #8FD7F4 22% 30%, transparent 30%), linear-gradient(90deg, #D9F3FF 0 22%, transparent 22% 28%, #D9F3FF 28% 50%, transparent 50% 56%, #D9F3FF 56% 78%, transparent 78%)',
    borderBottom: '12px solid #5CAA48',
  },
  heroHills: {
    position: 'absolute',
    left: -90,
    right: -90,
    bottom: -54,
    height: 150,
    background: 'radial-gradient(ellipse at 20% 68%, #50AE45 0 28%, transparent 29%), radial-gradient(ellipse at 66% 74%, #8DCB43 0 31%, transparent 32%), radial-gradient(ellipse at 94% 66%, #83C63E 0 28%, transparent 29%)',
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
    color: '#00A8E8',
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
    color: '#287680',
    fontWeight: 700,
  },
  heroCta: {
    background: '#54B900',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    padding: '10px 24px',
    fontSize: 16,
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 2px 0 #2F9600',
  },
  homePromoBand: {
    background: '#F4F4F4',
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
    background: 'linear-gradient(90deg, #E5FFD4 0%, #D1FDD4 100%)',
    border: '1px solid #7CE087',
    borderRadius: '70px 14px 14px 70px',
    minHeight: 132,
    padding: '18px 30px',
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    textAlign: 'left',
    color: '#008C2E',
    cursor: 'pointer',
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
    background: '#54B900',
    color: 'white',
    border: 'none',
    borderRadius: 3,
    padding: '8px 18px',
    fontSize: 12,
    fontWeight: 900,
    cursor: 'pointer',
  },
  supportBand: {
    background: 'linear-gradient(180deg, #08AEEA 0%, #04A8D7 100%)',
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
    background: '#54B900',
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
    background: 'linear-gradient(135deg, #9B5DE515, #F15BB515)',
    color: '#9B5DE5', fontWeight: 700, fontSize: 13,
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
  recReason: { fontSize: 11, fontWeight: 700, color: '#9B5DE5', textTransform: 'uppercase', letterSpacing: 0.5 },
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
    background: '#7DCE82', color: 'white', fontSize: 11, fontWeight: 700,
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
    border: '1.5px solid #43B900',
    borderRadius: 4,
    color: '#43B900',
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
    background: '#43B900',
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
    display: 'flex',
    alignItems: 'stretch',
    overflowX: 'auto',
    paddingLeft: 24,
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
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    padding: '6px 24px',
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

