// Core data types for Visual Narrative

export interface Photo {
  id: string;
  storyId: string;
  originalPath: string; // For local file reference

  // New Blob storage (preferred)
  thumbnailBlob?: Blob;
  fullBlob?: Blob;

  // Legacy base64 storage (backward compatibility)
  thumbnailDataUrl?: string;
  fullDataUrl?: string;

  sequence: number; // Order in the story
  createdAt: Date;

  // V1.1 features (optional for now)
  caption?: string;
  edits?: PhotoEdits;
  filterApplied?: string;
}

export interface PhotoEdits {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
}

export interface Story {
  id: string;
  title: string;
  coverImageId?: string; // ID of the photo to use as cover
  createdAt: Date;
  updatedAt: Date;

  // V1.1 features
  mainIntro?: string;

  // V1.2 features
  isPublished?: boolean;
}
