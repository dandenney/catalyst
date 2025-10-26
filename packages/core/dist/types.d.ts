/**
 * Core types for Catalyst page builder
 * Framework-agnostic schema definitions
 */
export type Locale = 'en' | 'es';
export type LocalizedContent<T = string> = {
    [L in Locale]?: T;
} & {
    en: T;
};
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
export interface ComponentSchema {
    id: string;
    type: string;
    fields: Record<string, Field>;
    variants?: Record<string, Partial<Record<string, Field>>>;
}
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
export interface PageSchema {
    id: string;
    slug: string;
    components: ComponentSchema[];
    metadata: {
        title: LocalizedContent;
        description?: LocalizedContent;
    };
}
export interface PersonalizationContext {
    segment?: string;
    [key: string]: string | undefined;
}
