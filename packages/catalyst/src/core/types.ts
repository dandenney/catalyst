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

export interface CardItemField {
  type: 'cardItem';
  image: ImageField;
  title: LocalizedContent;
  description: LocalizedContent;
  linkText: LocalizedContent;
  linkUrl: LocalizedContent;
  openInNewWindow?: boolean;
}

// Bento cell types (discriminated union on cellType)
export interface BentoCellBase {
  type: 'bentoCell';
  size: 'regular' | 'wide' | 'tall' | 'large';
}

export interface BentoFeaturedCell extends BentoCellBase {
  cellType: 'featured';
  label: LocalizedContent;
  title: LocalizedContent;
  description: LocalizedContent;
  image?: ImageField;
}

export interface BentoStatCell extends BentoCellBase {
  cellType: 'stat';
  label: LocalizedContent;
  value: LocalizedContent;
  suffix: LocalizedContent;
}

export interface BentoFeatureCell extends BentoCellBase {
  cellType: 'feature';
  icon: string;
  title: LocalizedContent;
  description: LocalizedContent;
}

export interface BentoFeatureListCell extends BentoCellBase {
  cellType: 'featureList';
  title: LocalizedContent;
  items: LocalizedContent[];
}

export interface BentoQuoteCell extends BentoCellBase {
  cellType: 'quote';
  quote: LocalizedContent;
  attribution: LocalizedContent;
}

export type BentoCellField = BentoFeaturedCell | BentoStatCell | BentoFeatureCell | BentoFeatureListCell | BentoQuoteCell;

export type Field = TextField | RichTextField | ImageField | ListField | BadgeField | ButtonField | MockupField | LogoItemField | IconField | ItemField | StatItemField | FAQItemField | PricingPlanField | CardItemField | BentoCellField;

// Component schema base
export interface ComponentSchema {
  id: string;
  type: string;
  fields: Record<string, Field>;
  // Personalization variants
  variants?: Record<string, Partial<Record<string, Field>>>;
  // Fields that are currently hidden (content preserved)
  disabledFields?: string[];
  // Per-variant disabled field overrides (falls back to disabledFields if not set)
  variantDisabledFields?: Record<string, string[]>;
  // Non-content configuration (not localized, not variant-overridden)
  settings?: Record<string, unknown>;
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
    label: TextField;
    heading: TextField;
    description: TextField;
    linkText: TextField;
    linkUrl: TextField;
    image: ImageField;
  };
}

export interface HeroSectionSchema extends ComponentSchema {
  type: 'HeroSection';
  fields: {
    label: TextField;
    heading: TextField;
    subtitle: TextField;
    primaryCtaText: TextField;
    primaryCtaUrl: TextField;
    secondaryCtaText: TextField;
    secondaryCtaUrl: TextField;
    image: ImageField;
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

export interface CardGridSectionSchema extends ComponentSchema {
  type: 'CardGridSection';
  fields: {
    heading: TextField;
    subtitle: TextField;
    cards: ListField<CardItemField>;
  };
  settings: {
    maxPerRow: 2 | 3 | 4;
    imageMode: 'natural' | 'squared';
    ctaStyle: 'link' | 'button';
    theme: 'light' | 'dark';
  };
}

export interface BentosSectionSchema extends ComponentSchema {
  type: 'BentosSection';
  fields: {
    label: TextField;
    heading: TextField;
    description: TextField;
    cells: ListField<BentoCellField>;
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
