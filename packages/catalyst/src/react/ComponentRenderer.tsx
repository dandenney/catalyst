/**
 * Component Renderer
 * Dynamically renders components from the registry based on schema type
 */

import React from 'react';
import { ComponentSchema } from '../core';
import { useCatalyst } from './CatalystContext';

export interface ComponentRendererProps {
  schema: ComponentSchema;
  onUpdate?: (schema: ComponentSchema) => void;
}

/**
 * Renders a component based on its schema type
 * Looks up the component from the registry provided to CatalystProvider
 *
 * @example
 * ```tsx
 * // In _app.tsx, register your components:
 * <CatalystProvider components={{ CTASection, HeroBanner }}>
 *   <App />
 * </CatalystProvider>
 *
 * // Then use ComponentRenderer anywhere:
 * <ComponentRenderer schema={componentSchema} onUpdate={handleUpdate} />
 * ```
 */
export function ComponentRenderer({ schema, onUpdate }: ComponentRendererProps) {
  const { components } = useCatalyst();

  const Component = components[schema.type];

  if (!Component) {
    return (
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.375rem',
          color: '#991b1b',
        }}
      >
        <strong>Unknown component type:</strong> {schema.type}
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#b91c1c' }}>
          Make sure to register this component in your CatalystProvider.
        </p>
      </div>
    );
  }

  return <Component schema={schema} onUpdate={onUpdate} />;
}
