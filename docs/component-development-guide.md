# Component Development Guide

This guide ensures all Catalyst components follow consistent patterns, especially for variant support.

## Table of Contents
- [Component Checklist](#component-checklist)
- [Using the useVariantHandling Hook](#using-the-usevarianthandling-hook)
- [Component Template](#component-template)
- [Testing Variant Support](#testing-variant-support)

## Component Checklist

When creating a new component, ensure you complete ALL of these steps:

### 1. Schema Definition (`packages/core/src/types.ts`)
- [ ] Create interface extending `ComponentSchema`
- [ ] Define all fields with proper types
- [ ] Ensure `variants` property is inherited from `ComponentSchema`

### 2. Registry Entry (`packages/core/src/registry.ts`)
- [ ] Import the schema type
- [ ] Create `createDefaultX()` function
- [ ] Add entry to `COMPONENT_REGISTRY` with icon, description, etc.

### 3. React Component Implementation
- [ ] **REQUIRED**: Import and use `useVariantHandling` hook
- [ ] **REQUIRED**: Import and render `VariantSelector` component in edit mode
- [ ] Use `displaySchema` from hook (not raw `schema`)
- [ ] Use `updateField` helper for all field updates
- [ ] Show variant override badges when editing variants
- [ ] Support all field types (TextField, ImageField, etc.)

### 4. Component Registration
- [ ] Export from `packages/demo-components/src/index.ts`
- [ ] Import in `ComponentRenderer.tsx`
- [ ] Add switch case in `ComponentRenderer`

### 5. Build & Test
- [ ] Run `npm run build` successfully
- [ ] Manually test in edit mode
- [ ] Verify variant selector appears
- [ ] Test creating and editing variants
- [ ] Test switching between base and variant editing

## Using the useVariantHandling Hook

**All components MUST use this hook** to ensure consistent variant support.

### Basic Usage

```tsx
import { useVariantHandling } from '@catalyst/react';

export function MyComponent({ schema, onUpdate }: MyComponentProps) {
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  // Always use displaySchema, not schema
  const { fields } = displaySchema;

  return (
    <div>
      {/* Variant selector required in edit mode */}
      {isEditMode && (
        <VariantSelector
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
        />
      )}

      {/* Use updateField helper for all editable content */}
      <EditableText
        content={fields.heading.value}
        onUpdate={(content) => updateField('heading', content, onUpdate)}
      />
    </div>
  );
}
```

### Hook API

**`useVariantHandling({ schema })`**

Returns:
- **`displaySchema`**: The schema with variants applied (use this, not raw schema)
- **`editingVariant`**: Currently selected variant name (or null for base)
- **`setEditingVariant`**: Function to change which variant is being edited
- **`updateField(fieldName, content, onUpdate)`**: Helper that handles variant updates

## Component Template

Copy this template when creating new components:

```tsx
/**
 * ComponentName Component
 * Brief description of what this component does
 */

import React from 'react';
import { ComponentNameSchema, getLocalizedValue } from '@catalyst/core';
import { EditableText, useCatalyst, VariantSelector, useVariantHandling } from '@catalyst/react';

export interface ComponentNameProps {
  schema: ComponentNameSchema;
  onUpdate?: (schema: ComponentNameSchema) => void;
}

export function ComponentName({ schema, onUpdate }: ComponentNameProps) {
  const { locale, isEditMode } = useCatalyst();

  // REQUIRED: Use variant handling hook
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  // Use displaySchema, not schema
  const { fields } = displaySchema;

  return (
    <div
      className="component-name"
      style={{
        position: 'relative',
        // ... your styles
      }}
    >
      {/* REQUIRED: Variant Selector in edit mode */}
      {isEditMode && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 10,
          }}
        >
          <VariantSelector
            variants={schema.variants}
            currentVariant={editingVariant}
            onVariantChange={setEditingVariant}
          />
        </div>
      )}

      {/* Editable Fields */}
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        {/* Show variant override badge when editing a variant */}
        {isEditMode && editingVariant && schema.variants?.[editingVariant]?.heading && (
          <div
            style={{
              position: 'absolute',
              top: '-24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#8b5cf6',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500',
              whiteSpace: 'nowrap',
            }}
          >
            Variant Override
          </div>
        )}

        <EditableText
          content={fields.heading.value}
          onUpdate={(content) => updateField('heading', content, onUpdate)}
          as="h2"
          style={{ /* your styles */ }}
        />
      </div>

      {/* Add more fields as needed */}
    </div>
  );
}
```

## Testing Variant Support

### Manual Testing Checklist

For each component, verify:

1. **Edit Mode**:
   - [ ] Variant selector appears in edit mode
   - [ ] Can create new variants
   - [ ] Can switch between "Base" and variant editing
   - [ ] Changes to base don't affect variants
   - [ ] Changes to variants don't affect base

2. **View Mode**:
   - [ ] Component displays base content by default
   - [ ] Personalization context applies correct variant
   - [ ] Fallback to base works when variant doesn't override field

3. **Edge Cases**:
   - [ ] Component works without `onUpdate` callback
   - [ ] Component works with no variants defined
   - [ ] Component works with empty variant overrides

### Future: Automated Tests

When setting up a testing framework, ensure tests for:

```typescript
describe('ComponentName variant support', () => {
  it('displays base content when no variant is active', () => {
    // Test base rendering
  });

  it('applies variant overrides when personalization matches', () => {
    // Test variant rendering
  });

  it('allows editing base fields in edit mode', () => {
    // Test base editing
  });

  it('allows editing variant fields in edit mode', () => {
    // Test variant editing
  });

  it('displays variant selector in edit mode', () => {
    // Test variant selector presence
  });
});
```

## Common Mistakes to Avoid

### ❌ DON'T: Use raw `schema` for rendering
```tsx
const { fields } = schema; // WRONG - doesn't apply variants
```

### ✅ DO: Use `displaySchema` from hook
```tsx
const { displaySchema } = useVariantHandling({ schema });
const { fields } = displaySchema; // CORRECT
```

---

### ❌ DON'T: Manually implement variant logic
```tsx
// WRONG - duplicates logic, error-prone
const handleUpdate = (field, content) => {
  if (editingVariant) {
    // ... complex variant update logic
  } else {
    // ... base update logic
  }
};
```

### ✅ DO: Use `updateField` helper
```tsx
// CORRECT - consistent, tested logic
const { updateField } = useVariantHandling({ schema });
<EditableText onUpdate={(content) => updateField('heading', content, onUpdate)} />
```

---

### ❌ DON'T: Forget the variant selector
```tsx
// WRONG - no way to edit variants
return <div>{content}</div>;
```

### ✅ DO: Always include VariantSelector
```tsx
// CORRECT - users can edit variants
{isEditMode && (
  <VariantSelector
    variants={schema.variants}
    currentVariant={editingVariant}
    onVariantChange={setEditingVariant}
  />
)}
```

## Questions?

- Review existing components: `HeroBanner.tsx`, `FeatureList.tsx`, `CTASection.tsx`
- Check the `useVariantHandling` hook source for implementation details
- Refer to the core types in `packages/core/src/types.ts`
