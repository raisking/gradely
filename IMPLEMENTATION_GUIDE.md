# Gradely Setup & Implementation Guide

This guide helps you complete the implementation of Gradely with all necessary components and screens.

## Phase 1: Core Setup (Already Done)

✅ Folder structure created  
✅ Data files organized (grades, subjects, skills, badges)  
✅ Utility functions set up  
✅ Global styles configured  
✅ Entry point (index.js) created  
✅ Layout components created  
✅ LoginScreen implemented  

## Phase 2: Implement Remaining Screens

### 1. HomeScreen.jsx
**Path:** `src/components/screens/HomeScreen.jsx`

Purpose: Main dashboard showing:
- Welcome message with user name
- Grade selector grid
- Subject overview cards
- Motivational section with features
- Hero stats (points, accuracy, streak)

Key features to include:
- Grade cards showing progress (X/Y started)
- Subject cards with icons
- CTA buttons to start learning
- Dashboard preview widget

### 2. GradeScreen.jsx
**Path:** `src/components/screens/GradeScreen.jsx`

Purpose: Show subjects available for selected grade

Shows:
- Grade header with emoji and color
- Subject cards with mastery progress
- Skill counts and completion percentages
- Mini progress bars

### 3. SubjectScreen.jsx
**Path:** `src/components/screens/SubjectScreen.jsx`

Purpose: List all skills in a subject for a grade

Displays:
- Subject banner with icon
- Skill list with mastery rings
- Difficulty indicators
- Attempt counts and accuracy %
- Mastery level badges

### 4. SkillScreen.jsx
**Path:** `src/components/screens/SkillScreen.jsx`

Purpose: Main practice/learning interface

Phases:
1. **Intro Phase** - Show skill description and explanation
2. **Practice Phase** - Display questions with adaptive difficulty
   - Multiple choice questions with instant feedback
   - Fill-in-the-blank with type-to-answer
   - Hint system
   - Progress bar showing question count
3. **Result Phase** - Show session summary with accuracy

Features:
- Adaptive difficulty based on performance
- Hints available for each question
- Instant feedback with explanations
- Points calculation
- Session statistics

### 5. Dashboard.jsx
**Path:** `src/components/screens/Dashboard.jsx`

Purpose: User learning analytics and progress

Shows:
- Overall statistics (questions answered, accuracy, etc.)
- Per-subject performance breakdown
- Skill recommendations (weak areas + untried)
- Recent activity with progress bars
- Subject analytics with mastery breakdown

### 6. BadgesScreen.jsx
**Path:** `src/components/screens/BadgesScreen.jsx`

Purpose: Achievement gallery

Shows:
- All badges in grid layout
- Earned badges with full color
- Locked badges grayed out
- Badge descriptions
- Total progress indicator

### 7. Shared Components

**ProgressRing.jsx** - Circular progress indicator
```javascript
- Props: percentage, size, stroke, color
- Displays SVG circular progress
- Used in mastery displays
```

**QuestionCard.jsx** - Question display
```javascript
- Props: question, onAnswer, showFeedback, feedback
- Handles MCQ and fill-type rendering
- Shows hints and feedback
```

**SkillCard.jsx** - Skill card display
```javascript
- Props: skill, mastery, progress
- Shows title, description, mastery ring
- Click handler for selecting skill
```

## Phase 3: Implementation Checklist

### Screen Components
- [ ] HomeScreen.jsx (Grade selector + stats)
- [ ] GradeScreen.jsx (Subject selector)
- [ ] SubjectScreen.jsx (Skills list)
- [ ] SkillScreen.jsx (Practice interface)
- [ ] Dashboard.jsx (Analytics)
- [ ] BadgesScreen.jsx (Achievements)

### Shared Components
- [ ] ProgressRing.jsx
- [ ] QuestionCard.jsx
- [ ] SkillCard.jsx
- [ ] ResultsScreen.jsx
- [ ] RecommendationCard.jsx

### Styling
- [ ] components.css (Component-specific styles)
- [ ] Responsive design (mobile breakpoints)
- [ ] Animations (transitions, hover effects)

### Utilities
- [ ] adaptive.js (Adaptive question selection)
- [ ] validation.js (Input validation)
- [ ] constants.js (Magic numbers, config)

## Phase 4: Integration Steps

### Step 1: Update App.jsx
Add route handling for all screens:

```javascript
import HomeScreen from './components/screens/HomeScreen';
import GradeScreen from './components/screens/GradeScreen';
// ... other imports

// In JSX main section:
{view === 'home' && <HomeScreen ... />}
{view === 'grade' && <GradeScreen ... />}
// ... other routes
```

