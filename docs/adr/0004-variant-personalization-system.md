# ADR 0004: Variant/Personalization System

## Status

Accepted

## Date

2026-01-28

## Context

Catalyst needs to support personalized content where different users see different versions of components based on their segment (e.g., "finance", "startup", "premium"). This must work in both:

1. **View mode**: Users see personalized content based on their segment
2. **Edit mode**: Content editors can view and edit each variant separately

### Requirements

- Store multiple content variants per component without duplicating the entire schema
- Apply personalization based on runtime context (URL params, user attributes)
- Allow editors to switch between variants and edit each independently
- Keep the base component as the fallback when no variant matches
- Support any field type (text, images, buttons, etc.)

## Decision

### Schema Structure

Variants are stored as partial field overrides keyed by segment name:

```typescript
interface ComponentSchema {
  id: string;
  type: string;
  fields: Record<string, Field>;  // Base fields (always required)
  variants?: Record<string, Partial<Record<string, Field>>>;  // Segment -> field overrides
}
```

Example:

```typescript
const heroSchema = {
  id: 'hero-1',
  type: 'HeroSection',
  fields: {
    title: { type: 'text', value: { en: 'Welcome to our platform' } },
    description: { type: 'text', value: { en: 'General description' } },
  },
  variants: {
    finance: {
      title: { type: 'text', value: { en: 'Enterprise financial solutions' } },
      // description inherits from base
    },
    startup: {
      title: { type: 'text', value: { en: 'Ship faster, iterate quicker' } },
      description: { type: 'text', value: { en: 'The modern toolkit for startups' } },
    },
  },
};
```

### Personalization Application

The `applyPersonalization` function merges variant fields into base fields:

```typescript
function applyPersonalization(
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

  return {
    ...component,
    fields: {
      ...component.fields,
      ...variant,  // Variant fields override base fields
    },
  };
}
```

### The useVariantHandling Hook

Components use `useVariantHandling` to handle all variant logic:

```typescript
const { displaySchema, editingVariant, setEditingVariant, updateField } =
  useVariantHandling({ schema });
```

Returns:
- **displaySchema**: The schema to render (with appropriate variant applied)
- **editingVariant**: Currently selected variant for editing (null = base)
- **setEditingVariant**: Function to switch variant being edited
- **updateField**: Helper that updates either base or variant fields

Display logic:
- In **view mode**: Applies personalization from context (`?segment=X`)
- In **edit mode with variant selected**: Shows that variant's merged fields
- In **edit mode without variant**: Shows base fields

Update logic:
- When `editingVariant` is null, updates `schema.fields[fieldName]`
- When `editingVariant` is set, updates `schema.variants[editingVariant][fieldName]`

### VariantSelector UI

A dropdown component for switching between variants in edit mode:

```typescript
<VariantSelector
  variants={schema.variants}
  currentVariant={editingVariant}
  onVariantChange={setEditingVariant}
/>
```

Features:
- Shows "Base" plus all existing variant names
- Highlights currently selected variant
- Includes "Add Variant" option to create new segments

### URL Parameters

Personalization context comes from URL parameters:

| Parameter | Effect |
|-----------|--------|
| `?segment=finance` | Apply "finance" variant |
| `?segment=startup` | Apply "startup" variant |

The `CatalystProvider` reads these and provides context via `useCatalyst().personalization`.

## Consequences

### Positive

- **Partial overrides**: Variants only store changed fields, not entire schemas
- **Inheritance**: Unspecified variant fields automatically inherit from base
- **Type-safe**: Full TypeScript support with `Partial<Record<string, Field>>`
- **Composable**: `useVariantHandling` works with any component schema
- **Edit flexibility**: Editors can view/edit base and variants independently
- **Runtime switching**: URL params enable A/B testing and preview

### Negative

- **Schema complexity**: Nested variant structure can be harder to understand
- **Field type repetition**: Variant fields must include `type` even when overriding
- **No cascading**: Variants are flat (can't have variant-of-variant)

### Neutral

- **Segment-based**: Currently only supports segment key; could extend to other context
- **Client-side resolution**: Personalization happens at render time, not server-side

## Alternatives Considered

### 1. Separate Schemas Per Variant

Store complete duplicate schemas for each variant.

Rejected because:
- High duplication for components with many fields
- Harder to keep variants in sync with base
- Storage overhead

### 2. Field-Level Variants

Store variants inside each field:

```typescript
fields: {
  title: {
    type: 'text',
    value: { en: 'Base title' },
    variants: {
      finance: { en: 'Finance title' },
    },
  },
}
```

Rejected because:
- Complex field type definitions
- Harder to see all variant content at once
- Inconsistent with other field properties

### 3. Content Slots

Use a slots system where variants reference content IDs.

Rejected because:
- Over-engineering for current needs
- Requires separate content storage
- More complex querying

## References

- `packages/catalyst/src/core/types.ts` - Schema type definitions
- `packages/catalyst/src/core/utils.ts` - `applyPersonalization` function
- `packages/catalyst/src/react/useVariantHandling.ts` - Variant hook
- `packages/catalyst/src/react/VariantSelector.tsx` - UI component
