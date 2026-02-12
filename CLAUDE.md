# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build catalyst package (tsc)
pnpm dev              # Run consumer-app dev server
pnpm dev:watch        # Run with file watching for all packages
pnpm test             # Run tests
pnpm -F catalyst build    # Build only catalyst
pnpm -F consumer-app dev  # Run only consumer app
```

## Architecture

**Monorepo Structure (pnpm workspace):**
```
├── packages/catalyst/     # THE published package
│   └── src/
│       ├── index.ts       # Main export (everything from 'catalyst')
│       ├── server.ts      # Server-only exports ('catalyst/server')
│       ├── core/          # Types, schemas, utilities (framework-agnostic)
│       ├── react/         # React bindings, hooks, editable components
│       │   └── ui/        # Shadcn-style UI primitives
│       └── storage/       # Persistence adapters (server-only)
└── consumer-app/          # Example Next.js app (NOT published)
    └── components/        # Example component implementations
```

**Key Principle:** Catalyst provides infrastructure; consumers provide component rendering. Components are rendered via direct imports and a switch statement in the consumer app.

## Import Patterns

```typescript
// Client-side imports
import {
  ComponentSchema, PageSchema, LocalizedContent, Locale,
  CatalystProvider, useCatalyst, createComponent,
  EditableText, EditableImage, EditableLink,
  useVariantHandling, useEditableLink,
  Popover, PopoverTrigger, PopoverContent, Button, Input, Label,
} from 'catalyst';

// Server-only imports (storage adapters)
import { JsonStorageAdapter } from 'catalyst/server';

