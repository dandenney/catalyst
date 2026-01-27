/**
 * InsertButton
 * Button that appears between components to insert new components
 */

import React, { useState } from 'react';
import { cn } from './lib/utils';
import { Button } from './ui/button';

export interface InsertButtonProps {
  onInsert: () => void;
}

export function InsertButton({ onInsert }: InsertButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        'relative h-0.5 my-2 transition-all',
        isHovered ? 'bg-[var(--catalyst-primary)]' : 'bg-[var(--catalyst-border)]'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        onClick={onInsert}
        variant={isHovered ? 'default' : 'outline'}
        size="sm"
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all',
          !isHovered && 'border-2 border-[var(--catalyst-primary)] text-[var(--catalyst-primary)] opacity-70'
        )}
        title="Insert component here"
      >
        + Add Component
      </Button>
    </div>
  );
}
