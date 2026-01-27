# Catalyst

A schema-driven page builder framework for React applications. Catalyst provides the infrastructure for building editable, localized, and personalized pages while letting you bring your own components.

## Architecture

This is a pnpm monorepo with a single published package:

```
catalyst/
├── packages/
│   └── catalyst/        # THE published package
│       └── src/
│           ├── core/    # Types, schemas, utilities (framework-agnostic)
│           ├── react/   # React bindings, hooks, editable components
│           └── storage/ # Persistence adapters
└── consumer-app/        # Example Next.js app (NOT published)
```

See [ADR 0001](docs/adr/0001-monorepo-structure.md) for architectural decisions.

## Features

- **Schema-Driven**: Components defined via type-safe schemas
- **Registry Pattern**: Register your own React components
- **Edit-in-Place**: Inline editing with `EditableText`, `EditableImage`, `EditableLink`
- **Localization**: Built-in support for multiple locales with automatic fallback
- **Personalization**: Variant-based content targeting via URL segments
- **Variant Handling**: Centralized hook for consistent variant behavior

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
# Install dependencies
pnpm install

# Build the catalyst package
pnpm build

# Start the consumer app dev server
pnpm dev
```

The example app will be available at `http://localhost:3000`

## Usage

### Import Pattern

Everything is exported from a single package:

```typescript
import {
  // Core types
  ComponentSchema, PageSchema, LocalizedContent, Locale,
  // React bindings
  CatalystProvider, useCatalyst, ComponentRenderer,
  EditableText, EditableImage, EditableLink,
  // Hooks
  useVariantHandling,
  // Storage
  JsonStorageAdapter
} from 'catalyst';

// Optional CSS variables
import 'catalyst/styles.css';
```

### Register Components

```typescript
import { CatalystProvider } from 'catalyst';
import { HeroBanner, FeatureList } from '@/components';

const components = {
  HeroBanner,
  FeatureList,
};

<CatalystProvider components={components}>
  <App />
</CatalystProvider>
```

### Render Components

```typescript
import { ComponentRenderer } from 'catalyst';

<ComponentRenderer
  schema={componentSchema}  // { type: 'HeroBanner', fields: {...} }
  onUpdate={handleUpdate}
/>
```

### URL Parameters

| Param | Effect |
|-------|--------|
| `?edit=true` | Enable edit mode |
| `?lang=es` | Switch to Spanish |
| `?segment=premium` | Apply personalization variant |

## Development

```bash
# Run consumer app
pnpm dev

# Run with file watching for all packages
pnpm dev:watch

# Build catalyst package
pnpm build

# Run tests
pnpm test
```

## Documentation

- [CLAUDE.md](CLAUDE.md) - Detailed developer guide and component patterns
- [ADR 0001](docs/adr/0001-monorepo-structure.md) - Monorepo structure decisions

## Design Principles

1. **Decoupled Architecture**: Consumer apps only interact with exported contracts
2. **Framework Agnostic Core**: Core types and logic have no framework dependencies
3. **Registry Pattern**: Consumers register their own components, framework provides infrastructure
4. **Type Safety**: TypeScript throughout for compile-time safety

## License

MIT
