/**
 * Component Registry
 * Central registry of all available components for the page builder
 */

import { ComponentSchema, HeroBannerSchema, FeatureListSchema } from './types';

export interface ComponentMetadata {
  type: string;
  label: string;
  description: string;
  category: 'layout' | 'content' | 'media' | 'other';
  icon?: string;
  thumbnail?: string;
  createDefault: () => ComponentSchema;
}

/**
 * Creates a default HeroBanner component
 */
function createDefaultHeroBanner(): HeroBannerSchema {
  return {
    id: `hero-${Date.now()}`,
    type: 'HeroBanner',
    fields: {
      title: {
        type: 'text',
        value: { en: 'Welcome to Your Page' },
      },
      subtitle: {
        type: 'text',
        value: { en: 'Start building amazing experiences' },
      },
      backgroundImage: {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=600&fit=crop',
        alt: { en: 'Hero background' },
      },
    },
  };
}

/**
 * Creates a default FeatureList component
 */
function createDefaultFeatureList(): FeatureListSchema {
  return {
    id: `features-${Date.now()}`,
    type: 'FeatureList',
    fields: {
      heading: {
        type: 'text',
        value: { en: 'Our Features' },
      },
      items: {
        type: 'list',
        value: [
          {
            title: { en: 'Feature One' },
            description: { en: 'Description of your first amazing feature.' },
          },
          {
            title: { en: 'Feature Two' },
            description: { en: 'Description of your second amazing feature.' },
          },
          {
            title: { en: 'Feature Three' },
            description: { en: 'Description of your third amazing feature.' },
          },
        ],
      },
    },
  };
}

/**
 * Registry of all available components
 */
export const COMPONENT_REGISTRY: Record<string, ComponentMetadata> = {
  HeroBanner: {
    type: 'HeroBanner',
    label: 'Hero Banner',
    description: 'Large banner with background image, title, and subtitle',
    category: 'layout',
    icon: '🎯',
    createDefault: createDefaultHeroBanner,
  },
  FeatureList: {
    type: 'FeatureList',
    label: 'Feature List',
    description: 'Grid of features with titles and descriptions',
    category: 'content',
    icon: '📋',
    createDefault: createDefaultFeatureList,
  },
};

/**
 * Get all available component types
 */
export function getAvailableComponents(): ComponentMetadata[] {
  return Object.values(COMPONENT_REGISTRY);
}

/**
 * Get metadata for a specific component type
 */
export function getComponentMetadata(type: string): ComponentMetadata | undefined {
  return COMPONENT_REGISTRY[type];
}

/**
 * Create a new component instance with default values
 */
export function createComponent(type: string): ComponentSchema | null {
  const metadata = COMPONENT_REGISTRY[type];
  if (!metadata) {
    console.error(`Unknown component type: ${type}`);
    return null;
  }
  return metadata.createDefault();
}
