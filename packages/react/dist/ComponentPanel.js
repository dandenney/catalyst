"use strict";
/**
 * ComponentPanel
 * Side panel UI for managing components in edit mode
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
exports.ComponentPanel = ComponentPanel;
const react_1 = __importStar(require("react"));
const core_1 = require("@catalyst/core");
const utils_1 = require("./lib/utils");
const sheet_1 = require("./ui/sheet");
const button_1 = require("./ui/button");
function ComponentPanel({ isOpen, onClose, onSelectComponent }) {
    const [selectedComponent, setSelectedComponent] = (0, react_1.useState)(null);
    const availableComponents = (0, core_1.getAvailableComponents)();
    const handleSelectComponent = (component) => {
        setSelectedComponent(component);
    };
    const handleAddComponent = () => {
        if (selectedComponent) {
            onSelectComponent(selectedComponent.type);
            setSelectedComponent(null);
        }
    };
    return (react_1.default.createElement(sheet_1.Sheet, { open: isOpen, onOpenChange: (open) => !open && onClose() },
        react_1.default.createElement(sheet_1.SheetContent, { side: "right", className: "flex flex-col w-[400px] sm:max-w-[400px] p-0" },
            react_1.default.createElement(sheet_1.SheetHeader, null,
                react_1.default.createElement(sheet_1.SheetTitle, null, "Add Component")),
            react_1.default.createElement("div", { className: "flex-1 overflow-y-auto p-4" },
                react_1.default.createElement("div", { className: "flex flex-col gap-3" }, availableComponents.map((component) => (react_1.default.createElement("button", { key: component.type, onClick: () => handleSelectComponent(component), className: (0, utils_1.cn)('p-4 rounded-[var(--catalyst-radius-lg)] text-left transition-all', selectedComponent?.type === component.type
                        ? 'border-2 border-[var(--catalyst-primary)] bg-blue-50'
                        : 'border border-[var(--catalyst-border)] bg-[var(--catalyst-background)] hover:border-[var(--catalyst-border-input)]') },
                    react_1.default.createElement("div", { className: "flex flex-col gap-3" },
                        component.thumbnail && (react_1.default.createElement("div", { className: "w-full h-[150px] rounded-[var(--catalyst-radius-sm)] overflow-hidden bg-[var(--catalyst-muted)]" },
                            react_1.default.createElement("img", { src: component.thumbnail, alt: `${component.label} preview`, className: "w-full h-full object-cover" }))),
                        react_1.default.createElement("div", { className: "flex items-start gap-3" },
                            react_1.default.createElement("span", { className: "text-2xl leading-none" }, component.icon),
                            react_1.default.createElement("div", { className: "flex-1" },
                                react_1.default.createElement("div", { className: "font-semibold mb-1" }, component.label),
                                react_1.default.createElement("div", { className: "text-sm text-[var(--catalyst-muted-foreground)]" }, component.description))))))))),
            selectedComponent && (react_1.default.createElement(sheet_1.SheetFooter, { className: "flex-col items-stretch gap-4" },
                react_1.default.createElement("div", { className: "text-sm text-[var(--catalyst-muted-foreground)]" },
                    react_1.default.createElement("strong", null, selectedComponent.label),
                    " will be added to your page"),
                react_1.default.createElement(button_1.Button, { onClick: handleAddComponent, className: "w-full" }, "Add to Page"))))));
}
