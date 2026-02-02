# Agent Guidelines for Ralph

This file provides guidance for AI agents working on this codebase in Ralph mode.

## Quality Expectations

This codebase will outlive you. Every shortcut compounds into technical debt. Fight entropy. Leave it better than you found it.

## Component Conversion Standards

When converting components to schema-based editable versions:

### 1. Type Safety First
- Define all field types explicitly in `packages/catalyst/src/core/types.ts`
- Use `LocalizedContent` for all user-facing text
- Export new types from `packages/catalyst/src/index.ts`

### 2. Consistent Patterns
- Always use `useVariantHandling` hook for variant support
- Always include `VariantSelector` when in edit mode
- Use `EDIT_CLASS` and `EDITING_CLASS` constants consistently:
  ```typescript
  const EDIT_CLASS = "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
  const EDITING_CLASS = "outline-2 outline-solid outline-primary outline-offset-2";
  ```

### 3. Editor UX
- Use `Sheet` component for editing complex items with multiple fields
- Use `Popover` for simple single-field edits
- All editors should have Cancel and Save buttons
- Include locale indicator in field labels: `Label ({locale.toUpperCase()})`

### 4. Commit Standards
- One commit per component conversion
- Commit message format: `feat([component]): make [component] section editable`
- Include progress.txt update in the same commit
- All feedback loops must pass before committing

## Feedback Loops

Before any commit, ALL must pass:
1. `pnpm typecheck` - TypeScript compilation
2. `pnpm lint` - ESLint checks
3. `pnpm build` - Build verification

Do NOT commit if any loop fails. Fix the issue first.

## Progress Tracking

Update `ralph/progress.txt` after each completed component:
- Move from "In Progress" to "Completed" section
- Note any decisions made
- Document any blockers encountered

## File Locations

| Purpose | Path |
|---------|------|
| Schema types | `packages/catalyst/src/core/types.ts` |
| Registry | `packages/catalyst/src/core/registry.ts` |
| Exports | `packages/catalyst/src/index.ts` |
| Schema components | `consumer-app/components/sections/[name]/schema-[name].tsx` |
| Reference impl | `consumer-app/components/sections/stats/schema-stats.tsx` |

## Signal Protocol

When finished with a component successfully:
```
<promise>COMPLETE</promise>
```

When blocked:
```
<promise>BLOCKED: [specific reason]</promise>
```

When all PRD components are done:
```
<promise>ALL_DONE</promise>
```
