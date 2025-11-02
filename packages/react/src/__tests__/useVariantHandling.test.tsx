/**
 * Tests for useVariantHandling hook
 * Ensures consistent variant support across all components
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVariantHandling } from '../useVariantHandling';
import { CatalystProvider } from '../CatalystContext';
import { ComponentSchema, TextField } from '@catalyst/core';
import React from 'react';

// Sample schema for testing
interface TestComponentSchema extends ComponentSchema {
  type: 'TestComponent';
  fields: {
    heading: TextField;
    description: TextField;
  };
}

const createTestSchema = (): TestComponentSchema => ({
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

describe('useVariantHandling', () => {
  describe('View Mode (No Edit)', () => {
    it('should return base schema when no personalization is active', () => {
      const schema = createTestSchema();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CatalystProvider locale="en" isEditMode={false} personalization={{}}>
          {children}
        </CatalystProvider>
      );

      const { result } = renderHook(() => useVariantHandling({ schema }), { wrapper });

      expect(result.current.displaySchema.fields.heading.value.en).toBe('Base Heading');
      expect(result.current.editingVariant).toBe(null);
    });

    it('should apply variant when personalization segment matches', () => {
      const schema = createTestSchema();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CatalystProvider
          locale="en"
          isEditMode={false}
          personalization={{ segment: 'premium' }}
        >
          {children}
        </CatalystProvider>
      );

      const { result } = renderHook(() => useVariantHandling({ schema }), { wrapper });

      expect(result.current.displaySchema.fields.heading.value.en).toBe('Premium Heading');
      // Description should fallback to base
      expect(result.current.displaySchema.fields.description.value.en).toBe('Base Description');
    });
  });

  describe('Edit Mode', () => {
    it('should return base schema when editing base (no variant selected)', () => {
      const schema = createTestSchema();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CatalystProvider locale="en" isEditMode={true} personalization={{}}>
          {children}
        </CatalystProvider>
      );

      const { result } = renderHook(() => useVariantHandling({ schema }), { wrapper });

      expect(result.current.displaySchema.fields.heading.value.en).toBe('Base Heading');
      expect(result.current.editingVariant).toBe(null);
    });

    it('should switch to variant when setEditingVariant is called', () => {
      const schema = createTestSchema();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CatalystProvider locale="en" isEditMode={true} personalization={{}}>
          {children}
        </CatalystProvider>
      );

      const { result } = renderHook(() => useVariantHandling({ schema }), { wrapper });

      act(() => {
        result.current.setEditingVariant('premium');
      });

      expect(result.current.editingVariant).toBe('premium');
      expect(result.current.displaySchema.fields.heading.value.en).toBe('Premium Heading');
    });

    it('should switch back to base when setEditingVariant(null) is called', () => {
      const schema = createTestSchema();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CatalystProvider locale="en" isEditMode={true} personalization={{}}>
          {children}
        </CatalystProvider>
      );

      const { result } = renderHook(() => useVariantHandling({ schema }), { wrapper });

      // First switch to variant
      act(() => {
        result.current.setEditingVariant('premium');
      });

      expect(result.current.editingVariant).toBe('premium');

      // Then switch back to base
      act(() => {
        result.current.setEditingVariant(null);
      });

      expect(result.current.editingVariant).toBe(null);
      expect(result.current.displaySchema.fields.heading.value.en).toBe('Base Heading');
    });
  });

  describe('updateField', () => {
    it('should update base field when not editing a variant', () => {
      const schema = createTestSchema();
      const onUpdate = vi.fn();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CatalystProvider locale="en" isEditMode={true} personalization={{}}>
          {children}
        </CatalystProvider>
      );

      const { result } = renderHook(() => useVariantHandling({ schema }), { wrapper });

      act(() => {
        result.current.updateField('heading', { en: 'Updated Heading' }, onUpdate);
      });

      expect(onUpdate).toHaveBeenCalledTimes(1);
      const updatedSchema = onUpdate.mock.calls[0][0] as TestComponentSchema;
      expect(updatedSchema.fields.heading.value.en).toBe('Updated Heading');
      // Ensure variants are preserved
      expect(updatedSchema.variants?.premium).toBeDefined();
    });

    it('should update variant field when editing a variant', () => {
      const schema = createTestSchema();
      const onUpdate = vi.fn();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CatalystProvider locale="en" isEditMode={true} personalization={{}}>
          {children}
        </CatalystProvider>
      );

      const { result } = renderHook(() => useVariantHandling({ schema }), { wrapper });

      // Switch to editing variant
      act(() => {
        result.current.setEditingVariant('premium');
      });

      // Update variant field
      act(() => {
        result.current.updateField('heading', { en: 'Updated Premium Heading' }, onUpdate);
      });

      expect(onUpdate).toHaveBeenCalledTimes(1);
      const updatedSchema = onUpdate.mock.calls[0][0] as TestComponentSchema;

      // Base should remain unchanged
      expect(updatedSchema.fields.heading.value.en).toBe('Base Heading');
      // Variant should be updated
      expect(updatedSchema.variants?.premium?.heading).toBeDefined();
      const variantHeading = updatedSchema.variants?.premium?.heading as TextField;
      expect(variantHeading.value.en).toBe('Updated Premium Heading');
    });

    it('should create new variant field if it does not exist', () => {
      const schema = createTestSchema();
      const onUpdate = vi.fn();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CatalystProvider locale="en" isEditMode={true} personalization={{}}>
          {children}
        </CatalystProvider>
      );

      const { result } = renderHook(() => useVariantHandling({ schema }), { wrapper });

      // Switch to editing variant
      act(() => {
        result.current.setEditingVariant('premium');
      });

      // Update a field that doesn't have a variant override yet (description)
      act(() => {
        result.current.updateField('description', { en: 'Premium Description' }, onUpdate);
      });

      expect(onUpdate).toHaveBeenCalledTimes(1);
      const updatedSchema = onUpdate.mock.calls[0][0] as TestComponentSchema;

      // Variant should now have description
      expect(updatedSchema.variants?.premium?.description).toBeDefined();
      const variantDescription = updatedSchema.variants?.premium?.description as TextField;
      expect(variantDescription.value.en).toBe('Premium Description');
    });

    it('should not call onUpdate if it is not provided', () => {
      const schema = createTestSchema();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CatalystProvider locale="en" isEditMode={true} personalization={{}}>
          {children}
        </CatalystProvider>
      );

      const { result } = renderHook(() => useVariantHandling({ schema }), { wrapper });

      // Should not throw error
      expect(() => {
        act(() => {
          result.current.updateField('heading', { en: 'Updated Heading' });
        });
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle schema with no variants', () => {
      const schemaWithoutVariants: TestComponentSchema = {
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

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CatalystProvider locale="en" isEditMode={true} personalization={{}}>
          {children}
        </CatalystProvider>
      );

      const { result } = renderHook(
        () => useVariantHandling({ schema: schemaWithoutVariants }),
        { wrapper }
      );

      expect(result.current.displaySchema.fields.heading.value.en).toBe('No Variants');
      expect(result.current.editingVariant).toBe(null);
    });

    it('should handle updating with empty variants object', () => {
      const schemaWithEmptyVariants: TestComponentSchema = {
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

      const onUpdate = vi.fn();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CatalystProvider locale="en" isEditMode={true} personalization={{}}>
          {children}
        </CatalystProvider>
      );

      const { result } = renderHook(
        () => useVariantHandling({ schema: schemaWithEmptyVariants }),
        { wrapper }
      );

      act(() => {
        result.current.updateField('heading', { en: 'Updated' }, onUpdate);
      });

      expect(onUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
