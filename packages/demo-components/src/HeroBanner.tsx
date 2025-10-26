/**
 * HeroBanner Component
 * Hero banner with background image, title, and subtitle
 */

import React, { useState } from 'react';
import { HeroBannerSchema, applyPersonalization, getLocalizedValue } from '@catalyst/core';
import { EditableText, useCatalyst, VariantSelector } from '@catalyst/react';

export interface HeroBannerProps {
  schema: HeroBannerSchema;
  onUpdate?: (schema: HeroBannerSchema) => void;
}

export function HeroBanner({ schema, onUpdate }: HeroBannerProps) {
  const { personalization, locale, isEditMode } = useCatalyst();
  const [editingVariant, setEditingVariant] = useState<string | null>(null);

  // In edit mode, determine which schema to display based on editing variant
  // In view mode, apply personalization normally
  const displaySchema = isEditMode && editingVariant
    ? applyPersonalization(schema, { segment: editingVariant }) as HeroBannerSchema
    : isEditMode
    ? schema
    : applyPersonalization(schema, personalization) as HeroBannerSchema;

  const { fields } = displaySchema;

  const handleFieldUpdate = (fieldName: keyof HeroBannerSchema['fields'], updatedContent: any) => {
    if (!onUpdate) return;

    // If editing a variant, update the variant fields
    if (editingVariant) {
      // Get the current field from either the variant or base fields
      const variantField = schema.variants?.[editingVariant]?.[fieldName];
      const currentField = variantField || schema.fields[fieldName];

      // Create the updated field based on field type
      let updatedField;
      if (currentField.type === 'image') {
        // For image fields, update the alt text
        updatedField = {
          ...currentField,
          alt: updatedContent,
        };
      } else {
        // For text fields, update the value
        updatedField = {
          ...currentField,
          value: updatedContent,
        };
      }

      const updatedSchema: HeroBannerSchema = {
        ...schema,
        variants: {
          ...schema.variants,
          [editingVariant]: {
            ...schema.variants?.[editingVariant],
            [fieldName]: updatedField,
          },
        },
      };
      onUpdate(updatedSchema);
    } else {
      // Otherwise, update base fields
      const currentField = schema.fields[fieldName];

      // Create the updated field based on field type
      let updatedField;
      if (currentField.type === 'image') {
        // For image fields, update the alt text
        updatedField = {
          ...currentField,
          alt: updatedContent,
        };
      } else {
        // For text fields, update the value
        updatedField = {
          ...currentField,
          value: updatedContent,
        };
      }

      const updatedSchema: HeroBannerSchema = {
        ...schema,
        fields: {
          ...schema.fields,
          [fieldName]: updatedField,
        },
      };
      onUpdate(updatedSchema);
    }
  };

  const bgImage = getLocalizedValue(fields.backgroundImage.alt, locale);

  return (
    <div
      className="hero-banner"
      style={{
        position: 'relative',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${fields.backgroundImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '3rem 1rem',
      }}
      role="img"
      aria-label={bgImage}
    >
      {/* Variant Selector in edit mode */}
      {isEditMode && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
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
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          {isEditMode && editingVariant && schema.variants?.[editingVariant]?.title && (
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
            content={fields.title.value}
            onUpdate={(content) => handleFieldUpdate('title', content)}
            as="h1"
            className="hero-title"
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          />
        </div>
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          {isEditMode && editingVariant && schema.variants?.[editingVariant]?.subtitle && (
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
            content={fields.subtitle.value}
            onUpdate={(content) => handleFieldUpdate('subtitle', content)}
            as="p"
            className="hero-subtitle"
            style={{
              fontSize: '1.5rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
