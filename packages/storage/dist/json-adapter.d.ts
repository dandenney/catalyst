/**
 * JSON file storage adapter implementation
 */
import { StorageAdapter, PageSchema } from '@catalyst/core';
export interface JsonStorageOptions {
    dataDir: string;
}
export declare class JsonStorageAdapter implements StorageAdapter {
    private dataDir;
    constructor(options: JsonStorageOptions);
    private getFilePath;
    getPage(slug: string): Promise<PageSchema | null>;
    savePage(page: PageSchema): Promise<void>;
    listPages(): Promise<PageSchema[]>;
}
