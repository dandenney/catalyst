/**
 * Catalyst Context Provider
 * Provides locale, personalization, editing state, and component registry to components
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Locale, PersonalizationContext, StorageAdapter, ComponentSchema } from '../core';

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

const CatalystContext = createContext<CatalystContextValue | null>(null);

export interface CatalystProviderProps {
  locale?: Locale;
  personalization?: PersonalizationContext;
  isEditMode?: boolean;
  storageAdapter?: StorageAdapter;
  /** Component registry - maps schema type names to React components */
  components?: ComponentRegistry;
  children: ReactNode;
}

export function CatalystProvider({
  locale = 'en',
  personalization = {},
  isEditMode = false,
  storageAdapter,
  components = {},
  children,
}: CatalystProviderProps) {
  const value: CatalystContextValue = {
    locale,
    personalization,
    isEditMode,
    storageAdapter,
    components,
  };

  return (
    <CatalystContext.Provider value={value}>
      {children}
    </CatalystContext.Provider>
  );
}

export function useCatalyst(): CatalystContextValue {
  const context = useContext(CatalystContext);
  if (!context) {
    throw new Error('useCatalyst must be used within CatalystProvider');
  }
  return context;
}
