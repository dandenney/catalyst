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
const utils_1 = require("./lib/utils");
const button_1 = require("./ui/button");
function InsertButton({ onInsert }) {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    return (react_1.default.createElement("div", { className: (0, utils_1.cn)('relative h-0.5 my-2 transition-all', isHovered ? 'bg-[var(--catalyst-primary)]' : 'bg-[var(--catalyst-border)]'), onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false) },
        react_1.default.createElement(button_1.Button, { onClick: onInsert, variant: isHovered ? 'default' : 'outline', size: "sm", className: (0, utils_1.cn)('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all', !isHovered && 'border-2 border-[var(--catalyst-primary)] text-[var(--catalyst-primary)] opacity-70'), title: "Insert component here" }, "+ Add Component")));
}
