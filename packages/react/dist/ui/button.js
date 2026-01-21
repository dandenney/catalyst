"use strict";
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
exports.buttonVariants = exports.Button = void 0;
const React = __importStar(require("react"));
const class_variance_authority_1 = require("class-variance-authority");
const utils_1 = require("../lib/utils");
const buttonVariants = (0, class_variance_authority_1.cva)('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--catalyst-radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--catalyst-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', {
    variants: {
        variant: {
            default: 'bg-[var(--catalyst-primary)] text-[var(--catalyst-primary-foreground)] shadow-[var(--catalyst-shadow-sm)] hover:bg-[var(--catalyst-primary-hover)]',
            destructive: 'bg-[var(--catalyst-destructive)] text-[var(--catalyst-destructive-foreground)] shadow-[var(--catalyst-shadow-sm)] hover:bg-[var(--catalyst-destructive-hover)]',
            outline: 'border border-[var(--catalyst-border-input)] bg-[var(--catalyst-background)] shadow-[var(--catalyst-shadow-sm)] hover:bg-[var(--catalyst-secondary)] text-[var(--catalyst-foreground)]',
            secondary: 'bg-[var(--catalyst-secondary)] text-[var(--catalyst-secondary-foreground)] shadow-[var(--catalyst-shadow-sm)] hover:bg-[var(--catalyst-secondary-hover)]',
            ghost: 'hover:bg-[var(--catalyst-secondary)] text-[var(--catalyst-foreground)]',
            link: 'text-[var(--catalyst-primary)] underline-offset-4 hover:underline',
            accent: 'bg-[var(--catalyst-accent)] text-[var(--catalyst-accent-foreground)] shadow-[var(--catalyst-shadow-sm)] hover:bg-[var(--catalyst-accent-hover)]',
            success: 'bg-[var(--catalyst-success)] text-[var(--catalyst-success-foreground)] shadow-[var(--catalyst-shadow-sm)]',
        },
        size: {
            default: 'h-9 px-4 py-2',
            sm: 'h-8 rounded-[var(--catalyst-radius-sm)] px-3 text-xs',
            lg: 'h-10 rounded-[var(--catalyst-radius-md)] px-8',
            icon: 'h-9 w-9',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
exports.buttonVariants = buttonVariants;
const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
    return (React.createElement("button", { className: (0, utils_1.cn)(buttonVariants({ variant, size, className })), ref: ref, ...props }));
});
exports.Button = Button;
Button.displayName = 'Button';
