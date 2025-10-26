/**
 * FeatureList Component
 * Displays a list of features with titles and descriptions
 */

import React, { useState } from 'react';
import { FeatureListSchema, getLocalizedValue, applyPersonalization, TextField, Field } from '@catalyst/core';
import { EditableText, useCatalyst, VariantSelector } from '@catalyst/react';

export interface FeatureListProps {
  schema: FeatureListSchema;
  onUpdate?: (schema: FeatureListSchema) => void;
}

export function FeatureList({ schema, onUpdate }: FeatureListProps) {
  const { locale, isEditMode, personalization } = useCatalyst();
  const [editingVariant, setEditingVariant] = useState<string | null>(null);

  // Log when editing variant changes
  const handleVariantChange = (variant: string | null) => {
    console.log('🎯 FeatureList: editingVariant changing from', editingVariant, 'to', variant);
    setEditingVariant(variant);
  };

  // In edit mode, determine which schema to display based on editing variant
  // In view mode, apply personalization normally
  const displaySchema = isEditMode && editingVariant
    ? applyPersonalization(schema, { segment: editingVariant }) as FeatureListSchema
    : isEditMode
    ? schema
    : applyPersonalization(schema, personalization) as FeatureListSchema;

  const { fields } = displaySchema;

  const handleHeadingUpdate = (updatedContent: any) => {
    if (!onUpdate) return;

    // If editing a variant, update the variant fields
    if (editingVariant) {
      // Get the current field from either the variant or base fields
      const variantField = schema.variants?.[editingVariant]?.heading;
      const currentField = variantField || schema.fields.heading;

      const updatedSchema: FeatureListSchema = {
        ...schema,
        variants: {
          ...schema.variants,
          [editingVariant]: {
            ...schema.variants?.[editingVariant],
            heading: {
              ...currentField,
              value: updatedContent,
            } as TextField,
          },
        },
      };
      onUpdate(updatedSchema);
    } else {
      // Otherwise, update base fields
      const updatedSchema: FeatureListSchema = {
        ...schema,
        fields: {
          ...schema.fields,
          heading: {
            ...schema.fields.heading,
            value: updatedContent,
          },
        },
      };
      onUpdate(updatedSchema);
    }
  };

  const handleItemTitleUpdate = (index: number, updatedContent: any) => {
    if (!onUpdate) return;

    console.log('🔧 handleItemTitleUpdate called', {
      editingVariant,
      index,
      updatedContent,
      hasVariants: !!schema.variants,
      variantKeys: schema.variants ? Object.keys(schema.variants) : []
    });

    // If editing a variant, update the variant fields
    if (editingVariant) {
      console.log('📝 Editing variant:', editingVariant);
      // Get current items from variant or base
      const variantItems = schema.variants?.[editingVariant]?.items as FeatureListSchema['fields']['items'] | undefined;
      const currentItems = variantItems?.value || schema.fields.items.value;
      console.log('📋 Current items source:', variantItems ? 'variant' : 'base', currentItems);

      const updatedItems = [...currentItems];
      updatedItems[index] = {
        ...updatedItems[index],
        title: updatedContent,
      };

      const updatedSchema: FeatureListSchema = {
        ...schema,
        variants: {
          ...schema.variants,
          [editingVariant]: {
            ...schema.variants?.[editingVariant],
            items: {
              type: 'list',
              value: updatedItems,
            } as FeatureListSchema['fields']['items'],
          } as Partial<Record<string, Field>>,
        },
      };
      console.log('✅ Updated schema (variant):', JSON.stringify(updatedSchema, null, 2));
      onUpdate(updatedSchema);
    } else {
      console.log('📝 Editing base');

      // Otherwise, update base fields
      const updatedItems = [...schema.fields.items.value];
      updatedItems[index] = {
        ...updatedItems[index],
        title: updatedContent,
      };

      const updatedSchema: FeatureListSchema = {
        ...schema,
        fields: {
          ...schema.fields,
          items: {
            ...schema.fields.items,
            value: updatedItems,
          },
        },
      };
      onUpdate(updatedSchema);
    }
  };

  const handleItemDescriptionUpdate = (index: number, updatedContent: any) => {
    if (!onUpdate) return;

    // If editing a variant, update the variant fields
    if (editingVariant) {
      // Get current items from variant or base
      const variantItems = schema.variants?.[editingVariant]?.items as FeatureListSchema['fields']['items'] | undefined;
      const currentItems = variantItems?.value || schema.fields.items.value;
      const updatedItems = [...currentItems];
      updatedItems[index] = {
        ...updatedItems[index],
        description: updatedContent,
      };

      const updatedSchema: FeatureListSchema = {
        ...schema,
        variants: {
          ...schema.variants,
          [editingVariant]: {
            ...schema.variants?.[editingVariant],
            items: {
              type: 'list',
              value: updatedItems,
            } as FeatureListSchema['fields']['items'],
          } as Partial<Record<string, Field>>,
        },
      };
      onUpdate(updatedSchema);
    } else {
      // Otherwise, update base fields
      const updatedItems = [...schema.fields.items.value];
      updatedItems[index] = {
        ...updatedItems[index],
        description: updatedContent,
      };

      const updatedSchema: FeatureListSchema = {
        ...schema,
        fields: {
          ...schema.fields,
          items: {
            ...schema.fields.items,
            value: updatedItems,
          },
        },
      };
      onUpdate(updatedSchema);
    }
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
            onVariantChange={handleVariantChange}
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
          onUpdate={handleHeadingUpdate}
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
