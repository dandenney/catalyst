/**
 * CTASection Component
 * Call-to-action section with heading, description, and button
 */

import React from 'react';
import { CTASectionSchema, getLocalizedValue } from '@catalyst/core';
import { EditableText, useCatalyst, VariantSelector, useVariantHandling } from '@catalyst/react';

export interface CTASectionProps {
  schema: CTASectionSchema;
  onUpdate?: (schema: CTASectionSchema) => void;
}

export function CTASection({ schema, onUpdate }: CTASectionProps) {
  const { locale, isEditMode } = useCatalyst();

  // Use the centralized variant handling hook
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  return (
    <div
      className="cta-section"
      style={{
        position: 'relative',
        padding: '3rem 1rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        borderRadius: '8px',
        margin: '2rem',
      }}
    >
      {/* Variant Selector in edit mode */}
      {isEditMode && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
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

      <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '800px' }}>
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
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '800px' }}>
        {isEditMode && editingVariant && schema.variants?.[editingVariant]?.description && (
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
          content={fields.description.value}
          onUpdate={(content) => updateField('description', content, onUpdate)}
          as="p"
          style={{
            fontSize: '1.125rem',
            marginBottom: '2rem',
            opacity: 0.95,
          }}
        />
      </div>

      <a
        href={getLocalizedValue(fields.buttonUrl.value, locale)}
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          background: 'white',
          color: '#667eea',
          textDecoration: 'none',
          borderRadius: '50px',
          fontWeight: '600',
          fontSize: '1rem',
          transition: 'transform 0.2s ease',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <EditableText
          content={fields.buttonText.value}
          onUpdate={(content) => updateField('buttonText', content, onUpdate)}
          as="span"
        />
      </a>
    </div>
  );
}
