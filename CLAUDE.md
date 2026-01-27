# Catalyst - AI Assistant Guide

## Quick Reference

```
MONOREPO STRUCTURE (pnpm workspace):
├── pnpm-workspace.yaml  # Workspace config
├── package.json         # Root scripts (dev, build, test)
├── packages/
│   └── catalyst/        # THE published package (name: "catalyst")
│       └── src/
│           ├── index.ts     # Main export
│           ├── core/        # Types, schemas, utilities (framework-agnostic)
│           ├── react/       # React bindings, hooks, ComponentRenderer
│           └── storage/     # Persistence adapters
└── consumer-app/        # Example Next.js app (NOT published)
    └── components/      # Example component implementations
```

### Import Pattern

```typescript
// Single package import - everything from 'catalyst'
import {
  // Core types
  ComponentSchema, PageSchema, LocalizedContent, Locale,
  // React bindings
  CatalystProvider, useCatalyst, ComponentRenderer, EditableText,
  // Storage
  JsonStorageAdapter
} from 'catalyst';

// CSS variables (optional)
import 'catalyst/styles.css';
```

## Component Registry Pattern

Catalyst uses a **registry pattern** where consumers register their own React components. The framework provides infrastructure; consumers provide rendering.

### Key Files

| Purpose | File |
|---------|------|
| Registry types | `packages/catalyst/src/react/CatalystContext.tsx` |
| Dynamic renderer | `packages/catalyst/src/react/ComponentRenderer.tsx` |
| Variant handling hook | `packages/catalyst/src/react/useVariantHandling.ts` |
| Editable text | `packages/catalyst/src/react/EditableText.tsx` |
| Editable image | `packages/catalyst/src/react/EditableImage.tsx` |
| Editable link | `packages/catalyst/src/react/EditableLink.tsx` |
| Core types | `packages/catalyst/src/core/types.ts` |
| Component registry | `packages/catalyst/src/core/registry.ts` |

### Type Definitions

```typescript
// From packages/catalyst/src/react/CatalystContext.tsx

// Contract for Catalyst-compatible components
type CatalystComponent<T extends ComponentSchema = ComponentSchema> =
  React.ComponentType<{
    schema: T;
    onUpdate?: (schema: T) => void;
  }>;

// Registry mapping type names to components
type ComponentRegistry = Record<string, CatalystComponent>;
```

### Registration Pattern

```typescript
// In _app.tsx or root component

import { CatalystProvider } from 'catalyst';
import { CTASection, HeroBanner, FeatureList } from '@/components';

// Components are defined in the consumer app, NOT in catalyst
const components = {
  CTASection,
  HeroBanner,
  FeatureList,
};

<CatalystProvider components={components}>
  <App />
</CatalystProvider>
```

### Rendering Pattern

```typescript
// In any page/component

import { ComponentRenderer } from 'catalyst';

// ComponentRenderer looks up schema.type in registry
<ComponentRenderer
  schema={componentSchema}  // { type: 'CTASection', fields: {...} }
  onUpdate={handleUpdate}
/>
```

## Creating a New Component

### Step 1: Define Schema in Core

File: `packages/catalyst/src/core/types.ts`

```typescript
export interface MyComponentSchema extends ComponentSchema {
  type: 'MyComponent';
  fields: {
    title: TextField;
    description: RichTextField;
  };
}
```

### Step 2: Add to Registry Metadata

File: `packages/catalyst/src/core/registry.ts`

```typescript
export const COMPONENT_REGISTRY: Record<string, ComponentMetadata> = {
  // ... existing
  MyComponent: {
    type: 'MyComponent',
    label: 'My Component',
    description: 'Does something useful',
    category: 'content',
  },
};

export function createDefaultMyComponent(): MyComponentSchema {
  return {
    id: `mycomponent-${Date.now()}`,
    type: 'MyComponent',
    fields: {
      title: { type: 'text', value: { en: 'Default Title' } },
      description: { type: 'richtext', value: { en: 'Default description' } },
    },
  };
}

// Add to createComponent switch statement
```

### Step 3: Create React Component

File: `consumer-app/components/MyComponent.tsx` (in YOUR app, not catalyst)

```typescript
import { MyComponentSchema, getLocalizedValue, useCatalyst, useVariantHandling, EditableText, VariantSelector } from 'catalyst';

interface MyComponentProps {
  schema: MyComponentSchema;
  onUpdate?: (schema: MyComponentSchema) => void;
}

export function MyComponent({ schema, onUpdate }: MyComponentProps) {
  const { locale, isEditMode } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  return (
    <section>
      {isEditMode && (
        <VariantSelector
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
        />
      )}

      <EditableText
        content={fields.title.value}
        onUpdate={(content) => updateField('title', content, onUpdate)}
      />
    </section>
  );
}
```

### Step 4: Register in Consumer

File: `consumer-app/app/layout.tsx` or root component

```typescript
import { MyComponent } from '@/components';

const components = {
  // ... existing
  MyComponent,
};
```

## useVariantHandling Hook

Central hook for variant/personalization support. All components should use this.

```typescript
const {
  displaySchema,      // Schema with variants applied (for rendering)
  editingVariant,     // Current variant being edited (null = base)
  setEditingVariant,  // Switch to editing a variant
  updateField,        // Update field in base or variant
} = useVariantHandling({ schema });
```

### Update Field Signature

```typescript
updateField(
  fieldName: string,      // 'title', 'description', etc.
  updatedContent: any,    // LocalizedContent for text fields
  onUpdate?: (schema) => void  // Callback to parent
)
```

## Editable Components

### EditableText

For inline text editing. Double-click to edit in edit mode.

