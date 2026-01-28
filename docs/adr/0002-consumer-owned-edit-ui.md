# ADR 0002: Consumer-Owned Edit UI Styling

## Status

Accepted

## Date

2026-01-28

## Context

Catalyst provides editable components (`EditableText`, `EditableLink`, `EditableImage`) that show visual indicators in edit mode and open popovers for editing. Two UI concerns emerged:

1. **Edit mode outlines**: Components need visible outlines to indicate they're editable. Catalyst's default uses CSS variables (`--catalyst-edit-outline`) which may not be visible against all backgrounds, especially in dark themes.

2. **Edit popovers**: Components like `EditableLink` and `EditableImage` open popovers with form fields. Catalyst includes shadcn-style UI primitives (`Popover`, `Input`, `Label`, `Button`) that use CSS variables for theming. These don't automatically inherit the consumer app's theme, causing contrast/readability issues.

### The Problem

When a consumer app (e.g., the example Next.js app) uses catalyst's built-in UI components for edit popovers, the styling doesn't match the app's theme:
- Popover backgrounds may be transparent or wrong color
- Text contrast issues in dark mode
- Visual inconsistency with the rest of the app

## Decision

### 1. Customizable Edit Mode Styling

All editable components accept optional `editClassName` and `editingClassName` props:

```typescript
<EditableText
  content={...}
  editClassName="cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2"
  editingClassName="outline-2 outline-solid outline-primary outline-offset-2"
/>
```

- `editClassName`: Applied when in edit mode (dashed outline)
- `editingClassName`: Applied when actively editing (solid outline)
- If not provided, falls back to catalyst's CSS variable-based defaults

The `useEditableLink` hook also accepts these props and exposes `editModeClassName` for custom trigger rendering.

### 2. Consumer Apps Own Edit Popover UI

For edit popovers with proper theming, consumer apps should:

1. Install their own shadcn components (`Popover`, `Input`, `Label`, `Button`)
2. Use `useEditableLink` hook for link/button editing behavior
3. Render their own popover UI using local components

Example pattern in consumer app:

```typescript
import { useEditableLink } from 'catalyst';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function EditableButton({ button, onUpdate }) {
  const link = useEditableLink({ href: button.href, text: button.text, onUpdate });

  return (
    <Popover open={link.isOpen} onOpenChange={...}>
      <PopoverTrigger asChild>
        <Button>{link.displayText}</Button>
      </PopoverTrigger>
      <PopoverContent>
        {/* Form using consumer's Input, Label, Button */}
      </PopoverContent>
    </Popover>
  );
}
```

### 3. Catalyst UI Primitives Remain Available

Catalyst still exports its UI primitives (`Popover`, `Input`, `Label`, `Button`) for:
- Quick prototyping
- Apps that set up the CSS variables
- Cases where theming isn't critical

## Consequences

### Positive

- **Theme compatibility**: Consumer apps get edit UIs that match their design system
- **Flexibility**: No forced styling decisions; consumers control the look
- **Composability**: `useEditableLink` hook enables custom trigger rendering (e.g., styled buttons)
- **Progressive enhancement**: Can start with catalyst defaults, customize later

### Negative

- **More setup for consumers**: Must install shadcn components for best results
- **Duplication**: Similar UI components exist in both catalyst and consumer apps
- **Learning curve**: Developers must understand when to use catalyst's vs. their own components

### Neutral

- **Catalyst UI still useful**: Works well for prototyping or with proper CSS variable setup
- **Pattern documented**: CLAUDE.md explains when to use which approach

## Alternatives Considered

### 1. CSS Variables Only

Require consumers to set CSS variables (`--catalyst-edit-outline`, `--catalyst-background`, etc.) to match their theme.

Rejected because:
- Tedious mapping between theme systems
- Doesn't handle Tailwind's dark mode class approach well
- Still requires understanding catalyst's variable names

### 2. Theme Provider

Add a `CatalystThemeProvider` that accepts theme tokens and maps them to CSS variables.

Rejected because:
- Added complexity in catalyst
- Still a translation layer between theme systems
- Consumer's components would still look different

### 3. Headless Only

Remove all UI from catalyst; only provide hooks and leave all rendering to consumers.

Rejected because:
- Too much boilerplate for simple cases
- `EditableText` inline editing works well as-is
- Some components (like basic images) don't need custom UI

## References

- [Shadcn/ui](https://ui.shadcn.com/) - The component pattern both catalyst and consumer apps follow
- [Radix UI Primitives](https://www.radix-ui.com/) - Underlying primitives for Popover, etc.
