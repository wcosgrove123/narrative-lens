# Visual Narrative - Project Context

## Project Overview
Visual Narrative is a desktop/web application for photographers to create sequenced photo essays and stories. The app prioritizes narrative flow over complex editing features, enabling users to arrange, tone-edit, caption, and publish photo stories with a one-click public portfolio feature.

## Target User
**Alex** - A 19-22 year old college student and part-time sports photographer who wants to:
- Tell visual stories (not just photo dumps)
- Build a professional portfolio without coding
- Apply quick tonal edits without complex software like Lightroom

## Core Philosophy
1. **Story First, Tools Second** - Every feature serves storytelling; intentionally simple
2. **Simplicity & Intuition** - Clean UI, minimal instruction needed
3. **Frictionless Sharing** - Easy path from private draft to public portfolio
4. **Single User Focus** - V1 is local-first, no multi-user or accounts

## Project Status
**Current Phase:** MVP Development - In Progress
- ✅ Project scaffolding complete (Vite + React + TypeScript)
- ✅ Core UI components built (Library, Editor, Dialog)
- ✅ IndexedDB storage layer implemented
- ✅ Story creation and management working
- ✅ Photo import functionality complete
- 🔄 Drag-and-drop sequencing (in progress)
- ⏳ Delete story functionality (pending)

## MVP Feature Set (Version 1.0 - Q4 2025)
**Theme:** "Get it working, not perfect"

### Core Features Implementation Status:
1. **Story Library/Dashboard**
   - ✅ Create new named stories (with dialog modal)
   - ✅ Display stories as thumbnail grid with cover images
   - ⏳ Delete stories (pending)
   - ⏳ Set cover image per story (pending)
   - ✅ Welcome screen for first-time users
   - ✅ Navigation to editor

2. **Story Editor** (Two-column layout)
   - ✅ Import multiple photos from local computer (file picker)
   - ✅ Photo bin displaying imported images
   - ⏳ Drag-and-drop sequencing canvas (pending)
   - ⏳ Reorder photos in sequence (pending)
   - ✅ Editable story title in header
   - ✅ Publish toggle (UI only, functionality in v1.2)

3. **Persistence**
   - ✅ Save stories and sequences to IndexedDB
   - ✅ Load stories on app startup
   - ✅ Auto-save story title changes
   - ✅ Photos stored as base64 data URLs

### Explicitly OUT OF SCOPE for V1.0:
- Photo editing/tone adjustments (comes in v1.1)
- Captioning (comes in v1.1)
- Publishing toggle (comes in v1.2)
- Public portfolio pages (comes in v1.2)
- User accounts/authentication
- Cloud sync
- Video/GIF support
- Mobile apps
- E-commerce features

## Future Roadmap

### Version 1.1 (Q1 2026) - "Adding the soul"
- Tone editor with sliders (Brightness, Contrast, Saturation, Sharpness)
- One-click filters (Cinematic, Vibrant, Gritty B&W, Faded Vintage, etc.)
- Caption text fields per photo
- Main title/intro text block
- **Integration:** Use Ente Photo Editor SDK (ente-io/photo-editor-sdk) as base for editing features

### Version 1.2 (Q2 2026) - "Going public"
- "Publish to Portfolio" toggle in editor
- Public portfolio URL generation
- Public portfolio page (grid of published stories)
- User bio and contact info section
- Public story viewer (presentation mode)

## Design System

