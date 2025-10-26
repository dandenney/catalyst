"use strict";
/**
 * Core utilities for localization and personalization
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalizedValue = getLocalizedValue;
exports.applyPersonalization = applyPersonalization;
exports.updateLocalizedField = updateLocalizedField;
/**
 * Get localized value with fallback to 'en'
 */
function getLocalizedValue(content, locale) {
    return content[locale] ?? content.en;
}
/**
 * Apply personalization to a component based on context
 * Returns a new component with variant fields merged in
 */
function applyPersonalization(component, context) {
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
        },
    };
}
/**
 * Update a localized field value
 */
function updateLocalizedField(content, locale, value) {
    return {
        ...content,
        [locale]: value,
    };
}
