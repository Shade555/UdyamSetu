# UdyamSetu Frontend - Getting Started

## Prerequisites

- Node.js 16+ and npm
- Code editor (VS Code recommended)

## Installation

```bash
cd frontend
npm install
```

This installs:
- React 19
- Vite (dev server & build tool)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)
- React Router (navigation)
- Supabase client (for future backend integration)

## Running the Dev Server

```bash
npm run dev
```

The app will open at **http://localhost:5174**

(Port 5173 may be in use, so Vite automatically tries 5174, 5175, etc.)

## Building for Production

```bash
npm run build
```

Outputs to `dist/` folder.

## Project Structure

```
src/
├── pages/
│   ├── Home.tsx                    # Landing page with journey visualization
│   ├── LanguageSelector.tsx        # English / हिन्दी / मराठी
│   ├── NeedSelector.tsx            # Business / Education / Other
│   ├── RequirementInput.tsx        # Natural language input with mock AI
│   ├── ProfileConfirmation.tsx     # Review extracted profile
│   ├── EligibilityCheck.tsx        # Rule checks with animations
│   ├── SchemeRecommendation.tsx    # Scheme cards with match reasons
│   ├── Finance.tsx                 # EMI calculator with sliders
│   ├── Documents.tsx               # Checklist with progress ring
│   ├── Partner.tsx                 # Partner selection with routing
│   └── OfficialAction.tsx          # Final summary & official CTA
├── components/
│   ├── JourneyProgress.tsx         # Persistent progress bar
│   └── OfflineIndicator.tsx        # Connectivity status
├── context/
│   └── JourneyContext.tsx          # Global state (language, profile, etc.)
├── index.css                       # Tailwind + custom utilities
└── App.tsx                         # Router setup
```

## Design System

### Colors
- **Background**: `neutral-50` (#fafaf8)
- **Text**: `neutral-900` (#1a1714)
- **Accent**: `accent-600` (#0284c7) - energetic yet trustworthy blue

### Typography
- **Display**: Large headlines (30px - 60px)
- **Body**: Comfortable reading (16px - 18px)
- **Labels**: Small uppercase text (12px - 14px)

### Motion
- **Entrance**: 300-500ms fade-in or slide-up
- **Interactions**: 150-300ms spring animations
- **Transitions**: 600-1000ms for major screen changes
- **Numbers**: Smooth counting animations

All animations respect `prefers-reduced-motion: reduce` for accessibility.

## Key Features

### 1. Journey Visualization
Every page shows progression through: NEED → UNDERSTAND → ELIGIBILITY → SCHEME → FINANCE → DOCUMENTS → PARTNER → ACTION

### 2. Motion-Heavy UI
- Staggered element entrances
- Spring-based button interactions
- Animated progress indicators
- Number counting animations
- SVG path animations

### 3. Minimal but Polished
- Generous whitespace
- Restrained color palette
- Clear typography hierarchy
- Subtle shadows and borders

### 4. Mobile-First
- Touch-friendly buttons (min 48px)
- Large readable text
- Full-width inputs and buttons on mobile
- Bottom-aligned CTAs
- Safe area support for notched phones

## Current Data

Using mock demo scenario:
```javascript
{
  purpose: 'business',
  projectType: 'dairy business',
  requestedAmount: 300000,
  annualIncome: 200000,
  location: 'Maharashtra'
}
```

Scheme demo:
- PMEGP with ₹10L - ₹50L loan range
- Mudra with ₹50K - ₹10L loan range
- Stand-Up India with ₹10L - ₹1Cr range

Partners:
- District Industries Centre (4.2km, authorized, compatible)
- SIDBI Branch (6.1km, authorized, compatible)
- Local Cooperative Bank (2.3km, NOT compatible)

## Next Steps

### For Backend Integration
1. Create FastAPI endpoints in `/backend`
2. Connect Supabase PostgreSQL
3. Replace mock API calls with real endpoints

### Example integration point:
```typescript
// Current (mock):
const mockProfile = { purpose: 'business', ... }

// Future (with backend):
const profile = await fetch('/api/extract-profile', { body: userInput })
  .then(r => r.json())
```

### For Offline Support
1. Implement Service Worker
2. Add IndexedDB caching
3. Queue sync actions on reconnect

### For Internationalization
1. Setup i18n library
2. Translate all strings to Hindi and Marathi
3. Support number/currency formatting per language

## Troubleshooting

### Port already in use?
Vite automatically tries the next available port (5174, 5175, etc.)

### Tailwind styles not showing?
Make sure you have `index.css` imported in `main.tsx`:
```typescript
import './index.css'
```

### Animation feels sluggish?
Check browser performance in DevTools. Ensure GPU acceleration is enabled. Motion animations use `transform` and `opacity` (GPU-friendly).

## Available Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Run oxlint for code quality
npm run preview    # Preview production build locally
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Size

Current bundle (dev):
- Main app: ~400KB (Vite dev mode, unminified)
- Dependencies: ~500MB in node_modules

Production build:
- Minified + gzipped: ~150KB estimated

## Performance Tips

- All animations use `transform` and `opacity` (GPU-accelerated)
- Large assets (hero.png) are only 170x179px
- No heavy 3D/WebGL
- Lazy loading ready for code splitting

## Questions?

Refer to:
- Frontend implementation: `frontend/IMPLEMENTATION_STATUS.md`
- Project context: `context.md`
- Progress tracking: `progress.md`
