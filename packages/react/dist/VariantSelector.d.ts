/**
 * VariantSelector
 * Allows switching between base and variant editing modes
 * Includes ability to create new variants
 */
import React from 'react';
export interface VariantSelectorProps {
    variants?: Record<string, unknown>;
    currentVariant: string | null;
    onVariantChange: (variant: string | null) => void;
}
export declare function VariantSelector({ variants, currentVariant, onVariantChange, }: VariantSelectorProps): React.JSX.Element;
