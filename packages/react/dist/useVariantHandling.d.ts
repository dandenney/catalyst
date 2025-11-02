/**
 * useVariantHandling Hook
 * Centralizes variant handling logic for all components
 * Ensures consistent variant support across the component library
 */
import { ComponentSchema } from '@catalyst/core';
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
    updateField: (fieldName: string, updatedContent: any, onUpdate?: (schema: T) => void) => void;
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
export declare function useVariantHandling<T extends ComponentSchema>({ schema, }: UseVariantHandlingOptions<T>): UseVariantHandlingResult<T>;
export {};
