# Catalyst

An open-source, schema-driven page builder with a decoupled architecture. This POC demonstrates clean separation of concerns, localization, personalization, and edit-in-place functionality.

## Architecture

This is a monorepo with clear separation between tooling packages and the consumer application:

```
catalyst/
├── packages/
│   ├── core/              # Framework-agnostic types and contracts
│   ├── storage/           # Storage adapters (JSON file adapter)
│   ├── react/             # React bindings and hooks
│   └── demo-components/   # Demo components (HeroBanner, FeatureList)
└── consumer-app/          # Next.js consumer application
    └── data/              # JSON data files
```

## Features

### MVP Features

- **Schema-Driven Architecture**: All components are defined via type-safe schemas
- **Two Demo Components**:
  - `HeroBanner`: Hero banner with title, subtitle, and background image
  - `FeatureList`: Grid of feature items with titles and descriptions
- **Two Routes**:
  - `/demo`: Prefilled page with HeroBanner and FeatureList
  - `/blank`: Empty page ready for content
- **Edit-in-Place**: Double-click text fields to edit when in edit mode
- **Component Previews**: Visual thumbnails of components in the component picker (Playwright-generated screenshots)
- **Localization**: Support for English (`en`) and Spanish (`es`) with automatic fallback
- **Personalization**: URL-based segment targeting (e.g., `?segment=finance` changes hero subtitle)
- **Local Storage**: JSON file-based storage (no external database)

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Playwright browsers (auto-installed when generating previews)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Build all packages:
```bash
npm run build
```

3. Start the dev server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Viewing Pages

- **Demo page**: `http://localhost:3000/demo`
- **Blank page**: `http://localhost:3000/blank`

### Localization

Add `?lang=es` to view Spanish content:
- `http://localhost:3000/demo?lang=es`

### Edit Mode

Add `?edit=true` to enable edit mode:
- `http://localhost:3000/demo?edit=true`

In edit mode:
- Text fields will have a dashed outline
- Double-click any text to edit it
- Press Enter to save or Escape to cancel
- Changes are persisted to the JSON files

### Personalization

Add `?segment=finance` to see personalized content:
- `http://localhost:3000/demo?segment=finance`

This will show the "finance" variant subtitle in the hero banner.

### Combining Parameters

You can combine multiple parameters:
- `http://localhost:3000/demo?lang=es&edit=true&segment=finance`

### Component Previews

When adding components in edit mode, you'll see visual preview thumbnails in the component picker panel. These previews are pixel-perfect screenshots generated using Playwright.

**To generate/update component previews:**

1. Ensure the dev server is running:
```bash
npm run dev
```

2. In another terminal, run the preview generation script:
```bash
npm run generate-previews --workspace=consumer-app
```

This will:
- Launch a headless browser
- Navigate to each component's preview route (`/preview/[component]`)
- Capture 800x600px screenshots
- Save images to `consumer-app/public/component-previews/`

Preview images are committed to the repository and served statically.

## Architecture & Data Flow

The application uses a clean client-server separation:

1. **Client (Browser)**: React components fetch page data via API routes
2. **API Routes**: Next.js API routes handle data persistence using storage adapters
3. **Storage Layer**: JSON file adapter reads/writes data on the server filesystem

```
Browser → API Route → Storage Adapter → JSON Files
   ↑                                        ↓
   └────────── Page Data ───────────────────┘
```

This architecture ensures:
- Storage operations only run server-side (Node.js environment)
- Client remains lightweight and framework-agnostic
- Easy to swap storage adapters (JSON → Database)

## Package Details

### @catalyst/core

Framework-agnostic core package with:
- TypeScript types for schemas
- Localization utilities
- Personalization utilities
- Storage adapter interface

### @catalyst/storage

Storage adapter implementations:
- `JsonStorageAdapter`: File-based storage using JSON (server-side only)

### @catalyst/react

React bindings including:
- `CatalystProvider`: Context provider for locale, personalization, and edit mode
- `EditableText`: Component for editable text fields
- `VariantSelector`: UI for selecting and editing component variants
- `useCatalyst`: Hook for accessing context (locale, edit mode, personalization)
- `useVariantHandling`: **Required hook** that centralizes variant logic for all components

