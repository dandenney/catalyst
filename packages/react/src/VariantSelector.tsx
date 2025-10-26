/**
 * VariantSelector
 * Allows switching between base and variant editing modes
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
  variants?: Record<string, any>;
  currentVariant: string | null;
  onVariantChange: (variant: string | null) => void;
}

export function VariantSelector({
  variants,
  currentVariant,
  onVariantChange,
}: VariantSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Inject styles on mount
  useEffect(() => {
    injectStyles();
  }, []);

  // If no variants exist, don't show the selector
  if (!variants || Object.keys(variants).length === 0) {
    return null;
  }

  const variantNames = Object.keys(variants);

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
            onClick={() => setIsOpen(false)}
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
              minWidth: '150px',
            }}
          >
            {/* Base option */}
            <button
              className="variant-selector-option"
              onClick={() => {
                console.log('🔵 VariantSelector: Switching to Base');
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
                  console.log('🟣 VariantSelector: Switching to variant:', variantName);
                  onVariantChange(variantName);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: currentVariant === variantName ? '#f1f5f9' : 'white',
                  border: 'none',
                  borderBottom: index < variantNames.length - 1 ? '1px solid #e5e7eb' : 'none',
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
          </div>
        </>
      )}
    </div>
  );
}
