/**
 * Component Renderer
 * Maps schema component types to React components
 */
import React from 'react';
import { ComponentSchema } from '@catalyst/core';
export interface ComponentRendererProps {
    schema: ComponentSchema;
    onUpdate?: (schema: ComponentSchema) => void;
}
export declare function ComponentRenderer({ schema, onUpdate }: ComponentRendererProps): React.JSX.Element;