### @catalyst/demo-components

Demo React components:
- `HeroBanner`: Hero banner component
- `FeatureList`: Feature list component
- `CTASection`: Call-to-action component (with gradient background and button)
- `ComponentRenderer`: Component registry for rendering schemas

**All components are required to support variants for personalization.**

### Consumer App

The Next.js consumer app includes:
- **API Routes** (`/api/pages/[slug]`): Server-side data handling
- **Custom Hook** (`usePage`): Client-side data fetching via fetch API
- **Pages**: `/demo` and `/blank` routes
- **Preview Route** (`/preview/[component]`): Isolated component rendering for screenshot generation
- **Scripts** (`scripts/generate-previews.ts`): Playwright script for generating component thumbnails

## Data Format

Pages are stored as JSON files in `consumer-app/data/`. Example:

```json
{
  "id": "demo-page",
  "slug": "demo",
  "metadata": {
    "title": {
      "en": "Demo Page",
      "es": "Página de Demostración"
    }
  },
  "components": [
    {
      "id": "hero-1",
      "type": "HeroBanner",
      "fields": {
        "title": {
          "type": "text",
          "value": {
            "en": "Welcome",
            "es": "Bienvenido"
          }
        }
      },
      "variants": {
        "finance": {
          "subtitle": {
            "type": "text",
            "value": {
              "en": "Financial solutions"
            }
          }
        }
      }
    }
  ]
}
```

## Creating New Components

All components **must** support variants for personalization. We provide tools to ensure consistency:

### Quick Start

1. **Copy the template**:
   ```bash
   cp packages/demo-components/.component-template.tsx packages/demo-components/src/YourComponent.tsx
   ```

2. **Follow the checklist** in `docs/component-development-guide.md`

3. **Required elements**:
   - Import and use `useVariantHandling` hook
   - Render `<VariantSelector>` in edit mode
   - Use `displaySchema` (not raw `schema`)
   - Use `updateField` helper for all updates

### Example Component Structure

```tsx
import { useVariantHandling } from '@catalyst/react';

export function MyComponent({ schema, onUpdate }) {
  const { locale, isEditMode } = useCatalyst();

  // Required: Use variant handling hook
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  return (
    <div>
      {/* Required: Variant selector */}
      {isEditMode && (
        <VariantSelector
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
        />
      )}

      <EditableText
        content={fields.heading.value}
        onUpdate={(content) => updateField('heading', content, onUpdate)}
      />
    </div>
  );
}
```

### Documentation

- **[Component Development Guide](docs/component-development-guide.md)** - Complete guide with checklist
- **[Variant Enforcement Summary](docs/variant-enforcement-summary.md)** - Architecture overview
- **[Component Template](packages/demo-components/.component-template.tsx)** - Starter template

### Enforcement Layers

We ensure variant support through multiple layers:

1. **`useVariantHandling` Hook** - Centralizes all variant logic (required)
2. **Documentation & Templates** - Clear guidelines and copy-paste template
3. **ESLint Rules** - Automated linting to catch common mistakes
4. **TypeScript** - Compile-time type safety
5. **Manual Testing Checklist** - Runtime verification

## Development

### Linting

Check for issues:
```bash
npm run lint
```

Auto-fix when possible:
```bash
npm run lint:fix
```

### Building Packages

Build all packages:
```bash
npm run build
```

Build specific package:
```bash
npm run build --workspace=@catalyst/core
```

### Generating Component Previews

Generate component preview images:
```bash
npm run generate-previews --workspace=consumer-app
```

Note: Dev server must be running for preview generation to work.

### Clean Build Artifacts

```bash
npm run clean
```

## Design Principles

1. **Decoupled Architecture**: Consumer app only interacts with exported contracts
2. **Framework Agnostic Core**: Core types and logic have no framework dependencies
3. **Type Safety**: TypeScript everywhere for compile-time safety
4. **Zero External Dependencies**: No network calls, stub translation
5. **Clear Separation**: Packages are independently buildable and testable

## Limitations (POC)

- No authentication or user roles
- No real database (JSON files only)
- Stub translation (no external API)
- Limited component library (2 components)
- Basic edit functionality (text only)
- No undo/redo
- No component drag-and-drop

## License

MIT
