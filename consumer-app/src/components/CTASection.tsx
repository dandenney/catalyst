/**
 * CTASection Component
 * Call-to-action section with heading, description, and button
 */

import React from 'react';
import { CTASectionSchema } from '@catalyst/core';
import { EditableText, EditableImage, EditableLink, useCatalyst, VariantSelector, useVariantHandling } from '@catalyst/react';

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
      className="bg-violet-600 cta-section relative py-12 px-8 md:px-16 text-white m-8"
    >
      {/* Variant Selector in edit mode - positioned on left to avoid overlap with ComponentControls */}
      {isEditMode && (
        <div className="absolute top-2 left-2 z-10">
          <VariantSelector
            variants={schema.variants}
            currentVariant={editingVariant}
            onVariantChange={setEditingVariant}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col items-start md:flex-row gap-8 md:gap-12">
        {/* Left Section: Image and Headline */}
        <div className="flex-1 flex flex-col max-w-xs">
          {/* Image and Headline */}
          <div className="space-y-4">
            <EditableImage
              src={fields.image.src}
              alt={fields.image.alt}
              onUpdate={({ src, alt }) => {
                const updated: CTASectionSchema = {
                  ...schema,
                  fields: {
                    ...schema.fields,
                    image: { type: 'image', src, alt },
                  },
                };
                onUpdate?.(updated);
              }}
              width={80}
              height={80}
              style={{ borderRadius: '8px' }}
            />
            <div className="relative">
              {isEditMode && editingVariant && schema.variants?.[editingVariant]?.heading && (
                <div className="absolute -top-6 left-0 bg-violet-600 text-white px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
                  Variant Override
                </div>
              )}
              <EditableText
                content={fields.heading.value}
                onUpdate={(content) => updateField('heading', content, onUpdate)}
                as="h2"
                className="text-xl md:text-2xl font-bold text-white leading-tight"
              />
            </div>
          </div>
        </div>

        {/* Right Section: Description and Link */}
        <div className="flex-1 flex flex-col">
          <div className="relative mb-4">
            {isEditMode && editingVariant && schema.variants?.[editingVariant]?.description && (
              <div className="absolute -top-6 left-0 bg-violet-600 text-white px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
                Variant Override
              </div>
            )}
            <EditableText
              content={fields.description.value}
              onUpdate={(content) => updateField('description', content, onUpdate)}
              as="p"
              className="text-white text-base leading-relaxed mb-4"
            />
          </div>

          <EditableLink
            href={fields.buttonUrl.value}
            text={fields.buttonText.value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#6dd5ed] no-underline font-normal text-base hover:underline"
            onUpdate={({ href, text }) => {
              const updated: CTASectionSchema = {
                ...schema,
                fields: {
                  ...schema.fields,
                  buttonUrl: { type: 'text', value: href },
                  buttonText: { type: 'text', value: text },
                },
              };
              onUpdate?.(updated);
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </EditableLink>
        </div>
      </div>
    </div>
  );
}
