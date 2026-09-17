// Image filtering utilities using Canvas API
// Based on Ente Photo Editor SDK approach but customized for our needs

import type { FilterValues, FilterPreset } from '../types/filters';

export type { FilterValues, FilterPreset };

// Default/neutral filter values
export const DEFAULT_FILTER_VALUES: FilterValues = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
};

// Filter presets for one-click effects
export const FILTER_PRESETS: FilterPreset[] = [
  {
    name: 'none',
    displayName: 'Original',
    values: DEFAULT_FILTER_VALUES,
  },
  {
    name: 'cinematic',
    displayName: 'Cinematic',
    values: {
      brightness: 95,
      contrast: 115,
      saturation: 80,
      blur: 0,
    },
  },
  {
    name: 'vibrant',
    displayName: 'Vibrant',
    values: {
      brightness: 105,
      contrast: 110,
      saturation: 140,
      blur: 0,
    },
  },
  {
    name: 'bw',
    displayName: 'Black & White',
    values: {
      brightness: 100,
      contrast: 110,
      saturation: 0,
      blur: 0,
    },
  },
  {
    name: 'vintage',
    displayName: 'Vintage',
    values: {
      brightness: 110,
      contrast: 90,
      saturation: 70,
      blur: 0.5,
    },
  },
  {
    name: 'gritty',
    displayName: 'Gritty',
    values: {
      brightness: 85,
      contrast: 130,
      saturation: 60,
      blur: 0,
    },
  },
];

/**
 * Apply filters to a canvas using CSS filters
 * This is hardware-accelerated and very performant
 */
export async function applyFiltersToCanvas(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  filters: FilterValues
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS if needed

    img.onload = () => {
      try {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Build CSS filter string
        const filterString = buildFilterString(filters);

        // Apply filters and draw
        ctx.imageSmoothingEnabled = true;
        ctx.filter = filterString;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve();
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Build CSS filter string from filter values
 */
function buildFilterString(filters: FilterValues): string {
  const parts: string[] = [];

  if (filters.brightness !== 100) {
    parts.push(`brightness(${filters.brightness}%)`);
  }

  if (filters.contrast !== 100) {
    parts.push(`contrast(${filters.contrast}%)`);
  }

  if (filters.saturation !== 100) {
    parts.push(`saturate(${filters.saturation}%)`);
  }

  if (filters.blur > 0) {
    parts.push(`blur(${filters.blur}px)`);
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
}

/**
 * Export canvas as Blob
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = 'image/jpeg',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      type,
      quality
    );
  });
}

/**
 * Get a preset by name
 */
export function getPresetByName(name: string): FilterPreset | undefined {
  return FILTER_PRESETS.find((preset) => preset.name === name);
}

/**
 * Apply a preset to current filter values
 */
export function applyPreset(presetName: string): FilterValues {
  const preset = getPresetByName(presetName);
  return preset ? { ...preset.values } : { ...DEFAULT_FILTER_VALUES };
}
