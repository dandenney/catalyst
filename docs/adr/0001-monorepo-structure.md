# ADR 0001: Monorepo Structure with Single Catalyst Package

## Status

Accepted

## Date

2025-01-26

## Context

Catalyst is a page builder framework for React applications. The project needed a clear package structure that would:

1. Support local development with a consumer app
2. Publish a single, easy-to-use package to npm
3. Maintain clean separation between framework code and example implementations
4. Use modern tooling with good monorepo support

### Previous Structure

The project initially had three separate packages:
- `@catalyst/core` - Types, schemas, utilities (framework-agnostic)
- `@catalyst/react` - React bindings, hooks, components
- `@catalyst/storage` - Persistence adapters

This created complexity:
- Consumers needed to install multiple packages
- Internal dependencies between packages added overhead
- Import paths were verbose (`import { X } from '@catalyst/core'`)

## Decision

We will use a **pnpm workspace monorepo** with a **single published `catalyst` package** that consolidates all functionality.

### Final Structure

```
catalyst/
├── pnpm-workspace.yaml          # Workspace configuration
├── package.json                 # Root: catalyst-workspace (private)
├── packages/
│   └── catalyst/                # THE published package
│       ├── package.json         # name: "catalyst", version: "0.0.1"
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts         # Main export (re-exports all modules)
│           ├── core/            # Types, schemas, utilities
│           │   ├── types.ts
│           │   ├── utils.ts
│           │   ├── storage.ts
│           │   └── registry.ts
│           ├── react/           # React bindings
│           │   ├── CatalystContext.tsx
│           │   ├── ComponentRenderer.tsx
│           │   ├── EditableText.tsx
│           │   ├── EditableImage.tsx
│           │   ├── EditableLink.tsx
│           │   ├── hooks.ts
│           │   ├── useVariantHandling.ts
│           │   ├── ui/          # UI primitives
│           │   ├── lib/         # Utilities (cn function)
│           │   └── styles/      # CSS variables
│           └── storage/         # Storage adapters
│               └── json-adapter.ts
└── consumer-app/                # Example Next.js app (NOT published)
    └── ...
```

### Key Decisions

1. **pnpm over npm/yarn**: Better workspace support, faster installs, strict dependency resolution
2. **Single package**: Simpler consumer experience (`import { X } from 'catalyst'`)
3. **Internal module organization**: Code organized in `core/`, `react/`, `storage/` directories but exported from single entry point
4. **`workspace:*` protocol**: Local linking during development, replaced with version on publish
5. **Neutral root**: Root `package.json` is private and only contains orchestration scripts

### Import Pattern

```typescript
// Single import for everything
import {
  // Core types
  ComponentSchema, PageSchema, LocalizedContent, Locale,
  // React bindings
  CatalystProvider, useCatalyst, ComponentRenderer, EditableText,
  // Storage
  JsonStorageAdapter
} from 'catalyst';

// Optional: CSS variables
import 'catalyst/styles.css';
```

### Root Scripts

```json
{
  "scripts": {
    "dev": "pnpm -F consumer-app dev",
    "dev:watch": "pnpm -r --parallel dev",
    "build": "pnpm -F catalyst build",
    "test": "pnpm -F catalyst test"
  }
}
```

## Consequences

### Positive

- **Simple consumer DX**: One package to install, one import source
- **No internal dependency management**: No versioning between core/react/storage
- **Clear separation**: Framework code in `packages/catalyst`, examples in `consumer-app`
- **Fast local development**: pnpm workspace linking is automatic
- **Future flexibility**: Can add more packages later if needed (e.g., `catalyst-vue`)

### Negative

- **Larger bundle for partial usage**: Consumers who only need types get React code too (mitigated by tree-shaking)
- **React is required**: Can't use core types without React peer dependency (acceptable for current scope)

### Neutral

- **Migration required**: Existing code using `@catalyst/core` or `@catalyst/react` needs import updates
- **pnpm required**: Contributors must use pnpm (enforced via `packageManager` field if desired)

## Alternatives Considered

### 1. Keep Multiple Packages

Rejected because:
- Added complexity for consumers
- Internal versioning overhead
- More complex publish process

### 2. Turborepo

Rejected because:
- Overkill for current project size
- pnpm workspaces provide sufficient functionality
- Can add later if build caching becomes valuable

### 3. npm workspaces

Rejected because:
- pnpm has better strict mode and faster installs
- `workspace:*` protocol is cleaner than file references

## References

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Workspace Protocol](https://pnpm.io/workspaces#workspace-protocol-workspace)
