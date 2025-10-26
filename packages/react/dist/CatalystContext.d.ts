/**
 * Catalyst Context Provider
 * Provides locale, personalization, and editing state to components
 */
import React, { ReactNode } from 'react';
import { Locale, PersonalizationContext, StorageAdapter } from '@catalyst/core';
export interface CatalystContextValue {
    locale: Locale;
    personalization: PersonalizationContext;
    isEditMode: boolean;
    storageAdapter?: StorageAdapter;
}
export interface CatalystProviderProps {
    locale?: Locale;
    personalization?: PersonalizationContext;
    isEditMode?: boolean;
    storageAdapter?: StorageAdapter;
    children: ReactNode;
}
export declare function CatalystProvider({ locale, personalization, isEditMode, storageAdapter, children, }: CatalystProviderProps): React.JSX.Element;
export declare function useCatalyst(): CatalystContextValue;
