"use strict";
/**
 * HeroBanner Component
 * Hero banner with background image, title, and subtitle
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroBanner = HeroBanner;
const react_1 = __importDefault(require("react"));
const core_1 = require("@catalyst/core");
const react_2 = require("@catalyst/react");
function HeroBanner({ schema, onUpdate }) {
    const { locale, isEditMode } = (0, react_2.useCatalyst)();
    // Use the centralized variant handling hook
    const { displaySchema, editingVariant, setEditingVariant, updateField } = (0, react_2.useVariantHandling)({ schema });
    const { fields } = displaySchema;
    const bgImage = (0, core_1.getLocalizedValue)(fields.backgroundImage.alt, locale);
    return (react_1.default.createElement("div", { className: "hero-banner", style: {
            position: 'relative',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${fields.backgroundImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '3rem 1rem',
        }, role: "img", "aria-label": bgImage },
        isEditMode && (react_1.default.createElement("div", { style: {
                position: 'absolute',
                top: '8px',
                left: '8px',
                zIndex: 10,
            } },
            react_1.default.createElement(react_2.VariantSelector, { variants: schema.variants, currentVariant: editingVariant, onVariantChange: setEditingVariant }))),
        react_1.default.createElement("div", { style: { textAlign: 'center', maxWidth: '800px' } },
            react_1.default.createElement("div", { style: { position: 'relative', display: 'inline-block', width: '100%' } },
                isEditMode && editingVariant && schema.variants?.[editingVariant]?.title && (react_1.default.createElement("div", { style: {
                        position: 'absolute',
                        top: '-24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#8b5cf6',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                    } }, "Variant Override")),
                react_1.default.createElement(react_2.EditableText, { content: fields.title.value, onUpdate: (content) => updateField('title', content, onUpdate), as: "h1", className: "hero-title", style: {
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    } })),
            react_1.default.createElement("div", { style: { position: 'relative', display: 'inline-block', width: '100%' } },
                isEditMode && editingVariant && schema.variants?.[editingVariant]?.subtitle && (react_1.default.createElement("div", { style: {
                        position: 'absolute',
                        top: '-24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#8b5cf6',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                    } }, "Variant Override")),
                react_1.default.createElement(react_2.EditableText, { content: fields.subtitle.value, onUpdate: (content) => updateField('subtitle', content, onUpdate), as: "p", className: "hero-subtitle", style: {
                        fontSize: '1.5rem',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    } })))));
}
