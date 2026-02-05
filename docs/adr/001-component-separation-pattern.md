# ADR 001: Component Separation Pattern

## Status

Accepted

## Date

2026-02-04

## Context

When building schema-driven components for the Catalyst page builder, we found that mixing display logic with edit logic created components that were:

1. **Hard to understand** - Walking into a component cold, it was difficult to see "what does this look like" vs "how is it edited"
2. **Hard to maintain** - Changes to visual design required navigating around edit infrastructure
3. **Hard to customize** - Consumer apps wanting different edit UIs had to fork entire components

The original `schema-cta.tsx` combined:
- Visual structure (Section, layout divs, typography)
- Edit affordances (EditableText, useEditableLink)
- Edit chrome (SectionEditBar, Popovers with forms)
- Data transformation (useVariantHandling, field update handlers)

## Decision

We will separate components into two files:

```
components/sections/[name]/
  [name].tsx           # Pure display component
  editable-[name].tsx  # Edit wrapper
```

### Pure Display Component (`[name].tsx`)

- Accepts **ReactNode** for content slots (can be strings or editable components)
- Has **zero knowledge** of edit mode, localization, or variants
- Contains only visual structure and styling
- Can be used standalone for static pages or previews
- Designers and non-edit-aware code can understand it easily
- Optional `editBar` slot for section-level edit chrome

```tsx
interface CTAProps {
  heading: ReactNode;      // String or EditableText
  description: ReactNode;  // String or EditableText
  link: ReactNode;         // Anchor or editable link wrapper
  editBar?: ReactNode;     // SectionEditBar in edit mode
}

export function CTA({ heading, description, link, editBar }: CTAProps) {
  return (
    <Section>
      {editBar}
      <h2>{heading}</h2>
      <p>{description}</p>
      {link}
    </Section>
  );
}
```

### Editable Wrapper (`editable-[name].tsx`)

- Accepts schema and onUpdate props
- Contains all edit infrastructure:
  - `useVariantHandling` for variant support
  - `useCatalyst` for edit mode and locale
  - Field update handlers
  - `useEditableLink` and similar hooks
- **Both modes render through the pure component** - only the slot contents differ

```tsx
export function EditableCTA({ schema, onUpdate, sectionControls }: EditableCTAProps) {
  const { isEditMode, locale } = useCatalyst();
  const { displaySchema, ... } = useVariantHandling({ schema });

  // Hooks must be called before conditional return
  const link = useEditableLink({ ... });

  // View mode: pass resolved strings to slots
  if (!isEditMode) {
    return (
      <CTA
        heading={getLocalizedValue(fields.heading.value, locale)}
        description={getLocalizedValue(fields.description.value, locale)}
        link={<a href={...}>{...}</a>}
      />
    );
  }

  // Edit mode: pass editable components to same slots
  return (
    <CTA
      editBar={<SectionEditBar ... />}
      heading={<EditableText content={fields.heading.value} ... />}
      description={<EditableText content={fields.description.value} ... />}
      link={<Popover>...</Popover>}
    />
  );
}
```

## Consequences

### Positive

- **Clear separation of concerns** - Visual design is isolated from edit infrastructure
- **Easier onboarding** - New developers can understand pure components immediately
- **Reusable display** - Pure components can be used for static pages, previews, or email templates
- **Testable** - Pure components are trivial to test with simple props
- **Customizable edit UIs** - Consumer apps can create different editable wrappers while keeping the same display
- **Single source of truth for layout** - Using ReactNode slots means both view and edit mode use the same component structure

### Negative

- **More files** - Two files per component instead of one
- **Hook ordering constraint** - All hooks must be called before the view-mode early return

### Mitigated

- **~~Structural duplication~~** - Originally edit mode duplicated layout. Now using ReactNode slots, both modes render through the pure component

### Neutral

- **Migration effort** - Existing schema-* components need to be refactored
- **Naming convention** - Established pattern: `[name].tsx` + `editable-[name].tsx`

## Alternatives Considered

### Slot-based composition
```tsx
<EditableSection schema={schema}>
  <CTA
    heading={<Editable field="heading" as="h2" />}
    description={<Editable field="description" as="p" />}
  />
</EditableSection>
```
Rejected: More complex API, harder to understand what's editable.

### Configuration-driven
```tsx
const config = { fields: { heading: 'text', description: 'text' }};
<SchemaComponent schema={schema} config={config} render={CTA} />
```
Rejected: Too magical, hard to customize edit UIs per-field.

### HOC pattern
```tsx
const EditableCTA = withEditable(CTA, { heading: 'text', ... });
```
Rejected: TypeScript complexity, less explicit about what's happening.

## References

- Implementation: `consumer-app/components/sections/cta/`
- Pattern documentation: `CLAUDE.md` "Making a Component Editable" section
