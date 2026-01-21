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
      className="hero-banner relative min-h-[400px] flex items-center justify-center bg-cover bg-center text-white px-4 py-12"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${fields.backgroundImage.src})`,
      }}
      role="img"
      aria-label={bgImage}
    >
      {/* Variant Selector in edit mode */}
      {isEditMode && (
        <div className="absolute top-2 left-2 z-10">
          <VariantSelector
            variants={schema.variants}
            currentVariant={editingVariant}
            onVariantChange={setEditingVariant}
          />
        </div>
      )}
      <div className="text-center max-w-3xl">
        <div className="relative inline-block w-full">
          {isEditMode && editingVariant && schema.variants?.[editingVariant]?.title && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
              Variant Override
            </div>
          )}
          <EditableText
            content={fields.title.value}
            onUpdate={(content) => updateField('title', content, onUpdate)}
            as="h1"
            className="hero-title text-5xl font-bold mb-4"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          />
        </div>
        <div className="relative inline-block w-full">
          {isEditMode && editingVariant && schema.variants?.[editingVariant]?.subtitle && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
              Variant Override
            </div>
          )}
          <EditableText
            content={fields.subtitle.value}
            onUpdate={(content) => updateField('subtitle', content, onUpdate)}
            as="p"
            className="hero-subtitle text-2xl"
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
