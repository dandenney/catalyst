"use strict";
/**
 * React hooks for Catalyst
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePage = usePage;
const react_1 = require("react");
const CatalystContext_1 = require("./CatalystContext");
// Re-export variant handling hook
__exportStar(require("./useVariantHandling"), exports);
/**
 * Hook to load and manage a page
 */
function usePage(slug) {
    const { storageAdapter } = (0, CatalystContext_1.useCatalyst)();
    const [page, setPage] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (!storageAdapter) {
            setLoading(false);
            return;
        }
        const adapter = storageAdapter;
        let cancelled = false;
        async function loadPage() {
            try {
                setLoading(true);
                setError(null);
                const loadedPage = await adapter.getPage(slug);
                if (!cancelled) {
                    setPage(loadedPage);
                }
            }
            catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err : new Error('Failed to load page'));
                }
            }
            finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        loadPage();
        return () => {
            cancelled = true;
        };
    }, [slug, storageAdapter]);
    const updateComponent = (0, react_1.useCallback)(async (componentId, updatedComponent) => {
        if (!page || !storageAdapter)
            return;
        const updatedPage = {
            ...page,
            components: page.components.map((c) => c.id === componentId ? updatedComponent : c),
        };
        setPage(updatedPage);
        await storageAdapter.savePage(updatedPage);
    }, [page, storageAdapter]);
    return {
        page,
        loading,
        error,
        updateComponent,
    };
}
