# LearnQuest Quick Start Guide

Get LearnQuest up and running in 5 minutes!

## Prerequisites
- Node.js 14+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)

## Quick Start

### 1. Navigate to Project
```bash
cd c:\Users\raipr\Documents\prai\learnquest
```

### 2. Install Dependencies
```bash
npm install
```

This installs:
- React 18
- React DOM
- Lucide React (icons)
- React Scripts (build tools)

### 3. Start Development Server
```bash
npm start
```

The app opens automatically at `http://localhost:3000`

### 4. Use the App
1. Click "Start Learning"
2. Enter your name
3. Select your role (Student, Parent, Teacher, Admin)
4. Explore grades and subjects
5. Practice skills and earn points!

## File Overview

```
learnquest/
├── public/index.html          → Main HTML page
├── src/
│   ├── components/            → React components
│   ├── data/                  → Skills, grades, subjects data
│   ├── styles/                → Styling
│   ├── utils/                 → Helper functions
│   ├── App.jsx                → Main component
│   └── index.js               → Entry point
└── package.json               → Dependencies
```

## Make Your First Change

### Edit HomeScreen
1. Create `src/components/screens/HomeScreen.jsx`
2. Copy template:

```javascript
import React from 'react';
import { baseStyles } from '../../styles/global';
import { BackBtn } from '../common/Layout';

export function HomeScreen({ onSelectGrade, onDashboard, user, stats, progress }) {
  const styles = baseStyles;

  return (
    <div style={styles.container}>
      <h1>Welcome back, {user?.name}!</h1>
      <p>Choose a grade to start practicing.</p>
      
      {/* Add your content here */}
    </div>
  );
}
```

3. Import in App.jsx:
```javascript
import { HomeScreen } from './components/screens/HomeScreen';
```

4. Add to App routes:
```javascript
{view === 'home' && (
  <HomeScreen 
    onSelectGrade={handleSelectGrade}
    onDashboard={() => setView('dashboard')}
    user={user}
    stats={stats}
    progress={progress}
  />
)}
```

5. Save and see changes instantly!

## Common Tasks

### Add a New Skill
Edit `src/data/skills.js`:

```javascript
'math-3-new-skill': {
  id: 'math-3-new-skill',
  subject: 'math',
  grade: '3',
  title: 'Your Skill Title',
  description: 'Brief description',
  explanation: 'Detailed explanation for students',
  questions: [
    {
      id: 'q1',
      type: 'mcq',
      difficulty: 1,
      prompt: 'Question text here?',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      answer: 'Option 1',
      hint: 'Hint text'
    }
  ]
}
```

### Change Colors
Edit `src/styles/global.js`:
- Update FONT_BODY and FONT_DISPLAY
- Modify colors in baseStyles

### Add an Icon
The app uses Lucide React icons. Find them at: https://lucide.dev

```javascript
import { ChefHat, Zap, Award } from 'lucide-react';

// Use in JSX
<ChefHat size={24} color="#7DCE82" />
```

## Troubleshooting

### npm: command not found
- Install Node.js from nodejs.org
- Restart your terminal

### Port 3000 already in use
```bash
npm start -- --port 3001
```

### Module not found errors
```bash
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

### Styles not applying
- Check the path to styles is correct
- Verify baseStyles object has the property
- Ensure inline styles use camelCase (backgroundColor not background-color)

### Components not rendering
- Check imports are correct
- Verify component is exported
- Look at browser console for errors

## Learning Resources

### React Documentation
- https://react.dev
- Official React hooks guide
- Component patterns

### CSS-in-JS Styling
- Using inline styles in React
- Inline style best practices
- Responsive design with CSS

### Lucide Icons
- https://lucide.dev
- Icon search and documentation
- Import and usage guide

## Next Steps

1. **Implement all screens** (see IMPLEMENTATION_GUIDE.md)
2. **Add more questions** to existing skills
3. **Create new skills** for advanced topics
4. **Customize styling** to match your brand
5. **Deploy** to the web (Vercel, Netlify, etc.)
6. **Add a backend** for user accounts and data persistence

## Deployment (Vercel - Easiest)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial LearnQuest setup"
git push origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Select your repository
4. Click "Deploy"

Done! Your app is live!

## Pro Tips

✨ Use React DevTools browser extension to debug state  
✨ Use `console.log()` liberally during development  
✨ Test on mobile using Chrome DevTools (Ctrl+Shift+I, Ctrl+Shift+M)  
✨ Use `.env` files for API secrets (not shown in git)  
✨ Keep components small and focused  

## Getting Help

1. **Check error messages** in browser console (F12)
2. **Search Stack Overflow** for React errors
3. **Read official docs** for React, Lucide, etc.
4. **Debug with DevTools** to inspect state and props
5. **Ask in React communities** (Reddit r/reactjs, Discord)

---

🎉 **You're all set! Happy coding!**

For detailed implementation info, see IMPLEMENTATION_GUIDE.md  
For full documentation, see README.md
