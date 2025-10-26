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

export function ComponentControls({
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: ComponentControlsProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 10,
      }}
    >
      {canMoveUp && onMoveUp && (
        <button
          onClick={onMoveUp}
          style={{
            padding: '0.5rem',
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
          title="Move up"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
        >
          ↑
        </button>
      )}
      {canMoveDown && onMoveDown && (
        <button
          onClick={onMoveDown}
          style={{
            padding: '0.5rem',
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
          title="Move down"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
        >
          ↓
        </button>
      )}
      <button
        onClick={onRemove}
        style={{
          padding: '0.5rem 0.75rem',
          background: 'white',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: '#ef4444',
          fontWeight: '500',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
        title="Remove component"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#fef2f2';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
        }}
      >
        Remove
      </button>
    </div>
  );
}
