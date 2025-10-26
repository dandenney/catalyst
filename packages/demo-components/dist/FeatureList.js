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
    const { locale } = (0, react_2.useCatalyst)();
    const { fields } = schema;
    const handleHeadingUpdate = (updatedContent) => {
        if (!onUpdate)
            return;
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
    };
    const handleItemTitleUpdate = (index, updatedContent) => {
        if (!onUpdate)
            return;
        const updatedItems = [...fields.items.value];
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
    };
    const handleItemDescriptionUpdate = (index, updatedContent) => {
        if (!onUpdate)
            return;
        const updatedItems = [...fields.items.value];
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
    };
    return (react_1.default.createElement("div", { className: "feature-list", style: {
            padding: '3rem 1rem',
            maxWidth: '1200px',
            margin: '0 auto',
        } },
        react_1.default.createElement(react_2.EditableText, { content: fields.heading.value, onUpdate: handleHeadingUpdate, as: "h2", className: "feature-list-heading", style: {
                fontSize: '2.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '2rem',
            } }),
        react_1.default.createElement("div", { style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
            } }, fields.items.value.map((item, index) => (react_1.default.createElement("div", { key: index, className: "feature-item", style: {
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: 'white',
            } },
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
