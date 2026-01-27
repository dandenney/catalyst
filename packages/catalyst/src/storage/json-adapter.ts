/**
 * JSON file storage adapter implementation
 */

import { StorageAdapter, PageSchema } from '../core';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface JsonStorageOptions {
  dataDir: string;
}

export class JsonStorageAdapter implements StorageAdapter {
  private dataDir: string;

  constructor(options: JsonStorageOptions) {
    this.dataDir = options.dataDir;
  }

  private getFilePath(slug: string): string {
    return join(this.dataDir, `${slug}.json`);
  }

  async getPage(slug: string): Promise<PageSchema | null> {
    try {
      const filePath = this.getFilePath(slug);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as PageSchema;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async savePage(page: PageSchema): Promise<void> {
    // Ensure data directory exists
    await fs.mkdir(this.dataDir, { recursive: true });

    const filePath = this.getFilePath(page.slug);
    await fs.writeFile(filePath, JSON.stringify(page, null, 2), 'utf-8');
  }

  async listPages(): Promise<PageSchema[]> {
    try {
      const files = await fs.readdir(this.dataDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      const pages = await Promise.all(
        jsonFiles.map(async (file) => {
          const data = await fs.readFile(join(this.dataDir, file), 'utf-8');
          return JSON.parse(data) as PageSchema;
        })
      );

      return pages;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }
}
