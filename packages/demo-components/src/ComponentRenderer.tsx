/**
 * Component Renderer
 * Maps schema component types to React components
 */

import React from 'react';
import { ComponentSchema } from '@catalyst/core';
import { HeroBanner } from './HeroBanner';
import { FeatureList } from './FeatureList';
import { CTASection } from './CTASection';

export interface ComponentRendererProps {
  schema: ComponentSchema;
  onUpdate?: (schema: ComponentSchema) => void;
}

export function ComponentRenderer({ schema, onUpdate }: ComponentRendererProps) {
  switch (schema.type) {
    case 'HeroBanner':
      return <HeroBanner schema={schema as any} onUpdate={onUpdate as any} />;

    case 'FeatureList':
      return <FeatureList schema={schema as any} onUpdate={onUpdate as any} />;

    case 'CTASection':
      return <CTASection schema={schema as any} onUpdate={onUpdate as any} />;

    default:
      return (
        <div style={{ padding: '1rem', background: '#fee', border: '1px solid #fcc' }}>
          Unknown component type: {schema.type}
        </div>
      );
  }
}
