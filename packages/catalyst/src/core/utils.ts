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
