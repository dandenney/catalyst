/**
 * VariantSelector
 * Allows switching between base and variant editing modes
 * Includes ability to create new variants
 */

import React, { useState, useEffect } from 'react';

// Inject styles directly into the document head
const injectStyles = () => {
  if (typeof document === 'undefined') return;

  const styleId = 'variant-selector-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .variant-selector-option {
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
    }
  `;
  document.head.appendChild(style);
};

export interface VariantSelectorProps {
  variants?: Record<string, unknown>;
  currentVariant: string | null;
  onVariantChange: (variant: string | null) => void;
}

export function VariantSelector({
  variants = {},
  currentVariant,
  onVariantChange,
}: VariantSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newVariantName, setNewVariantName] = useState('');

  // Inject styles on mount
  useEffect(() => {
    injectStyles();
  }, []);

  const variantNames = Object.keys(variants || {});

  const handleCreateVariant = () => {
    if (!newVariantName.trim()) return;

    // Switch to the new variant (it will be created when user makes first edit)
    onVariantChange(newVariantName.trim());
    setNewVariantName('');
    setIsCreating(false);
    setIsOpen(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.5rem 0.75rem',
          background: currentVariant ? '#8b5cf6' : 'white',
          border: '1px solid #cbd5e1',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: currentVariant ? 'white' : '#64748b',
          fontWeight: '500',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
        title="Select variant to edit"
        onMouseEnter={(e) => {
          if (currentVariant) {
            e.currentTarget.style.background = '#7c3aed';
          } else {
            e.currentTarget.style.background = '#f1f5f9';
          }
        }}
        onMouseLeave={(e) => {
          if (currentVariant) {
            e.currentTarget.style.background = '#8b5cf6';
          } else {
            e.currentTarget.style.background = 'white';
          }
        }}
      >
        {currentVariant ? `Variant: ${currentVariant}` : 'Base'}
        <span style={{ fontSize: '0.75rem' }}>▼</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => {
              setIsOpen(false);
              setIsCreating(false);
              setNewVariantName('');
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 19,
            }}
          />

          {/* Dropdown */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.25rem',
              background: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 20,
              minWidth: '200px',
            }}
          >
            {/* Base option */}
            <button
              className="variant-selector-option"
              onClick={() => {
                onVariantChange(null);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: currentVariant === null ? '#f1f5f9' : 'white',
                border: 'none',
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textAlign: 'left',
                fontWeight: currentVariant === null ? '600' : '400',
              }}
              onMouseEnter={(e) => {
                if (currentVariant !== null) {
                  e.currentTarget.style.background = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (currentVariant !== null) {
                  e.currentTarget.style.background = 'white';
                }
              }}
            >
              Base
            </button>

            {/* Variant options */}
            {variantNames.map((variantName, index) => (
              <button
                key={variantName}
                className="variant-selector-option"
                onClick={() => {
                  onVariantChange(variantName);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: currentVariant === variantName ? '#f1f5f9' : 'white',
                  border: 'none',
                  borderBottom: isCreating || index < variantNames.length - 1 ? '1px solid #e5e7eb' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  fontWeight: currentVariant === variantName ? '600' : '400',
                }}
                onMouseEnter={(e) => {
                  if (currentVariant !== variantName) {
                    e.currentTarget.style.background = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentVariant !== variantName) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                {variantName}
              </button>
            ))}

            {/* Create new variant form */}
            {isCreating ? (
              <div
                style={{
                  padding: '0.75rem',
                  borderTop: variantNames.length > 0 ? '1px solid #e5e7eb' : 'none',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
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
                  placeholder="e.g., premium, mobile"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    color: '#1f2937',
                    backgroundColor: '#ffffff',
                  }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleCreateVariant}
                    disabled={!newVariantName.trim()}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: newVariantName.trim() ? '#10b981' : '#d1d5db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: newVariantName.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewVariantName('');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: 'white',
                      color: '#64748b',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Add Variant button */
              <button
                className="variant-selector-option"
                onClick={() => setIsCreating(true)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'white',
                  border: 'none',
                  borderTop: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  color: '#3b82f6',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                <span style={{ fontSize: '1rem' }}>+</span>
                Add Variant
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
