# Image Editing Research & Recommendations
**Date**: October 13, 2025
**Purpose**: Evaluate image editing libraries for Visual Narrative v1.1

---

## Requirements Summary

For Visual Narrative v1.1, we need:

### Must-Have Features
1. **Basic Adjustments**: Brightness, Contrast, Saturation, Sharpness sliders
2. **Filter Presets**: 5-6 one-click filters (Cinematic, B&W, Vibrant, etc.)
3. **Non-Destructive Editing**: Store edits as metadata, apply on render
4. **React/TypeScript**: Must integrate with our existing stack
5. **Performance**: Fast preview, works with local images (Blobs/URLs)
6. **Small Bundle Size**: Keep app lightweight

### Nice-to-Have Features
- Crop/rotate (can add later)
- Undo/redo (can implement ourselves)
- Live preview
- Export to different formats

---

## Library Evaluation

### Option 1: Ente Photo Editor SDK ⭐ RECOMMENDED
**GitHub**: https://github.com/ente-io/photo-editor-sdk
**NPM**: `@ente-io/photo-editor-sdk`

#### Pros
✅ Built specifically for React + TypeScript
✅ Headless components (full design control)
✅ Non-destructive by design
✅ Uses browser APIs (good performance)
✅ Lightweight approach
✅ MIT licensed (free, open-source)
✅ Created by photo app experts (Ente)
✅ Mentioned in our PRD/docs as target solution

#### Cons
⚠️ Last published ~1 year ago (may have limited updates)
⚠️ Known issue: Color adjustments after transforms can have adverse effects
⚠️ Smaller community than alternatives
⚠️ May need to supplement with custom code

#### Installation
```bash
npm install @ente-io/photo-editor-sdk
```

#### Basic Usage
```typescript
import {
  PhotoEditorPreview,
  PhotoEditorProvider,
  usePhotoColourAdjuster,
  usePhotoTransformer
} from '@ente-io/photo-editor-sdk';

function Editor() {
  const { brightness, setBrightness } = usePhotoColourAdjuster();

  return (
    <PhotoEditorProvider>
      <PhotoEditorPreview />
      <input
        type="range"
        value={brightness}
        onChange={(e) => setBrightness(e.target.value)}
      />
    </PhotoEditorProvider>
  );
}
```

#### Best For
Our use case! Designed for storytelling apps that need basic tone adjustments.

---

### Option 2: TOAST UI Image Editor
**GitHub**: https://github.com/nhn/tui.image-editor
**NPM**: `@toast-ui/react-image-editor`

#### Pros
✅ Feature-rich (crop, rotate, draw, shapes, text, filters)
✅ Official React wrapper available
✅ Actively maintained by NHN Cloud
✅ 7.5k GitHub stars (large community)
✅ Cross-browser compatible
✅ Undo/redo built-in

