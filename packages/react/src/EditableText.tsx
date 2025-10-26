/**
 * Editable Text Component
 * Renders text that can be edited in-place when in edit mode
 */

import React, { useState, useCallback, useRef, useEffect, KeyboardEvent } from 'react';
import { LocalizedContent, getLocalizedValue } from '@catalyst/core';
import { useCatalyst } from './CatalystContext';

export interface EditableTextProps {
  content: LocalizedContent;
  onUpdate?: (content: LocalizedContent) => void;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
}

export function EditableText({
  content,
  onUpdate,
  as: Component = 'span',
  className = '',
  style: customStyle = {},
}: EditableTextProps) {
  const { locale, isEditMode } = useCatalyst();
  const [isEditing, setIsEditing] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const originalValueRef = useRef<string>('');

  const displayValue = getLocalizedValue(content, locale);

  const handleDoubleClick = useCallback(() => {
    if (isEditMode && elementRef.current) {
      originalValueRef.current = displayValue;
      setIsEditing(true);
      // Focus the element after it becomes contentEditable
      setTimeout(() => {
        if (elementRef.current) {
          elementRef.current.focus();
          // Select all text for easy editing
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(elementRef.current);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  }, [isEditMode, displayValue]);

  const handleBlur = useCallback(() => {
    if (isEditing && elementRef.current && onUpdate) {
      const newValue = elementRef.current.textContent || '';
      if (newValue !== originalValueRef.current) {
        const updated: LocalizedContent = {
          ...content,
          [locale]: newValue,
        };
        onUpdate(updated);
      }
    }
    setIsEditing(false);
  }, [isEditing, content, locale, onUpdate]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      } else if (e.key === 'Escape') {
        // Restore original value on escape
        if (elementRef.current) {
          elementRef.current.textContent = originalValueRef.current;
        }
        setIsEditing(false);
        e.currentTarget.blur();
      }
    },
    []
  );

  // Sync the text content when displayValue changes externally
  useEffect(() => {
    if (!isEditing && elementRef.current) {
      elementRef.current.textContent = displayValue;
    }
  }, [displayValue, isEditing]);

  const editModeStyle = isEditMode
    ? {
        cursor: 'pointer',
        outline: '1px dashed #94a3b8',
        outlineOffset: '2px',
      }
    : {};

  const editingStyle = isEditing
    ? {
        outline: '2px solid #3b82f6',
        outlineOffset: '2px',
      }
    : {};

  const mergedStyle = { ...customStyle, ...editModeStyle, ...editingStyle };

  return (
    <Component
      ref={elementRef as any}
      className={className}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={mergedStyle}
      title={isEditMode ? 'Double-click to edit' : undefined}
      contentEditable={isEditing}
      suppressContentEditableWarning
    >
      {displayValue}
    </Component>
  );
}
