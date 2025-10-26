"use strict";
/**
 * InsertButton
 * Button that appears between components to insert new components
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
exports.InsertButton = InsertButton;
const react_1 = __importStar(require("react"));
function InsertButton({ onInsert }) {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    return (react_1.default.createElement("div", { style: {
            position: 'relative',
            height: '2px',
            background: isHovered ? '#3b82f6' : '#e5e7eb',
            margin: '0.5rem 0',
            transition: 'all 0.2s',
        }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false) },
        react_1.default.createElement("button", { onClick: onInsert, style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '0.5rem 1rem',
                background: isHovered ? '#3b82f6' : 'white',
                color: isHovered ? 'white' : '#3b82f6',
                border: '2px solid #3b82f6',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                opacity: isHovered ? 1 : 0.7,
            }, title: "Insert component here" }, "+ Add Component")));
}
