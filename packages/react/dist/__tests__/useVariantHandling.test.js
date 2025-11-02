"use strict";
/**
 * Tests for useVariantHandling hook
 * Ensures consistent variant support across all components
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const react_1 = require("@testing-library/react");
const useVariantHandling_1 = require("../useVariantHandling");
const CatalystContext_1 = require("../CatalystContext");
const react_2 = __importDefault(require("react"));
const createTestSchema = () => ({
    id: 'test-1',
    type: 'TestComponent',
    fields: {
        heading: {
            type: 'text',
            value: { en: 'Base Heading' },
        },
        description: {
            type: 'text',
            value: { en: 'Base Description' },
        },
    },
    variants: {
        premium: {
            heading: {
                type: 'text',
                value: { en: 'Premium Heading' },
            },
        },
    },
});
(0, vitest_1.describe)('useVariantHandling', () => {
    (0, vitest_1.describe)('View Mode (No Edit)', () => {
        (0, vitest_1.it)('should return base schema when no personalization is active', () => {
            const schema = createTestSchema();
            const wrapper = ({ children }) => (react_2.default.createElement(CatalystContext_1.CatalystProvider, { locale: "en", isEditMode: false, personalization: {} }, children));
            const { result } = (0, react_1.renderHook)(() => (0, useVariantHandling_1.useVariantHandling)({ schema }), { wrapper });
            (0, vitest_1.expect)(result.current.displaySchema.fields.heading.value.en).toBe('Base Heading');
            (0, vitest_1.expect)(result.current.editingVariant).toBe(null);
        });
        (0, vitest_1.it)('should apply variant when personalization segment matches', () => {
            const schema = createTestSchema();
            const wrapper = ({ children }) => (react_2.default.createElement(CatalystContext_1.CatalystProvider, { locale: "en", isEditMode: false, personalization: { segment: 'premium' } }, children));
            const { result } = (0, react_1.renderHook)(() => (0, useVariantHandling_1.useVariantHandling)({ schema }), { wrapper });
            (0, vitest_1.expect)(result.current.displaySchema.fields.heading.value.en).toBe('Premium Heading');
            // Description should fallback to base
            (0, vitest_1.expect)(result.current.displaySchema.fields.description.value.en).toBe('Base Description');
        });
    });
    (0, vitest_1.describe)('Edit Mode', () => {
        (0, vitest_1.it)('should return base schema when editing base (no variant selected)', () => {
            const schema = createTestSchema();
            const wrapper = ({ children }) => (react_2.default.createElement(CatalystContext_1.CatalystProvider, { locale: "en", isEditMode: true, personalization: {} }, children));
            const { result } = (0, react_1.renderHook)(() => (0, useVariantHandling_1.useVariantHandling)({ schema }), { wrapper });
            (0, vitest_1.expect)(result.current.displaySchema.fields.heading.value.en).toBe('Base Heading');
            (0, vitest_1.expect)(result.current.editingVariant).toBe(null);
        });
        (0, vitest_1.it)('should switch to variant when setEditingVariant is called', () => {
            const schema = createTestSchema();
            const wrapper = ({ children }) => (react_2.default.createElement(CatalystContext_1.CatalystProvider, { locale: "en", isEditMode: true, personalization: {} }, children));
            const { result } = (0, react_1.renderHook)(() => (0, useVariantHandling_1.useVariantHandling)({ schema }), { wrapper });
            (0, react_1.act)(() => {
                result.current.setEditingVariant('premium');
            });
            (0, vitest_1.expect)(result.current.editingVariant).toBe('premium');
            (0, vitest_1.expect)(result.current.displaySchema.fields.heading.value.en).toBe('Premium Heading');
        });
        (0, vitest_1.it)('should switch back to base when setEditingVariant(null) is called', () => {
            const schema = createTestSchema();
            const wrapper = ({ children }) => (react_2.default.createElement(CatalystContext_1.CatalystProvider, { locale: "en", isEditMode: true, personalization: {} }, children));
            const { result } = (0, react_1.renderHook)(() => (0, useVariantHandling_1.useVariantHandling)({ schema }), { wrapper });
            // First switch to variant
            (0, react_1.act)(() => {
                result.current.setEditingVariant('premium');
            });
            (0, vitest_1.expect)(result.current.editingVariant).toBe('premium');
            // Then switch back to base
            (0, react_1.act)(() => {
                result.current.setEditingVariant(null);
            });
            (0, vitest_1.expect)(result.current.editingVariant).toBe(null);
            (0, vitest_1.expect)(result.current.displaySchema.fields.heading.value.en).toBe('Base Heading');
        });
    });
    (0, vitest_1.describe)('updateField', () => {
        (0, vitest_1.it)('should update base field when not editing a variant', () => {
            const schema = createTestSchema();
            const onUpdate = vitest_1.vi.fn();
            const wrapper = ({ children }) => (react_2.default.createElement(CatalystContext_1.CatalystProvider, { locale: "en", isEditMode: true, personalization: {} }, children));
            const { result } = (0, react_1.renderHook)(() => (0, useVariantHandling_1.useVariantHandling)({ schema }), { wrapper });
            (0, react_1.act)(() => {
                result.current.updateField('heading', { en: 'Updated Heading' }, onUpdate);
            });
            (0, vitest_1.expect)(onUpdate).toHaveBeenCalledTimes(1);
            const updatedSchema = onUpdate.mock.calls[0][0];
            (0, vitest_1.expect)(updatedSchema.fields.heading.value.en).toBe('Updated Heading');
            // Ensure variants are preserved
            (0, vitest_1.expect)(updatedSchema.variants?.premium).toBeDefined();
        });
        (0, vitest_1.it)('should update variant field when editing a variant', () => {
            const schema = createTestSchema();
            const onUpdate = vitest_1.vi.fn();
            const wrapper = ({ children }) => (react_2.default.createElement(CatalystContext_1.CatalystProvider, { locale: "en", isEditMode: true, personalization: {} }, children));
            const { result } = (0, react_1.renderHook)(() => (0, useVariantHandling_1.useVariantHandling)({ schema }), { wrapper });
            // Switch to editing variant
            (0, react_1.act)(() => {
                result.current.setEditingVariant('premium');
            });
            // Update variant field
            (0, react_1.act)(() => {
                result.current.updateField('heading', { en: 'Updated Premium Heading' }, onUpdate);
            });
            (0, vitest_1.expect)(onUpdate).toHaveBeenCalledTimes(1);
            const updatedSchema = onUpdate.mock.calls[0][0];
            // Base should remain unchanged
            (0, vitest_1.expect)(updatedSchema.fields.heading.value.en).toBe('Base Heading');
            // Variant should be updated
            (0, vitest_1.expect)(updatedSchema.variants?.premium?.heading).toBeDefined();
            const variantHeading = updatedSchema.variants?.premium?.heading;
            (0, vitest_1.expect)(variantHeading.value.en).toBe('Updated Premium Heading');
        });
        (0, vitest_1.it)('should create new variant field if it does not exist', () => {
            const schema = createTestSchema();
            const onUpdate = vitest_1.vi.fn();
            const wrapper = ({ children }) => (react_2.default.createElement(CatalystContext_1.CatalystProvider, { locale: "en", isEditMode: true, personalization: {} }, children));
            const { result } = (0, react_1.renderHook)(() => (0, useVariantHandling_1.useVariantHandling)({ schema }), { wrapper });
            // Switch to editing variant
            (0, react_1.act)(() => {
                result.current.setEditingVariant('premium');
            });
            // Update a field that doesn't have a variant override yet (description)
            (0, react_1.act)(() => {
                result.current.updateField('description', { en: 'Premium Description' }, onUpdate);
            });
            (0, vitest_1.expect)(onUpdate).toHaveBeenCalledTimes(1);
            const updatedSchema = onUpdate.mock.calls[0][0];
            // Variant should now have description
            (0, vitest_1.expect)(updatedSchema.variants?.premium?.description).toBeDefined();
            const variantDescription = updatedSchema.variants?.premium?.description;
            (0, vitest_1.expect)(variantDescription.value.en).toBe('Premium Description');
        });
        (0, vitest_1.it)('should not call onUpdate if it is not provided', () => {
            const schema = createTestSchema();
            const wrapper = ({ children }) => (react_2.default.createElement(CatalystContext_1.CatalystProvider, { locale: "en", isEditMode: true, personalization: {} }, children));
            const { result } = (0, react_1.renderHook)(() => (0, useVariantHandling_1.useVariantHandling)({ schema }), { wrapper });
            // Should not throw error
            (0, vitest_1.expect)(() => {
                (0, react_1.act)(() => {
                    result.current.updateField('heading', { en: 'Updated Heading' });
                });
            }).not.toThrow();
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle schema with no variants', () => {
            const schemaWithoutVariants = {
                id: 'test-2',
                type: 'TestComponent',
                fields: {
                    heading: {
                        type: 'text',
                        value: { en: 'No Variants' },
                    },
                    description: {
                        type: 'text',
                        value: { en: 'Description' },
                    },
                },
            };
            const wrapper = ({ children }) => (react_2.default.createElement(CatalystContext_1.CatalystProvider, { locale: "en", isEditMode: true, personalization: {} }, children));
            const { result } = (0, react_1.renderHook)(() => (0, useVariantHandling_1.useVariantHandling)({ schema: schemaWithoutVariants }), { wrapper });
            (0, vitest_1.expect)(result.current.displaySchema.fields.heading.value.en).toBe('No Variants');
            (0, vitest_1.expect)(result.current.editingVariant).toBe(null);
        });
        (0, vitest_1.it)('should handle updating with empty variants object', () => {
            const schemaWithEmptyVariants = {
                id: 'test-3',
                type: 'TestComponent',
                fields: {
                    heading: {
                        type: 'text',
                        value: { en: 'Heading' },
                    },
                    description: {
                        type: 'text',
                        value: { en: 'Description' },
                    },
                },
                variants: {},
            };
            const onUpdate = vitest_1.vi.fn();
            const wrapper = ({ children }) => (react_2.default.createElement(CatalystContext_1.CatalystProvider, { locale: "en", isEditMode: true, personalization: {} }, children));
            const { result } = (0, react_1.renderHook)(() => (0, useVariantHandling_1.useVariantHandling)({ schema: schemaWithEmptyVariants }), { wrapper });
            (0, react_1.act)(() => {
                result.current.updateField('heading', { en: 'Updated' }, onUpdate);
            });
            (0, vitest_1.expect)(onUpdate).toHaveBeenCalledTimes(1);
        });
    });
});
