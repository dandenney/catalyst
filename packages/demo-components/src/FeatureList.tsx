/**
 * FeatureList Component
 * Displays a list of features with titles and descriptions
 */

import React from 'react';
import { FeatureListSchema, LocalizedContent } from '@catalyst/core';
import { EditableText, useCatalyst, VariantSelector, useVariantHandling } from '@catalyst/react';

export interface FeatureListProps {
  schema: FeatureListSchema;
  onUpdate?: (schema: FeatureListSchema) => void;
}

export function FeatureList({ schema, onUpdate }: FeatureListProps) {
  const { isEditMode } = useCatalyst();

  // Use the centralized variant handling hook
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleItemTitleUpdate = (index: number, updatedContent: LocalizedContent) => {
    if (!onUpdate) return;

    // Clone the current items array
    const updatedItems = [...fields.items.value];
    updatedItems[index] = {
      ...updatedItems[index],
      title: updatedContent,
    };

    // Use the hook's updateField to handle variant logic
    updateField('items', updatedItems, onUpdate);
  };

  const handleItemDescriptionUpdate = (index: number, updatedContent: LocalizedContent) => {
    if (!onUpdate) return;

    // Clone the current items array
    const updatedItems = [...fields.items.value];
    updatedItems[index] = {
      ...updatedItems[index],
      description: updatedContent,
    };

    // Use the hook's updateField to handle variant logic
    updateField('items', updatedItems, onUpdate);
  };

  return (
    <div
      className="feature-list"
      style={{
        position: 'relative',
        padding: '3rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        border: isEditMode ? '2px dashed #cbd5e1' : 'none',
        borderRadius: isEditMode ? '8px' : '0',
      }}
    >
      {/* Component ID label in edit mode */}
      {isEditMode && (
        <div
          style={{
            position: 'absolute',
            top: '0.5rem',
            left: '1rem',
            background: '#f3f4f6',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            color: '#6b7280',
            fontFamily: 'monospace',
            zIndex: 10,
          }}
        >
          {schema.id}
        </div>
      )}

      {/* Variant Selector in edit mode */}
      {isEditMode && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
          }}
        >
          <VariantSelector
            variants={schema.variants}
            currentVariant={editingVariant}
            onVariantChange={setEditingVariant}
          />
        </div>
      )}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        {isEditMode && editingVariant && schema.variants?.[editingVariant]?.heading && (
          <div
            style={{
              position: 'absolute',
              top: '-24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#8b5cf6',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500',
              whiteSpace: 'nowrap',
            }}
          >
            Variant Override
          </div>
        )}
        <EditableText
          content={fields.heading.value}
          onUpdate={(content) => updateField('heading', content, onUpdate)}
          as="h2"
          className="feature-list-heading"
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        {fields.items.value.map((item, index) => (
          <div
            key={index}
            className="feature-item"
            style={{
              position: 'relative',
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: 'white',
            }}
          >
            {/* Variant Override indicator for the entire items list */}
            {isEditMode && editingVariant && schema.variants?.[editingVariant]?.items && index === 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '8px',
                  background: '#8b5cf6',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                }}
              >
                Variant Override (All Items)
              </div>
            )}
            <EditableText
              content={item.title}
              onUpdate={(updatedContent) =>
                handleItemTitleUpdate(index, updatedContent)
              }
              as="h3"
              className="feature-item-title"
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
              }}
            />
            <EditableText
              content={item.description}
              onUpdate={(updatedContent) =>
                handleItemDescriptionUpdate(index, updatedContent)
              }
              as="p"
              className="feature-item-description"
              style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: '1.6',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
