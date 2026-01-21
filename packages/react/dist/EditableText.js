"use strict";
/**
 * Editable Text Component
 * Renders text that can be edited in-place when in edit mode
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
exports.EditableText = EditableText;
const react_1 = __importStar(require("react"));
const core_1 = require("@catalyst/core");
const CatalystContext_1 = require("./CatalystContext");
const utils_1 = require("./lib/utils");
function EditableText({ content, onUpdate, as: Component = 'span', className = '', style: customStyle = {}, }) {
    const { locale, isEditMode } = (0, CatalystContext_1.useCatalyst)();
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const elementRef = (0, react_1.useRef)(null);
    const originalValueRef = (0, react_1.useRef)('');
    const displayValue = (0, core_1.getLocalizedValue)(content, locale);
    const handleDoubleClick = (0, react_1.useCallback)(() => {
        if (isEditMode && elementRef.current) {
            originalValueRef.current = displayValue;
            setIsEditing(true);
            // Focus the element after it becomes contentEditable
            setTimeout(() => {
                if (elementRef.current) {
                    elementRef.current.focus();
                    // Select all text for easy editing
                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(elementRef.current);
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                }
            }, 0);
        }
    }, [isEditMode, displayValue]);
    const handleBlur = (0, react_1.useCallback)(() => {
        if (isEditing && elementRef.current && onUpdate) {
            const newValue = elementRef.current.textContent || '';
            if (newValue !== originalValueRef.current) {
                const updated = {
                    ...content,
                    [locale]: newValue,
                };
                onUpdate(updated);
            }
        }
        setIsEditing(false);
    }, [isEditing, content, locale, onUpdate]);
    const handleKeyDown = (0, react_1.useCallback)((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
        }
        else if (e.key === 'Escape') {
            // Restore original value on escape
            if (elementRef.current) {
                elementRef.current.textContent = originalValueRef.current;
            }
            setIsEditing(false);
            e.currentTarget.blur();
        }
    }, []);
    // Sync the text content when displayValue changes externally
    (0, react_1.useEffect)(() => {
        if (!isEditing && elementRef.current) {
            elementRef.current.textContent = displayValue;
        }
    }, [displayValue, isEditing]);
    return (react_1.default.createElement(Component, { ref: elementRef, className: (0, utils_1.cn)(className, isEditMode && 'cursor-pointer outline-1 outline-dashed outline-[var(--catalyst-edit-outline)] outline-offset-2', isEditing && 'outline-2 outline-solid outline-[var(--catalyst-edit-active)] outline-offset-2'), onDoubleClick: handleDoubleClick, onBlur: handleBlur, onKeyDown: handleKeyDown, style: customStyle, title: isEditMode ? 'Double-click to edit' : undefined, contentEditable: isEditing, suppressContentEditableWarning: true }, displayValue));
}
