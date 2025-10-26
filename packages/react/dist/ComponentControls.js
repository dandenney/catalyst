"use strict";
/**
 * ComponentControls
 * Inline controls that appear for each component in edit mode
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentControls = ComponentControls;
const react_1 = __importDefault(require("react"));
function ComponentControls({ onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown, }) {
    return (react_1.default.createElement("div", { style: {
            position: 'absolute',
            top: '8px',
            right: '8px',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 10,
        } },
        canMoveUp && onMoveUp && (react_1.default.createElement("button", { onClick: onMoveUp, style: {
                padding: '0.5rem',
                background: 'white',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }, title: "Move up", onMouseEnter: (e) => {
                e.currentTarget.style.background = '#f1f5f9';
            }, onMouseLeave: (e) => {
                e.currentTarget.style.background = 'white';
            } }, "\u2191")),
        canMoveDown && onMoveDown && (react_1.default.createElement("button", { onClick: onMoveDown, style: {
                padding: '0.5rem',
                background: 'white',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }, title: "Move down", onMouseEnter: (e) => {
                e.currentTarget.style.background = '#f1f5f9';
            }, onMouseLeave: (e) => {
                e.currentTarget.style.background = 'white';
            } }, "\u2193")),
        react_1.default.createElement("button", { onClick: onRemove, style: {
                padding: '0.5rem 0.75rem',
                background: 'white',
                border: '1px solid #ef4444',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#ef4444',
                fontWeight: '500',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }, title: "Remove component", onMouseEnter: (e) => {
                e.currentTarget.style.background = '#fef2f2';
            }, onMouseLeave: (e) => {
                e.currentTarget.style.background = 'white';
            } }, "Remove")));
}
