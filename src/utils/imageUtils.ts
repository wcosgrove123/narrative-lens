import heic2any from 'heic2any';

/**
 * Converts HEIC/HEIF images to JPEG format
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    });

    // heic2any can return Blob or Blob[] - handle both cases
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

    // Create a new File from the converted Blob
    return new File([blob], file.name.replace(/\.heic$/i, '.jpg'), {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch (error: any) {
    // If the image is already browser-readable (code: 1), just use it as-is
    // This happens when Mac exports HEIC as JPEG but keeps the .HEIC extension
    if (error.code === 1) {
      return new File([file], file.name.replace(/\.heic$/i, '.jpg'), {
        type: 'image/jpeg',
        lastModified: file.lastModified,
      });
    }

    console.error('Error converting HEIC:', error);
    throw new Error('Failed to convert HEIC image');
  }
}

/**
 * Checks if a file is a HEIC/HEIF image
 */
export function isHeicFile(file: File): boolean {
  const extension = file.name.toLowerCase();
  return extension.endsWith('.heic') || extension.endsWith('.heif');
}

/**
 * Checks if a file is a supported image format (including HEIC)
 */
export function isSupportedImageFile(file: File): boolean {
  // Standard web formats
  if (file.type.startsWith('image/')) {
    return true;
  }

  // HEIC/HEIF (not always properly typed by browser)
  if (isHeicFile(file)) {
    return true;
  }

  return false;
}

/**
 * Common RAW camera formats (for documentation/future support)
 */
export const RAW_FORMATS = {
  Canon: ['.cr2', '.cr3'],
  Nikon: ['.nef', '.nrw'],
  Sony: ['.arw', '.srf', '.sr2'],
  Fujifilm: ['.raf'],
  Olympus: ['.orf'],
  Panasonic: ['.rw2'],
  Pentax: ['.pef', '.dng'],
  Leica: ['.dng', '.rwl'],
  Adobe: ['.dng'], // Digital Negative (open standard)
};

/**
 * Checks if a file is a RAW format (currently unsupported)
 */
export function isRawFile(file: File): boolean {
  const extension = file.name.toLowerCase();
  const allRawExtensions = Object.values(RAW_FORMATS).flat();
  return allRawExtensions.some(ext => extension.endsWith(ext));
}
