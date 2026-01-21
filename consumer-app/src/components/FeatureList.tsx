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
      className={`feature-list relative px-4 py-12 max-w-screen-xl mx-auto ${
        isEditMode ? 'border-2 border-dashed border-slate-300 rounded-lg' : ''
      }`}
    >
      {/* Component ID label in edit mode */}
      {isEditMode && (
        <div className="absolute top-2 left-4 bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 font-mono z-10">
          {schema.id}
        </div>
      )}

      {/* Variant Selector in edit mode - positioned below ID label to avoid overlap with ComponentControls */}
      {isEditMode && (
        <div className="absolute top-10 left-4 z-10">
          <VariantSelector
            variants={schema.variants}
            currentVariant={editingVariant}
            onVariantChange={setEditingVariant}
          />
        </div>
      )}
      <div className="relative mb-8">
        {isEditMode && editingVariant && schema.variants?.[editingVariant]?.heading && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
            Variant Override
          </div>
        )}
        <EditableText
          content={fields.heading.value}
          onUpdate={(content) => updateField('heading', content, onUpdate)}
          as="h2"
          className="feature-list-heading text-4xl font-bold text-center"
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
        {fields.items.value.map((item, index) => (
          <div
            key={index}
            className="feature-item relative p-6 border border-gray-200 rounded-lg bg-white"
          >
            {/* Variant Override indicator for the entire items list */}
            {isEditMode && editingVariant && schema.variants?.[editingVariant]?.items && index === 0 && (
              <div className="absolute -top-3 right-2 bg-violet-600 text-white px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
                Variant Override (All Items)
              </div>
            )}
            <EditableText
              content={item.title}
              onUpdate={(updatedContent) =>
                handleItemTitleUpdate(index, updatedContent)
              }
              as="h3"
              className="feature-item-title text-2xl font-semibold mb-3"
            />
            <EditableText
              content={item.description}
              onUpdate={(updatedContent) =>
                handleItemDescriptionUpdate(index, updatedContent)
              }
              as="p"
              className="feature-item-description text-base text-gray-500 leading-relaxed"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
