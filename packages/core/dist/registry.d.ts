/**
 * Component Registry
 * Central registry of all available components for the page builder
 */
import { ComponentSchema } from './types';
export interface ComponentMetadata {
    type: string;
    label: string;
    description: string;
    category: 'layout' | 'content' | 'media' | 'other';
    icon?: string;
    thumbnail?: string;
    createDefault: () => ComponentSchema;
}
/**
 * Registry of all available components
 */
export declare const COMPONENT_REGISTRY: Record<string, ComponentMetadata>;
/**
 * Get all available component types
 */
export declare function getAvailableComponents(): ComponentMetadata[];
/**
 * Get metadata for a specific component type
 */
export declare function getComponentMetadata(type: string): ComponentMetadata | undefined;
/**
 * Create a new component instance with default values
 */
export declare function createComponent(type: string): ComponentSchema | null;
