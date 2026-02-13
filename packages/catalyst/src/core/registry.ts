/**
 * Component Registry
 * Central registry of all available components for the page builder
 */

import { ComponentSchema, HeroBannerSchema, FeatureListSchema, CTASectionSchema, HeroSectionSchema, LogosSectionSchema, ItemsSectionSchema, StatsSectionSchema, FAQSectionSchema, FooterSectionSchema, PricingSectionSchema, CardGridSectionSchema } from './types';

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
      label: {
        type: 'text',
        value: { en: 'Get Started' },
      },
      heading: {
        type: 'text',
        value: { en: 'Ready to get started?' },
      },
      description: {
        type: 'text',
        value: { en: 'Join thousands of users who are already using our platform.' },
      },
      linkText: {
        type: 'text',
        value: { en: 'Get Started' },
      },
      linkUrl: {
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
      label: {
        type: 'text',
        value: { en: 'Introducing Catalyst' },
      },
      heading: {
        type: 'text',
        value: { en: 'Ship personalized pages without the chaos' },
      },
      subtitle: {
        type: 'text',
        value: {
          en: 'Catalyst gives your marketing team a visual editor on top of your existing codebase. No CMS migration, no iframe hacks — just clean React components with built-in personalization.',
        },
      },
      primaryCtaText: {
        type: 'text',
        value: { en: 'Get started for free' },
      },
      primaryCtaUrl: {
        type: 'text',
        value: { en: '#' },
      },
      secondaryCtaText: {
        type: 'text',
        value: { en: 'Request a demo' },
      },
      secondaryCtaUrl: {
        type: 'text',
        value: { en: '#' },
      },
      image: {
        type: 'image',
        src: 'https://placehold.co/1200x720/0F172A/1E293B?text=Product+Screenshot',
        alt: { en: 'Product screenshot' },
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
 * Creates a default StatsSection component
 */
function createDefaultStatsSection(): StatsSectionSchema {
  return {
    id: `stats-${Date.now()}`,
    type: 'StatsSection',
    fields: {
      stats: {
        type: 'list',
        value: [
          {
            type: 'statItem',
            label: { en: 'used by' },
            value: { en: '76.93' },
            suffix: { en: 'k' },
            description: { en: 'designers on Figma Community' },
          },
          {
            type: 'statItem',
            label: { en: 'over' },
            value: { en: '1829' },
            description: { en: 'clones and forks of the template on Github' },
          },
          {
            type: 'statItem',
            label: { en: 'already' },
            value: { en: '164.93' },
            suffix: { en: 'k' },
            description: { en: 'installations with shadcn/ui CLI' },
          },
          {
            type: 'statItem',
            label: { en: 'includes' },
            value: { en: '74' },
            description: { en: 'blocks and sections' },
          },
        ],
      },
    },
  };
}

/**
 * Creates a default FAQSection component
 */
function createDefaultFAQSection(): FAQSectionSchema {
  return {
    id: `faq-${Date.now()}`,
    type: 'FAQSection',
    fields: {
      title: {
        type: 'text',
        value: { en: 'Questions and Answers' },
      },
      items: {
        type: 'list',
        value: [
          {
            type: 'faqItem',
            question: {
              en: 'Why building a great landing page is critical for your business?',
            },
            answer: {
              en: 'In today’s AI-driven world, standing out is harder than ever. A professional landing page makes the difference between success and failure.',
            },
          },
          {
            type: 'faqItem',
            question: {
              en: 'Why use Launch UI instead of a no-code tool?',
            },
            answer: {
              en: 'No-code tools can lock you into recurring fees and limited control. Launch UI gives you full control of your code while maintaining professional quality.',
            },
          },
          {
            type: 'faqItem',
            question: {
              en: 'Are Figma files included?',
            },
            answer: {
              en: 'Yes! The complete Launch UI template is available for free on the Figma community.',
            },
          },
        ],
      },
    },
  };
}

/**
 * Creates a default PricingSection component
 */
function createDefaultPricingSection(): PricingSectionSchema {
  return {
    id: `pricing-${Date.now()}`,
    type: 'PricingSection',
    fields: {
      title: {
        type: 'text',
        value: { en: 'Build your dream landing page, today.' },
      },
      description: {
        type: 'text',
        value: { en: 'Get lifetime access to all the components. No recurring fees. Just simple, transparent pricing.' },
      },
      plans: {
        type: 'list',
        value: [
          {
            type: 'pricingPlan',
            name: { en: 'Free' },
            description: { en: 'For everyone starting out on a website for their big idea' },
            price: 0,
            priceNote: { en: 'Free and open-source forever. Get started now.' },
            ctaLabel: { en: 'Get started for free' },
            ctaHref: { en: '/docs/getting-started/introduction' },
            ctaVariant: 'glow',
            features: [
              { en: '1 website template' },
              { en: '9 blocks and sections' },
              { en: '4 custom animations' },
            ],
            variant: 'default',
          },
          {
            type: 'pricingPlan',
            name: { en: 'Pro' },
            description: { en: 'For early-stage founders, solopreneurs and indie devs' },
            price: 99,
            priceNote: { en: 'Lifetime access. Free updates. No recurring fees.' },
            ctaLabel: { en: 'Get all-access' },
            ctaHref: { en: '#' },
            ctaVariant: 'default',
            features: [
              { en: '5 templates' },
              { en: '74 blocks and sections' },
              { en: '20 illustrations' },
              { en: '10 custom animations' },
            ],
            variant: 'glow-brand',
          },
          {
            type: 'pricingPlan',
            name: { en: 'Pro Team' },
            description: { en: 'For teams and agencies working on cool products together' },
            price: 499,
            priceNote: { en: 'Lifetime access. Free updates. No recurring fees.' },
            ctaLabel: { en: 'Get all-access for your team' },
            ctaHref: { en: '#' },
            ctaVariant: 'default',
            features: [
              { en: 'All the templates, components and sections available for your entire team' },
            ],
            variant: 'glow',
          },
        ],
      },
    },
  };
}

/**
 * Creates a default FooterSection component
 */
function createDefaultFooterSection(): FooterSectionSchema {
  return {
    id: `footer-${Date.now()}`,
    type: 'FooterSection',
    fields: {
      brandName: {
        type: 'text',
        value: { en: 'Launch UI' },
      },
      brandLogo: {
        type: 'image',
        src: '/favicon.svg',
        alt: { en: 'Launch UI logo' },
      },
      columns: {
        type: 'list',
        value: [
          {
            type: 'footerColumn',
            title: { en: 'Product' },
            links: [
              { text: { en: 'Changelog' }, href: { en: '/' } },
              { text: { en: 'Documentation' }, href: { en: '/' } },
            ],
          },
          {
            type: 'footerColumn',
            title: { en: 'Company' },
            links: [
              { text: { en: 'About' }, href: { en: '/' } },
              { text: { en: 'Careers' }, href: { en: '/' } },
              { text: { en: 'Blog' }, href: { en: '/' } },
            ],
          },
          {
            type: 'footerColumn',
            title: { en: 'Contact' },
            links: [
              { text: { en: 'Discord' }, href: { en: '/' } },
              { text: { en: 'Twitter' }, href: { en: '/' } },
              { text: { en: 'Github' }, href: { en: '/' } },
            ],
          },
        ],
      },
      policies: {
        type: 'list',
        value: [
          { text: { en: 'Privacy Policy' }, href: { en: '/' } },
          { text: { en: 'Terms of Service' }, href: { en: '/' } },
        ],
      },
      copyright: {
        type: 'text',
        value: { en: '© 2025 Launch UI. All rights reserved' },
      },
    },
  };
}

/**
 * Creates a default CardGridSection component
 */
function createDefaultCardGrid(): CardGridSectionSchema {
  return {
    id: `card-grid-${Date.now()}`,
    type: 'CardGridSection',
    fields: {
      heading: {
        type: 'text',
        value: { en: 'Explore our resources' },
      },
      subtitle: {
        type: 'text',
        value: { en: 'Curated content to help you get the most out of our platform.' },
      },
      cards: {
        type: 'list',
        value: [
          {
            type: 'cardItem',
            image: {
              type: 'image',
              src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
              alt: { en: 'Getting started guide' },
            },
            title: { en: 'Getting Started Guide' },
            description: { en: 'Learn the basics and set up your first project in minutes.' },
            linkText: { en: 'Read the guide' },
            linkUrl: { en: '/docs/getting-started' },
          },
          {
            type: 'cardItem',
            image: {
              type: 'image',
              src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
              alt: { en: 'Best practices' },
            },
            title: { en: 'Best Practices' },
            description: { en: 'Tips and patterns from teams who have shipped great products.' },
            linkText: { en: 'Learn more' },
            linkUrl: { en: '/docs/best-practices' },
          },
          {
            type: 'cardItem',
            image: {
              type: 'image',
              src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
              alt: { en: 'Community' },
            },
            title: { en: 'Join the Community' },
            description: { en: 'Connect with other developers and share your experience.' },
            linkText: { en: 'Join now' },
            linkUrl: { en: '/community' },
            openInNewWindow: true,
          },
        ],
      },
    },
    settings: {
      maxPerRow: 3,
      imageMode: 'natural',
      ctaStyle: 'link',
      theme: 'light',
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
  StatsSection: {
    type: 'StatsSection',
    label: 'Stats Section',
    description: 'Display statistics with values, labels, and descriptions',
    category: 'content',
    icon: '📊',
    thumbnail: '/component-previews/StatsSection.png',
    createDefault: createDefaultStatsSection,
  },
  FAQSection: {
    type: 'FAQSection',
    label: 'FAQ Section',
    description: 'Frequently asked questions with answers',
    category: 'content',
    icon: '❓',
    thumbnail: '/component-previews/FAQSection.png',
    createDefault: createDefaultFAQSection,
  },
  PricingSection: {
    type: 'PricingSection',
    label: 'Pricing Section',
    description: 'Pricing plans with features and CTAs',
    category: 'content',
    icon: '💰',
    thumbnail: '/component-previews/PricingSection.png',
    createDefault: createDefaultPricingSection,
  },
  FooterSection: {
    type: 'FooterSection',
    label: 'Footer',
    description: 'Footer with columns and policies',
    category: 'layout',
    icon: '🔻',
    thumbnail: '/component-previews/FooterSection.png',
    createDefault: createDefaultFooterSection,
  },
  CardGridSection: {
    type: 'CardGridSection',
    label: 'Card Grid',
    description: 'Grid of cards with images, descriptions, and CTAs',
    category: 'content',
    icon: '🃏',
    thumbnail: '/component-previews/CardGridSection.png',
    createDefault: createDefaultCardGrid,
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
