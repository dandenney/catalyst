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

**Key Principle:** Catalyst provides infrastructure; consumers provide component rendering. The framework uses a **registry pattern** where consumer apps register their own React components.

## Import Patterns

```typescript
// Client-side imports
import {
  ComponentSchema, PageSchema, LocalizedContent, Locale,
  CatalystProvider, useCatalyst, ComponentRenderer,
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
- Components registered via `CatalystProvider` with `components` prop
- `ComponentRenderer` looks up `schema.type` in registry to render
- Consumer defines React components; catalyst provides the wiring

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
| Component registry | `packages/catalyst/src/core/registry.ts` |
| Context/Provider | `packages/catalyst/src/react/CatalystContext.tsx` |
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

## Adding a New Component Type

1. **Define schema** in `packages/catalyst/src/core/types.ts`
2. **Add metadata** in `packages/catalyst/src/core/registry.ts` (including `createDefault` function)
3. **Create React component** in consumer-app using `useCatalyst`, `useVariantHandling`, and editable components
4. **Register** in consumer-app's `CatalystProvider`
