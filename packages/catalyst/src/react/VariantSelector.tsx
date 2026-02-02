/**
 * VariantSelector
 * Allows switching between base and variant editing modes
 * Includes ability to create new variants
 */

import React, { useState } from 'react';
import { cn } from './lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface VariantSelectorProps {
  variants?: Record<string, unknown>;
  currentVariant: string | null;
  onVariantChange: (variant: string | null) => void;
  extraItems?: React.ReactNode;
}

export function VariantSelector({
  variants = {},
  currentVariant,
  onVariantChange,
  extraItems,
}: VariantSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newVariantName, setNewVariantName] = useState('');

  const variantNames = Object.keys(variants || {});

  const handleCreateVariant = () => {
    if (!newVariantName.trim()) return;

    // Switch to the new variant (it will be created when user makes first edit)
    onVariantChange(newVariantName.trim());
    setNewVariantName('');
    setIsCreating(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={currentVariant ? 'accent' : 'outline'}
          size="sm"
          className="gap-2"
          title="Select variant to edit"
        >
          {currentVariant ? `Variant: ${currentVariant}` : 'Base'}
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onVariantChange(null)}
          className={cn(currentVariant === null && 'font-medium')}
          style={currentVariant === null ? { backgroundColor: 'rgba(255,255,255,0.08)' } : undefined}
        >
          Base
        </DropdownMenuItem>

        {variantNames.map((variantName) => (
          <DropdownMenuItem
            key={variantName}
            onClick={() => onVariantChange(variantName)}
            className={cn(currentVariant === variantName && 'font-medium')}
            style={currentVariant === variantName ? { backgroundColor: 'rgba(255,255,255,0.08)' } : undefined}
          >
            {variantName}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {isCreating ? (
          <div className="p-2" onClick={(e) => e.stopPropagation()}>
            <Input
              type="text"
              value={newVariantName}
              onChange={(e) => setNewVariantName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateVariant();
                } else if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewVariantName('');
                }
              }}
              placeholder="e.g., premium, mobile…"
              autoFocus
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={handleCreateVariant}
                disabled={!newVariantName.trim()}
                className="flex-1"
              >
                Create
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setNewVariantName('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); // Prevent dropdown from closing
              setIsCreating(true);
            }}
            className="gap-2"
            style={{ color: '#a1a1aa' }}
          >
            <span style={{ color: '#e5a158' }}>+</span>
            Add Variant
          </DropdownMenuItem>
        )}

        {extraItems && (
          <>
            <DropdownMenuSeparator />
            {extraItems}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
