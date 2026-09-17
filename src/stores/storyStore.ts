import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import type { Story } from '../types';

interface StoryStore {
  stories: Story[];
  loadStories: () => Promise<void>;
  createStory: (title: string) => Promise<Story>;
  deleteStory: (id: string) => Promise<void>;
  updateStory: (id: string, updates: Partial<Story>) => Promise<void>;
  getStoryById: (id: string) => Story | undefined;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  stories: [],

  loadStories: async () => {
    const stories = await db.stories.toArray();
    set({ stories: stories.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()) });
  },

  createStory: async (title: string) => {
    const now = new Date();
    const newStory: Story = {
      id: uuidv4(),
      title,
      createdAt: now,
      updatedAt: now,
    };

    await db.stories.add(newStory);
    await get().loadStories();
    return newStory;
  },

  deleteStory: async (id: string) => {
    // Delete all photos associated with the story
    await db.photos.where('storyId').equals(id).delete();
    // Delete the story
    await db.stories.delete(id);
    await get().loadStories();
  },

  updateStory: async (id: string, updates: Partial<Story>) => {
    await db.stories.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
    await get().loadStories();
  },

  getStoryById: (id: string) => {
    return get().stories.find((story) => story.id === id);
  },
}));
