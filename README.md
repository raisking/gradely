<<<<<<< HEAD
# learnquest
=======
# LearnQuest - React Project Structure

A comprehensive educational platform for Pre-K to Grade 12 students, built with React. This project was restructured from a single monolithic component into a modular, scalable architecture.

## Project Directory Structure

```
learnquest/
├── public/
│   └── index.html                    # Main HTML file
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── Layout.jsx            # Header, Footer, common UI components
│   │   ├── screens/
│   │   │   ├── LoginScreen.jsx       # Login/signup screen
│   │   │   ├── HomeScreen.jsx        # Home dashboard with grade selector
│   │   │   ├── GradeScreen.jsx       # Grade-level subject selector
│   │   │   ├── SubjectScreen.jsx     # Subject skills list
│   │   │   ├── SkillScreen.jsx       # Skill practice interface
│   │   │   ├── Dashboard.jsx         # User learning dashboard
│   │   │   └── BadgesScreen.jsx      # Achievements/badges display
│   │   └── shared/
│   │       ├── ProgressRing.jsx      # Circular progress indicator
│   │       ├── QuestionCard.jsx      # Question display component
│   │       └── SkillCard.jsx         # Skill card component
│   ├── data/
│   │   ├── grades.js                 # Grade level definitions
│   │   ├── subjects.js               # Subject definitions
│   │   ├── skills.js                 # Complete skills catalog
│   │   └── badges.js                 # Badge definitions & checks
│   ├── styles/
│   │   ├── global.js                 # Global styles and theme
│   │   ├── components.css            # Component-specific styles
│   │   └── theme.js                  # Color palette and theme config
│   ├── utils/
│   │   ├── helpers.js                # Helper functions (calcMastery, etc.)
│   │   ├── adaptive.js               # Adaptive difficulty engine
│   │   └── validation.js             # Input validation functions
│   ├── App.jsx                       # Main app component
│   └── index.js                      # React entry point
├── package.json                      # Dependencies and scripts
├── .gitignore                        # Git ignore file
└── README.md                         # This file
```

## Key Files Explained

### Data Layer (`src/data/`)

- **grades.js** - Defines all 14 grade levels (Pre-K through Grade 12) with colors and emojis
- **subjects.js** - Defines 4 core subjects (Math, ELA, Science, Social Studies)
- **skills.js** - Complete catalog of all skills with questions, organized by grade and subject
- **badges.js** - Achievement definitions and unlock conditions

### Components

#### Common Components (`src/components/common/`)
- `Header` - Top navigation with user profile and quick stats
- `Footer` - Footer with branding
- `BackBtn` - Navigation back button
- `SectionHeader` - Reusable section header component

#### Screen Components (`src/components/screens/`)
Each screen represents a major view of the app:

1. **LoginScreen** - User authentication and role selection
2. **HomeScreen** - Main dashboard with grade selection and stats
3. **GradeScreen** - Shows subjects available for a grade
4. **SubjectScreen** - Lists all skills for a subject
5. **SkillScreen** - Main practice interface with adaptive questions
6. **Dashboard** - User progress analytics and recommendations
7. **BadgesScreen** - Achievement gallery

### Utilities (`src/utils/`)

- **helpers.js** - Core functions:
  - `calcMastery()` - Calculate skill mastery (0-100)
  - `masteryLabel()` - Get mastery level label and color
  - `difficultyColor()` - Get color for difficulty
  - `randomCheer()` - Get random congratulatory message

- **adaptive.js** - Adaptive learning engine
  - `pickAdaptiveQuestion()` - Select next question based on performance

## How It Works

### 1. Data Flow
```
User Login → Home Screen → Grade Selection → Subject Selection → Skills List → Practice → Results
```

### 2. State Management
The app uses React hooks for state:
- **view** - Current screen (login, home, grade, subject, skill, etc.)
- **user** - Logged-in user info
- **progress** - Tracks attempts/correct for each skill
- **stats** - Global stats (points, streak, badges, etc.)
- **selectedGrade/Subject/Skill** - Navigation state

### 3. Adaptive Difficulty
Questions are selected based on:
- Recent performance (last 3 answers)
- Correct rate (determines if increase/decrease difficulty)
- Already-asked questions (never repeat same question)

### 4. Scoring System
- Easy correct: +5 points
- Medium correct: +8 points
- Hard correct: +11 points
- Wrong attempt: +1 point (for trying)

### 5. Mastery Calculation
```
Mastery Score = (Accuracy × 0.7) + (Volume × 0.3)
- Accuracy: percentage of correct answers
- Volume: attempts (10+ attempts = full credit)
- Mastery ≥ 85% = Skill Mastered
```

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

The app will open at `http://localhost:3000`

### Demo Mode
The app runs in demo mode (no backend required):
- All progress saves in browser memory during session
- Reloading page resets progress
- To persist data, add localStorage or a backend API

## Customization

### Adding New Skills

Edit `src/data/skills.js`:

```javascript
'math-3-fractions': {
  id: 'math-3-fractions',
  subject: 'math',
  grade: '3',
  title: 'Introduction to Fractions',
  description: 'Learn basic fraction concepts',
  explanation: 'A fraction is a part of a whole...',
  questions: [
    {
      id: 'q1',
      type: 'mcq', // or 'fill'
      difficulty: 1,
      prompt: 'What is 1/2 of 8?',
      options: ['2', '4', '8', '16'],
      answer: '4',
      hint: 'Half of 8 is...'
    },
    // ... more questions
  ]
}
```

### Modifying Styling

Global styles are in `src/styles/global.js`:
- `FONT_BODY` - Main body font
- `FONT_DISPLAY` - Display/heading font
- `baseStyles` - All styled objects
- `globalStyles` - CSS animations and responsive rules

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Lazy load screens using React.lazy() (optional)
- Memoize expensive calculations with useMemo()
- Use production build for deployment

## Adding a Backend

To connect to a real backend:

1. Create API module: `src/services/api.js`
2. Add endpoints for:
   - User authentication
   - Progress sync
   - Question bank
   - Leaderboards

3. Update state management to use API calls

Example structure:
```javascript
// src/services/api.js
export const loginUser = async (name, role) => {
  const response = await fetch('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ name, role })
  });
  return response.json();
};
```

## Troubleshooting

### Skills not appearing?
- Check `src/data/skills.js` for correct grade/subject IDs
- Verify GRADES and SUBJECTS match skill definitions

### Questions not showing?
- Ensure questions array in skill has valid structure
- Check that type is either 'mcq' or 'fill'

### Styling issues?
- Verify fonts are loading (check browser Network tab)
- Check that globalStyles are injected in App.jsx

## License

MIT License - See LICENSE file for details

## Contributing

Pull requests are welcome! Please ensure:
1. Code follows existing patterns
2. New components are in appropriate directories
3. Data files are well-formatted and documented
4. Tests pass before submitting

## Future Enhancements

- [ ] User profiles and accounts
- [ ] Real-time leaderboards
- [ ] Teacher dashboard for class management
- [ ] Mobile app version
- [ ] Offline support with Service Workers
- [ ] Text-to-speech for questions
- [ ] Dark mode support
- [ ] Multi-language support
>>>>>>> 19d756ce (initial push)
