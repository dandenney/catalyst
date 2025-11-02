/**
 * React hooks for Catalyst
 */
import { PageSchema, ComponentSchema } from '@catalyst/core';
export * from './useVariantHandling';
/**
 * Hook to load and manage a page
 */
export declare function usePage(slug: string): {
    page: PageSchema | null;
    loading: boolean;
    error: Error | null;
    updateComponent: (componentId: string, updatedComponent: ComponentSchema) => Promise<void>;
};
