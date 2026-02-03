# ADR 0005: Editing UI Patterns

## Status

Accepted

## Supersedes

Extends [ADR 0003: Consumer-Owned Edit UI Styling](./0003-consumer-owned-edit-ui.md)

ADR 0003 established that consumers own edit UI styling via hooks (e.g., `useEditableLink`) and their own shadcn components. This ADR extends that principle: **consumers own section control UI styling** via Sheet components and their own shadcn primitives.

## Context

Catalyst currently uses multiple editing UI patterns:

| Content Type | Current Pattern | Trigger |
|-------------|----------------|---------|
| Plain text | Inline contentEditable | Double-click |
| Images | Popover | Click |
| Links | Popover | Click |
| Buttons/CTAs | Popover (via hook) | Click |
| Prices | Popover | Click |
| Variants | Sheet panel | Click (via section edit bar) |
| Component order | Sheet panel | Click (via section edit bar) |

**Problems solved:**

1. Section-level controls (move, remove, variants) now have a dedicated UI
2. Non-modal Sheet allows editing while seeing the page
3. Clear visual hierarchy: inline for content, sheet for section settings
4. Consistent "Edit [Section]" button pattern across all sections

---

## Decision

### What Is Truly Inline

Content editing remains inline via popovers:

| Element | Pattern | Trigger | Rationale |
|---------|---------|---------|-----------|
| **Text content** | contentEditable | Double-click | Direct manipulation feels natural, WYSIWYG |
| **Images** | Popover | Click | Quick URL/alt editing near the element |
| **Links/Buttons** | Popover | Click | Quick text/URL editing near the element |

**Characteristics:**
- Single value or small group of related values
- Result immediately visible in context
- No complex validation needed
- Escape/Enter/Cmd+Enter for cancel/save

### What Requires a Panel

Section-level controls use a right-side Sheet:

| Element | Rationale |
|---------|-----------|
| **Variant selection** | Affects entire section, needs clear UI |
| **Section ordering** | Move up/down within page structure |
| **Section removal** | Destructive action needs confirmation space |
| **Add section** | Selection from available section types |

**Characteristics:**
- Affects the section as a whole (not individual content)
- Benefits from seeing the full page while editing
- Non-blocking interaction preferred

---

## Panel Implementation

### Right-Side Sheet (Radix Dialog)

```
┌────────────────────────────────────────────┬──────────────┐
│                                            │              │
│           Page Content                     │  Section     │
│                                            │  Controls    │
│       [Section with Edit Bar]              │              │
│       ─────────────────────                │  - Variant   │
│         Edit [SectionName] [✏]             │  - Move Up   │
│       ─────────────────────                │  - Move Down │
│                                            │  - Remove    │
│                                            │              │
└────────────────────────────────────────────┴──────────────┘
```

### Behavior

**Display mode:** Non-modal (`modal={false}`) - page remains interactive

**Trigger:**
- Click "Edit [Section]" button in section edit bar
- Sheet slides in from right
- Page content remains visible and accessible

**Sheet contents:**
- Section type as title
- Variant selector (if variants exist)
- Move up/down buttons (disabled at boundaries)
- Remove section button (destructive, at bottom)

**Animation:**
- Slide in/out from right
- 300ms close, 500ms open duration
- Smooth easing transitions

**Add section flow:**
- Fixed bottom bar shows "Edit Mode" indicator
- Plus button opens Sheet with section type options
- Selecting a type adds it at the end

---

## Component Architecture

### Files

| File | Purpose |
|------|---------|
| `section-controls.ts` | TypeScript interface for section controls |
| `section-edit-bar.tsx` | Horizontal bar above sections with edit button |
| `section-edit-sheet.tsx` | Right-side Sheet with section controls |
| `edit-mode-indicator.tsx` | Fixed bottom bar with add section functionality |
| `sheet.tsx` | Customized shadcn Sheet (non-modal) |

### SectionControls Interface

```typescript
export interface SectionControls {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}
```

### Usage in Schema Components

```typescript
import SectionEditBar from "../../ui/section-edit-bar";
import { type SectionControls } from "../../ui/section-controls";

interface SchemaSectionProps {
  schema: SectionSchema;
  onUpdate?: (schema: SectionSchema) => void;
  sectionControls?: SectionControls;
}

export default function SchemaSection({ schema, onUpdate, sectionControls }: SchemaSectionProps) {
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const hasVariants = schema.variants && Object.keys(schema.variants).length > 0;

  return (
    <Section>
      <SectionEditBar
        sectionType={schema.type}
        controls={sectionControls}
        variants={hasVariants ? schema.variants : undefined}
        currentVariant={editingVariant}
        onVariantChange={setEditingVariant}
      />
      {/* Section content with EditableText, etc. */}
    </Section>
  );
}
```

### Page-Level Section Management

```typescript
const [sections, setSections] = useState<Section[]>([...]);

const moveSection = (from: number, to: number) => {
  setSections((prev) => {
    if (to < 0 || to >= prev.length) return prev;
    const next = [...prev];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  });
};

const removeSection = (index: number) => {
  setSections((prev) => prev.filter((_, i) => i !== index));
};

// In render:
{sections.map((section, index) => {
  const sectionControls: SectionControls = {
    canMoveUp: index > 0,
    canMoveDown: index < sections.length - 1,
    onMoveUp: () => moveSection(index, index - 1),
    onMoveDown: () => moveSection(index, index + 1),
    onRemove: () => removeSection(index),
  };

  return <SchemaSection sectionControls={sectionControls} ... />;
})}
```

---

## Consequences

### Positive

- Non-modal Sheet keeps page visible during section editing
- Clear separation: popovers for content, Sheet for section settings
- Consistent "Edit [Section]" pattern across all sections
- Uses existing shadcn Sheet component (no new dependencies)
- Simple interface makes section controls easy to implement

### Negative

- Two panel patterns (Popover + Sheet) require understanding both
- Sheet takes screen real estate on smaller viewports

### Neutral

- Popovers remain for content editing (images, links, buttons)
- CSS variable system remains for theming
- Future: could migrate content editing to Sheet if needed

---

## Future Considerations

- **Nested editing**: If sections need complex field editing, Sheet tabs could be added
- **Keyboard navigation**: Tab + Enter to open Sheet from section
- **Mobile**: Sheet could slide up from bottom on narrow viewports
- **Undo/redo**: Section changes could be tracked for undo support

---

## References

- [ADR 0003](./0003-consumer-owned-edit-ui.md) - Consumer-owned edit UI styling principle
- [shadcn/ui Sheet](https://ui.shadcn.com/docs/components/sheet) - Sheet component
- [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) - Underlying primitive
