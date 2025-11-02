/**
 * COMPONENT TEMPLATE
 *
 * Copy this file when creating new components to ensure proper variant support.
 * Follow the checklist in /docs/component-development-guide.md
 */

import React from 'react';
import { ComponentNameSchema, getLocalizedValue } from '@catalyst/core';
import { EditableText, useCatalyst, VariantSelector, useVariantHandling } from '@catalyst/react';

export interface ComponentNameProps {
  schema: ComponentNameSchema;
  onUpdate?: (schema: ComponentNameSchema) => void;
}

/**
 * ComponentName Component
 *
 * TODO: Add description
 *
 * Features:
 * - ✅ Full variant support via useVariantHandling hook
 * - ✅ Localization support (en/es)
 * - ✅ Edit mode with inline editing
 * - ✅ Personalization support
 */
export function ComponentName({ schema, onUpdate }: ComponentNameProps) {
  const { locale, isEditMode } = useCatalyst();

  // ✅ REQUIRED: Use variant handling hook
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  // ✅ Use displaySchema (not raw schema) to respect variants
  const { fields } = displaySchema;

  return (
    <div
      className="component-name"
      style={{
        position: 'relative',
        padding: '2rem',
        // Add your styles here
      }}
    >
      {/* ✅ REQUIRED: Variant Selector in edit mode */}
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

      {/* Example: Editable Heading Field */}
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        {/* Show variant override badge when editing a variant */}
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
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        />
      </div>

      {/* Example: Editable Description Field */}
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
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
            fontSize: '1rem',
            marginTop: '1rem',
          }}
        />
      </div>

      {/* Example: Non-editable element using localized value */}
      <a
        href={getLocalizedValue(fields.buttonUrl.value, locale)}
        style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          background: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginTop: '1rem',
        }}
      >
        {getLocalizedValue(fields.buttonText.value, locale)}
      </a>
    </div>
  );
}
