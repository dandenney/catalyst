/**
 * useVariantHandling Hook
 * Centralizes variant handling logic for all components
 * Ensures consistent variant support across the component library
 */

import { useState, useCallback } from 'react';
import { ComponentSchema, applyPersonalization, Field, TextField, RichTextField, ImageField, ListField, BadgeField, ButtonField, MockupField, LogoItemField } from '../core';
import { useCatalyst } from './CatalystContext';

/**
 * Helper to create updated field based on type
 * Extracted to module scope to avoid recreation on each render
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createUpdatedField(currentField: Field, content: any): Field {
  switch (currentField.type) {
    case 'image': {
      const imageField = currentField as ImageField;
      return { ...imageField, alt: content };
    }
    case 'text': {
      const textField = currentField as TextField;
      return { ...textField, value: content };
    }
    case 'richtext': {
      const richtextField = currentField as RichTextField;
      return { ...richtextField, value: content };
    }
    case 'list': {
      const listField = currentField as ListField;
      return { ...listField, value: content };
    }
    case 'badge': {
      const badgeField = currentField as BadgeField;
      // Merge partial updates (e.g., { label: newLabel } or { link: newLink })
      return { ...badgeField, ...content };
    }
    case 'button': {
      const buttonField = currentField as ButtonField;
      // Merge partial updates
      return { ...buttonField, ...content };
    }
    case 'mockup': {
      const mockupField = currentField as MockupField;
      // Merge partial updates
      return { ...mockupField, ...content };
    }
    case 'logoItem': {
      const logoField = currentField as LogoItemField;
      return { ...logoField, ...content };
    }
    default:
      return currentField;
  }
}

interface UseVariantHandlingOptions<T extends ComponentSchema> {
  schema: T;
}

interface UseVariantHandlingResult<T extends ComponentSchema> {
  /** The schema to display (with variants applied if editing or personalization applied if viewing) */
  displaySchema: T;
  /** The current variant being edited (null if editing base) */
  editingVariant: string | null;
  /** Set which variant to edit */
  setEditingVariant: (variant: string | null) => void;
  /** Helper to update a field in either the base schema or a variant */
  updateField: (
    fieldName: string,
    updatedContent: any,
    onUpdate?: (schema: T) => void
  ) => void;
}

/**
 * Hook that handles all variant logic for a component
 *
 * @example
 * ```tsx
 * export function MyComponent({ schema, onUpdate }: MyComponentProps) {
 *   const { displaySchema, editingVariant, setEditingVariant, updateField } =
 *     useVariantHandling({ schema });
 *
 *   const { fields } = displaySchema;
 *
 *   return (
 *     <div>
 *       {isEditMode && (
 *         <VariantSelector
 *           variants={schema.variants}
 *           currentVariant={editingVariant}
 *           onVariantChange={setEditingVariant}
 *         />
 *       )}
 *       <EditableText
 *         content={fields.heading.value}
 *         onUpdate={(content) => updateField('heading', content, onUpdate)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useVariantHandling<T extends ComponentSchema>({
  schema,
}: UseVariantHandlingOptions<T>): UseVariantHandlingResult<T> {
  const { personalization, isEditMode } = useCatalyst();
  const [editingVariant, setEditingVariant] = useState<string | null>(null);

  // In edit mode, determine which schema to display based on editing variant
  // In view mode, apply personalization normally
  const displaySchema: T = isEditMode && editingVariant
    ? (applyPersonalization(schema, { segment: editingVariant }) as T)
    : isEditMode
    ? schema
    : (applyPersonalization(schema, personalization) as T);

  const updateField = useCallback(
    (
      fieldName: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatedContent: any,
      onUpdate?: (schema: T) => void
    ) => {
      if (!onUpdate) return;

      // If editing a variant, update the variant fields
      if (editingVariant) {
        const variantField = schema.variants?.[editingVariant]?.[fieldName] as Field | undefined;
        const currentField = (variantField || schema.fields[fieldName]) as Field;
        const updatedField = createUpdatedField(currentField, updatedContent);

        const updatedSchema: T = {
          ...schema,
          variants: {
            ...schema.variants,
            [editingVariant]: {
              ...schema.variants?.[editingVariant],
              [fieldName]: updatedField,
            },
          },
        };
        onUpdate(updatedSchema);
      } else {
        // Otherwise, update base fields
        const currentField = schema.fields[fieldName] as Field;
        const updatedField = createUpdatedField(currentField, updatedContent);

        const updatedSchema: T = {
          ...schema,
          fields: {
            ...schema.fields,
            [fieldName]: updatedField,
          },
        };
        onUpdate(updatedSchema);
      }
    },
    [schema, editingVariant]
  );

  return {
    displaySchema,
    editingVariant,
    setEditingVariant,
    updateField,
  };
}
