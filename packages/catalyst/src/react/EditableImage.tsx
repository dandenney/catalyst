/**
 * Editable Image Component
 * Renders an image that can have its URL and alt text edited in edit mode
 */

import React, { useState, useCallback, useEffect } from 'react';
import { LocalizedContent, getLocalizedValue } from '../core';
import { useCatalyst } from './CatalystContext';
import { cn } from './lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export interface EditableImageProps {
  src: string;
  alt: LocalizedContent;
  onUpdate?: (data: { src: string; alt: LocalizedContent }) => void;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}

export function EditableImage({
  src,
  alt,
  onUpdate,
  className = '',
  style: customStyle = {},
  width,
  height,
}: EditableImageProps) {
  const { locale, isEditMode } = useCatalyst();
  const [isOpen, setIsOpen] = useState(false);
  const [editSrc, setEditSrc] = useState(src);
  const [editAlt, setEditAlt] = useState(getLocalizedValue(alt, locale));

  const displayAlt = getLocalizedValue(alt, locale);

  // Sync state when props change
  useEffect(() => {
    if (!isOpen) {
      setEditSrc(src);
      setEditAlt(getLocalizedValue(alt, locale));
    }
  }, [src, alt, locale, isOpen]);

  const handleSave = useCallback(() => {
    if (onUpdate) {
      const updatedAlt: LocalizedContent = {
        ...alt,
        [locale]: editAlt,
      };
      onUpdate({ src: editSrc, alt: updatedAlt });
    }
    setIsOpen(false);
  }, [editSrc, editAlt, alt, locale, onUpdate]);

  const handleCancel = useCallback(() => {
    setEditSrc(src);
    setEditAlt(displayAlt);
    setIsOpen(false);
  }, [src, displayAlt]);

  const handleClick = useCallback(() => {
    if (isEditMode) {
      setIsOpen(true);
    }
  }, [isEditMode]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter' && e.metaKey) {
        handleSave();
      }
    },
    [handleCancel, handleSave]
  );

  return (
    <Popover open={isOpen} onOpenChange={(open) => isEditMode && setIsOpen(open)}>
      <PopoverTrigger asChild>
        <img
          src={src}
          alt={displayAlt}
          onClick={handleClick}
          className={cn(
            className,
            isEditMode && 'cursor-pointer outline-1 outline-dashed outline-[var(--catalyst-edit-outline)] outline-offset-2',
            isOpen && 'outline-2 outline-solid outline-[var(--catalyst-edit-active)] outline-offset-2'
          )}
          title={isEditMode ? 'Click to edit image' : undefined}
          style={{
            ...customStyle,
            width,
            height,
          }}
        />
      </PopoverTrigger>
      <PopoverContent onKeyDown={handleKeyDown}>
        <div className="space-y-3">
          <div>
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="text"
              value={editSrc}
              onChange={(e) => setEditSrc(e.target.value)}
              placeholder="https://example.com/image.jpg"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="image-alt">Alt Text ({locale.toUpperCase()})</Label>
            <Input
              id="image-alt"
              type="text"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              placeholder="Describe the image"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>

          <p className="text-xs text-[var(--catalyst-muted-foreground)]">
            Cmd+Enter to save, Esc to cancel
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
