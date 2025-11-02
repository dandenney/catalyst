"use strict";
/**
 * Component Registry
 * Central registry of all available components for the page builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPONENT_REGISTRY = void 0;
exports.getAvailableComponents = getAvailableComponents;
exports.getComponentMetadata = getComponentMetadata;
exports.createComponent = createComponent;
/**
 * Creates a default HeroBanner component
 */
function createDefaultHeroBanner() {
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
function createDefaultFeatureList() {
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
function createDefaultCTASection() {
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
        },
    };
}
/**
 * Registry of all available components
 */
exports.COMPONENT_REGISTRY = {
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
};
/**
 * Get all available component types
 */
function getAvailableComponents() {
    return Object.values(exports.COMPONENT_REGISTRY);
}
/**
 * Get metadata for a specific component type
 */
function getComponentMetadata(type) {
    return exports.COMPONENT_REGISTRY[type];
}
/**
 * Create a new component instance with default values
 */
function createComponent(type) {
    const metadata = exports.COMPONENT_REGISTRY[type];
    if (!metadata) {
        console.error(`Unknown component type: ${type}`);
        return null;
    }
    return metadata.createDefault();
}
