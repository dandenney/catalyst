"use strict";
/**
 * Component Renderer
 * Dynamically renders components from the registry based on schema type
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentRenderer = ComponentRenderer;
const react_1 = __importDefault(require("react"));
const CatalystContext_1 = require("./CatalystContext");
/**
 * Renders a component based on its schema type
 * Looks up the component from the registry provided to CatalystProvider
 *
 * @example
 * ```tsx
 * // In _app.tsx, register your components:
 * <CatalystProvider components={{ CTASection, HeroBanner }}>
 *   <App />
 * </CatalystProvider>
 *
 * // Then use ComponentRenderer anywhere:
 * <ComponentRenderer schema={componentSchema} onUpdate={handleUpdate} />
 * ```
 */
function ComponentRenderer({ schema, onUpdate }) {
    const { components } = (0, CatalystContext_1.useCatalyst)();
    const Component = components[schema.type];
    if (!Component) {
        return (react_1.default.createElement("div", { style: {
                padding: '1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.375rem',
                color: '#991b1b',
            } },
            react_1.default.createElement("strong", null, "Unknown component type:"),
            " ",
            schema.type,
            react_1.default.createElement("p", { style: { marginTop: '0.5rem', fontSize: '0.875rem', color: '#b91c1c' } }, "Make sure to register this component in your CatalystProvider.")));
    }
    return react_1.default.createElement(Component, { schema: schema, onUpdate: onUpdate });
}
