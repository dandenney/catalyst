/**
 * React hooks for Catalyst
 */

import { useState, useEffect, useCallback } from 'react';
import { PageSchema, ComponentSchema } from '../core';
import { useCatalyst } from './CatalystContext';

// Re-export variant handling hook
export * from './useVariantHandling';

// Re-export editable link hook
export * from './useEditableLink';

/**
 * Hook to load and manage a page
 */
export function usePage(slug: string) {
  const { storageAdapter } = useCatalyst();
  const [page, setPage] = useState<PageSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load page'));
        }
      } finally {
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

  const updateComponent = useCallback(
    async (componentId: string, updatedComponent: ComponentSchema) => {
      if (!page || !storageAdapter) return;

      const updatedPage: PageSchema = {
        ...page,
        components: page.components.map((c) =>
          c.id === componentId ? updatedComponent : c
        ),
      };

      setPage(updatedPage);
      await storageAdapter.savePage(updatedPage);
    },
    [page, storageAdapter]
  );

  return {
    page,
    loading,
    error,
    updateComponent,
  };
}
