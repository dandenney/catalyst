/**
 * Core types for Catalyst page builder
 * Framework-agnostic schema definitions
 */

// Supported locales
export type Locale = 'en' | 'es';

// Localized content with fallback to 'en'
export type LocalizedContent<T = string> = {
  [L in Locale]?: T;
} & {
  en: T; // 'en' is required as fallback
};

// Field types
export interface TextField {
  type: 'text';
  value: LocalizedContent;
}

export interface RichTextField {
  type: 'richtext';
  value: LocalizedContent;
}

export interface ImageField {
  type: 'image';
  src: string;
  alt: LocalizedContent;
}

export interface ListField<T = any> {
  type: 'list';
  value: T[];
}

export interface BadgeField {
  type: 'badge';
  label: LocalizedContent;
  link: {
    href: LocalizedContent;
    text: LocalizedContent;
  };
}

export interface ButtonField {
  type: 'button';
  href: LocalizedContent;
  text: LocalizedContent;
  variant?: string; // 'default' | 'glow' etc.
  icon?: string; // 'github', 'arrow-right'
  iconPosition?: 'left' | 'right';
}

export interface MockupField {
  type: 'mockup';
  srcLight: string;
  srcDark?: string;
  alt: LocalizedContent;
  width: number;
  height: number;
}

export interface LogoItemField {
  type: 'logoItem';
  name: LocalizedContent;
  version?: LocalizedContent;
  badge?: LocalizedContent;
  imageKey: string; // Key to look up the SVG component in consumer app
}

export interface IconField {
  type: 'icon';
  iconKey: string; // Key to look up the icon component in consumer app
}

export interface ItemField {
  type: 'item';
  title: LocalizedContent;
  description: LocalizedContent;
  icon: IconField;
}

export interface StatItemField {
  type: 'statItem';
  label?: LocalizedContent;
  value: LocalizedContent;
  suffix?: LocalizedContent;
  description: LocalizedContent;
}

export interface FAQItemField {
  type: 'faqItem';
  question: LocalizedContent;
  answer: LocalizedContent;
}

export interface PricingPlanField {
  type: 'pricingPlan';
  name: LocalizedContent;
  description: LocalizedContent;
  price: number;
  originalPrice?: number;
  priceNote: LocalizedContent;
  ctaLabel: LocalizedContent;
  ctaHref: LocalizedContent;
  ctaVariant: 'default' | 'glow';
  features: LocalizedContent[];
  variant?: 'default' | 'glow' | 'glow-brand';
}

export type Field = TextField | RichTextField | ImageField | ListField | BadgeField | ButtonField | MockupField | LogoItemField | IconField | ItemField | StatItemField | FAQItemField | PricingPlanField;

// Component schema base
export interface ComponentSchema {
  id: string;
  type: string;
  fields: Record<string, Field>;
  // Personalization variants
  variants?: Record<string, Partial<Record<string, Field>>>;
}

// Specific component schemas
export interface HeroBannerSchema extends ComponentSchema {
  type: 'HeroBanner';
  fields: {
    title: TextField;
    subtitle: TextField;
    backgroundImage: ImageField;
  };
}

export interface FeatureListSchema extends ComponentSchema {
  type: 'FeatureList';
  fields: {
    heading: TextField;
    items: {
      type: 'list';
      value: Array<{
        title: LocalizedContent;
        description: LocalizedContent;
      }>;
    };
  };
}

export interface CTASectionSchema extends ComponentSchema {
  type: 'CTASection';
  fields: {
    heading: TextField;
    description: TextField;
    buttonText: TextField;
    buttonUrl: TextField;
    image: ImageField;
  };
}

export interface HeroSectionSchema extends ComponentSchema {
  type: 'HeroSection';
  fields: {
    title: TextField;
    description: TextField;
    badge: BadgeField;
    buttons: ListField<ButtonField>;
    mockup: MockupField;
  };
}

export interface LogosSectionSchema extends ComponentSchema {
  type: 'LogosSection';
  fields: {
    title: TextField;
    badgeText: TextField;
    logos: ListField<LogoItemField>;
  };
}

export interface ItemsSectionSchema extends ComponentSchema {
  type: 'ItemsSection';
  fields: {
    title: TextField;
    items: ListField<ItemField>;
  };
}

export interface StatsSectionSchema extends ComponentSchema {
  type: 'StatsSection';
  fields: {
    stats: ListField<StatItemField>;
  };
}

export interface FooterLinkItem {
  text: LocalizedContent;
  href: LocalizedContent;
}

export interface FooterColumnField {
  type: 'footerColumn';
  title: LocalizedContent;
  links: FooterLinkItem[];
}

export interface FooterSectionSchema extends ComponentSchema {
  type: 'FooterSection';
  fields: {
    brandName: TextField;
    brandLogo: ImageField;
    columns: ListField<FooterColumnField>;
    policies: ListField<FooterLinkItem>;
    copyright: TextField;
  };
}

export interface FAQSectionSchema extends ComponentSchema {
  type: 'FAQSection';
  fields: {
    title: TextField;
    items: ListField<FAQItemField>;
  };
}

export interface PricingSectionSchema extends ComponentSchema {
  type: 'PricingSection';
  fields: {
    title: TextField;
    description: TextField;
    plans: ListField<PricingPlanField>;
  };
}

// Page schema
export interface PageSchema {
  id: string;
  slug: string;
  components: ComponentSchema[];
  metadata: {
    title: LocalizedContent;
    description?: LocalizedContent;
  };
}

// Personalization context
export interface PersonalizationContext {
  segment?: string;
  [key: string]: string | undefined;
}
