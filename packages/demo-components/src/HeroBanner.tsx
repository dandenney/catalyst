/**
 * HeroBanner Component
 * Hero banner with background image, title, and subtitle
 */

import React from 'react';
import { HeroBannerSchema, getLocalizedValue } from '@catalyst/core';
import { EditableText, useCatalyst, VariantSelector, useVariantHandling } from '@catalyst/react';

export interface HeroBannerProps {
  schema: HeroBannerSchema;
  onUpdate?: (schema: HeroBannerSchema) => void;
}

export function HeroBanner({ schema, onUpdate }: HeroBannerProps) {
  const { locale, isEditMode } = useCatalyst();

  // Use the centralized variant handling hook
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

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
            onUpdate={(content) => updateField('title', content, onUpdate)}
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
            onUpdate={(content) => updateField('subtitle', content, onUpdate)}
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
