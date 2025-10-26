/**
 * ComponentControls
 * Inline controls that appear for each component in edit mode
 */
import React from 'react';
export interface ComponentControlsProps {
    onRemove: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
}
export declare function ComponentControls({ onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown, }: ComponentControlsProps): React.JSX.Element;
