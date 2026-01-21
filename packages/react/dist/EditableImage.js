"use strict";
/**
 * Editable Image Component
 * Renders an image that can have its URL and alt text edited in edit mode
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
exports.EditableImage = EditableImage;
const react_1 = __importStar(require("react"));
const core_1 = require("@catalyst/core");
const CatalystContext_1 = require("./CatalystContext");
const utils_1 = require("./lib/utils");
const popover_1 = require("./ui/popover");
const button_1 = require("./ui/button");
const input_1 = require("./ui/input");
const label_1 = require("./ui/label");
function EditableImage({ src, alt, onUpdate, className = '', style: customStyle = {}, width, height, }) {
    const { locale, isEditMode } = (0, CatalystContext_1.useCatalyst)();
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [editSrc, setEditSrc] = (0, react_1.useState)(src);
    const [editAlt, setEditAlt] = (0, react_1.useState)((0, core_1.getLocalizedValue)(alt, locale));
    const displayAlt = (0, core_1.getLocalizedValue)(alt, locale);
    // Sync state when props change
    (0, react_1.useEffect)(() => {
        if (!isOpen) {
            setEditSrc(src);
            setEditAlt((0, core_1.getLocalizedValue)(alt, locale));
        }
    }, [src, alt, locale, isOpen]);
    const handleSave = (0, react_1.useCallback)(() => {
        if (onUpdate) {
            const updatedAlt = {
                ...alt,
                [locale]: editAlt,
            };
            onUpdate({ src: editSrc, alt: updatedAlt });
        }
        setIsOpen(false);
    }, [editSrc, editAlt, alt, locale, onUpdate]);
    const handleCancel = (0, react_1.useCallback)(() => {
        setEditSrc(src);
        setEditAlt(displayAlt);
        setIsOpen(false);
    }, [src, displayAlt]);
    const handleClick = (0, react_1.useCallback)(() => {
        if (isEditMode) {
            setIsOpen(true);
        }
    }, [isEditMode]);
    const handleKeyDown = (0, react_1.useCallback)((e) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
        else if (e.key === 'Enter' && e.metaKey) {
            handleSave();
        }
    }, [handleCancel, handleSave]);
    return (react_1.default.createElement(popover_1.Popover, { open: isOpen, onOpenChange: (open) => isEditMode && setIsOpen(open) },
        react_1.default.createElement(popover_1.PopoverTrigger, { asChild: true },
            react_1.default.createElement("img", { src: src, alt: displayAlt, onClick: handleClick, className: (0, utils_1.cn)(className, isEditMode && 'cursor-pointer outline-1 outline-dashed outline-[var(--catalyst-edit-outline)] outline-offset-2', isOpen && 'outline-2 outline-solid outline-[var(--catalyst-edit-active)] outline-offset-2'), title: isEditMode ? 'Click to edit image' : undefined, style: {
                    ...customStyle,
                    width,
                    height,
                } })),
        react_1.default.createElement(popover_1.PopoverContent, { onKeyDown: handleKeyDown },
            react_1.default.createElement("div", { className: "space-y-3" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement(label_1.Label, { htmlFor: "image-url" }, "Image URL"),
                    react_1.default.createElement(input_1.Input, { id: "image-url", type: "text", value: editSrc, onChange: (e) => setEditSrc(e.target.value), placeholder: "https://example.com/image.jpg", autoFocus: true })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement(label_1.Label, { htmlFor: "image-alt" },
                        "Alt Text (",
                        locale.toUpperCase(),
                        ")"),
                    react_1.default.createElement(input_1.Input, { id: "image-alt", type: "text", value: editAlt, onChange: (e) => setEditAlt(e.target.value), placeholder: "Describe the image" })),
                react_1.default.createElement("div", { className: "flex gap-2 justify-end" },
                    react_1.default.createElement(button_1.Button, { variant: "outline", size: "sm", onClick: handleCancel }, "Cancel"),
                    react_1.default.createElement(button_1.Button, { size: "sm", onClick: handleSave }, "Save")),
                react_1.default.createElement("p", { className: "text-xs text-[var(--catalyst-muted-foreground)]" }, "Cmd+Enter to save, Esc to cancel")))));
}
