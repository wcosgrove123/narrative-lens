import Dexie, { type Table } from 'dexie';
import type { Story, Photo } from '../types';

export class NarrativeLensDB extends Dexie {
  stories!: Table<Story>;
  photos!: Table<Photo>;

  constructor() {
    super('NarrativeLensDB');

    this.version(1).stores({
      stories: 'id, title, createdAt, updatedAt',
      photos: 'id, storyId, sequence, createdAt'
    });
  }
}

export const db = new NarrativeLensDB();
