# LearnQuest Architecture at a Glance

## 🏗️ Visual Project Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PUBLIC HTML (index.html)                      │
│              Serves the React app in #root div                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   React App (App.jsx)                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              State Management (useState)                │   │
│  │  • view, user, progress, stats, selectedGrade, etc.   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Header (Sticky, persists on all pages)        │   │
│  │  • Navigation buttons, user profile, quick stats      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Main Content (Route-based View)              │   │
│  │  • Rendered based on 'view' state                      │   │
│  │  • Different screen per route                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Toast Notifications (Floating)                 │   │
│  │  • Success, error, info messages                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │    Footer (Sticky bottom, persists on all pages)      │   │
│  │  • Branding and links                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

                    Route Navigation
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼─────┐     ┌──────▼────┐    ┌─────▼────┐
   │ Login     │     │ Home      │    │ Dashboard│
   │ Screen    │     │ Screen    │    │ Screen   │
   │ ⬇️        │     │ ⬇️         │    │          │
   │ Grade     │     │ Subject   │    │          │
   │ Screen    │     │ Screen    │    │          │
   │ ⬇️        │     │ ⬇️         │    │          │
   │ Skill     │     │ Skill     │    │          │
   │ Screen    │     │ Screen    │    │          │
   └───────────┘     └───────────┘    └──────────┘
```

---

## 📊 Component Organization

```
┌─ COMPONENTS (React Components)
│
├─ COMMON (Reusable components)
│  ├─ Header
│  │  ├─ Logo & branding
│  │  ├─ StatChip (points, streak, badges)
│  │  └─ Navigation buttons
│  │
│  ├─ Footer
│  │  └─ Branding text
│  │
│  ├─ BackBtn
│  │  └─ Navigation back button
│  │
│  └─ SectionHeader
│     ├─ Title
│     ├─ Subtitle
│     └─ Optional icon
│
└─ SCREENS (Full-page components)
   ├─ LoginScreen ✅
   │  ├─ Name input field
   │  ├─ Role selector (4 buttons)
   │  └─ Start button
   │
   ├─ HomeScreen 🚧
   │  ├─ Welcome section
   │  ├─ Grade selector grid
   │  ├─ Subject overview
   │  └─ Motivational section
   │
   ├─ GradeScreen 🚧
   │  ├─ Grade header (color-coded)
   │  └─ Subject cards
   │
   ├─ SubjectScreen 🚧
   │  ├─ Subject banner
   │  └─ Skills list
   │
   ├─ SkillScreen 🚧
   │  ├─ Intro phase
   │  ├─ Practice phase
   │  └─ Result phase
   │
   ├─ Dashboard 🚧
   │  ├─ Overall stats
   │  ├─ Subject breakdown
   │  ├─ Recommendations
   │  └─ Recent activity
   │
   └─ BadgesScreen 🚧
      └─ Badge grid (earned & locked)
```

---

## 💾 Data Layer Architecture

```
┌─ DATA (Static data definitions)
│
├─ grades.js
│  └─ 14 grade objects
│     ├─ id: 'prek', 'k', '1'...'12'
│     ├─ label: 'Pre-K', 'Kindergarten', etc.
│     ├─ color: hexadecimal
│     └─ emoji: for visual appeal
│
├─ subjects.js
│  └─ 4 subject objects
│     ├─ math, ela, science, social
│     ├─ icon: lucide-react icon
│     ├─ color: theme color
│     └─ tagline: description
│
├─ skills.js
│  └─ 20+ skill objects
│     ├─ id, subject, grade
│     ├─ title, description
│     ├─ explanation (for learning)
│     └─ questions: [
│           ├─ id, type, difficulty
│           ├─ prompt (question text)
│           ├─ options (for MCQ)
│           ├─ answer (correct answer)
│           └─ hint (help text)
│        ]
│
└─ badges.js
   └─ 9 badge objects
      ├─ id, name, icon
      ├─ description
      └─ check function (unlock condition)
```

---

## 🔧 Utilities Architecture

```
┌─ UTILS (Helper functions)
│
├─ helpers.js
│  ├─ pickAdaptiveQuestion()
│  │  └─ Selects next question based on performance
│  │
│  ├─ calcMastery()
│  │  └─ Calculates 0-100 mastery score
│  │
│  ├─ masteryLabel()
│  │  └─ Returns label, color, icon for mastery level
│  │
│  ├─ difficultyLabel()
│  │  └─ 'Easy', 'Medium', 'Hard'
│  │
│  ├─ difficultyColor()
│  │  └─ Color for difficulty level
│  │
│  └─ randomCheer()
│     └─ Random congratulatory message
│
├─ adaptive.js (🚧 To implement)
│  └─ Advanced adaptive difficulty logic
│
└─ validation.js (🚧 To implement)
   └─ Input validation functions
```

---

## 🎨 Styling Architecture

```
┌─ STYLES
│
└─ global.js
   ├─ Fonts
   │  ├─ FONT_BODY: 'Plus Jakarta Sans'
   │  └─ FONT_DISPLAY: 'Fraunces'
   │
   ├─ Global CSS (via globalStyles string)
   │  ├─ Keyframe animations (float, slideUp, pop)
   │  ├─ Hover effects
   │  ├─ Focus states
   │  ├─ Responsive breakpoints
   │  └─ Media queries
   │
   └─ baseStyles object
      ├─ app, main, container
      ├─ header, headerInner, logo
      ├─ primaryBtn, secondaryBtn, iconBtn
      ├─ card, footer
      └─ ... (50+ style objects)
