/**
 * Editable Text Component
 * Renders text that can be edited in-place when in edit mode
 */

import React, { useState, useCallback, KeyboardEvent } from 'react';
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
  const [editValue, setEditValue] = useState('');

  const displayValue = getLocalizedValue(content, locale);

  const handleDoubleClick = useCallback(() => {
    if (isEditMode) {
      setEditValue(displayValue);
      setIsEditing(true);
    }
  }, [isEditMode, displayValue]);

  const handleBlur = useCallback(() => {
    if (isEditing && editValue !== displayValue && onUpdate) {
      const updated: LocalizedContent = {
        ...content,
        [locale]: editValue,
      };
      onUpdate(updated);
    }
    setIsEditing(false);
  }, [isEditing, editValue, displayValue, content, locale, onUpdate]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.currentTarget.blur();
      } else if (e.key === 'Escape') {
        setIsEditing(false);
      }
    },
    []
  );

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className={`${className} catalyst-editing`}
        style={{
          font: 'inherit',
          border: '2px solid #3b82f6',
          background: '#eff6ff',
          padding: '2px 4px',
          borderRadius: '2px',
          outline: 'none',
        }}
      />
    );
  }

  const editModeStyle = isEditMode
    ? {
        cursor: 'pointer',
        outline: '1px dashed #94a3b8',
        outlineOffset: '2px',
      }
    : {};

  const mergedStyle = { ...customStyle, ...editModeStyle };

  return (
    <Component
      className={className}
      onDoubleClick={handleDoubleClick}
      style={mergedStyle}
      title={isEditMode ? 'Double-click to edit' : undefined}
    >
      {displayValue}
    </Component>
  );
}
