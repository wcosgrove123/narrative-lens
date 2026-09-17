# Ente Photo Editor SDK - Code Analysis
**Date**: October 13, 2025
**Location**: `docs/photo-editor-sdk/`

---

## Overview

Successfully cloned and analyzed the Ente Photo Editor SDK. Here's what I found.

## ✅ Good News

**It's perfect for our use case!** The SDK is:
- Lightweight and simple
- Uses Canvas API with CSS filters (very performant)
- Headless (we control the UI completely)
- Non-destructive by design
- React 18 compatible

---

## How It Works

### Architecture

```
PhotoEditorProvider (Context)
  ├── PhotoEditorPreview (Display Component)
  └── usePhotoColourAdjuster (Hook for adjustments)
      └── applyFilters() (Canvas rendering)
```

### Key Components

#### 1. **PhotoEditorProvider** (Context Provider)
Provides shared state across all editor components:
- `fileURL` - URL of the image to edit
- `originalSizeCanvasRef` - Full-resolution canvas
- `previewCanvasRef` - Preview canvas (for UI)
- `outputMime` - Output format (JPEG, PNG, etc.)

#### 2. **PhotoEditorPreview** (Display Component)
Renders the canvas with live preview of edits.

#### 3. **usePhotoColourAdjuster** (Hook)
Takes adjustment values and applies them to the canvas:
```typescript
interface FilterValues {
  brightness: number;    // 0-200% (100 = normal)
  contrast: number;      // 0-200% (100 = normal)
  blur: number;          // 0+ pixels
  saturation: number;    // 0-200% (100 = normal)
  invert: boolean;       // true/false
}
```

#### 4. **applyFilters()** (Core Logic)
Uses Canvas API with CSS filters:
```javascript
context.filter = `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px) saturate(${saturation}%) invert(${invert ? 1 : 0})`;
context.drawImage(image, 0, 0, canvas.width, canvas.height);
```

**This is genius!** Instead of pixel manipulation, it uses native CSS filters which are:
- Hardware-accelerated (GPU)
- Very fast
- Battle-tested by browsers

---

## What's Included

### Adjustments (via `usePhotoColourAdjuster`)
✅ Brightness
✅ Contrast
✅ Blur
✅ Saturation
✅ Invert (B&W)

### Transforms (via `usePhotoTransformer`)
✅ Rotate
✅ Crop
✅ Flip

### Export
✅ High-resolution export
✅ Custom MIME types (JPEG, PNG, WebP)

---

## What's Missing

For our needs, we still need to add:
❌ **Sharpness** slider (not in SDK)
❌ **Filter presets** (Cinematic, Vintage, etc.)
❌ **Custom filters** beyond basic adjustments

**But that's OK!** We can easily extend the SDK.

---

## How to Extend It

### Adding Sharpness

Sharpness isn't a native CSS filter, but we can fake it:
```javascript
// Approach 1: Use contrast + clarity combo
context.filter = `contrast(${contrast}%) brightness(${brightness}%)`;

// Approach 2: Use unsharp mask (custom implementation)
// Apply slight blur, subtract from original = sharper
```

### Adding Filter Presets

Create preset values for `FilterValues`:
```typescript
const FILTERS = {
  cinematic: {
    brightness: 95,
    contrast: 115,
    saturation: 80,
    blur: 0,
    invert: false
  },
  vibrant: {
    brightness: 105,
    contrast: 110,
    saturation: 140,
    blur: 0,
    invert: false
  },
  bw: {
    brightness: 100,
    contrast: 110,
    saturation: 0,  // ← This makes it B&W
    blur: 0,
    invert: false
  },
  vintage: {
    brightness: 110,
    contrast: 90,
    saturation: 70,
    blur: 0.5,
    invert: false
  }
};
```

### Adding Custom Filters

For advanced effects (sepia, vignette, etc.), we can:
1. Use additional CSS filters (sepia, hue-rotate, etc.)
2. Extend the `applyFilters()` function
3. Layer multiple canvas operations

---

## Integration with Our App

### What Works Out of the Box

✅ **Blob URLs**: Ente SDK accepts any image URL, including `blob://` URLs (what we use!)
✅ **React 18**: Peer dependency is React 18 (we have that)
✅ **TypeScript**: Full TS support
✅ **Non-destructive**: Never modifies original image

### Our Current Data Flow

