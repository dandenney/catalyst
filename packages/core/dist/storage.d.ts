/**
 * Storage adapter interface
 * Defines the contract for persistence
 */
import { PageSchema } from './types';
export interface StorageAdapter {
    /**
     * Load a page by its slug
     */
    getPage(slug: string): Promise<PageSchema | null>;
    /**
     * Save/update a page
     */
    savePage(page: PageSchema): Promise<void>;
    /**
     * List all pages
     */
    listPages(): Promise<PageSchema[]>;
}
