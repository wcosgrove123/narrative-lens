# Visual Narrative - Technical Architecture

## Overview
Visual Narrative is a client-side web application built with React, TypeScript, and IndexedDB. This document describes the technical architecture, data flow, and key implementation patterns.

## Technology Stack

### Core Framework
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing

### Image Processing
- **heic2any** - HEIC/HEIF to JPEG conversion (iPhone photos)
- **FileReader API** - Image file reading
- **Base64 encoding** - Image storage in IndexedDB

### State Management
- **Zustand** - Lightweight state management
  - `storyStore` - Manages story CRUD operations
  - `photoStore` - Manages photo CRUD operations

### Data Persistence
- **Dexie.js** - IndexedDB wrapper
  - Local-first architecture
  - No backend required for MVP
  - Photos stored as base64 data URLs

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Headless accessible components
- **Lucide React** - Icon library

### Future Integrations (v1.1+)
- **@dnd-kit** - Drag and drop (v1.0 completion)
- **Ente Photo Editor SDK** - Image editing (v1.1)

## Project Structure

```
narrative-lens-app/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   └── CreateStoryDialog.tsx
│   ├── pages/               # Route-level components
│   │   ├── Library.tsx      # Story dashboard
│   │   └── Editor.tsx       # Story editor
│   ├── stores/              # Zustand state stores
│   │   ├── storyStore.ts
│   │   └── photoStore.ts
│   ├── db/                  # Database layer
│   │   └── index.ts         # Dexie setup
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── utils/               # Helper functions
│   ├── App.tsx              # Router setup
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Data Model

### TypeScript Interfaces

```typescript
interface Story {
  id: string;              // UUID
  title: string;
  coverImageId?: string;   // Reference to Photo.id
  createdAt: Date;
  updatedAt: Date;
  mainIntro?: string;      // v1.1
  isPublished?: boolean;   // v1.2
}

interface Photo {
  id: string;              // UUID
  storyId: string;         // FK to Story.id
  originalPath: string;    // Original filename
  thumbnailDataUrl?: string; // Base64 thumbnail
  fullDataUrl?: string;    // Base64 full image
  sequence: number;        // Order in story
  createdAt: Date;
  caption?: string;        // v1.1
  edits?: PhotoEdits;      // v1.1
  filterApplied?: string;  // v1.1
}

interface PhotoEdits {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
}
```

### Database Schema (Dexie/IndexedDB)

```typescript
stories: 'id, title, createdAt, updatedAt'
photos: 'id, storyId, sequence, createdAt'
```

## Application Flow

### Routing

- `/` - Library page (story dashboard)
- `/editor/:storyId` - Story editor

### Story Creation Flow

1. User clicks "New Story" button
2. `CreateStoryDialog` modal opens
3. User enters title and clicks "Create"
4. `storyStore.createStory()` called
   - Generates UUID
   - Creates Story object with timestamps
   - Saves to IndexedDB via Dexie
5. User navigated to `/editor/:storyId`

### Photo Import Flow

1. User clicks "Import Photos" in Editor
2. Hidden file input triggered
3. User selects image files
4. For each file:
   - Read as base64 data URL via FileReader
   - Create Photo object with UUID
   - Save to IndexedDB via `photoStore.addPhoto()`
5. Photo thumbnails appear in Photo Bin

### Data Persistence

- **Automatic**: All operations immediately persist to IndexedDB
- **No explicit "save"**: Changes are saved as they happen
- **Story title**: Auto-saves on blur
- **Photos**: Saved immediately on import
- **Sequence**: Will auto-save on drag-and-drop (pending)

## State Management Pattern

### Zustand Store Structure

```typescript
const useStoryStore = create<StoryStore>((set, get) => ({
  // State
  stories: [],

  // Actions
  loadStories: async () => {
    const stories = await db.stories.toArray();
    set({ stories });
  },

  createStory: async (title) => {
    const story = { id: uuidv4(), title, ... };
    await db.stories.add(story);
    await get().loadStories();
    return story;
  },

  // ... more actions
}));
```

### Store Usage in Components

```typescript
// In React component
const { stories, loadStories, createStory } = useStoryStore();