// Optional CSS variables
import 'catalyst/styles.css';
```

## Core Concepts

### Component Registry
- `COMPONENT_REGISTRY` in `packages/catalyst/src/core/registry.ts` defines component metadata and `createDefault` factories
- Used by `createComponent(type)` to instantiate new schemas with default values
- **Not used for rendering** - consumer apps render components via direct imports and switch statements in `page.tsx`

### Adding/Removing Components in Consumer App
To add a component to the page:
1. Import the schema component in `consumer-app/app/page.tsx`
2. Add a case to the switch statement that renders components
3. Add to `addSectionOptions` array if it should appear in the "Add Section" menu

To remove a component from the page:
1. Remove its case from the switch statement in `page.tsx`
2. Remove from `addSectionOptions` array
3. Remove from the `SectionType` union
4. Optionally remove from `COMPONENT_REGISTRY` if it shouldn't be creatable via `createComponent()`

### Editable Components
All support `editClassName` and `editingClassName` props for custom edit-mode styling:

| Component | Trigger | What it edits |
|-----------|---------|---------------|
| `EditableText` | Double-click | Inline text (LocalizedContent) |
| `EditableLink` | Click | Link text + URL (both LocalizedContent) |
| `EditableImage` | Click | Image URL + alt text |

### useEditableLink Hook
Extracts link editing behavior for composable use (e.g., editing buttons that need custom rendering):

```typescript
const link = useEditableLink({ href, text, onUpdate, editClassName, editingClassName });
// Returns: isOpen, setIsOpen, displayHref, displayText, editHref, editText,
//          setEditHref, setEditText, handleSave, handleCancel, handleKeyDown,
//          handleClick, isEditMode, locale, editModeClassName
```

### Localization
- `LocalizedContent` type: `{ en: string; es?: string }` (en required as fallback)
- `getLocalizedValue(content, locale)` resolves with fallback
- `Locale` type: `'en' | 'es'`
- **Page-wide language toggle** in edit mode indicator bar switches locale for all components
- Editable components update only the current locale's value

### Variants/Personalization
Variants enable per-component personalization for different audience segments.

**Key Concept:** Language is page-wide, variants are per-component.

| Scope | Edit Mode | View Mode |
|-------|-----------|-----------|
| Language | Toggle in bottom bar affects all components | `?lang=es` URL param |
| Variants | Each component's edit sheet has variant selector | `?segment=premium` applies to all components |

**Hook:** `useVariantHandling({ schema })`
- Returns: `displaySchema`, `editingVariant`, `setEditingVariant`, `updateField`
- In edit mode: shows variant being edited (or base)
- In view mode: applies personalization based on `?segment=` param

**Creating Variants:**
1. Click "Edit [Section]" button on any component
2. In the sheet, click "Add variant" under Personalization Variants
3. Enter variant name (e.g., "premium", "finance", "startup")
4. Edit fields - changes only affect that variant

**Viewing Variants:**
- `?segment=finance` - All components with a "finance" variant show personalized content
- Components without that variant show base content

## Key Files

| Purpose | Location |
|---------|----------|
| Core types | `packages/catalyst/src/core/types.ts` |
| Component registry (for `createComponent()`) | `packages/catalyst/src/core/registry.ts` |
| Context/Provider | `packages/catalyst/src/react/CatalystContext.tsx` |
| Page rendering & switch statement | `consumer-app/app/page.tsx` |
| Variant handling hook | `packages/catalyst/src/react/useVariantHandling.ts` |
| Editable link hook | `packages/catalyst/src/react/useEditableLink.ts` |
| Hooks exports | `packages/catalyst/src/react/hooks.ts` |
| Language toggle | `consumer-app/components/ui/language-toggle.tsx` |
| Edit mode indicator (with language toggle) | `consumer-app/components/ui/edit-mode-indicator.tsx` |
| Section edit sheet (with variant controls) | `consumer-app/components/ui/section-edit-sheet.tsx` |
| URL param handling | `consumer-app/components/contexts/catalyst-wrapper.tsx` |
| **Example: CTA pure display** | `consumer-app/components/sections/cta/cta.tsx` |
| **Example: CTA editable wrapper** | `consumer-app/components/sections/cta/editable-cta.tsx` |
| Component separation ADR | `docs/adr/001-component-separation-pattern.md` |

## Consumer App Patterns

### Editable Wrapper Structure

Use visual separators to organize editable wrapper files. This makes it easy to scan and find sections when opening a file cold.

```typescript
export function EditableMySection({ schema, onUpdate, ... }: Props) {
  const { isEditMode, locale } = useCatalyst();
  const { displaySchema, ... } = useVariantHandling({ schema });

  const { fields } = displaySchema;

  // ─────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────

  const handleTitleUpdate = (content: LocalizedContent) => { ... };

  // All hooks must be called before conditional returns
  const button = useEditableLink({ ... });

  // ─────────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────────

  if (!isEditMode) {
    return (
      <MySection
        title={getLocalizedValue(fields.title.value, locale)}
        ...
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // Edit Mode
  // ─────────────────────────────────────────────────────────────────

  return (
    <Section>
      <SectionEditBar ... />
      <EditableText ... />
      ...
    </Section>
  );
}
```

The structure is always:
1. **Top:** Context hooks, variant handling, field destructuring
2. **Handlers:** Update functions (before hooks that reference them)
3. **View Mode:** Early return with pure display component
4. **Edit Mode:** Full editing UI

### Edit Mode Styling
For visible edit outlines in consumer apps, pass custom classes to editable components:

```typescript
const EDIT_CLASS = "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS = "outline-2 outline-solid outline-primary outline-offset-2";

<EditableText editClassName={EDIT_CLASS} editingClassName={EDITING_CLASS} ... />
```

### Popover UIs
For edit popovers with proper theming, use consumer-app's shadcn components (Popover, Input, Label, Button) rather than catalyst's CSS-variable-based ones.

### URL Parameters
| Param | Effect |
|-------|--------|
| `?edit=true` | Enable edit mode (shows edit bars, language toggle, editable outlines) |
| `?lang=es` | Switch to Spanish (page-wide, also controllable via toggle in edit mode) |
| `?segment=premium` | Apply personalization variant to all components that have it |

**Common combinations:**
- `?edit=true` - Edit base English content
- `?edit=true&lang=es` - Edit Spanish content
- `?segment=finance` - View finance variant (English)
- `?segment=finance&lang=es` - View finance variant in Spanish

## Design System: Retro-Futuristic Minimalist Developer SaaS

All consumer-app components should follow this design direction. The aesthetic is **Swiss Modernism meets developer tooling with subtle sci-fi hints** — think Linear, Vercel, or Raycast with a touch of space-age precision.

### Core Principles
- **Spacious layout** — generous whitespace, centered content, max-w-2xl for text
- **High-contrast Swiss typography** — large sans headings (`tracking-tight`, `text-balance`), clear hierarchy
- **Restrained accent** — single blue `#3B82F6` used sparingly (labels, accent lines, hover states)
- **Product-first** — content is the star, not decoration
- **Subtle sci-fi hints** — faint dot grid, mono-spaced labels, gradient accent lines (never heavy neon/glow)
- **Precision** — clean borders, mathematical spacing, no visual noise

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0A0E1A` | Section backgrounds (deep navy-black) |
| Heading text | `#F1F5F9` | Primary headings |
| Body text | `#94A3B8` | Descriptions, secondary text |
| Accent | `#3B82F6` | Labels, accent lines, hover states |
| Border | `#1E293B` | Subtle separators, card borders |

### Typography
| Element | Style |
|---------|-------|
| Labels/tags | `font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]` |
| Headings | `font-sans text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance sm:text-4xl lg:text-5xl` |
| Body | `font-sans text-base leading-relaxed text-[#94A3B8] text-pretty` |

### Recurring Design Elements
- **Dot grid background** — `radial-gradient(circle, rgba(148,163,184,0.8) 1px, transparent 1px)` at `opacity-[0.035]`, 24px spacing
- **Gradient accent line** — `h-px w-16 bg-gradient-to-r from-[#3B82F6] to-transparent` between content sections
- **Top border separator** — `border-t border-[#1E293B]` on dark sections
- **Mono label** — small `font-mono` uppercase tag above headings for retro-futuristic feel

### Button/Link Style
```
White-to-silver gradient, dark text, subtle hover glow:
inline-flex items-center rounded-md border border-white/20
bg-gradient-to-b from-white to-[#C0C7D0]
px-5 py-2.5 text-sm font-medium text-[#0A0E1A]
transition-all duration-200
hover:from-white hover:to-white hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]
```

### What to Avoid
- Neon colors, heavy glow effects, text-shadow glow
- Scanning animations, corner brackets, HUD-style chrome
- Uppercase headings (reserve uppercase for small labels only)
- `font-mono` for body text (only for labels/tags)
- Decorative elements that don't serve content hierarchy
- Animations longer than 200ms for UI transitions

### Reference Implementation
The CTA component (`consumer-app/components/sections/cta/`) is the canonical example of this design system applied to a component.

---

## Making a Component Editable (Complete Pattern)

We use a **two-file separation pattern** to keep display logic separate from edit logic. See [ADR 001](docs/adr/001-component-separation-pattern.md) for rationale.

```
components/sections/[name]/
  [name].tsx           # Pure display - accepts ReactNode slots
  editable-[name].tsx  # Edit wrapper - injects editable components into slots
```

### Step 1: Define Schema Types (`packages/catalyst/src/core/types.ts`)

Add any new field types needed, then add the component schema:

```typescript
// If needed: new field type
export interface MyItemField {
  type: 'myItem';
  name: LocalizedContent;
  // ... other properties
}

// Update Field union if new field type added
export type Field = TextField | RichTextField | ImageField | ListField | MyItemField;

// Component schema
export interface MySectionSchema extends ComponentSchema {
  type: 'MySection';
  fields: {
    title: TextField;
    items: ListField<MyItemField>;
  };
}
```

### Step 2: Add to Registry (`packages/catalyst/src/core/registry.ts`)

1. Import the new schema type
2. Create the default factory function
3. Add to COMPONENT_REGISTRY

```typescript
import { ..., MySectionSchema } from './types';

function createDefaultMySection(): MySectionSchema {
  return {
    id: `my-section-${Date.now()}`,
    type: 'MySection',
    fields: {
      title: { type: 'text', value: { en: 'Default Title' } },
      items: { type: 'list', value: [...] },
    },
  };
}

// In COMPONENT_REGISTRY:
MySection: {
  type: 'MySection',
  label: 'My Section',
  description: 'Description here',
  category: 'content',
  icon: '📦',
  createDefault: createDefaultMySection,
},
```

### Step 3a: Create Pure Display Component (`consumer-app/components/sections/[name]/[name].tsx`)

**This component has ZERO knowledge of edit mode, localization, or schemas.**
**Uses ReactNode slots so edit mode can inject editable components.**

```typescript
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../../ui/section";

interface MySectionProps {
  title: ReactNode;       // String or EditableText
  subtitle: ReactNode;    // String or EditableText
  className?: string;
  editBar?: ReactNode;    // SectionEditBar in edit mode
}

/**
 * Pure display component.
 * Accepts ReactNode slots - layout is defined once here.
 * EditableMySection injects editable components into slots.
 */
export function MySection({ title, subtitle, className, editBar }: MySectionProps) {
  return (
    <Section className={cn("group relative", className)}>
      {editBar}
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </Section>
  );
}
```

### Step 3b: Create Editable Wrapper (`consumer-app/components/sections/[name]/editable-[name].tsx`)

**This component injects editable elements into the pure component's slots.**
**Both view and edit mode render through the same pure component.**

```typescript
"use client";

import {
  EditableText,
  getLocalizedValue,
  type LocalizedContent,
  type MySectionSchema,
  useCatalyst,
  useVariantHandling,
} from "catalyst";

import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import { MySection } from "./my-section";

const EDIT_CLASS = "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS = "outline-2 outline-solid outline-primary outline-offset-2";

interface EditableMySectionProps {
  schema: MySectionSchema;
  onUpdate?: (schema: MySectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

export function EditableMySection({
  schema,
  onUpdate,
  className,
  sectionControls,
}: EditableMySectionProps) {
  const { isEditMode, locale } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  // ─────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────

  const handleTitleUpdate = (content: LocalizedContent) => {
    updateField("title", content, onUpdate);
  };

  // All hooks must be called before conditional returns

  // ─────────────────────────────────────────────────────────────────
  // View Mode - pass strings to slots
  // ─────────────────────────────────────────────────────────────────

  if (!isEditMode) {
    return (
      <MySection
        title={getLocalizedValue(fields.title.value, locale)}
        subtitle={getLocalizedValue(fields.subtitle.value, locale)}
        className={className}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // Edit Mode - pass editable components to same slots
  // ─────────────────────────────────────────────────────────────────

  return (
    <MySection
      className={className}
      editBar={
        <SectionEditBar
          sectionType={schema.type}
          controls={sectionControls}
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
        />
      }
      title={
        <EditableText
          content={fields.title.value}
          onUpdate={handleTitleUpdate}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      }
      subtitle={/* EditableText for subtitle */}
    />
  );
}
```

### Step 4: Update Page to Use Editable Component (`consumer-app/app/page.tsx`)

```typescript
// Add import (note: EditableMySection, not MySection)
import { EditableMySection } from "../components/sections/my-section/editable-my-section";

// Add to SectionSchema union
type SectionSchema = ... | MySectionSchema;

// Add case in switch statement
case "MySection":
  return (
    <EditableMySection
      key={section.schema.id}
      schema={section.schema as MySectionSchema}
      onUpdate={(schema) => updateSectionSchema(index, schema)}
      sectionControls={sectionControls}
    />
  );

// Add to addSectionOptions array
{ type: "MySection", label: "My Section" },
```

### Checklist for Editable Components

- [ ] Schema type defined in `types.ts`
- [ ] Field union updated if new field type added
- [ ] `createDefault` function in `registry.ts`
- [ ] Added to `COMPONENT_REGISTRY`
- [ ] **Pure display component** (`[name].tsx`) uses ReactNode slots
- [ ] Pure component has `editBar` slot for section chrome
- [ ] **Editable wrapper** (`editable-[name].tsx`) injects into slots
- [ ] Both view and edit mode render through pure component
- [ ] Editable wrapper uses `useVariantHandling` hook
- [ ] All hooks called before conditional return (React rules)
- [ ] Edit mode passes `EditableText` to slots
- [ ] Custom fields have popover editors with consumer-app UI
- [ ] Added to `SectionSchema` union in `page.tsx`
- [ ] Added case in switch statement in `page.tsx`
- [ ] Added to `addSectionOptions` array in `page.tsx`
- [ ] Build passes (`pnpm build`)
