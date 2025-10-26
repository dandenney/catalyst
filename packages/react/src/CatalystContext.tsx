/**
 * Catalyst Context Provider
 * Provides locale, personalization, and editing state to components
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Locale, PersonalizationContext, StorageAdapter } from '@catalyst/core';

export interface CatalystContextValue {
  locale: Locale;
  personalization: PersonalizationContext;
  isEditMode: boolean;
  storageAdapter?: StorageAdapter;
}

const CatalystContext = createContext<CatalystContextValue | null>(null);

export interface CatalystProviderProps {
  locale?: Locale;
  personalization?: PersonalizationContext;
  isEditMode?: boolean;
  storageAdapter?: StorageAdapter;
  children: ReactNode;
}

export function CatalystProvider({
  locale = 'en',
  personalization = {},
  isEditMode = false,
  storageAdapter,
  children,
}: CatalystProviderProps) {
  const value: CatalystContextValue = {
    locale,
    personalization,
    isEditMode,
    storageAdapter,
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
