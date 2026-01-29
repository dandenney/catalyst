/**
 * Component Registry
 * Central registry of all available components for the page builder
 */

import { ComponentSchema, HeroBannerSchema, FeatureListSchema, CTASectionSchema, HeroSectionSchema, LogosSectionSchema, ItemsSectionSchema } from './types';

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
 * Creates a default LogosSection component
 */
function createDefaultLogosSection(): LogosSectionSchema {
  return {
    id: `logos-${Date.now()}`,
    type: 'LogosSection',
    fields: {
      title: {
        type: 'text',
        value: { en: 'Built with industry-standard tools and best practices' },
      },
      badgeText: {
        type: 'text',
        value: { en: 'Last updated: January 2026' },
      },
      logos: {
        type: 'list',
        value: [
          {
            type: 'logoItem',
            name: { en: 'Figma' },
            imageKey: 'figma',
          },
          {
            type: 'logoItem',
            name: { en: 'React' },
            version: { en: '19.2.1' },
            imageKey: 'react',
          },
          {
            type: 'logoItem',
            name: { en: 'TypeScript' },
            version: { en: '5.9.3' },
            imageKey: 'typescript',
          },
          {
            type: 'logoItem',
            name: { en: 'Shadcn/ui' },
            version: { en: '3.6.3' },
            badge: { en: 'New' },
            imageKey: 'shadcn',
          },
          {
            type: 'logoItem',
            name: { en: 'Tailwind' },
            version: { en: '4.1.18' },
            imageKey: 'tailwind',
          },
        ],
      },
    },
  };
}

/**
 * Creates a default ItemsSection component
 */
function createDefaultItemsSection(): ItemsSectionSchema {
  return {
    id: `items-${Date.now()}`,
    type: 'ItemsSection',
    fields: {
      title: {
        type: 'text',
        value: { en: 'Everything you need. Nothing you don\'t.' },
      },
      items: {
        type: 'list',
        value: [
          {
            type: 'item',
            title: { en: 'Accessibility first' },
            description: { en: 'Fully WCAG 2.0 compliant, made with best a11y practices' },
            icon: { type: 'icon', iconKey: 'scan-face' },
          },
          {
            type: 'item',
            title: { en: 'Responsive design' },
            description: { en: 'Looks and works great on any device and screen size' },
            icon: { type: 'icon', iconKey: 'monitor-smartphone' },
          },
          {
            type: 'item',
            title: { en: 'Light and dark mode' },
            description: { en: 'Seamless switching between color schemes, 6 themes included' },
            icon: { type: 'icon', iconKey: 'eclipse' },
          },
          {
            type: 'item',
            title: { en: 'Easy to customize' },
            description: { en: 'Flexible options to match your product or brand' },
            icon: { type: 'icon', iconKey: 'blocks' },
          },
          {
            type: 'item',
            title: { en: 'Top-level performance' },
            description: { en: 'Made for lightning-fast load times and smooth interactions' },
            icon: { type: 'icon', iconKey: 'fast-forward' },
          },
          {
            type: 'item',
            title: { en: 'Production ready' },
            description: { en: 'Thoroughly tested and launch-prepared' },
            icon: { type: 'icon', iconKey: 'rocket' },
          },
          {
            type: 'item',
            title: { en: 'Made for localisation' },
            description: { en: 'Easy to implement support for multiple languages and regions' },
            icon: { type: 'icon', iconKey: 'languages' },
          },
          {
            type: 'item',
            title: { en: 'CMS friendly' },
            description: { en: 'Built to work with your any headless content management system' },
            icon: { type: 'icon', iconKey: 'square-pen' },
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
  LogosSection: {
    type: 'LogosSection',
    label: 'Logos Section',
    description: 'Display partner/technology logos with names and versions',
    category: 'content',
    icon: '🏷️',
    thumbnail: '/component-previews/LogosSection.png',
    createDefault: createDefaultLogosSection,
  },
  ItemsSection: {
    type: 'ItemsSection',
    label: 'Items Section',
    description: 'Grid of feature items with icons, titles, and descriptions',
    category: 'content',
    icon: '📦',
    thumbnail: '/component-previews/ItemsSection.png',
    createDefault: createDefaultItemsSection,
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
