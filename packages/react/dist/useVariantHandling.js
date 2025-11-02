"use strict";
/**
 * useVariantHandling Hook
 * Centralizes variant handling logic for all components
 * Ensures consistent variant support across the component library
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVariantHandling = useVariantHandling;
const react_1 = require("react");
const core_1 = require("@catalyst/core");
const CatalystContext_1 = require("./CatalystContext");
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
function useVariantHandling({ schema, }) {
    const { personalization, isEditMode } = (0, CatalystContext_1.useCatalyst)();
    const [editingVariant, setEditingVariant] = (0, react_1.useState)(null);
    // In edit mode, determine which schema to display based on editing variant
    // In view mode, apply personalization normally
    const displaySchema = isEditMode && editingVariant
        ? (0, core_1.applyPersonalization)(schema, { segment: editingVariant })
        : isEditMode
            ? schema
            : (0, core_1.applyPersonalization)(schema, personalization);
    const updateField = (0, react_1.useCallback)((fieldName, updatedContent, onUpdate) => {
        if (!onUpdate)
            return;
        // If editing a variant, update the variant fields
        if (editingVariant) {
            const variantField = schema.variants?.[editingVariant]?.[fieldName];
            const currentField = (variantField || schema.fields[fieldName]);
            let updatedField;
            // Handle different field types
            if (currentField.type === 'image') {
                const imageField = currentField;
                updatedField = {
                    ...imageField,
                    alt: updatedContent,
                };
            }
            else if (currentField.type === 'text') {
                const textField = currentField;
                updatedField = {
                    ...textField,
                    value: updatedContent,
                };
            }
            else if (currentField.type === 'richtext') {
                const richtextField = currentField;
                updatedField = {
                    ...richtextField,
                    value: updatedContent,
                };
            }
            else if (currentField.type === 'list') {
                const listField = currentField;
                updatedField = {
                    ...listField,
                    value: updatedContent,
                };
            }
            else {
                // Fallback
                updatedField = currentField;
            }
            const updatedSchema = {
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
        }
        else {
            // Otherwise, update base fields
            const currentField = schema.fields[fieldName];
            let updatedField;
            // Handle different field types
            if (currentField.type === 'image') {
                const imageField = currentField;
                updatedField = {
                    ...imageField,
                    alt: updatedContent,
                };
            }
            else if (currentField.type === 'text') {
                const textField = currentField;
                updatedField = {
                    ...textField,
                    value: updatedContent,
                };
            }
            else if (currentField.type === 'richtext') {
                const richtextField = currentField;
                updatedField = {
                    ...richtextField,
                    value: updatedContent,
                };
            }
            else if (currentField.type === 'list') {
                const listField = currentField;
                updatedField = {
                    ...listField,
                    value: updatedContent,
                };
            }
            else {
                // Fallback
                updatedField = currentField;
            }
            const updatedSchema = {
                ...schema,
                fields: {
                    ...schema.fields,
                    [fieldName]: updatedField,
                },
            };
            onUpdate(updatedSchema);
        }
    }, [schema, editingVariant]);
    return {
        displaySchema,
        editingVariant,
        setEditingVariant,
        updateField,
    };
}
