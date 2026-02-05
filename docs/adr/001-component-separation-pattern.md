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

- Accepts **resolved strings** as props (not LocalizedContent, not schemas)
- Has **zero knowledge** of edit mode, localization, or variants
- Contains only visual structure and styling
- Can be used standalone for static pages or previews
- Designers and non-edit-aware code can understand it easily

```tsx
interface CTAProps {
  heading: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export function CTA({ heading, description, buttonText, buttonHref }: CTAProps) {
  return (
    <Section>
      <h2>{heading}</h2>
      <p>{description}</p>
      <Button><a href={buttonHref}>{buttonText}</a></Button>
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
- In **view mode**: renders the pure component with resolved values
- In **edit mode**: renders full edit UI with EditableText, popovers, etc.

```tsx
export function EditableCTA({ schema, onUpdate, sectionControls }: EditableCTAProps) {
  const { isEditMode, locale } = useCatalyst();
  const { displaySchema, ... } = useVariantHandling({ schema });

  // Hooks must be called before conditional return
  const button = useEditableLink({ ... });

  // View mode: pure component
  if (!isEditMode) {
    return (
      <CTA
        heading={getLocalizedValue(fields.heading.value, locale)}
        description={getLocalizedValue(fields.description.value, locale)}
        ...
      />
    );
  }

  // Edit mode: full edit UI
  return (
    <Section>
      <SectionEditBar ... />
      <EditableText ... />
      ...
    </Section>
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

### Negative

- **Some structural duplication** - Edit mode must replicate the visual structure to wrap elements with EditableText
- **More files** - Two files per component instead of one
- **Hook ordering constraint** - All hooks must be called before the view-mode early return

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