```
User imports photo
  ↓
Store as Blob in IndexedDB
  ↓
Create Object URL: URL.createObjectURL(blob)
  ↓
Pass to <PhotoEditorProvider fileURL={objectURL} />
  ↓
Apply edits with usePhotoColourAdjuster({ brightness, contrast, ... })
  ↓
Export edited image: photoEditor.exportImage()
  ↓
Store edit metadata in database
```

**This fits perfectly!**

---

## Proposed Integration Plan

### Step 1: Install SDK
```bash
npm install @ente-io/photo-editor-sdk
```

### Step 2: Create Wrapper Component
`src/components/PhotoEditor.tsx`
```typescript
import {
  PhotoEditorProvider,
  PhotoEditorPreview,
  usePhotoColourAdjuster,
  usePhotoEditor
} from '@ente-io/photo-editor-sdk';

interface Props {
  photoUrl: string;
  onSave: (edits: PhotoEdits) => void;
}

export function PhotoEditor({ photoUrl, onSave }: Props) {
  const [edits, setEdits] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    invert: false
  });

  return (
    <PhotoEditorProvider
      value={{
        fileURL: photoUrl,
        outputMime: 'image/jpeg'
      }}
    >
      <EditorControls edits={edits} onChange={setEdits} />
      <PhotoEditorPreview show={true} />
    </PhotoEditorProvider>
  );
}
```

### Step 3: Update Database Schema
Add `edits` field to `Photo` interface:
```typescript
interface Photo {
  id: string;
  storyId: string;
  // ... existing fields
  edits?: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    invert: boolean;
  };
  filterApplied?: string; // 'cinematic', 'bw', etc.
}
```

### Step 4: Render with Edits
When displaying photos, re-apply edits:
```typescript
// In photo display component
<PhotoEditorProvider
  value={{
    fileURL: photo.fullDataUrl,
    outputMime: 'image/jpeg'
  }}
>
  <PhotoEditorPreview show={true} />
</PhotoEditorProvider>

// Apply saved edits
usePhotoColourAdjuster({
  values: photo.edits || DEFAULT_EDITS
});
```

---

## Pros & Cons

### Pros ✅
- Extremely lightweight (no heavy dependencies)
- Uses native browser APIs (fast, reliable)
- Perfect for our use case (tone adjustments)
- Easy to extend with custom filters
- Works with our Blob storage
- Non-destructive by default
- MIT licensed

### Cons ⚠️
- Missing sharpness (need custom implementation)
- No built-in filter presets (need to create)
- Limited to CSS filter capabilities (no advanced effects like vignette without custom code)
- Not actively maintained (last update ~1 year ago)
- Known issue: color adjustments after transforms can be weird

### Verdict
**Use it!** The pros heavily outweigh the cons. We can easily add what's missing.

---

## Alternative: Custom Canvas API

If Ente SDK doesn't work, we can build our own using the same approach:

```typescript
// src/utils/imageFilters.ts
export function applyFilters(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  filters: FilterValues
) {
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}
```

This is literally what Ente SDK does! Very simple.

---

## Next Steps

1. ✅ Clone SDK (done)
2. ✅ Analyze code (done)
3. ⏳ Install SDK in our project
4. ⏳ Build prototype PhotoEditor component
5. ⏳ Test with existing photos
6. ⏳ Add filter presets
7. ⏳ Implement sharpness (custom)
8. ⏳ Update database schema

---

## Key Files to Reference

### In Ente SDK
- `src/hooks/usePhotoColourAdjuster.tsx` - Main hook
- `src/lib/colours/apply.ts` - Core filter logic
- `src/components/PhotoEditorContext.tsx` - Context provider
- `src/components/PhotoEditorPreview.tsx` - Display component

### To Create in Our App
- `src/components/PhotoEditor.tsx` - Main editor wrapper
- `src/components/ToneControls.tsx` - Sliders for adjustments
- `src/components/FilterPicker.tsx` - Preset filter buttons
- `src/utils/filterPresets.ts` - Filter definitions
- `src/utils/customFilters.ts` - Custom filter logic (sharpness, etc.)

---

## Decision

✅ **Go with Ente SDK**

It's perfect for v1.1. Simple, lightweight, does exactly what we need. We'll supplement with custom filter presets and sharpness implementation.

**Confidence Level**: 95%

**Risk Level**: Low (can always fall back to custom Canvas API)

**Development Time Estimate**: 1-2 weeks to full integration
