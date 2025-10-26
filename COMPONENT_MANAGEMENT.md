# Component Management System

The Catalyst page builder now includes a complete component management UI that allows you to add, remove, and reorder components on your pages.

## Features

### 1. **Component Registry** (`@catalyst/core`)
Central registry of all available components with metadata:

```typescript
import { COMPONENT_REGISTRY, getAvailableComponents, createComponent } from '@catalyst/core';

// Get all available components
const components = getAvailableComponents();

// Create a new component instance
const newHero = createComponent('HeroBanner');
```

### 2. **Extended usePage Hook** (`consumer-app/src/hooks/usePage.ts`)
The `usePage` hook now includes component lifecycle management:

```typescript
const {
  page,
  loading,
  error,
  updateComponent,    // Update existing component
  addComponent,       // Add new component at position
  removeComponent,    // Remove component by ID
  reorderComponents,  // Reorder components by ID array
} = usePage('demo');
```

### 3. **UI Components** (`@catalyst/react`)

#### ComponentPanel
Side panel for selecting and adding components:
```typescript
<ComponentPanel
  isOpen={isPanelOpen}
  onClose={() => setIsPanelOpen(false)}
  onSelectComponent={(type) => handleAddComponent(type)}
/>
```

#### ComponentControls
Inline controls for each component (Remove, Move Up/Down):
```typescript
<ComponentControls
  onRemove={() => removeComponent(id)}
  onMoveUp={() => handleMoveUp()}
  onMoveDown={() => handleMoveDown()}
  canMoveUp={index > 0}
  canMoveDown={index < length - 1}
/>
```

#### InsertButton
Button between components to insert at specific position:
```typescript
<InsertButton onInsert={() => handleInsert(position)} />
```

## How to Use

### Viewing the Page Builder UI

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Navigate to the demo page in **edit mode**:
   ```
   http://localhost:3000/demo?edit=true
   ```

3. You'll see:
   - **Fixed "Add Component" button** (bottom-right corner)
   - **Insert buttons** between components (on hover)
   - **Component controls** (top-right of each component)
     - Remove button
     - Move up/down arrows

### Adding Components

**Option 1: Use the floating button**
- Click the "+ Add Component" button in the bottom-right
- Select a component from the panel
- Click "Add to Page" to append at the end

**Option 2: Use insert buttons**
- Hover between components to see insert buttons
- Click "+ Add Component" at the desired position
- Select and add your component

### Removing Components

- In edit mode, each component has a "Remove" button in the top-right
- Click to delete the component from the page
- Changes are saved automatically

### Reordering Components

- Use the ↑ and ↓ arrows on each component
- Components will swap positions
- First component can't move up
- Last component can't move down

### Editing Component Content

- Double-click any text in edit mode to edit inline
- Press Enter to save, Escape to cancel
- Changes are saved automatically

### Preview Mode

View the page without edit controls:
```
http://localhost:3000/demo
```

## Implementation Example

See `/consumer-app/src/pages/demo.tsx` for a complete implementation:

```typescript
export default function DemoPage() {
  const {
    page,
    updateComponent,
    addComponent,
    removeComponent,
    reorderComponents
  } = usePage("demo");

  const { isEditMode } = useCatalyst();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [insertPosition, setInsertPosition] = useState<number>();

  const handleSelectComponent = (type: string) => {
    const newComponent = createComponent(type);
    if (newComponent) {
      addComponent(newComponent, insertPosition);
    }
    setIsPanelOpen(false);
  };

  return (
    <main>
      {/* Fixed add button */}
      {isEditMode && (
        <button onClick={() => setIsPanelOpen(true)}>
          + Add Component
        </button>
      )}

      {/* Components with controls */}
      {page.components.map((component, index) => (
        <div key={component.id}>
          {isEditMode && (
            <ComponentControls
              onRemove={() => removeComponent(component.id)}
              onMoveUp={...}
              onMoveDown={...}
            />
          )}

          <ComponentRenderer
            schema={component}
            onUpdate={(updated) => updateComponent(component.id, updated)}
          />

          {isEditMode && (
            <InsertButton onInsert={() => handleInsert(index + 1)} />
          )}
        </div>
      ))}

      {/* Component panel */}
      <ComponentPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSelectComponent={handleSelectComponent}
      />
    </main>
  );
}
```

## Adding New Components to the Registry

To add a new component type:

1. Create the component schema in `/packages/core/src/types.ts`
2. Create the React component in `/packages/demo-components/src/`
3. Add to the registry in `/packages/core/src/registry.ts`:

```typescript
export const COMPONENT_REGISTRY: Record<string, ComponentMetadata> = {
  // ... existing components

  YourNewComponent: {
    type: 'YourNewComponent',
    label: 'Your Component Name',
    description: 'What this component does',
    category: 'content',
    icon: '📝',
    createDefault: () => ({
      id: `your-component-${Date.now()}`,
      type: 'YourNewComponent',
      fields: {
        // ... default field values
      },
    }),
  },
};
```

4. Rebuild packages:
   ```bash
   npm run build
   ```

## Architecture

```
User Action (Add/Remove/Reorder)
    ↓
usePage Hook (Optimistic Update)
    ↓
API Route (/api/pages/[slug])
    ↓
Storage Adapter (JsonStorageAdapter)
    ↓
JSON File (consumer-app/data/*.json)
```

All component operations are:
- **Optimistic**: UI updates immediately
- **Reversible**: Reverts on save failure
- **Persisted**: Saved to JSON files via API

## Query Parameters

- `?edit=true` - Enable edit mode
- `?lang=es` - Change locale
- `?segment=finance` - Apply personalization variant

Example: `http://localhost:3000/demo?edit=true&lang=es`
