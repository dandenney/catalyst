/**
 * Custom hook for loading and managing pages via API routes
 */

import { useState, useEffect, useCallback } from 'react';
import { PageSchema, ComponentSchema } from '@catalyst/core';

export function usePage(slug: string) {
  const [page, setPage] = useState<PageSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/pages/${slug}`);

        if (!response.ok) {
          throw new Error(`Failed to load page: ${response.statusText}`);
        }

        const data = await response.json();

        if (!cancelled) {
          setPage(data);
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
  }, [slug]);

  const updateComponent = useCallback(
    async (componentId: string, updatedComponent: ComponentSchema) => {
      if (!page) return;

      const updatedPage: PageSchema = {
        ...page,
        components: page.components.map((c) =>
          c.id === componentId ? updatedComponent : c
        ),
      };

      // Optimistically update local state
      setPage(updatedPage);

      try {
        // Save to server
        const response = await fetch(`/api/pages/${slug}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPage),
        });

        if (!response.ok) {
          throw new Error('Failed to save page');
        }
      } catch (err) {
        // Revert on error
        setPage(page);
        console.error('Failed to save changes:', err);
      }
    },
    [page, slug]
  );

  return {
    page,
    loading,
    error,
    updateComponent,
  };
}
