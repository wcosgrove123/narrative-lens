# Visual Narrative

A desktop/web application for photographers to create compelling, sequenced photo essays. Built with simplicity and storytelling in mind.

## Project Status

**Current Phase:** MVP Development (Version 1.0)
**Focus:** Core story creation and photo sequencing functionality

## Features (MVP - V1.0)

- ✅ Story library dashboard with thumbnail grid
- ✅ Create and delete stories
- ✅ Set cover images for stories
- ✅ Photo import from local computer
- ✅ Drag-and-drop file import from file explorer
- ✅ HEIC/HEIF format support (auto-converts to JPEG)
- ✅ Support for JPEG, PNG, GIF, WebP formats
- ✅ Drag-and-drop photo sequencing
- ✅ Local persistence (IndexedDB)

### Coming in V1.1 (Q1 2026)
- Tone editor with adjustment sliders
- One-click photo filters
- Photo captions and story introductions

### Coming in V1.2 (Q2 2026)
- Public portfolio publishing
- Shareable portfolio URL
- Public story viewer

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Storage:** IndexedDB via Dexie.js
- **Drag & Drop:** @dnd-kit
- **State Management:** Zustand
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Image Processing:** heic2any (HEIC/HEIF conversion)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server
The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (Library, Editor)
├── stores/         # Zustand state management
├── db/             # IndexedDB setup and utilities
├── types/          # TypeScript type definitions
└── utils/          # Helper functions
```

## Design Philosophy

1. **Story First, Tools Second** - Every feature serves storytelling
2. **Simplicity & Intuition** - Clean UI, minimal learning curve
3. **Frictionless Sharing** - Easy path from draft to public portfolio
4. **Single User Focus** - Local-first, no accounts (for now)

## Color Scheme

- **Editor Background:** `#1A1A1A` (Deep charcoal)
- **Accent Color:** `#007AFF` (Vibrant blue)
- **Text:** White with various opacity levels
- **Typography:** Inter (sans-serif)

## Supported Image Formats

**Fully Supported:**
- JPEG/JPG, PNG, GIF, WebP, BMP, SVG
- HEIC/HEIF (iPhone format - auto-converted)

**Not Supported:**
- RAW formats (.cr2, .cr3, .nef, .arw, etc.) - Export to JPEG first

See `FILE_FORMATS.md` for complete details.

## Documentation

See the project planning documents for more details:
- `PRD.md` - Product Requirements Document
- `UX.md` - User Stories and User Flows
- `VisualRoadmap.md` - Phased Development Plan
- `Wireframe.md` - UI/UX Specifications
- `claude.md` - Development Context Guide
- `ARCHITECTURE.md` - Technical Architecture
- `FILE_FORMATS.md` - Supported Image Formats

## Target User

**Alex** - A college student and part-time sports photographer who wants to tell visual stories (not just photo dumps), build a professional portfolio, and apply quick tonal edits without complex software.

## Success Criteria (MVP)

Alex can:
- Create a new story
- Import 20 photos from a game
- Select and arrange 8 favorites in sequence
- Save the work
- Return later and continue editing

## License

[License TBD]

## Contributing

This is currently a personal/educational project. Contribution guidelines will be added in future versions.