#### Cons
❌ Heavy bundle size (fabric.js dependency ~150KB gzipped)
❌ Opinionated UI (harder to customize)
❌ Overly complex for our needs (we only need sliders + filters)
❌ May have React 18 compatibility issues (GitHub issue #794)
❌ Last major release: April 2022

#### Installation
```bash
npm install @toast-ui/react-image-editor
npm install tui-image-editor
```

#### Basic Usage
```jsx
import ImageEditor from '@toast-ui/react-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';

function App() {
  return (
    <ImageEditor
      includeUI={{
        loadImage: {
          path: 'img/sampleImage.jpg',
          name: 'SampleImage'
        },
        theme: myTheme,
        menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
      }}
    />
  );
}
```

#### Best For
Full-featured photo editing apps (like Canva clones). Overkill for us.

---

### Option 3: Custom Canvas API Solution
**Approach**: Build our own using native browser Canvas API

#### Pros
✅ Zero dependencies
✅ Full control over implementation
✅ Smallest possible bundle size
✅ Learn exactly how image processing works
✅ Can optimize for our specific use case

#### Cons
❌ More development time
❌ Need to implement filters from scratch
❌ Requires image processing knowledge
❌ Potential for bugs/edge cases

#### Implementation Approach
```typescript
// src/utils/imageProcessing.ts
export function applyBrightness(
  imageData: ImageData,
  value: number
): ImageData {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * value);     // R
    data[i + 1] = Math.min(255, data[i + 1] * value); // G
    data[i + 2] = Math.min(255, data[i + 2] * value); // B
    // data[i + 3] is alpha, leave unchanged
  }
  return imageData;
}

export function applyContrast(imageData: ImageData, value: number): ImageData {
  // ... similar pixel manipulation
}
```

#### Best For
Learning projects, or if Ente SDK doesn't work out.

---

### Option 4: Other React Libraries

#### Filerobot Image Editor
- Commercial (paid after trial)
- Feature-rich but expensive
- ❌ Not suitable for open-source project

#### React Photo Editor (`react-photo-editor`)
- ✅ Basic adjustments included
- ⚠️ Limited documentation
- ⚠️ Smaller community
- Could be fallback option

---

## Recommended Approach

### Phase 1: Prototype with Ente SDK (1 week)
1. Install `@ente-io/photo-editor-sdk`
2. Build simple test page with brightness/contrast sliders
3. Evaluate performance and usability
4. Check if it meets our needs

### Phase 2: Supplement with Custom Code (1-2 weeks)
If Ente SDK is insufficient:
- Use Ente for foundation
- Build custom filters using Canvas API
- Create our own filter presets

### Phase 3: Fallback to Custom Canvas (if needed)
If Ente SDK has critical issues:
- Implement pure Canvas API solution
- Port filter algorithms from open-source projects (GIMP, Darktable)
- Reference: https://www.html5rocks.com/en/tutorials/canvas/imagefilters/

---

## Filter Algorithm Resources

To implement filters, reference these open-source projects:

### Instagram-Style Filters
- **CSSgram**: https://github.com/una/CSSgram (CSS filters, can port to Canvas)
- **Filters.css**: https://github.com/bansal/filters.css

### Image Processing Algorithms
- **GIMP Filters**: Study GIMP source code (C, but algorithms are portable)
- **Darktable**: RAW processing algorithms (reference for tone curves)
- **RawTherapee**: Color adjustment algorithms

### Canvas API Tutorials
- MDN Canvas Tutorial: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- HTML5 Rocks Image Filters: https://www.html5rocks.com/en/tutorials/canvas/imagefilters/

---

## Next Steps

1. **Clone Ente Photo Editor SDK**
   ```bash
   cd W:\local-ai-dev\apps\narrative-lens\docs
   git clone https://github.com/ente-io/photo-editor-sdk.git
   ```

2. **Study the source code**
   - Look at component structure
   - Understand hooks API
   - Check how they handle non-destructive edits

3. **Create prototype branch**
   ```bash
   git checkout -b feature/image-editing-prototype
   ```

4. **Build test component**
   - Create `src/components/PhotoEditor.tsx`
   - Implement basic brightness slider
   - Test with existing photo imports

5. **Document findings**
   - Does it work with our Blob storage?
   - Performance acceptable?
   - Can we customize the UI?

---

## Decision Matrix

| Criteria | Ente SDK | TOAST UI | Custom Canvas |
|----------|----------|----------|---------------|
| **Bundle Size** | ⭐⭐⭐⭐ Small | ⭐⭐ Large | ⭐⭐⭐⭐⭐ Minimal |
| **React Integration** | ⭐⭐⭐⭐⭐ Native | ⭐⭐⭐ Wrapper | ⭐⭐⭐⭐ DIY |
| **Customization** | ⭐⭐⭐⭐⭐ Full | ⭐⭐ Limited | ⭐⭐⭐⭐⭐ Full |
| **Development Time** | ⭐⭐⭐⭐ Fast | ⭐⭐⭐⭐⭐ Fastest | ⭐⭐ Slow |
| **Maintenance** | ⭐⭐⭐ Low | ⭐⭐⭐⭐ Active | ⭐⭐ Manual |
| **Feature Set** | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Full | ⭐⭐⭐ Custom |
| **Documentation** | ⭐⭐⭐ Basic | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐ MDN |

**Winner**: **Ente Photo Editor SDK** with Custom Canvas as fallback

---

## Implementation Timeline

### Week 1: Research & Prototyping
- [x] Evaluate libraries
- [ ] Clone Ente SDK repo
- [ ] Study Ente source code
- [ ] Build proof-of-concept

### Week 2: Integration
- [ ] Install Ente SDK in project
- [ ] Create PhotoEditor component
- [ ] Implement adjustment sliders UI
- [ ] Test with existing photos

### Week 3: Filters & Presets
- [ ] Design filter presets
- [ ] Implement filter logic
- [ ] Create filter picker UI
- [ ] Add preview mode

### Week 4: Polish & Testing
- [ ] Performance optimization
- [ ] Edge case handling
- [ ] User testing
- [ ] Documentation

---

## Questions to Resolve

1. ✅ Which library should we use? → **Ente SDK (with fallback plan)**
2. ⏳ Does Ente SDK work with our Blob storage? → **Test in prototype**
3. ⏳ Can we customize the UI completely? → **Test in prototype**
4. ⏳ How do we store edit metadata? → **Design schema update**
5. ⏳ Performance with large images? → **Test with real photos**

---

## Conclusion

**Recommended Path**:
1. Start with **Ente Photo Editor SDK** (aligns with PRD, lightweight, React-native)
2. Clone the repo to study implementation
3. Build prototype in our app
4. Supplement with custom Canvas code if needed
5. Keep Custom Canvas as Plan B

**Next Action**: Clone Ente SDK repo and study the source code.