### Visual Theme
- **Editor/Dashboard:** Dark mode with deep charcoal background (#1A1A1A)
- **Public Portfolio:** Light mode with white/light gray background (#FFFFFF / #F7F7F7)
- **Accent Color:** Vibrant blue (#007AFF)
- **Typography:**
  - App/Editor: Inter (sans-serif) - clean and modern
  - Portfolio: Lora or Playfair Display (serif) for photographer name

### Key UI Patterns
- Story cards with rounded corners and hover effects
- Two-column editor layout (75% canvas, 25% controls)
- Minimal, gallery-like aesthetic with generous white space
- Blue borders/highlights for selected/active elements

## Technical Considerations

### Platform Decision Needed
The PRD mentions "desktop and web application" - need to decide on:
- Electron app for cross-platform desktop
- Web app (React/Vue/Svelte)
- Progressive Web App (PWA)
- Combination approach

### Storage Strategy for MVP
- Local-first architecture (IndexedDB, localStorage, or local files)
- No backend required for v1.0
- Consider future cloud migration path for v1.2+

### Image Handling
- **Supported formats**: JPEG, PNG, GIF, WebP, BMP, SVG, HEIC/HEIF
- **HEIC/HEIF**: Auto-converts to JPEG using heic2any
- **RAW formats**: NOT supported (.cr2, .nef, .arw, etc.)
  - Users must export RAW to JPEG in Lightroom/CaptureOne first
  - Too large and complex for browser processing
- **Storage**: Base64 data URLs in IndexedDB
- **Future optimization**: Thumbnail generation, compression

### Data Model (Conceptual)
```
Story {
  id
  title
  coverImageId
  createdDate
  photos: [
    {
      id
      originalPath
      sequence
      edits (brightness, contrast, etc. - v1.1)
      caption (v1.1)
      filterApplied (v1.1)
    }
  ]
  mainIntro (v1.1)
  isPublished (v1.2)
}
```

## Development Priorities

### Phase 1 Focus (Current)
1. Set up project structure and tooling
2. Build story library UI
3. Implement story CRUD operations
4. Build photo import functionality
5. Implement drag-and-drop sequencing

### Success Criteria for MVP
Alex (target user) can:
- Create a new story
- Import 20 photos from a game
- Drag 8 favorites onto the canvas
- Arrange them in a specific order
- Save the work
- Return later and continue editing

### Technical Stack (Decided)
- [x] Frontend framework: **React 18 + TypeScript**
- [x] Desktop vs web-first: **Web app** (can wrap in Electron later)
- [x] Build tool: **Vite**
- [x] Styling: **Tailwind CSS**
- [x] Local storage: **IndexedDB via Dexie.js**
- [x] Image processing: **browser-image-compression** for optimization
- [x] Drag-and-drop: **@dnd-kit/core + @dnd-kit/sortable**
- [x] State management: **Zustand**
- [x] UI components: **Radix UI** (headless, accessible)
- [x] Icons: **lucide-react**
- [x] Image editing (v1.1): **Ente Photo Editor SDK**

## Important Constraints
- **No premature optimization** - Get v1.0 working first
- **No feature creep** - Stick strictly to roadmap phases
- **Single user only** - Don't build for multi-user until explicitly needed
- **Local-first** - Backend comes later

## Implementation Details

### Current Architecture
```
narrative-lens-app/
├── src/
│   ├── components/
│   │   └── CreateStoryDialog.tsx    # Radix UI dialog for story creation
│   ├── pages/
│   │   ├── Library.tsx              # Main dashboard with story grid
│   │   └── Editor.tsx               # Two-column story editor
│   ├── stores/
│   │   ├── storyStore.ts            # Zustand store for stories
│   │   └── photoStore.ts            # Zustand store for photos
│   ├── db/
│   │   └── index.ts                 # Dexie.js IndexedDB setup
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   └── App.tsx                      # React Router setup
```

### Key Implementation Decisions
1. **Storage**: Photos stored as base64 data URLs in IndexedDB (no file system access needed)
2. **State Management**: Zustand stores with async operations for database interactions
3. **Routing**: React Router with `/` for library and `/editor/:storyId` for editor
4. **Styling**: Tailwind utilities + inline styles for brand colors (due to v4 compatibility)
5. **File Upload**: Hidden input + ref pattern for native file picker experience

### Database Schema (Dexie)
```typescript
stories: 'id, title, createdAt, updatedAt'
photos: 'id, storyId, sequence, createdAt'
```

## References
- **PRD.md** - Full product requirements
- **UX.md** - User stories and flows
- **VisualRoadmap.md** - Phased development plan
- **Wireframe.md** - Detailed UI/UX specifications
- **ARCHITECTURE.md** - Technical architecture and patterns (see narrative-lens-app/)
