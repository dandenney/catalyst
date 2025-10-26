/**
 * InsertButton
 * Button that appears between components to insert new components
 */

import React, { useState } from 'react';

export interface InsertButtonProps {
  onInsert: () => void;
}

export function InsertButton({ onInsert }: InsertButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        height: '2px',
        background: isHovered ? '#3b82f6' : '#e5e7eb',
        margin: '0.5rem 0',
        transition: 'all 0.2s',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onInsert}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '0.5rem 1rem',
          background: isHovered ? '#3b82f6' : 'white',
          color: isHovered ? 'white' : '#3b82f6',
          border: '2px solid #3b82f6',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '600',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s',
          opacity: isHovered ? 1 : 0.7,
        }}
        title="Insert component here"
      >
        + Add Component
      </button>
    </div>
  );
}
