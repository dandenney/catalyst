/**
 * useVariantHandling Hook
 * Centralizes variant handling logic for all components
 * Ensures consistent variant support across the component library
 */

import { useState, useCallback } from 'react';
import { ComponentSchema, applyPersonalization, Field, TextField, RichTextField, ImageField, ListField } from '@catalyst/core';
import { useCatalyst } from './CatalystContext';

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
      updatedContent: any,
      onUpdate?: (schema: T) => void
    ) => {
      if (!onUpdate) return;

      // If editing a variant, update the variant fields
      if (editingVariant) {
        const variantField = schema.variants?.[editingVariant]?.[fieldName] as Field | undefined;
        const currentField = (variantField || schema.fields[fieldName]) as Field;

        let updatedField: Field;

        // Handle different field types
        if (currentField.type === 'image') {
          const imageField = currentField as ImageField;
          updatedField = {
            ...imageField,
            alt: updatedContent,
          };
        } else if (currentField.type === 'text') {
          const textField = currentField as TextField;
          updatedField = {
            ...textField,
            value: updatedContent,
          };
        } else if (currentField.type === 'richtext') {
          const richtextField = currentField as RichTextField;
          updatedField = {
            ...richtextField,
            value: updatedContent,
          };
        } else if (currentField.type === 'list') {
          const listField = currentField as ListField;
          updatedField = {
            ...listField,
            value: updatedContent,
          };
        } else {
          // Fallback
          updatedField = currentField;
        }

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

        let updatedField: Field;

        // Handle different field types
        if (currentField.type === 'image') {
          const imageField = currentField as ImageField;
          updatedField = {
            ...imageField,
            alt: updatedContent,
          };
        } else if (currentField.type === 'text') {
          const textField = currentField as TextField;
          updatedField = {
            ...textField,
            value: updatedContent,
          };
        } else if (currentField.type === 'richtext') {
          const richtextField = currentField as RichTextField;
          updatedField = {
            ...richtextField,
            value: updatedContent,
          };
        } else if (currentField.type === 'list') {
          const listField = currentField as ListField;
          updatedField = {
            ...listField,
            value: updatedContent,
          };
        } else {
          // Fallback
          updatedField = currentField;
        }

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