```typescript
import { EditableText } from 'catalyst';

<EditableText
  content={fields.title.value}      // LocalizedContent
  onUpdate={(content) => updateField('title', content, onUpdate)}
  as="h2"                           // 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className="text-xl font-bold"
/>
```

### EditableImage

For image URL and alt text editing. Click to edit in edit mode.

```typescript
import { EditableImage } from 'catalyst';

<EditableImage
  src={fields.heroImage.src}        // string URL
  alt={fields.heroImage.alt}        // LocalizedContent
  onUpdate={({ src, alt }) => {
    // Update the ImageField
    const updated = { ...schema };
    updated.fields.heroImage = { type: 'image', src, alt };
    onUpdate(updated);
  }}
  className="w-full"
  width={800}
  height={400}
/>
```

**Edit mode behavior:**
- Click image to open edit popover
- Edit URL and alt text (localized)
- Cmd+Enter to save, Esc to cancel
- Click outside to cancel

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `src` | `string` | Image URL |
| `alt` | `LocalizedContent` | Localized alt text |
| `onUpdate` | `({ src, alt }) => void` | Called on save |
| `className` | `string` | CSS class for img element |
| `style` | `CSSProperties` | Inline styles for img |
| `width` | `number \| string` | Image width |
| `height` | `number \| string` | Image height |

**Future:** Will support `ImageProvider` for upload/browse when registered.

### EditableLink

For link URL and text editing. Click to edit in edit mode.

```typescript
import { EditableLink } from 'catalyst';

<EditableLink
  href={fields.buttonUrl.value}    // LocalizedContent (URL)
  text={fields.buttonText.value}   // LocalizedContent (link text)
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-500"
  onUpdate={({ href, text }) => {
    // Update both URL and text fields
  }}
>
  {/* Optional children (e.g., icon) rendered after text */}
  <ArrowIcon />
</EditableLink>
```

**Edit mode behavior:**
- Click link to open edit popover
- Edit link text and URL (both localized)
- Cmd+Enter to save, Esc to cancel
- Click outside to cancel
- Link navigation is disabled in edit mode

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `href` | `LocalizedContent` | Localized URL |
| `text` | `LocalizedContent` | Localized link text |
| `onUpdate` | `({ href, text }) => void` | Called on save |
| `className` | `string` | CSS class for anchor element |
| `style` | `CSSProperties` | Inline styles |
| `target` | `string` | Link target (e.g., `_blank`) |
| `rel` | `string` | Link rel attribute |
| `children` | `ReactNode` | Optional children (rendered after text) |

## Field Types

From `packages/catalyst/src/core/types.ts`:

| Type | Structure |
|------|-----------|
| `TextField` | `{ type: 'text', value: LocalizedContent }` |
| `RichTextField` | `{ type: 'richtext', value: LocalizedContent }` |
| `ImageField` | `{ type: 'image', src: string, alt: LocalizedContent }` |
| `ListField<T>` | `{ type: 'list', value: T[] }` |

```typescript
// LocalizedContent requires 'en', other locales optional
type LocalizedContent<T = string> = {
  en: T;      // required (fallback)
  es?: T;     // optional
};

// Locale type controls available languages
type Locale = 'en' | 'es';
```

## Context Values

Access via `useCatalyst()`:

```typescript
{
  locale: 'en' | 'es',
  personalization: { segment?: string },
  isEditMode: boolean,
  storageAdapter?: StorageAdapter,
  components: ComponentRegistry,  // the registered components
}
```

## Common Tasks

### Add a component type to existing page

1. Create component following pattern above
2. Register in root component
3. Add to page data JSON with matching `type` field

### Swap a component implementation

```typescript
// Just change which component is registered for a type
import { MyCustomHeroBanner } from '@/components/MyCustomHeroBanner';

const components = {
  HeroBanner: MyCustomHeroBanner,  // use your custom version
  // ...
};
```

### Access component registry programmatically

```typescript
const { components } = useCatalyst();
const MyComponent = components['MyComponent'];
```

## File Locations Quick Reference

| Need to... | Look in... |
|------------|------------|
| Add/modify schema types | `packages/catalyst/src/core/types.ts` |
| Add component metadata | `packages/catalyst/src/core/registry.ts` |
| Modify context/provider | `packages/catalyst/src/react/CatalystContext.tsx` |
| Modify dynamic renderer | `packages/catalyst/src/react/ComponentRenderer.tsx` |
| See catalyst source | `packages/catalyst/src/` |

## Package Structure

```
catalyst (single published package)
└── src/
    ├── index.ts      # Re-exports everything
    ├── core/         # Framework-agnostic types and utilities
    │   ├── types.ts
    │   ├── utils.ts
    │   ├── storage.ts
    │   └── registry.ts
    ├── react/        # React bindings
    │   ├── CatalystContext.tsx
    │   ├── ComponentRenderer.tsx
    │   ├── EditableText.tsx
    │   ├── EditableImage.tsx
    │   ├── EditableLink.tsx
    │   ├── hooks.ts
    │   ├── useVariantHandling.ts
    │   └── ui/       # UI primitives
    └── storage/      # Storage adapters
        └── json-adapter.ts
```

## Running the Project

```bash
# Install dependencies (using pnpm)
pnpm install

# Run consumer app dev server
pnpm dev

# Run with file watching for all packages
pnpm dev:watch

# Build catalyst package
pnpm build

# Run tests
pnpm test
```

## URL Parameters (consumer-app)

| Param | Effect |
|-------|--------|
| `?edit=true` | Enable edit mode |
| `?lang=es` | Switch to Spanish |
| `?segment=premium` | Apply premium variant personalization |

Example: `http://localhost:3000/demo?edit=true&lang=en&segment=premium`
