/**
 * ComponentPanel
 * Side panel UI for managing components in edit mode
 */

import React, { useState } from 'react';
import { ComponentMetadata, getAvailableComponents } from '@catalyst/core';

export interface ComponentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (type: string) => void;
}

export function ComponentPanel({ isOpen, onClose, onSelectComponent }: ComponentPanelProps) {
  const [selectedComponent, setSelectedComponent] = useState<ComponentMetadata | null>(null);
  const availableComponents = getAvailableComponents();

  if (!isOpen) return null;

  const handleSelectComponent = (component: ComponentMetadata) => {
    setSelectedComponent(component);
  };

  const handleAddComponent = () => {
    if (selectedComponent) {
      onSelectComponent(selectedComponent.type);
      setSelectedComponent(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 999,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '400px',
          background: 'white',
          boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
            Add Component
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              color: '#6b7280',
            }}
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        {/* Component List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {availableComponents.map((component) => (
              <button
                key={component.type}
                onClick={() => handleSelectComponent(component)}
                style={{
                  padding: '1rem',
                  border: selectedComponent?.type === component.type
                    ? '2px solid #3b82f6'
                    : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: selectedComponent?.type === component.type
                    ? '#eff6ff'
                    : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedComponent?.type !== component.type) {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedComponent?.type !== component.type) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Thumbnail Preview */}
                  {component.thumbnail && (
                    <div
                      style={{
                        width: '100%',
                        height: '150px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        background: '#f3f4f6',
                      }}
                    >
                      <img
                        src={component.thumbnail}
                        alt={`${component.label} preview`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  )}

                  {/* Component Info */}
                  <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                    <span style={{ fontSize: '2rem', lineHeight: 1 }}>
                      {component.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {component.label}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {component.description}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview & Add Button */}
        {selectedComponent && (
          <div
            style={{
              padding: '1rem',
              borderTop: '1px solid #e5e7eb',
              background: '#f9fafb',
            }}
          >
            <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
              <strong>{selectedComponent.label}</strong> will be added to your page
            </div>
            <button
              onClick={handleAddComponent}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3b82f6';
              }}
            >
              Add to Page
            </button>
          </div>
        )}
      </div>
    </>
  );
}
