"use strict";
/**
 * Component Renderer
 * Maps schema component types to React components
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentRenderer = ComponentRenderer;
const react_1 = __importDefault(require("react"));
const HeroBanner_1 = require("./HeroBanner");
const FeatureList_1 = require("./FeatureList");
function ComponentRenderer({ schema, onUpdate }) {
    switch (schema.type) {
        case 'HeroBanner':
            return react_1.default.createElement(HeroBanner_1.HeroBanner, { schema: schema, onUpdate: onUpdate });
        case 'FeatureList':
            return react_1.default.createElement(FeatureList_1.FeatureList, { schema: schema, onUpdate: onUpdate });
        default:
            return (react_1.default.createElement("div", { style: { padding: '1rem', background: '#fee', border: '1px solid #fcc' } },
                "Unknown component type: ",
                schema.type));
    }
}
