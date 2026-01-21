/**
 * Catalyst Context Provider
 * Provides locale, personalization, editing state, and component registry to components
 */
import React, { ReactNode } from 'react';
import { Locale, PersonalizationContext, StorageAdapter, ComponentSchema } from '@catalyst/core';
/**
 * A Catalyst-compatible component that can render a schema
 * Components must accept schema and optional onUpdate callback
 */
export type CatalystComponent<T extends ComponentSchema = ComponentSchema> = React.ComponentType<{
    schema: T;
    onUpdate?: (schema: T) => void;
}>;
/**
 * Registry mapping component type strings to their React implementations
 * Consumers register their own components here
 */
export type ComponentRegistry = Record<string, CatalystComponent>;
export interface CatalystContextValue {
    locale: Locale;
    personalization: PersonalizationContext;
    isEditMode: boolean;
    storageAdapter?: StorageAdapter;
    components: ComponentRegistry;
}
export interface CatalystProviderProps {
    locale?: Locale;
    personalization?: PersonalizationContext;
    isEditMode?: boolean;
    storageAdapter?: StorageAdapter;
    /** Component registry - maps schema type names to React components */
    components?: ComponentRegistry;
    children: ReactNode;
}
export declare function CatalystProvider({ locale, personalization, isEditMode, storageAdapter, components, children, }: CatalystProviderProps): React.JSX.Element;
export declare function useCatalyst(): CatalystContextValue;
