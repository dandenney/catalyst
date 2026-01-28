/**
 * useEditableLink Hook
 * Extracts link editing state and behavior for composable use.
 * Used internally by EditableLink and available for custom link-like components (e.g. buttons).
 */

import { useState, useCallback, useEffect } from 'react';
import { LocalizedContent, getLocalizedValue } from '../core';
import { useCatalyst } from './CatalystContext';

export interface UseEditableLinkOptions {
  href: LocalizedContent;
  text: LocalizedContent;
  onUpdate?: (data: { href: LocalizedContent; text: LocalizedContent }) => void;
  /** Custom class for edit mode outline (overrides default) */
  editClassName?: string;
  /** Custom class for active/open state outline (overrides default) */
  editingClassName?: string;
}

export interface UseEditableLinkResult {
  /** Whether the edit popover is open */
  isOpen: boolean;
  /** Open/close the edit popover */
  setIsOpen: (open: boolean) => void;
  /** Resolved href for the current locale */
  displayHref: string;
  /** Resolved text for the current locale */
  displayText: string;
  /** Current edit href value */
  editHref: string;
  /** Set the edit href value */
  setEditHref: (value: string) => void;
  /** Current edit text value */
  editText: string;
  /** Set the edit text value */
  setEditText: (value: string) => void;
  /** Save edits and close popover */
  handleSave: () => void;
  /** Cancel edits and close popover */
  handleCancel: () => void;
  /** Keyboard handler (Cmd+Enter to save, Escape to cancel) */
  handleKeyDown: (e: React.KeyboardEvent) => void;
  /** Click handler that prevents navigation in edit mode */
  handleClick: (e: React.MouseEvent) => void;
  /** Whether edit mode is active */
  isEditMode: boolean;
  /** Current locale */
  locale: string;
  /** CSS classes for edit-mode outline styling */
  editModeClassName: string;
}

const defaultEditClassName = 'cursor-pointer outline-1 outline-dashed outline-[var(--catalyst-edit-outline,#94a3b8)] outline-offset-2';
const defaultEditingClassName = 'outline-2 outline-solid outline-[var(--catalyst-edit-active,#3b82f6)] outline-offset-2';

export function useEditableLink({
  href,
  text,
  onUpdate,
  editClassName,
  editingClassName,
}: UseEditableLinkOptions): UseEditableLinkResult {
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

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isEditMode) {
        e.preventDefault();
        setIsOpen(true);
      }
    },
    [isEditMode]
  );

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

  const editModeClassName = [
    isEditMode && (editClassName ?? defaultEditClassName),
    isOpen && (editingClassName ?? defaultEditingClassName),
  ]
    .filter(Boolean)
    .join(' ');

  return {
    isOpen,
    setIsOpen,
    displayHref,
    displayText,
    editHref,
    setEditHref,
    editText,
    setEditText,
    handleSave,
    handleCancel,
    handleKeyDown,
    handleClick,
    isEditMode,
    locale,
    editModeClassName,
  };
}