useEffect(() => {
  loadStories(); // Load on mount
}, [loadStories]);
```

## Key Design Decisions

### 1. Base64 Image Storage
**Decision**: Store images as base64 data URLs in IndexedDB
**Rationale**:
- No file system access needed (works in browser)
- Simplifies persistence (everything in one database)
- Avoids CORS issues
- No server required

**Tradeoffs**:
- Larger storage footprint (~33% overhead)
- Could hit browser storage limits with many large images
- Future: Consider image compression with `browser-image-compression`

### 2. Local-First Architecture
**Decision**: All data stored locally in browser
**Rationale**:
- Faster development (no backend needed)
- Better privacy (data stays on device)
- Works offline by default
- Aligns with MVP scope

**Future**: Can add cloud sync in v1.2+ without major refactor

### 3. Zustand for State Management
**Decision**: Zustand instead of Redux or Context
**Rationale**:
- Lighter weight (< 1KB)
- Simpler API
- Good TypeScript support
- Sufficient for single-user app

### 4. Radix UI for Accessible Components
**Decision**: Use Radix for modals/dialogs
**Rationale**:
- Accessibility built-in
- Unstyled (full design control)
- Robust focus management
- Portal support for modals

### 5. Tailwind CSS with Inline Styles
**Decision**: Tailwind utilities + inline styles for brand colors
**Rationale**:
- Tailwind v4 breaking changes
- Faster to use inline styles than configure v4 theming
- Still get Tailwind benefits for layout/spacing
- Can migrate to proper Tailwind config later

## Performance Considerations

### Current Optimizations
- Images loaded lazily in photo bin grid
- Stories sorted by `updatedAt` in memory (fast)
- IndexedDB indexed on common query fields

### Future Optimizations (if needed)
- Implement true thumbnail generation (resize images)
- Use `browser-image-compression` library
- Virtual scrolling for large photo grids
- Lazy load story cards in library
- Debounce title auto-save

## Error Handling

### Current Approach
- Database errors logged to console
- Failed photo imports silently skipped (file type validation)
- Missing story shows "Story not found" message

### Future Improvements
- Toast notifications for errors
- Retry logic for failed operations
- Data validation with Zod
- Error boundary components

## Testing Strategy (Future)

### Unit Tests
- Store actions (create, update, delete)
- Type guards and validation
- Utility functions

### Integration Tests
- Full user flows (create story → import photos → sequence)
- Database operations
- Router navigation

### E2E Tests
- Critical user paths
- Cross-browser compatibility

## Build & Deployment

### Development
```bash
npm run dev    # Start Vite dev server
```

### Production Build
```bash
npm run build  # Outputs to dist/
npm run preview # Preview production build
```

### Deployment Options
- **Static hosting**: Vercel, Netlify, GitHub Pages
- **PWA**: Can be installed as desktop app
- **Electron** (future): Wrap for true desktop app

## Security Considerations

### Current
- No authentication (single-user, local)
- Data stored in browser (private to device)
- No external API calls

### Future (v1.2+)
- When adding public portfolios:
  - Sanitize user input
  - CSP headers
  - Consider rate limiting on backend

## Browser Compatibility

### Targets
- Chrome/Edge 90+
- Firefox 90+
- Safari 14+

### Required Features
- IndexedDB
- FileReader API
- ES2020 JavaScript
- CSS Grid & Flexbox

## Future Architecture Changes

### v1.1 Additions
- Image editing pipeline
- Caption storage in database
- Filter application logic

### v1.2 Additions
- Backend API (Node.js/Express or Firebase)
- Public portfolio generation
- URL routing for public stories
- Optional: Cloud storage for published stories

### Potential Optimizations
- Service worker for offline support
- IndexedDB migration system
- Data export/import functionality
- Browser storage quota management
