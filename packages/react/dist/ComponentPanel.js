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
function ComponentPanel({ isOpen, onClose, onSelectComponent }) {
    const [selectedComponent, setSelectedComponent] = (0, react_1.useState)(null);
    const availableComponents = (0, core_1.getAvailableComponents)();
    if (!isOpen)
        return null;
    const handleSelectComponent = (component) => {
        setSelectedComponent(component);
    };
    const handleAddComponent = () => {
        if (selectedComponent) {
            onSelectComponent(selectedComponent.type);
            setSelectedComponent(null);
        }
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { onClick: onClose, style: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.3)',
                zIndex: 999,
            } }),
        react_1.default.createElement("div", { style: {
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '400px',
                background: 'white',
                boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
            } },
            react_1.default.createElement("div", { style: {
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                } },
                react_1.default.createElement("h2", { style: { fontSize: '1.25rem', fontWeight: '600', margin: 0 } }, "Add Component"),
                react_1.default.createElement("button", { onClick: onClose, style: {
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                        color: '#6b7280',
                    }, "aria-label": "Close panel" }, "\u00D7")),
            react_1.default.createElement("div", { style: {
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1rem',
                } },
                react_1.default.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' } }, availableComponents.map((component) => (react_1.default.createElement("button", { key: component.type, onClick: () => handleSelectComponent(component), style: {
                        padding: '1rem',
                        border: selectedComponent?.type === component.type
                            ? '2px solid #3b82f6'
                            : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: selectedComponent?.type === component.type
                            ? '#eff6ff'
                            : 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                    }, onMouseEnter: (e) => {
                        if (selectedComponent?.type !== component.type) {
                            e.currentTarget.style.borderColor = '#cbd5e1';
                        }
                    }, onMouseLeave: (e) => {
                        if (selectedComponent?.type !== component.type) {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                        }
                    } },
                    react_1.default.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' } },
                        component.thumbnail && (react_1.default.createElement("div", { style: {
                                width: '100%',
                                height: '150px',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                background: '#f3f4f6',
                            } },
                            react_1.default.createElement("img", { src: component.thumbnail, alt: `${component.label} preview`, style: {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                } }))),
                        react_1.default.createElement("div", { style: { display: 'flex', alignItems: 'start', gap: '0.75rem' } },
                            react_1.default.createElement("span", { style: { fontSize: '2rem', lineHeight: 1 } }, component.icon),
                            react_1.default.createElement("div", { style: { flex: 1 } },
                                react_1.default.createElement("div", { style: { fontWeight: '600', marginBottom: '0.25rem' } }, component.label),
                                react_1.default.createElement("div", { style: { fontSize: '0.875rem', color: '#6b7280' } }, component.description))))))))),
            selectedComponent && (react_1.default.createElement("div", { style: {
                    padding: '1rem',
                    borderTop: '1px solid #e5e7eb',
                    background: '#f9fafb',
                } },
                react_1.default.createElement("div", { style: { marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' } },
                    react_1.default.createElement("strong", null, selectedComponent.label),
                    " will be added to your page"),
                react_1.default.createElement("button", { onClick: handleAddComponent, style: {
                        width: '100%',
                        padding: '0.75rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                    }, onMouseEnter: (e) => {
                        e.currentTarget.style.background = '#2563eb';
                    }, onMouseLeave: (e) => {
                        e.currentTarget.style.background = '#3b82f6';
                    } }, "Add to Page"))))));
}
