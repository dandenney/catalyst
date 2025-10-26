"use strict";
/**
 * FeatureList Component
 * Displays a list of features with titles and descriptions
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
exports.FeatureList = FeatureList;
const react_1 = __importStar(require("react"));
const core_1 = require("@catalyst/core");
const react_2 = require("@catalyst/react");
function FeatureList({ schema, onUpdate }) {
    const { locale, isEditMode, personalization } = (0, react_2.useCatalyst)();
    const [editingVariant, setEditingVariant] = (0, react_1.useState)(null);
    // Log when editing variant changes
    const handleVariantChange = (variant) => {
        console.log('🎯 FeatureList: editingVariant changing from', editingVariant, 'to', variant);
        setEditingVariant(variant);
    };
    // In edit mode, determine which schema to display based on editing variant
    // In view mode, apply personalization normally
    const displaySchema = isEditMode && editingVariant
        ? (0, core_1.applyPersonalization)(schema, { segment: editingVariant })
        : isEditMode
            ? schema
            : (0, core_1.applyPersonalization)(schema, personalization);
    const { fields } = displaySchema;
    const handleHeadingUpdate = (updatedContent) => {
        if (!onUpdate)
            return;
        // If editing a variant, update the variant fields
        if (editingVariant) {
            // Get the current field from either the variant or base fields
            const variantField = schema.variants?.[editingVariant]?.heading;
            const currentField = variantField || schema.fields.heading;
            const updatedSchema = {
                ...schema,
                variants: {
                    ...schema.variants,
                    [editingVariant]: {
                        ...schema.variants?.[editingVariant],
                        heading: {
                            ...currentField,
                            value: updatedContent,
                        },
                    },
                },
            };
            onUpdate(updatedSchema);
        }
        else {
            // Otherwise, update base fields
            const updatedSchema = {
                ...schema,
                fields: {
                    ...schema.fields,
                    heading: {
                        ...schema.fields.heading,
                        value: updatedContent,
                    },
                },
            };
            onUpdate(updatedSchema);
        }
    };
    const handleItemTitleUpdate = (index, updatedContent) => {
        if (!onUpdate)
            return;
        console.log('🔧 handleItemTitleUpdate called', {
            editingVariant,
            index,
            updatedContent,
            hasVariants: !!schema.variants,
            variantKeys: schema.variants ? Object.keys(schema.variants) : []
        });
        // If editing a variant, update the variant fields
        if (editingVariant) {
            console.log('📝 Editing variant:', editingVariant);
            // Get current items from variant or base
            const variantItems = schema.variants?.[editingVariant]?.items;
            const currentItems = variantItems?.value || schema.fields.items.value;
            console.log('📋 Current items source:', variantItems ? 'variant' : 'base', currentItems);
            const updatedItems = [...currentItems];
            updatedItems[index] = {
                ...updatedItems[index],
                title: updatedContent,
            };
            const updatedSchema = {
                ...schema,
                variants: {
                    ...schema.variants,
                    [editingVariant]: {
                        ...schema.variants?.[editingVariant],
                        items: {
                            type: 'list',
                            value: updatedItems,
                        },
                    },
                },
            };
            console.log('✅ Updated schema (variant):', JSON.stringify(updatedSchema, null, 2));
            onUpdate(updatedSchema);
        }
        else {
            console.log('📝 Editing base');
            // Otherwise, update base fields
            const updatedItems = [...schema.fields.items.value];
            updatedItems[index] = {
                ...updatedItems[index],
                title: updatedContent,
            };
            const updatedSchema = {
                ...schema,
                fields: {
                    ...schema.fields,
                    items: {
                        ...schema.fields.items,
                        value: updatedItems,
                    },
                },
            };
            onUpdate(updatedSchema);
        }
    };
    const handleItemDescriptionUpdate = (index, updatedContent) => {
        if (!onUpdate)
            return;
        // If editing a variant, update the variant fields
        if (editingVariant) {
            // Get current items from variant or base
            const variantItems = schema.variants?.[editingVariant]?.items;
            const currentItems = variantItems?.value || schema.fields.items.value;
            const updatedItems = [...currentItems];
            updatedItems[index] = {
                ...updatedItems[index],
                description: updatedContent,
            };
            const updatedSchema = {
                ...schema,
                variants: {
                    ...schema.variants,
                    [editingVariant]: {
                        ...schema.variants?.[editingVariant],
                        items: {
                            type: 'list',
                            value: updatedItems,
                        },
                    },
                },
            };
            onUpdate(updatedSchema);
        }
        else {
            // Otherwise, update base fields
            const updatedItems = [...schema.fields.items.value];
            updatedItems[index] = {
                ...updatedItems[index],
                description: updatedContent,
            };
            const updatedSchema = {
                ...schema,
                fields: {
                    ...schema.fields,
                    items: {
                        ...schema.fields.items,
                        value: updatedItems,
                    },
                },
            };
            onUpdate(updatedSchema);
        }
    };
    return (react_1.default.createElement("div", { className: "feature-list", style: {
            position: 'relative',
            padding: '3rem 1rem',
            maxWidth: '1200px',
            margin: '0 auto',
            border: isEditMode ? '2px dashed #cbd5e1' : 'none',
            borderRadius: isEditMode ? '8px' : '0',
        } },
        isEditMode && (react_1.default.createElement("div", { style: {
                position: 'absolute',
                top: '0.5rem',
                left: '1rem',
                background: '#f3f4f6',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: '#6b7280',
                fontFamily: 'monospace',
                zIndex: 10,
            } }, schema.id)),
        isEditMode && (react_1.default.createElement("div", { style: {
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 10,
            } },
            react_1.default.createElement(react_2.VariantSelector, { variants: schema.variants, currentVariant: editingVariant, onVariantChange: handleVariantChange }))),
        react_1.default.createElement("div", { style: { position: 'relative', marginBottom: '2rem' } },
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
            react_1.default.createElement(react_2.EditableText, { content: fields.heading.value, onUpdate: handleHeadingUpdate, as: "h2", className: "feature-list-heading", style: {
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                } })),
        react_1.default.createElement("div", { style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
            } }, fields.items.value.map((item, index) => (react_1.default.createElement("div", { key: index, className: "feature-item", style: {
                position: 'relative',
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: 'white',
            } },
            isEditMode && editingVariant && schema.variants?.[editingVariant]?.items && index === 0 && (react_1.default.createElement("div", { style: {
                    position: 'absolute',
                    top: '-12px',
                    right: '8px',
                    background: '#8b5cf6',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                } }, "Variant Override (All Items)")),
            react_1.default.createElement(react_2.EditableText, { content: item.title, onUpdate: (updatedContent) => handleItemTitleUpdate(index, updatedContent), as: "h3", className: "feature-item-title", style: {
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                } }),
            react_1.default.createElement(react_2.EditableText, { content: item.description, onUpdate: (updatedContent) => handleItemDescriptionUpdate(index, updatedContent), as: "p", className: "feature-item-description", style: {
                    fontSize: '1rem',
                    color: '#6b7280',
                    lineHeight: '1.6',
                } })))))));
}
