/**
 * Editable Link Component
 * Renders a link that can have its URL and text edited in edit mode
 */

import React, { useState, useCallback, useEffect } from 'react';
import { LocalizedContent, getLocalizedValue } from '../core';
import { useCatalyst } from './CatalystContext';
import { cn } from './lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export interface EditableLinkProps {
  href: LocalizedContent;
  text: LocalizedContent;
  onUpdate?: (data: { href: LocalizedContent; text: LocalizedContent }) => void;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
  children?: React.ReactNode;
}

export function EditableLink({
  href,
  text,
  onUpdate,
  className = '',
  style: customStyle = {},
  target,
  rel,
  children,
}: EditableLinkProps) {
  const { locale, isEditMode } = useCatalyst();
  const [isOpen, setIsOpen] = useState(false);
  const [editHref, setEditHref] = useState(getLocalizedValue(href, locale));
  const [editText, setEditText] = useState(getLocalizedValue(text, locale));

  const displayHref = getLocalizedValue(href, locale);
  const displayText = getLocalizedValue(text, locale);

  // Sync state when props change
  useEffect(() => {
    if (!isOpen) {
      setEditHref(getLocalizedValue(href, locale));
      setEditText(getLocalizedValue(text, locale));
    }
  }, [href, text, locale, isOpen]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      setIsOpen(true);
    }
  }, [isEditMode]);

  const handleSave = useCallback(() => {
    if (onUpdate) {
      const updatedHref: LocalizedContent = {
        ...href,
        [locale]: editHref,
      };
      const updatedText: LocalizedContent = {
        ...text,
        [locale]: editText,
      };
      onUpdate({ href: updatedHref, text: updatedText });
    }
    setIsOpen(false);
  }, [editHref, editText, href, text, locale, onUpdate]);

  const handleCancel = useCallback(() => {
    setEditHref(displayHref);
    setEditText(displayText);
    setIsOpen(false);
  }, [displayHref, displayText]);

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
        <a
          href={isEditMode ? undefined : displayHref}
          target={isEditMode ? undefined : target}
          rel={isEditMode ? undefined : rel}
          className={cn(
            className,
            isEditMode && 'cursor-pointer outline-1 outline-dashed outline-[var(--catalyst-edit-outline)] outline-offset-2',
            isOpen && 'outline-2 outline-solid outline-[var(--catalyst-edit-active)] outline-offset-2'
          )}
          onClick={handleClick}
          title={isEditMode ? 'Click to edit link' : undefined}
          style={customStyle}
        >
          <span>{displayText}</span>
          {children}
        </a>
      </PopoverTrigger>
      <PopoverContent onKeyDown={handleKeyDown}>
        <div className="space-y-3">
          <div>
            <Label htmlFor="link-text">Link Text ({locale.toUpperCase()})</Label>
            <Input
              id="link-text"
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Click here"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="link-url">URL ({locale.toUpperCase()})</Label>
            <Input
              id="link-url"
              type="text"
              value={editHref}
              onChange={(e) => setEditHref(e.target.value)}
              placeholder="https://example.com"
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