### Step 2: Wire Up State Props
Each screen needs these props:
```javascript
// Example for HomeScreen
<HomeScreen
  user={user}
  stats={stats}
  progress={progress}
  onSelectGrade={handleSelectGrade}
  onDashboard={() => setView('dashboard')}
/>
```

### Step 3: Implement Navigation
```javascript
// In App.jsx
const handleSelectGrade = (grade) => {
  setSelectedGrade(grade);
  setView('grade');
};

const handleSelectSubject = (subject) => {
  setSelectedSubject(subject);
  setView('subject');
};

// ... etc for other navigation
```

### Step 4: Connect Answer Recording
```javascript
<SkillScreen
  skill={activeSkill}
  progress={progress[activeSkill.id]}
  onAnswer={recordAnswer}
  onComplete={(msg) => pushToast(msg)}
/>
```

## Implementation Tips

### Creating a Screen Component

Template:
```javascript
import React, { useState } from 'react';
import { BackBtn, SectionHeader } from '../common/Layout';
import { baseStyles } from '../../styles/global';

export function YourScreen({ grade, onBack, onSelectSkill, progress }) {
  const [state, setState] = useState(null);
  const styles = baseStyles;

  return (
    <div style={styles.container}>
      <BackBtn onClick={onBack} label="Back" />
      
      {/* Your content here */}
      
    </div>
  );
}
```

### Using Styles
```javascript
// Combine multiple styles
style={{...styles.card, ...styles.subjectCard}}

// Conditional styling
style={{
  ...styles.button,
  background: isActive ? '#7DCE82' : 'white',
  color: isActive ? 'white' : '#1F2937'
}}
```

### Working with Data
```javascript
import { SKILLS, getSkillsFor } from '../../data/skills';
import { GRADES } from '../../data/grades';
import { SUBJECTS } from '../../data/subjects';

// Get skills for a grade/subject
const skills = getSkillsFor('3', 'math');

// Calculate mastery
const mastery = calcMastery(progress[skillId]);
```

## Testing Locally

1. Start dev server:
```bash
cd Gradely
npm start
```

2. Open http://localhost:3000

3. Login with any name and role

4. Navigate through screens

5. Answer questions to see:
   - Progress tracking
   - Badge unlocking
   - Mastery calculation
   - Adaptive difficulty

## Debugging Tips

### Check Console for Errors
```javascript
console.log('Progress:', progress);
console.log('Stats:', stats);
console.log('Skills:', SKILLS);
```

### Verify Data Structure
```javascript
// Check if skills loaded
console.log(Object.keys(SKILLS).length); // Should be > 0

// Check grades
console.log(GRADES.length); // Should be 14
```

### Test Calculations
```javascript
// Test mastery calculation
const testProgress = { attempts: 10, correct: 8, history: [] };
console.log(calcMastery(testProgress)); // Should output 0-100
```

## Performance Optimization

### Code Splitting (Optional)
```javascript
const HomeScreen = React.lazy(() => import('./HomeScreen'));
const Dashboard = React.lazy(() => import('./Dashboard'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <HomeScreen />
</Suspense>
```

### Memoization
```javascript
import { useMemo } from 'react';

// Memoize expensive calculations
const recommendations = useMemo(() => {
  return Object.values(SKILLS)
    .filter(skill => calcMastery(progress[skill.id]) > 0)
    .slice(0, 3);
}, [progress]);
```

## Deployment

### Build for Production
```bash
npm run build
```

Creates optimized build in `build/` folder

### Deploy Options
- **Vercel** (easiest for React)
- **Netlify** (static hosting)
- **GitHub Pages** (free)
- **AWS S3 + CloudFront**
- **Docker container** (any cloud provider)

### Adding Backend
Create `src/services/api.js`:
```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const fetchSkills = async () => {
  const res = await fetch(`${API_BASE}/api/skills`);
  return res.json();
};

export const saveProgress = async (userId, progress) => {
  const res = await fetch(`${API_BASE}/api/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, progress })
  });
  return res.json();
};
```

## Next Steps

1. **Implement HomeScreen** - Start with the main screen
2. **Add GradeScreen** - Grade selection
3. **Build SkillScreen** - Most complex, practice interface
4. **Connect Dashboard** - Analytics
5. **Polish UI** - Add animations, responsive design
6. **Add Backend** - Connect to API (optional)
7. **Deploy** - Choose hosting and launch

## Support

For questions or issues:
1. Check existing data in `src/data/`
2. Review component examples in `src/components/`
3. Look at helpers in `src/utils/`
4. Check browser console for errors
5. Verify React DevTools for state issues
