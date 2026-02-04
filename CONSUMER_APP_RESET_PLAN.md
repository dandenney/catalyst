# Consumer App Reset Plan

This document outlines the plan to reset the consumer-app for a fresh set of components while preserving the editor UI infrastructure.

## What's Already Safe (catalyst package)

The core editor infrastructure lives in `packages/catalyst/` and won't be touched:
- `EditableText`, `EditableLink`, `EditableImage`
- `VariantSelector`, `ComponentControls`, `ComponentPanel`, `InsertButton`
- `useVariantHandling`, `useEditableLink` hooks
- `CatalystProvider`, `useCatalyst`
- UI primitives (button, input, popover, sheet, etc.)

---

## Consumer-App Editor UI to Preserve

These 4 files in `consumer-app/components/ui/` are the editor UI:

| File | Purpose |
|------|---------|
| `section-edit-bar.tsx` | Top bar with edit button + pencil icon |
| `section-edit-sheet.tsx` | Right-side sheet with section controls |
| `edit-mode-indicator.tsx` | Bottom indicator showing edit mode state |
| `section-controls.ts` | Type definitions for move/remove callbacks |

**These stay in place, untouched.**

---

## Archive Structure

```
consumer-app/
├── _archive/
│   ├── sections/           ← Move all except cta/
│   │   ├── hero/
│   │   ├── pricing/
│   │   ├── logos/
│   │   ├── items/
│   │   ├── faq/
│   │   ├── stats/
│   │   ├── footer/
│   │   └── navbar/
│   ├── ui/                 ← Move example-specific UI
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── item.tsx
│   │   ├── pricing-column.tsx
│   │   ├── mockup.tsx
│   │   ├── screenshot.tsx
│   │   ├── editable-screenshot.tsx
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── navigation.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── beam.tsx
│   │   ├── glow.tsx
│   │   └── layout-lines.tsx
│   └── logos/              ← Move entire folder
```

---

## Keep in Place

```
consumer-app/components/
├── contexts/               ← Keep (CatalystWrapper, ThemeProvider)
├── sections/
│   └── cta/                ← Keep as example template
│       ├── schema-cta.tsx
│       └── default.tsx
└── ui/
    ├── section-edit-bar.tsx      ← EDITOR UI - Keep
    ├── section-edit-sheet.tsx    ← EDITOR UI - Keep
    ├── edit-mode-indicator.tsx   ← EDITOR UI - Keep
    ├── section-controls.ts       ← EDITOR UI - Keep
    ├── section.tsx               ← Keep (base wrapper)
    ├── button.tsx                ← Keep (shadcn primitive)
    ├── input.tsx                 ← Keep (shadcn primitive)
    ├── label.tsx                 ← Keep (shadcn primitive)
    ├── popover.tsx               ← Keep (shadcn primitive)
    ├── sheet.tsx                 ← Keep (shadcn primitive)
    ├── accordion.tsx             ← Keep (shadcn primitive)
    ├── dropdown-menu.tsx         ← Keep (shadcn primitive)
    ├── icon-picker.tsx           ← Keep (useful utility)
    └── mode-toggle.tsx           ← Keep (theme toggle)
```

---

## Simplify page.tsx

Strip down to only CTA:
- Remove state for hero, pricing, logos, items, faq, stats, footer, navbar
- Keep one `ctaSchema` state
- Keep the edit mode URL params logic
- Simplify the add-section UI (or remove temporarily)

---

## Execution Steps

1. Create `consumer-app/_archive/` directory
2. Move archived sections, UI components, and logos
3. Simplify `page.tsx` to only render CTA
4. Update imports (remove references to archived components)
5. Merge Tailwind config from the other branch
6. Test with `pnpm dev`

---

## Notes

- The `section.tsx` wrapper component is a simple flex container with glass effects - decide if you need it or want to create a fresh section wrapper
- Edit mode styling constants pattern used in sections:
  ```typescript
  const EDIT_CLASS = "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
  const EDITING_CLASS = "outline-2 outline-solid outline-primary outline-offset-2";
  ```
- Every schema section should use `useVariantHandling` and include `SectionEditBar`
