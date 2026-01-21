"use strict";
/**
 * Editable Link Component
 * Renders a link that can have its URL and text edited in edit mode
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
exports.EditableLink = EditableLink;
const react_1 = __importStar(require("react"));
const core_1 = require("@catalyst/core");
const CatalystContext_1 = require("./CatalystContext");
const utils_1 = require("./lib/utils");
const popover_1 = require("./ui/popover");
const button_1 = require("./ui/button");
const input_1 = require("./ui/input");
const label_1 = require("./ui/label");
function EditableLink({ href, text, onUpdate, className = '', style: customStyle = {}, target, rel, children, }) {
    const { locale, isEditMode } = (0, CatalystContext_1.useCatalyst)();
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [editHref, setEditHref] = (0, react_1.useState)((0, core_1.getLocalizedValue)(href, locale));
    const [editText, setEditText] = (0, react_1.useState)((0, core_1.getLocalizedValue)(text, locale));
    const displayHref = (0, core_1.getLocalizedValue)(href, locale);
    const displayText = (0, core_1.getLocalizedValue)(text, locale);
    // Sync state when props change
    (0, react_1.useEffect)(() => {
        if (!isOpen) {
            setEditHref((0, core_1.getLocalizedValue)(href, locale));
            setEditText((0, core_1.getLocalizedValue)(text, locale));
        }
    }, [href, text, locale, isOpen]);
    const handleClick = (0, react_1.useCallback)((e) => {
        if (isEditMode) {
            e.preventDefault();
            setIsOpen(true);
        }
    }, [isEditMode]);
    const handleSave = (0, react_1.useCallback)(() => {
        if (onUpdate) {
            const updatedHref = {
                ...href,
                [locale]: editHref,
            };
            const updatedText = {
                ...text,
                [locale]: editText,
            };
            onUpdate({ href: updatedHref, text: updatedText });
        }
        setIsOpen(false);
    }, [editHref, editText, href, text, locale, onUpdate]);
    const handleCancel = (0, react_1.useCallback)(() => {
        setEditHref(displayHref);
        setEditText(displayText);
        setIsOpen(false);
    }, [displayHref, displayText]);
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
            react_1.default.createElement("a", { href: isEditMode ? undefined : displayHref, target: isEditMode ? undefined : target, rel: isEditMode ? undefined : rel, className: (0, utils_1.cn)(className, isEditMode && 'cursor-pointer outline-1 outline-dashed outline-[var(--catalyst-edit-outline)] outline-offset-2', isOpen && 'outline-2 outline-solid outline-[var(--catalyst-edit-active)] outline-offset-2'), onClick: handleClick, title: isEditMode ? 'Click to edit link' : undefined, style: customStyle },
                react_1.default.createElement("span", null, displayText),
                children)),
        react_1.default.createElement(popover_1.PopoverContent, { onKeyDown: handleKeyDown },
            react_1.default.createElement("div", { className: "space-y-3" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement(label_1.Label, { htmlFor: "link-text" },
                        "Link Text (",
                        locale.toUpperCase(),
                        ")"),
                    react_1.default.createElement(input_1.Input, { id: "link-text", type: "text", value: editText, onChange: (e) => setEditText(e.target.value), placeholder: "Click here", autoFocus: true })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement(label_1.Label, { htmlFor: "link-url" },
                        "URL (",
                        locale.toUpperCase(),
                        ")"),
                    react_1.default.createElement(input_1.Input, { id: "link-url", type: "text", value: editHref, onChange: (e) => setEditHref(e.target.value), placeholder: "https://example.com" })),
                react_1.default.createElement("div", { className: "flex gap-2 justify-end" },
                    react_1.default.createElement(button_1.Button, { variant: "outline", size: "sm", onClick: handleCancel }, "Cancel"),
                    react_1.default.createElement(button_1.Button, { size: "sm", onClick: handleSave }, "Save")),
                react_1.default.createElement("p", { className: "text-xs text-[var(--catalyst-muted-foreground)]" }, "Cmd+Enter to save, Esc to cancel")))));
}
