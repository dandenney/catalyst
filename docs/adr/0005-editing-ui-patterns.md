# ADR 0005: Editing UI Patterns

## Status

Proposed

## Supersedes

Extends [ADR 0003: Consumer-Owned Edit UI Styling](./0003-consumer-owned-edit-ui.md)

ADR 0003 established that consumers own edit UI styling via hooks (e.g., `useEditableLink`) and their own shadcn components. This ADR extends that principle: **consumers will own drawer UI styling**, and hooks will evolve to support drawer context instead of popovers.

## Context

Catalyst currently uses multiple editing UI patterns:

| Content Type | Current Pattern | Trigger |
|-------------|----------------|---------|
| Plain text | Inline contentEditable | Double-click |
| Images | Popover | Click |
| Links | Popover | Click |
| Buttons/CTAs | Popover (via hook) | Click |
| Prices | Popover | Click |
| Variants | Dropdown menu | Click |
| Component order | Inline buttons | Click |

**Problems with current approach:**

1. Inconsistent triggers (double-click vs single-click)
2. Popovers feel cramped for complex edits
3. No clear visual hierarchy between "quick edit" and "deep edit"
4. Popovers position awkwardly near viewport edges
5. No cohesive animation language

**Target aesthetic:** The polish level of Vaul (drawer) - smooth spring animations, opinionated defaults, modern shadcn styling.

---

## Decision

### What Is Truly Inline

Only plain text editing remains inline:

| Element | Pattern | Trigger | Rationale |
|---------|---------|---------|-----------|
| **Text content** | contentEditable | Double-click | Direct manipulation feels natural, WYSIWYG |

**Characteristics:**
- Single value being edited
- Result immediately visible in context
- No complex validation needed
- Escape/Enter sufficient for cancel/save

### What Requires a Panel

Everything else moves to a bottom drawer:

| Element | Rationale |
|---------|-----------|
| **Images** | URL input, alt text, preview, future upload/crop |
| **Links** | URL + text + target, link validation preview |
| **Buttons/CTAs** | Text + URL + style variant |
| **Prices** | Amount + currency + period + formatting |
| **Component settings** | Variants, visibility rules, spacing |
| **List items** | Add/remove/reorder, item details |
| **Rich content blocks** | Multiple fields, complex layouts |

**Characteristics:**
- Multiple related fields
- Benefit from preview before commit
- Need space for future enhancements
- Complex validation or transformation

---

## Panel Implementation

### Bottom Drawer (Vaul)

```
┌────────────────────────────────────────────┐
│                                            │
│           Page Content                     │
│                                            │
│       [Editing Element]                    │
│                                            │
├────────────────────────────────────────────┤
│  ─────  (drag handle)                      │
│                                            │
│  Edit Panel                                │
│  Fields | Preview | Actions                │
│                                            │
└────────────────────────────────────────────┘
```

### Behavior

**Display mode:** Overlay with backdrop (dim/blur behind drawer)

**Snap points:**
- Collapsed: ~80px (header + drag handle)
- Default: 40% viewport height
- Expanded: 85% viewport height

**Trigger:**
- Click on editable element opens drawer
- Drawer header shows what's being edited
- Element gets visual highlight (ring/glow)

**Nested editing (e.g., list item with image):**
- Single drawer with tabs: `Content | Image | Link`
- Tabs appear when element has multiple editable aspects
- Animated tab transitions

**Undo/redo:** None initially. Changes require explicit save, cancel discards.

**Keyboard access:** Tab to element, Enter opens drawer

**Animation:**
- Spring physics (not linear)
- Backdrop blur on content behind
- Smooth height transitions
- Gesture support (drag to dismiss/resize)

---

## Implementation Plan

### Phase 1: Foundation

- [ ] Install Vaul
- [ ] Create `EditDrawer` component with shadcn styling
- [ ] Define snap points and animation config
- [ ] Create context for drawer state management
- [ ] Wire up Tab + Enter keyboard trigger

### Phase 2: Migration

- [ ] Migrate `EditableImage` from popover to drawer
- [ ] Migrate `EditableLink` from popover to drawer
- [ ] Migrate button/CTA editing to drawer
- [ ] Create `PriceEditor` drawer panel

### Phase 3: Enhancement

- [ ] Add component settings panel
- [ ] Add variant management panel
- [ ] Add list item editor with tabs
- [ ] Keyboard navigation within drawer (Tab through fields, Escape to close)

### Phase 4: Polish

- [ ] Refine animations and snap behaviors
- [ ] Mobile gesture refinements
- [ ] Focus management and a11y audit

---

## Consequences

### Positive

- Consistent editing UX across all complex fields
- Mobile-first approach works on all viewports
- Modern, polished feel matching target aesthetic
- Room for feature growth in panels
- Clear mental model: inline = text, drawer = everything else

### Negative

- Dependency on Vaul library
- Migration effort from current popovers
- Users may need to re-learn interaction patterns

### Neutral

- Popovers remain useful for tooltips, menus (non-editing contexts)
- CSS variable system remains for theming

---

## References

- [ADR 0003](./0003-consumer-owned-edit-ui.md) - Consumer-owned edit UI styling principle
- [Vaul](https://vaul.emilkowal.ski/) - Drawer component
- [shadcn/ui](https://ui.shadcn.com/) - Component styling system
