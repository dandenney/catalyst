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
- **Localization**: Support for English (`en`) and Spanish (`es`) with automatic fallback
- **Personalization**: URL-based segment targeting (e.g., `?segment=finance` changes hero subtitle)
- **Local Storage**: JSON file-based storage (no external database)

## Getting Started

### Prerequisites

- Node.js 20+ and npm

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
- `useCatalyst`: Hook for accessing context

### @catalyst/demo-components

Demo React components:
- `HeroBanner`: Hero banner component
- `FeatureList`: Feature list component
- `ComponentRenderer`: Component registry for rendering schemas

### Consumer App

The Next.js consumer app includes:
- **API Routes** (`/api/pages/[slug]`): Server-side data handling
- **Custom Hook** (`usePage`): Client-side data fetching via fetch API
- **Pages**: `/demo` and `/blank` routes

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

## Development

### Building Packages

Build all packages:
```bash
npm run build
```

Build specific package:
```bash
npm run build --workspace=@catalyst/core
```

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
