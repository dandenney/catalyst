# ADR 0002: Separate Client and Server Exports

## Status

Accepted

## Date

2025-01-26

## Context

Catalyst is used in Next.js applications with the App Router, which enforces strict separation between client and server components. Client components cannot import Node.js-only modules like `fs` or `path`.

The catalyst package includes:
- **Client-safe code**: React components, hooks, context, types
- **Server-only code**: Storage adapters (JsonStorageAdapter uses Node.js `fs`)

Initially, everything was exported from a single entry point:

```typescript
// This fails in client components because it bundles fs
import { CatalystProvider, JsonStorageAdapter } from 'catalyst';
```

When `CatalystProvider` was used in a client component, the bundler attempted to include the storage module (which imports `fs`), causing build failures:

```
Module not found: Can't resolve 'fs'
```

## Decision

Split the package into two entry points:

1. **`catalyst`** - Client-safe exports (types, React bindings)
2. **`catalyst/server`** - Server-only exports (storage adapters)

### Package Structure

```
packages/catalyst/src/
├── index.ts      # Client-safe: core + react
├── server.ts     # Server-only: storage
├── core/         # Types, utilities (client-safe)
├── react/        # React bindings (client-safe)
└── storage/      # Storage adapters (server-only)
```

### Export Configuration

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./server": "./src/server.ts",
    "./styles.css": "./src/react/styles/catalyst.css"
  }
}
```

### Import Pattern

```typescript
// Client components - React bindings and types
import {
  CatalystProvider,
  useCatalyst,
  EditableText,
  ComponentSchema
} from 'catalyst';

// Server components or API routes only
import { JsonStorageAdapter } from 'catalyst/server';

// CSS (optional)
import 'catalyst/styles.css';
```

## Consequences

### Positive

- **Works with Next.js App Router**: Client components can safely import from `catalyst`
- **Clear boundaries**: Obvious which code is server-only
- **Tree-shaking friendly**: Client bundles don't include server code
- **Extensible**: Future server-only features have a clear home

### Negative

- **Two imports instead of one**: Slightly more verbose for full-stack usage
- **Documentation update needed**: Must clarify which exports are where

### Neutral

- **Follows common patterns**: Similar to `next/server`, `@tanstack/react-query` server exports

## Alternatives Considered

### 1. Conditional Exports with `package.json` `browser` Field

Could use the `browser` field to swap implementations, but:
- More complex configuration
- Harder to understand
- Doesn't clearly communicate intent to consumers

### 2. Separate Package (`catalyst-server`)

Could publish storage as a separate package, but:
- Adds publishing complexity
- Overkill for current scope
- Harder to keep versions in sync

### 3. Dynamic Imports Only

Could require consumers to use dynamic imports for storage:

```typescript
const { JsonStorageAdapter } = await import('catalyst/storage');
```

Rejected because:
- Awkward API
- Doesn't solve the bundler analysis issue

## References

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Package.json Exports](https://nodejs.org/api/packages.html#subpath-exports)
