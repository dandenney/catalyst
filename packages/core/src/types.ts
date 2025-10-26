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

export type Field = TextField | RichTextField | ImageField | ListField;

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
