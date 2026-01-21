"use strict";
/**
 * ComponentControls
 * Inline controls that appear for each component in edit mode
 * Optionally includes variant selection
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentControls = ComponentControls;
const react_1 = __importDefault(require("react"));
const button_1 = require("./ui/button");
const VariantSelector_1 = require("./VariantSelector");
function ComponentControls({ onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown, variants, currentVariant, onVariantChange, }) {
    const showVariantSelector = variants !== undefined && onVariantChange !== undefined;
    return (react_1.default.createElement("div", { className: "absolute top-2 right-2 flex gap-2 z-10" },
        showVariantSelector && (react_1.default.createElement(VariantSelector_1.VariantSelector, { variants: variants, currentVariant: currentVariant ?? null, onVariantChange: onVariantChange })),
        canMoveUp && onMoveUp && (react_1.default.createElement(button_1.Button, { variant: "outline", size: "icon", onClick: onMoveUp, title: "Move up" }, "\u2191")),
        canMoveDown && onMoveDown && (react_1.default.createElement(button_1.Button, { variant: "outline", size: "icon", onClick: onMoveDown, title: "Move down" }, "\u2193")),
        react_1.default.createElement(button_1.Button, { variant: "outline", size: "sm", onClick: onRemove, title: "Remove component", className: "border-[var(--catalyst-destructive)] text-[var(--catalyst-destructive)] hover:bg-red-50" }, "Remove")));
}
