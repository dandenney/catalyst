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
function EditableText({ content, onUpdate, as: Component = 'span', className = '', style: customStyle = {}, }) {
    const { locale, isEditMode } = (0, CatalystContext_1.useCatalyst)();
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [editValue, setEditValue] = (0, react_1.useState)('');
    const displayValue = (0, core_1.getLocalizedValue)(content, locale);
    const handleDoubleClick = (0, react_1.useCallback)(() => {
        if (isEditMode) {
            setEditValue(displayValue);
            setIsEditing(true);
        }
    }, [isEditMode, displayValue]);
    const handleBlur = (0, react_1.useCallback)(() => {
        if (isEditing && editValue !== displayValue && onUpdate) {
            const updated = {
                ...content,
                [locale]: editValue,
            };
            onUpdate(updated);
        }
        setIsEditing(false);
    }, [isEditing, editValue, displayValue, content, locale, onUpdate]);
    const handleKeyDown = (0, react_1.useCallback)((e) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
        else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    }, []);
    if (isEditing) {
        return (react_1.default.createElement("input", { type: "text", value: editValue, onChange: (e) => setEditValue(e.target.value), onBlur: handleBlur, onKeyDown: handleKeyDown, autoFocus: true, className: `${className} catalyst-editing`, style: {
                font: 'inherit',
                border: '2px solid #3b82f6',
                background: '#eff6ff',
                padding: '2px 4px',
                borderRadius: '2px',
                outline: 'none',
            } }));
    }
    const editModeStyle = isEditMode
        ? {
            cursor: 'pointer',
            outline: '1px dashed #94a3b8',
            outlineOffset: '2px',
        }
        : {};
    const mergedStyle = { ...customStyle, ...editModeStyle };
    return (react_1.default.createElement(Component, { className: className, onDoubleClick: handleDoubleClick, style: mergedStyle, title: isEditMode ? 'Double-click to edit' : undefined }, displayValue));
}
