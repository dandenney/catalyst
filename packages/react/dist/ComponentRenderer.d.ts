/**
 * Component Renderer
 * Dynamically renders components from the registry based on schema type
 */
import React from 'react';
import { ComponentSchema } from '@catalyst/core';
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
export declare function ComponentRenderer({ schema, onUpdate }: ComponentRendererProps): React.JSX.Element;
