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

## Consumer App Patterns

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

## Making a Component Editable (Complete Pattern)

When asked to make a component editable, follow this complete pattern:

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

### Step 3: Create Schema Component (`consumer-app/components/sections/[name]/schema-[name].tsx`)

**IMPORTANT:** Always include variant support using `useVariantHandling` and pass variant props to `SectionEditBar`.

```typescript
"use client";

import {
  EditableText,
  type LocalizedContent,
  type MySectionSchema,
  useVariantHandling,
} from "catalyst";

import { cn } from "@/lib/utils";
import { Section } from "../../ui/section";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";

// Edit mode styling constants
const EDIT_CLASS = "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS = "outline-2 outline-solid outline-primary outline-offset-2";

interface SchemaMySectionProps {
  schema: MySectionSchema;
  onUpdate?: (schema: MySectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

export default function SchemaMySection({
  schema,
  onUpdate,
  className,
  sectionControls,
}: SchemaMySectionProps) {
  // ALWAYS use useVariantHandling for variant support
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleTitleUpdate = (content: LocalizedContent) => {
    updateField("title", content, onUpdate);
  };

  return (
    <Section className={cn("group relative", className)}>
      {/* SectionEditBar handles variant selection via sheet UI */}
      <SectionEditBar
        sectionType={schema.type}
        controls={sectionControls}
        variants={schema.variants}
        currentVariant={editingVariant}
        onVariantChange={setEditingVariant}
      />

      <EditableText
        content={fields.title.value}
        onUpdate={handleTitleUpdate}
        as="h2"
        editClassName={EDIT_CLASS}
        editingClassName={EDITING_CLASS}
      />
      {/* ... rest of component */}
    </Section>
  );
}
```

### Step 4: Update Page to Use Schema Component (`consumer-app/app/page.tsx`)

1. Import the schema type and component
2. Add to the `SectionSchema` union type
3. Add a case in the switch statement (include `sectionControls` for move/remove functionality)
4. Add to `addSectionOptions` array

```typescript
// Add import
import SchemaMySection from "../components/sections/my-section/schema-my-section";

// Add to SectionSchema union
type SectionSchema = ... | MySectionSchema;

// Add case in switch statement (sectionControls is built in the map loop)
case "MySection":
  return (
    <SchemaMySection
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
- [ ] Schema component uses `useVariantHandling` hook
- [ ] Schema component passes variant props to `SectionEditBar`
- [ ] All text fields use `EditableText` with edit styling classes
- [ ] Custom fields have popover editors with consumer-app UI components
- [ ] Component accepts `sectionControls` prop and passes to `SectionEditBar`
- [ ] Added to `SectionSchema` union in `page.tsx`
- [ ] Added case in switch statement in `page.tsx`
- [ ] Added to `addSectionOptions` array in `page.tsx`
- [ ] Build passes (`pnpm build`)
