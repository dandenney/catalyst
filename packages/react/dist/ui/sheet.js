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
exports.SheetDescription = exports.SheetTitle = exports.SheetFooter = exports.SheetHeader = exports.SheetContent = exports.SheetClose = exports.SheetTrigger = exports.SheetOverlay = exports.SheetPortal = exports.Sheet = void 0;
const React = __importStar(require("react"));
const DialogPrimitive = __importStar(require("@radix-ui/react-dialog"));
const class_variance_authority_1 = require("class-variance-authority");
const utils_1 = require("../lib/utils");
const Sheet = DialogPrimitive.Root;
exports.Sheet = Sheet;
const SheetTrigger = DialogPrimitive.Trigger;
exports.SheetTrigger = SheetTrigger;
const SheetClose = DialogPrimitive.Close;
exports.SheetClose = SheetClose;
const SheetPortal = DialogPrimitive.Portal;
exports.SheetPortal = SheetPortal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (React.createElement(DialogPrimitive.Overlay, { className: (0, utils_1.cn)('fixed inset-0 z-50 bg-[var(--catalyst-overlay)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className), ...props, ref: ref })));
exports.SheetOverlay = SheetOverlay;
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;
const sheetVariants = (0, class_variance_authority_1.cva)('fixed z-50 gap-4 bg-[var(--catalyst-background)] shadow-[var(--catalyst-shadow-lg)] transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out', {
    variants: {
        side: {
            top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
            bottom: 'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
            right: 'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md',
        },
    },
    defaultVariants: {
        side: 'right',
    },
});
const SheetContent = React.forwardRef(({ side = 'right', className, children, ...props }, ref) => (React.createElement(SheetPortal, null,
    React.createElement(SheetOverlay, null),
    React.createElement(DialogPrimitive.Content, { ref: ref, className: (0, utils_1.cn)(sheetVariants({ side }), className), ...props }, children))));
exports.SheetContent = SheetContent;
SheetContent.displayName = DialogPrimitive.Content.displayName;
const SheetHeader = ({ className, ...props }) => (React.createElement("div", { className: (0, utils_1.cn)('flex flex-col space-y-2 p-6 border-b border-[var(--catalyst-border)]', className), ...props }));
exports.SheetHeader = SheetHeader;
SheetHeader.displayName = 'SheetHeader';
const SheetFooter = ({ className, ...props }) => (React.createElement("div", { className: (0, utils_1.cn)('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-4 border-t border-[var(--catalyst-border)] bg-[var(--catalyst-muted)]', className), ...props }));
exports.SheetFooter = SheetFooter;
SheetFooter.displayName = 'SheetFooter';
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (React.createElement(DialogPrimitive.Title, { ref: ref, className: (0, utils_1.cn)('text-lg font-semibold text-[var(--catalyst-foreground)]', className), ...props })));
exports.SheetTitle = SheetTitle;
SheetTitle.displayName = DialogPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (React.createElement(DialogPrimitive.Description, { ref: ref, className: (0, utils_1.cn)('text-sm text-[var(--catalyst-muted-foreground)]', className), ...props })));
exports.SheetDescription = SheetDescription;
SheetDescription.displayName = DialogPrimitive.Description.displayName;
