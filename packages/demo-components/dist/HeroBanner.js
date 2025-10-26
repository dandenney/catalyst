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
    const { personalization, locale } = (0, react_2.useCatalyst)();
    // Apply personalization to get the right variant
    const personalizedSchema = (0, core_1.applyPersonalization)(schema, personalization);
    const { fields } = personalizedSchema;
    const handleFieldUpdate = (fieldName, updatedContent) => {
        if (!onUpdate)
            return;
        const updatedSchema = {
            ...schema,
            fields: {
                ...schema.fields,
                [fieldName]: {
                    ...schema.fields[fieldName],
                    value: updatedContent,
                },
            },
        };
        onUpdate(updatedSchema);
    };
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
        react_1.default.createElement("div", { style: { textAlign: 'center', maxWidth: '800px' } },
            react_1.default.createElement(react_2.EditableText, { content: fields.title.value, onUpdate: (content) => handleFieldUpdate('title', content), as: "h1", className: "hero-title", style: {
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                } }),
            react_1.default.createElement(react_2.EditableText, { content: fields.subtitle.value, onUpdate: (content) => handleFieldUpdate('subtitle', content), as: "p", className: "hero-subtitle", style: {
                    fontSize: '1.5rem',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                } }))));
}
