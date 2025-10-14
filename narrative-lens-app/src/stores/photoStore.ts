import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import type { Photo } from '../types';
import { convertHeicToJpeg, isHeicFile, isSupportedImageFile, isRawFile } from '../utils/imageUtils';

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
      console.log('Converting HEIC to JPEG:', file.name);
      try {
        processedFile = await convertHeicToJpeg(file);
      } catch (error) {
        console.error('HEIC conversion failed:', error);
        throw new Error(`Failed to convert HEIC image: ${file.name}`);
      }
    }

    const photos = get().photos.filter((p) => p.storyId === storyId);
    const maxSequence = photos.length > 0 ? Math.max(...photos.map((p) => p.sequence)) : -1;

    // Convert file to base64 data URL
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(processedFile);
    });

    const newPhoto: Photo = {
      id: uuidv4(),
      storyId,
      originalPath: file.name, // Keep original filename
      fullDataUrl: dataUrl,
      thumbnailDataUrl: dataUrl, // For now, use same image. Can optimize later.
      sequence: maxSequence + 1,
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
    // Update sequence numbers for all photos
    await Promise.all(
      photos.map((photo, index) =>
        db.photos.update(photo.id, { sequence: index })
      )
    );

    if (photos.length > 0) {
      await get().loadPhotosForStory(photos[0].storyId);
    }
  },

  getPhotosForStory: (storyId: string) => {
    return get().photos.filter((p) => p.storyId === storyId);
  },
}));
