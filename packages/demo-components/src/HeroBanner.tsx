/**
 * HeroBanner Component
 * Hero banner with background image, title, and subtitle
 */

import React from 'react';
import { HeroBannerSchema, applyPersonalization, getLocalizedValue } from '@catalyst/core';
import { EditableText, useCatalyst } from '@catalyst/react';

export interface HeroBannerProps {
  schema: HeroBannerSchema;
  onUpdate?: (schema: HeroBannerSchema) => void;
}

export function HeroBanner({ schema, onUpdate }: HeroBannerProps) {
  const { personalization, locale } = useCatalyst();

  // Apply personalization to get the right variant
  const personalizedSchema = applyPersonalization(schema, personalization) as HeroBannerSchema;
  const { fields } = personalizedSchema;

  const handleFieldUpdate = (fieldName: keyof HeroBannerSchema['fields'], updatedContent: any) => {
    if (!onUpdate) return;

    const updatedSchema: HeroBannerSchema = {
      ...schema,
      fields: {
        ...schema.fields,
        [fieldName]: {
          ...schema.fields[fieldName],
          value: updatedContent,
        },
      },
    };

    onUpdate(updatedSchema);
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
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
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
  );
}
