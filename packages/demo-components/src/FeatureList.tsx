/**
 * FeatureList Component
 * Displays a list of features with titles and descriptions
 */

import React from 'react';
import { FeatureListSchema, getLocalizedValue } from '@catalyst/core';
import { EditableText, useCatalyst } from '@catalyst/react';

export interface FeatureListProps {
  schema: FeatureListSchema;
  onUpdate?: (schema: FeatureListSchema) => void;
}

export function FeatureList({ schema, onUpdate }: FeatureListProps) {
  const { locale } = useCatalyst();
  const { fields } = schema;

  const handleHeadingUpdate = (updatedContent: any) => {
    if (!onUpdate) return;

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
  };

  const handleItemTitleUpdate = (index: number, updatedContent: any) => {
    if (!onUpdate) return;

    const updatedItems = [...fields.items.value];
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
  };

  const handleItemDescriptionUpdate = (index: number, updatedContent: any) => {
    if (!onUpdate) return;

    const updatedItems = [...fields.items.value];
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
  };

  return (
    <div
      className="feature-list"
      style={{
        padding: '3rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <EditableText
        content={fields.heading.value}
        onUpdate={handleHeadingUpdate}
        as="h2"
        className="feature-list-heading"
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      />
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
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: 'white',
            }}
          >
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
