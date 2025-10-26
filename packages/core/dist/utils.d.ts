/**
 * Core utilities for localization and personalization
 */
import { LocalizedContent, Locale, ComponentSchema, PersonalizationContext } from './types';
/**
 * Get localized value with fallback to 'en'
 */
export declare function getLocalizedValue<T = string>(content: LocalizedContent<T>, locale: Locale): T;
/**
 * Apply personalization to a component based on context
 * Returns a new component with variant fields merged in
 */
export declare function applyPersonalization(component: ComponentSchema, context: PersonalizationContext): ComponentSchema;
/**
 * Update a localized field value
 */
export declare function updateLocalizedField(content: LocalizedContent, locale: Locale, value: string): LocalizedContent;
