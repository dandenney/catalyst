"use strict";
/**
 * HeroBanner Component
 * Hero banner with background image, title, and subtitle
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroBanner = HeroBanner;
const react_1 = __importStar(require("react"));
const core_1 = require("@catalyst/core");
const react_2 = require("@catalyst/react");
function HeroBanner({ schema, onUpdate }) {
    const { personalization, locale, isEditMode } = (0, react_2.useCatalyst)();
    const [editingVariant, setEditingVariant] = (0, react_1.useState)(null);
    // In edit mode, determine which schema to display based on editing variant
    // In view mode, apply personalization normally
    const displaySchema = isEditMode && editingVariant
        ? (0, core_1.applyPersonalization)(schema, { segment: editingVariant })
        : isEditMode
            ? schema
            : (0, core_1.applyPersonalization)(schema, personalization);
    const { fields } = displaySchema;
    const handleFieldUpdate = (fieldName, updatedContent) => {
        if (!onUpdate)
            return;
        // If editing a variant, update the variant fields
        if (editingVariant) {
            // Get the current field from either the variant or base fields
            const variantField = schema.variants?.[editingVariant]?.[fieldName];
            const currentField = variantField || schema.fields[fieldName];
            // Create the updated field based on field type
            let updatedField;
            if (currentField.type === 'image') {
                // For image fields, update the alt text
                updatedField = {
                    ...currentField,
                    alt: updatedContent,
                };
            }
            else {
                // For text fields, update the value
                updatedField = {
                    ...currentField,
                    value: updatedContent,
                };
            }
            const updatedSchema = {
                ...schema,
                variants: {
                    ...schema.variants,
                    [editingVariant]: {
                        ...schema.variants?.[editingVariant],
                        [fieldName]: updatedField,
                    },
                },
            };
            onUpdate(updatedSchema);
        }
        else {
            // Otherwise, update base fields
            const currentField = schema.fields[fieldName];
            // Create the updated field based on field type
            let updatedField;
            if (currentField.type === 'image') {
                // For image fields, update the alt text
                updatedField = {
                    ...currentField,
                    alt: updatedContent,
                };
            }
            else {
                // For text fields, update the value
                updatedField = {
                    ...currentField,
                    value: updatedContent,
                };
            }
            const updatedSchema = {
                ...schema,
                fields: {
                    ...schema.fields,
                    [fieldName]: updatedField,
                },
            };
            onUpdate(updatedSchema);
        }
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
                react_1.default.createElement(react_2.EditableText, { content: fields.title.value, onUpdate: (content) => handleFieldUpdate('title', content), as: "h1", className: "hero-title", style: {
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
                react_1.default.createElement(react_2.EditableText, { content: fields.subtitle.value, onUpdate: (content) => handleFieldUpdate('subtitle', content), as: "p", className: "hero-subtitle", style: {
                        fontSize: '1.5rem',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    } })))));
}
