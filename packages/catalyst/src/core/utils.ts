/**
 * Core utilities for localization and personalization
 */

import { LocalizedContent, Locale, ComponentSchema, PersonalizationContext, Field } from './types';

/**
 * Get localized value with fallback to 'en'
 */
export function getLocalizedValue<T = string>(
  content: LocalizedContent<T>,
  locale: Locale
): T {
  return content[locale] ?? content.en;
}

/**
 * Apply personalization to a component based on context
 * Returns a new component with variant fields merged in
 */
export function applyPersonalization(
  component: ComponentSchema,
  context: PersonalizationContext
): ComponentSchema {
  if (!component.variants || !context.segment) {
    return component;
  }

  const variant = component.variants[context.segment];
  if (!variant) {
    return component;
  }

  // Merge variant fields into component
  return {
    ...component,
    fields: {
      ...component.fields,
      ...variant,
    } as Record<string, Field>,
  };
}

/**
 * Configuration for a toggleable field in the edit sheet.
 * Declared by each editable component to specify which fields can be toggled.
 */
export interface FieldToggleConfig {
  /** The field key in the schema (e.g., 'heading', 'link') */
  key: string;
  /** Human-readable label for the toggle switch (e.g., 'Heading') */
  label: string;
}

/**
 * Check if a field is enabled (not in the disabledFields array).
 * When a variant is specified, checks variantDisabledFields first,
 * falling back to base disabledFields if the variant doesn't specify its own.
 */
export function isFieldEnabled(
  schema: ComponentSchema,
  fieldKey: string,
  variant?: string | null
): boolean {
  if (variant) {
    const variantDisabled = schema.variantDisabledFields?.[variant];
    if (variantDisabled) {
      return !variantDisabled.includes(fieldKey);
    }
  }
  return !schema.disabledFields?.includes(fieldKey);
}

/**
 * Get the resolved disabled fields array for a given variant context.
 * Returns the variant-specific array if it exists, otherwise the base array.
 */
export function getDisabledFields(
  schema: ComponentSchema,
  variant?: string | null
): string[] {
  if (variant) {
    const variantDisabled = schema.variantDisabledFields?.[variant];
    if (variantDisabled) {
      return variantDisabled;
    }
  }
  return schema.disabledFields ?? [];
}

/**
 * Update a localized field value
 */
export function updateLocalizedField(
  content: LocalizedContent,
  locale: Locale,
  value: string
): LocalizedContent {
  return {
    ...content,
    [locale]: value,
  };
}
