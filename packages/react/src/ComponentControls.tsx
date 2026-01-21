/**
 * ComponentControls
 * Inline controls that appear for each component in edit mode
 * Optionally includes variant selection
 */

import React from 'react';
import { Button } from './ui/button';
import { VariantSelector } from './VariantSelector';

export interface ComponentControlsProps {
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  // Optional variant props
  variants?: Record<string, unknown>;
  currentVariant?: string | null;
  onVariantChange?: (variant: string | null) => void;
}

export function ComponentControls({
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  variants,
  currentVariant,
  onVariantChange,
}: ComponentControlsProps) {
  const showVariantSelector = variants !== undefined && onVariantChange !== undefined;

  return (
    <div className="absolute top-2 right-2 flex gap-2 z-10">
      {showVariantSelector && (
        <VariantSelector
          variants={variants}
          currentVariant={currentVariant ?? null}
          onVariantChange={onVariantChange}
        />
      )}
      {canMoveUp && onMoveUp && (
        <Button
          variant="outline"
          size="icon"
          onClick={onMoveUp}
          title="Move up"
        >
          ↑
        </Button>
      )}
      {canMoveDown && onMoveDown && (
        <Button
          variant="outline"
          size="icon"
          onClick={onMoveDown}
          title="Move down"
        >
          ↓
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onRemove}
        title="Remove component"
        className="border-[var(--catalyst-destructive)] text-[var(--catalyst-destructive)] hover:bg-red-50"
      >
        Remove
      </Button>
    </div>
  );
}
