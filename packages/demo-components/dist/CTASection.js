"use strict";
/**
 * CTASection Component
 * Call-to-action section with heading, description, and button
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTASection = CTASection;
const react_1 = __importDefault(require("react"));
const core_1 = require("@catalyst/core");
const react_2 = require("@catalyst/react");
function CTASection({ schema, onUpdate }) {
    const { locale, isEditMode } = (0, react_2.useCatalyst)();
    // Use the centralized variant handling hook
    const { displaySchema, editingVariant, setEditingVariant, updateField } = (0, react_2.useVariantHandling)({ schema });
    const { fields } = displaySchema;
    return (react_1.default.createElement("div", { className: "cta-section", style: {
            position: 'relative',
            padding: '3rem 1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            borderRadius: '8px',
            margin: '2rem',
        } },
        isEditMode && (react_1.default.createElement("div", { style: {
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 10,
            } },
            react_1.default.createElement(react_2.VariantSelector, { variants: schema.variants, currentVariant: editingVariant, onVariantChange: setEditingVariant }))),
        react_1.default.createElement("div", { style: { position: 'relative', display: 'inline-block', width: '100%', maxWidth: '800px' } },
            isEditMode && editingVariant && schema.variants?.[editingVariant]?.heading && (react_1.default.createElement("div", { style: {
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
            react_1.default.createElement(react_2.EditableText, { content: fields.heading.value, onUpdate: (content) => updateField('heading', content, onUpdate), as: "h2", style: {
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                } })),
        react_1.default.createElement("div", { style: { position: 'relative', display: 'inline-block', width: '100%', maxWidth: '800px' } },
            isEditMode && editingVariant && schema.variants?.[editingVariant]?.description && (react_1.default.createElement("div", { style: {
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
            react_1.default.createElement(react_2.EditableText, { content: fields.description.value, onUpdate: (content) => updateField('description', content, onUpdate), as: "p", style: {
                    fontSize: '1.125rem',
                    marginBottom: '2rem',
                    opacity: 0.95,
                } })),
        react_1.default.createElement("a", { href: (0, core_1.getLocalizedValue)(fields.buttonUrl.value, locale), style: {
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: 'white',
                color: '#667eea',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'transform 0.2s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }, onMouseEnter: (e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
            }, onMouseLeave: (e) => {
                e.currentTarget.style.transform = 'scale(1)';
            } },
            react_1.default.createElement(react_2.EditableText, { content: fields.buttonText.value, onUpdate: (content) => updateField('buttonText', content, onUpdate), as: "span" }))));
}
