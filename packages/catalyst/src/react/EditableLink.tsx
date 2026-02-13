/**
 * Editable Link Component
 * Renders a link that can have its URL and text edited in edit mode
 */

import React from 'react';
import { LocalizedContent } from '../core';
import { useEditableLink } from './useEditableLink';
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
  /** Custom class for edit mode outline (overrides default) */
  editClassName?: string;
  /** Custom class for active/open state outline (overrides default) */
  editingClassName?: string;
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
  editClassName,
  editingClassName,
}: EditableLinkProps) {
  const link = useEditableLink({ href, text, onUpdate, editClassName, editingClassName });

  return (
    <Popover open={link.isOpen} onOpenChange={(open) => link.isEditMode && link.setIsOpen(open)}>
      <PopoverTrigger asChild>
        <a
          href={link.isEditMode ? undefined : link.displayHref}
          target={link.isEditMode ? undefined : target}
          rel={link.isEditMode ? undefined : rel}
          className={cn(className, link.editModeClassName)}
          onClick={link.handleClick}
          title={link.isEditMode ? 'Click to edit link' : undefined}
          style={customStyle}
        >
          <span>{link.displayText}</span>
          {children}
        </a>
      </PopoverTrigger>
      <PopoverContent className="w-80" onKeyDown={link.handleKeyDown}>
        <div className="space-y-3">
          <div>
            <Label htmlFor="link-text">Link Text ({link.locale.toUpperCase()})</Label>
            <Input
              id="link-text"
              type="text"
              value={link.editText}
              onChange={(e) => link.setEditText(e.target.value)}
              placeholder="Click here…"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="link-url">URL ({link.locale.toUpperCase()})</Label>
            <Input
              id="link-url"
              type="text"
              value={link.editHref}
              onChange={(e) => link.setEditHref(e.target.value)}
              placeholder="https://example.com…"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={link.handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={link.handleSave}>
              Save
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Cmd+Enter to save, Esc to cancel
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
