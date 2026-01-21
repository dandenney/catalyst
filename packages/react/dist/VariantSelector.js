"use strict";
/**
 * VariantSelector
 * Allows switching between base and variant editing modes
 * Includes ability to create new variants
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
exports.VariantSelector = VariantSelector;
const react_1 = __importStar(require("react"));
const utils_1 = require("./lib/utils");
const dropdown_menu_1 = require("./ui/dropdown-menu");
const button_1 = require("./ui/button");
const input_1 = require("./ui/input");
function VariantSelector({ variants = {}, currentVariant, onVariantChange, }) {
    const [isCreating, setIsCreating] = (0, react_1.useState)(false);
    const [newVariantName, setNewVariantName] = (0, react_1.useState)('');
    const variantNames = Object.keys(variants || {});
    const handleCreateVariant = () => {
        if (!newVariantName.trim())
            return;
        // Switch to the new variant (it will be created when user makes first edit)
        onVariantChange(newVariantName.trim());
        setNewVariantName('');
        setIsCreating(false);
    };
    return (react_1.default.createElement(dropdown_menu_1.DropdownMenu, null,
        react_1.default.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
            react_1.default.createElement(button_1.Button, { variant: currentVariant ? 'accent' : 'outline', size: "sm", className: "gap-2", title: "Select variant to edit" },
                currentVariant ? `Variant: ${currentVariant}` : 'Base',
                react_1.default.createElement("span", { className: "text-xs" }, "\u25BC"))),
        react_1.default.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end" },
            react_1.default.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: () => onVariantChange(null), className: (0, utils_1.cn)(currentVariant === null && 'font-semibold bg-[var(--catalyst-secondary)]') }, "Base"),
            variantNames.map((variantName) => (react_1.default.createElement(dropdown_menu_1.DropdownMenuItem, { key: variantName, onClick: () => onVariantChange(variantName), className: (0, utils_1.cn)(currentVariant === variantName && 'font-semibold bg-[var(--catalyst-secondary)]') }, variantName))),
            react_1.default.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
            isCreating ? (react_1.default.createElement("div", { className: "p-2", onClick: (e) => e.stopPropagation() },
                react_1.default.createElement(input_1.Input, { type: "text", value: newVariantName, onChange: (e) => setNewVariantName(e.target.value), onKeyDown: (e) => {
                        if (e.key === 'Enter') {
                            handleCreateVariant();
                        }
                        else if (e.key === 'Escape') {
                            setIsCreating(false);
                            setNewVariantName('');
                        }
                    }, placeholder: "e.g., premium, mobile", autoFocus: true, className: "mb-2" }),
                react_1.default.createElement("div", { className: "flex gap-2" },
                    react_1.default.createElement(button_1.Button, { variant: "success", size: "sm", onClick: handleCreateVariant, disabled: !newVariantName.trim(), className: "flex-1" }, "Create"),
                    react_1.default.createElement(button_1.Button, { variant: "outline", size: "sm", onClick: () => {
                            setIsCreating(false);
                            setNewVariantName('');
                        }, className: "flex-1" }, "Cancel")))) : (react_1.default.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: () => setIsCreating(true), className: "text-[var(--catalyst-primary)] font-semibold gap-2" },
                react_1.default.createElement("span", null, "+"),
                "Add Variant")))));
}
