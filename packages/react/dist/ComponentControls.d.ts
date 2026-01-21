/**
 * ComponentControls
 * Inline controls that appear for each component in edit mode
 * Optionally includes variant selection
 */
import React from 'react';
export interface ComponentControlsProps {
    onRemove: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
    variants?: Record<string, unknown>;
    currentVariant?: string | null;
    onVariantChange?: (variant: string | null) => void;
}
export declare function ComponentControls({ onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown, variants, currentVariant, onVariantChange, }: ComponentControlsProps): React.JSX.Element;
