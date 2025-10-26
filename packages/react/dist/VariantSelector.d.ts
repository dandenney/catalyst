/**
 * VariantSelector
 * Allows switching between base and variant editing modes
 */
import React from 'react';
export interface VariantSelectorProps {
    variants?: Record<string, any>;
    currentVariant: string | null;
    onVariantChange: (variant: string | null) => void;
}
export declare function VariantSelector({ variants, currentVariant, onVariantChange, }: VariantSelectorProps): React.JSX.Element | null;
