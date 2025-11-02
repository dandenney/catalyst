"use strict";
/**
 * FeatureList Component
 * Displays a list of features with titles and descriptions
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureList = FeatureList;
const react_1 = __importDefault(require("react"));
const react_2 = require("@catalyst/react");
function FeatureList({ schema, onUpdate }) {
    const { isEditMode } = (0, react_2.useCatalyst)();
    // Use the centralized variant handling hook
    const { displaySchema, editingVariant, setEditingVariant, updateField } = (0, react_2.useVariantHandling)({ schema });
    const { fields } = displaySchema;
    const handleItemTitleUpdate = (index, updatedContent) => {
        if (!onUpdate)
            return;
        // Clone the current items array
        const updatedItems = [...fields.items.value];
        updatedItems[index] = {
            ...updatedItems[index],
            title: updatedContent,
        };
        // Use the hook's updateField to handle variant logic
        updateField('items', updatedItems, onUpdate);
    };
    const handleItemDescriptionUpdate = (index, updatedContent) => {
        if (!onUpdate)
            return;
        // Clone the current items array
        const updatedItems = [...fields.items.value];
        updatedItems[index] = {
            ...updatedItems[index],
            description: updatedContent,
        };
        // Use the hook's updateField to handle variant logic
        updateField('items', updatedItems, onUpdate);
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
            react_1.default.createElement(react_2.VariantSelector, { variants: schema.variants, currentVariant: editingVariant, onVariantChange: setEditingVariant }))),
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
            react_1.default.createElement(react_2.EditableText, { content: fields.heading.value, onUpdate: (content) => updateField('heading', content, onUpdate), as: "h2", className: "feature-list-heading", style: {
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
