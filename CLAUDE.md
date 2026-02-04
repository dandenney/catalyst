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

### Variants/Personalization
- `useVariantHandling({ schema })` handles variant selection and field updates
- Returns: `displaySchema`, `editingVariant`, `setEditingVariant`, `updateField`
- Variants keyed by segment (e.g., 'premium')

## Key Files

| Purpose | Location |
|---------|----------|
| Core types | `packages/catalyst/src/core/types.ts` |
| Component registry (for `createComponent()`) | `packages/catalyst/src/core/registry.ts` |
| Context/Provider | `packages/catalyst/src/react/CatalystContext.tsx` |
| Page rendering & switch statement | `consumer-app/app/page.tsx` |
| Variant handling | `packages/catalyst/src/react/useVariantHandling.ts` |
| Editable link hook | `packages/catalyst/src/react/useEditableLink.ts` |
| Hooks exports | `packages/catalyst/src/react/hooks.ts` |

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
| `?edit=true` | Enable edit mode |
| `?lang=es` | Switch to Spanish |
| `?segment=premium` | Apply personalization variant |

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

**IMPORTANT:** Always include variant support using `useVariantHandling` and `VariantSelector`.

```typescript
"use client";

import {
  EditableText,
  type LocalizedContent,
  type MySectionSchema,
  useCatalyst,
  useVariantHandling,
  VariantSelector,
} from "catalyst";

// Edit mode styling constants
const EDIT_CLASS = "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS = "outline-2 outline-solid outline-primary outline-offset-2";

interface SchemaMySectionProps {
  schema: MySectionSchema;
  onUpdate?: (schema: MySectionSchema) => void;
  className?: string;
}

export default function SchemaMySection({ schema, onUpdate, className }: SchemaMySectionProps) {
  const { isEditMode } = useCatalyst();

  // ALWAYS use useVariantHandling for variant support
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleTitleUpdate = (content: LocalizedContent) => {
    updateField("title", content, onUpdate);
  };

  return (
    <Section className={className}>
      {/* ALWAYS include VariantSelector in edit mode */}
      {isEditMode && schema.variants && Object.keys(schema.variants).length > 0 && (
        <div className="flex justify-end mb-4">
          <VariantSelector
            variants={schema.variants}
            currentVariant={editingVariant}
            onVariantChange={setEditingVariant}
          />
        </div>
      )}

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
3. Add a case in the switch statement
4. Add to `addSectionOptions` array

```typescript
// Add import
import SchemaMySection from "../components/sections/my-section/schema-my-section";

// Add to SectionSchema union
type SectionSchema = ... | MySectionSchema;

// Add case in switch statement
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
- [ ] Schema component includes `VariantSelector` when in edit mode
- [ ] All text fields use `EditableText` with edit styling classes
- [ ] Custom fields have popover editors with consumer-app UI components
- [ ] Added to `SectionSchema` union in `page.tsx`
- [ ] Added case in switch statement in `page.tsx`
- [ ] Added to `addSectionOptions` array in `page.tsx`
- [ ] Build passes (`pnpm build`)