```

---

## 🔄 State Flow

```
User Action
    │
    ▼
State Update (setState)
    │
    ▼
Component Re-renders
    │
    ▼
Props passed to children
    │
    ▼
Child components update
    │
    ▼
UI reflects changes
    │
    ▼
User sees result
```

---

## 📱 Responsive Breakpoints

```
Mobile           Tablet           Desktop
< 768px         768px-1024px     > 1024px

┌──────┐        ┌────────┐      ┌──────────────┐
│      │        │        │      │              │
│ Col1 │        │ Col1   │      │ Col1 │ Col2  │
│      │        │        │      │              │
├──────┤        ├────────┤      ├──────┼───────┤
│      │        │ Col2   │      │ Col3 │ Col4  │
│ Col2 │        │        │      │              │
│      │        ├────────┤      └──────────────┘
└──────┘        │ Col3   │
               │        │
               └────────┘
```

---

## 🎮 Game Mechanics Flow

```
User Answers Question
        │
        ├─ Correct? ✅
        │  │
        │  ├─ Points = 5 + (difficulty × 3)
        │  ├─ Add to correct count
        │  ├─ Set streak = streak + 1
        │  └─ Show success feedback
        │
        └─ Incorrect? ❌
           │
           ├─ Points = 1 (participation)
           ├─ Reset streak = 0
           ├─ Show correct answer + explanation
           └─ Show hint

        ▼

Adaptive Engine
        │
        ├─ Recent correct rate < 34%? → Easier (difficulty 1)
        ├─ Recent correct rate 34-75%? → Medium (difficulty 2)
        └─ Recent correct rate > 75%? → Harder (difficulty 3)

        ▼

Update Progress
        │
        ├─ Skill: { attempts++, correct += if_right }
        ├─ Stats: { points+=, totalAnswered++, etc. }
        └─ Mastery = (accuracy × 0.7) + (volume × 0.3)

        ▼

Check Badges
        │
        └─ If earned → Show notification + unlock
```

---

## 📊 Data Persistence

**Current (Demo Mode)**
- All data in component state (useState)
- Lost on page reload
- Perfect for testing

**Future (Backend Mode)**
- Send progress to API
- Store in database
- Sync across devices

---

## 🔐 Security Considerations

Current (Demo):
- ✅ No sensitive data exposed
- ✅ No authentication needed
- ✅ No backend calls

For Production:
- 🚧 Add JWT authentication
- 🚧 Hash passwords on backend
- 🚧 Validate all inputs
- 🚧 Use HTTPS only
- 🚧 Rate limit API calls

---

## ⚡ Performance Optimization

Implemented:
- ✅ Inline styles (no CSS parsing delay)
- ✅ Lightweight dependencies (Lucide only)
- ✅ Efficient state management
- ✅ No unnecessary re-renders

Opportunities:
- 🚧 React.memo for components
- 🚧 useCallback for functions
- 🚧 useMemo for calculations
- 🚧 Code splitting (lazy loading)
- 🚧 Service workers (offline support)

---

## 🔌 Integration Points

For Backend:
```javascript
// API Layer Needed
POST /api/auth/login          // Login user
POST /api/progress            // Save progress
GET  /api/progress/:userId    // Load progress
GET  /api/skills              // Get skill questions
GET  /api/leaderboard         // Get rankings

// Environment Config
REACT_APP_API_URL=...
REACT_APP_AUTH_TOKEN=...
```

---

## 📚 File Size Reference

| File | Purpose | Size |
|------|---------|------|
| package.json | Dependencies | ~500 bytes |
| index.html | HTML entry | ~1 KB |
| index.js | React entry | ~1 KB |
| App.jsx | Main component | ~8 KB |
| Layout.jsx | Common components | ~5 KB |
| LoginScreen.jsx | Login page | ~5 KB |
| skills.js | All questions | ~150 KB |
| helpers.js | Utilities | ~3 KB |
| global.js | Styles | ~10 KB |
| **Total** | **All source files** | **~183 KB** |

---

## 🎯 Next Implementation Priority

1. **High Priority** (Blocks basic functionality)
   - [ ] HomeScreen
   - [ ] SkillScreen (most complex)
   - [ ] QuestionCard

2. **Medium Priority** (Improves experience)
   - [ ] Dashboard
   - [ ] Responsive design
   - [ ] Animations

3. **Low Priority** (Nice to have)
   - [ ] BadgesScreen polish
   - [ ] Advanced analytics
   - [ ] Social features

---

## 💡 Architecture Benefits

✅ **Modularity** - Easy to maintain and update  
✅ **Scalability** - Ready to add features  
✅ **Reusability** - Components used multiple times  
✅ **Testability** - Each component can be tested independently  
✅ **Performance** - Optimized for speed  
✅ **Documentation** - Well-documented for team  
✅ **Flexibility** - Easy to switch backend/frontend  

---

**Ready to build? Start with QUICK_START.md!**
