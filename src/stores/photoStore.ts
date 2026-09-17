import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import type { Photo } from '../types';
import { convertHeicToJpeg, isHeicFile, isSupportedImageFile, isRawFile } from '../utils/imageUtils';
import imageCompression from 'browser-image-compression';

interface PhotoStore {
  photos: Photo[];
  loadPhotosForStory: (storyId: string) => Promise<void>;
  addPhoto: (storyId: string, file: File) => Promise<Photo>;
  deletePhoto: (id: string) => Promise<void>;
  updatePhotoSequence: (photos: Photo[]) => Promise<void>;
  getPhotosForStory: (storyId: string) => Photo[];
}

export const usePhotoStore = create<PhotoStore>((set, get) => ({
  photos: [],

  loadPhotosForStory: async (storyId: string) => {
    const photos = await db.photos.where('storyId').equals(storyId).toArray();
    set({ photos: photos.sort((a, b) => a.sequence - b.sequence) });
  },

  addPhoto: async (storyId: string, file: File) => {
    // Check if supported format
    if (!isSupportedImageFile(file)) {
      if (isRawFile(file)) {
        console.warn('RAW format not supported:', file.name);
        throw new Error(`RAW format (${file.name}) not supported. Please export as JPEG first.`);
      }
      console.warn('Unsupported file type:', file.name, file.type);
      throw new Error(`Unsupported file format: ${file.name}`);
    }

    // Convert HEIC to JPEG if needed
    let processedFile = file;
    if (isHeicFile(file)) {
      try {
        processedFile = await convertHeicToJpeg(file);
      } catch (error) {
        console.error('HEIC conversion failed:', error);
        throw new Error(`Failed to convert HEIC image: ${file.name}`);
      }
    }

    // Compress full-size image (max 2048px width, ~90% quality)
    const fullBlob = await imageCompression(processedFile, {
      maxSizeMB: 1,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
    });

    // Create thumbnail (max 400px for grid display)
    const thumbnailBlob = await imageCompression(processedFile, {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 400,
      useWebWorker: true,
    });

    const newPhoto: Photo = {
      id: uuidv4(),
      storyId,
      originalPath: file.name, // Keep original filename
      fullBlob,
      thumbnailBlob,
      sequence: -1, // Start in bin (not on canvas)
      createdAt: new Date(),
    };

    await db.photos.add(newPhoto);
    await get().loadPhotosForStory(storyId);
    return newPhoto;
  },

  deletePhoto: async (id: string) => {
    const photo = await db.photos.get(id);
    if (!photo) return;

    await db.photos.delete(id);
    await get().loadPhotosForStory(photo.storyId);
  },

  updatePhotoSequence: async (photos: Photo[]) => {
    // Update local state immediately (optimistic update)
    const currentPhotos = get().photos;
    const updatedPhotosMap = new Map(photos.map(p => [p.id, p]));

    const newPhotos = currentPhotos.map(photo =>
      updatedPhotosMap.has(photo.id) ? updatedPhotosMap.get(photo.id)! : photo
    );

    set({ photos: newPhotos.sort((a, b) => a.sequence - b.sequence) });

    // Update database in background (don't await)
    Promise.all(
      photos.map((photo) =>
        db.photos.update(photo.id, { sequence: photo.sequence })
      )
    ).catch(err => console.error('Failed to update photo sequence:', err));
  },

  getPhotosForStory: (storyId: string) => {
    return get().photos.filter((p) => p.storyId === storyId);
  },
}));
