# Supported Image Formats

## Currently Supported (v1.0)

### Standard Web Formats
These formats work natively in all browsers:
- **JPEG/JPG** (.jpg, .jpeg) - Most common, recommended
- **PNG** (.png) - Lossless, supports transparency
- **GIF** (.gif) - Animated images
- **WebP** (.webp) - Modern format, excellent compression
- **BMP** (.bmp) - Uncompressed bitmap
- **SVG** (.svg) - Vector graphics

### Mobile Formats (Auto-converted)
- **HEIC/HEIF** (.heic, .heif) - Apple's default format (iPhone/iPad)
  - Automatically converted to JPEG on import
  - Uses `heic2any` library
  - Maintains 90% quality during conversion

## Not Supported (v1.0)

### RAW Camera Formats
Professional camera RAW formats require specialized processing and are not supported in the browser. Users must export to JPEG first.

**Common RAW formats by camera brand:**

#### Canon
- .cr2 (older models)
- .cr3 (newer models like R5, R6, EOS R)

#### Nikon
- .nef (most models)
- .nrw (Coolpix series)

#### Sony
- .arw (Alpha series)
- .srf, .sr2 (older models)

#### Fujifilm
- .raf (X-series, GFX)

#### Olympus / OM System
- .orf (all models)

#### Panasonic / Lumix
- .rw2 (all models)

#### Pentax / Ricoh
- .pef (Pentax K-series)
- .dng (some models)

#### Leica
- .rwl (proprietary RAW)
- .dng (M, SL series)

#### Adobe DNG
- .dng (Digital Negative - open standard)
- Used by some cameras, Lightroom exports

## Recommendations for Photographers

### If you shoot in RAW:
1. **Export to JPEG first** using your camera's software or Lightroom/Capture One
2. Recommended export settings:
   - Format: JPEG
   - Quality: 90-95%
   - Color space: sRGB (for web)
   - Resolution: Full size (app will handle optimization later)

### If you use iPhone (HEIC):
- Just import directly! The app will convert automatically
- No quality loss from conversion
- Slightly slower import time (1-2 seconds per image)

### Best Format for Visual Narrative:
- **JPEG** - Best balance of quality and file size
- Use highest quality setting from your camera
- sRGB color space for consistent display

## Future Enhancements (Post-MVP)

### Possible v1.1+ Features:
- Automatic image optimization on import
- Thumbnail generation (reduced file size)
- Client-side image compression options

### Possible v2.0+ Features:
- RAW file support via WebAssembly (complex, requires significant development)
- Server-side RAW conversion (requires backend)
- Batch export from Lightroom plugin

## Technical Details

### File Size Considerations
Images are stored as base64 in IndexedDB with ~33% overhead:
- 3MB JPEG → ~4MB in storage
- Browser limit: Usually 50MB-100MB for IndexedDB
- Recommended: Keep individual photos under 10MB

### HEIC Conversion Details
- Library: `heic2any` (MIT license)
- Process: Client-side in browser
- Quality: 90% JPEG (customizable)
- Speed: ~1-2 seconds per image
- Bundle size: ~100KB added

### RAW Format Why Not Supported
1. **File size**: RAW files are 20-50MB each
2. **Processing**: Requires complex demosaicing algorithms
3. **Browser limitations**: No native browser support
4. **Better workflow**: RAW should be edited in dedicated software first
