/**
 * Component Registry
 * Central registry of all available components for the page builder
 */

import { ComponentSchema, HeroBannerSchema, FeatureListSchema, CTASectionSchema, HeroSectionSchema } from './types';

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
 * Creates a default CTASection component
 */
function createDefaultCTASection(): CTASectionSchema {
  return {
    id: `cta-${Date.now()}`,
    type: 'CTASection',
    fields: {
      heading: {
        type: 'text',
        value: { en: 'Ready to get started?' },
      },
      description: {
        type: 'text',
        value: { en: 'Join thousands of users who are already using our platform.' },
      },
      buttonText: {
        type: 'text',
        value: { en: 'Get Started' },
      },
      buttonUrl: {
        type: 'text',
        value: { en: '/signup' },
      },
      image: {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop',
        alt: { en: 'CTA image' },
      },
    },
  };
}

/**
 * Creates a default HeroSection component
 */
function createDefaultHeroSection(): HeroSectionSchema {
  return {
    id: `hero-section-${Date.now()}`,
    type: 'HeroSection',
    fields: {
      title: {
        type: 'text',
        value: {
          en: 'Give your big idea the design it deserves',
          es: 'Dale a tu gran idea el diseño que merece',
        },
      },
      description: {
        type: 'text',
        value: {
          en: 'Professionally designed blocks and templates built with React, Shadcn/ui and Tailwind that will help your product stand out.',
          es: 'Bloques y plantillas diseñados profesionalmente con React, Shadcn/ui y Tailwind que ayudarán a destacar tu producto.',
        },
      },
      badge: {
        type: 'badge',
        label: {
          en: 'New version of Launch UI is out!',
          es: '¡Nueva versión de Launch UI disponible!',
        },
        link: {
          href: { en: '/docs/getting-started' },
          text: { en: 'Get started', es: 'Comenzar' },
        },
      },
      buttons: {
        type: 'list',
        value: [
          {
            type: 'button',
            href: { en: '/docs/getting-started' },
            text: { en: 'Get Started', es: 'Comenzar' },
            variant: 'default',
          },
          {
            type: 'button',
            href: { en: 'https://github.com/launch-ui/launch-ui' },
            text: { en: 'Github' },
            variant: 'glow',
            icon: 'github',
            iconPosition: 'left',
          },
        ],
      },
      mockup: {
        type: 'mockup',
        srcLight: '/dashboard-light.png',
        srcDark: '/dashboard-dark.png',
        alt: {
          en: 'Launch UI app screenshot',
          es: 'Captura de pantalla de Launch UI',
        },
        width: 1248,
        height: 765,
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
    thumbnail: '/component-previews/HeroBanner.png',
    createDefault: createDefaultHeroBanner,
  },
  FeatureList: {
    type: 'FeatureList',
    label: 'Feature List',
    description: 'Grid of features with titles and descriptions',
    category: 'content',
    icon: '📋',
    thumbnail: '/component-previews/FeatureList.png',
    createDefault: createDefaultFeatureList,
  },
  CTASection: {
    type: 'CTASection',
    label: 'CTA Section',
    description: 'Call-to-action section with heading, description, and button',
    category: 'content',
    icon: '📢',
    thumbnail: '/component-previews/CTASection.png',
    createDefault: createDefaultCTASection,
  },
  HeroSection: {
    type: 'HeroSection',
    label: 'Hero Section',
    description: 'Hero section with title, description, badge, buttons, and mockup',
    category: 'layout',
    icon: '🦸',
    thumbnail: '/component-previews/HeroSection.png',
    createDefault: createDefaultHeroSection,
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
