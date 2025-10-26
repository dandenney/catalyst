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

  const savePage = useCallback(
    async (updatedPage: PageSchema) => {
      try {
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
        return true;
      } catch (err) {
        console.error('Failed to save changes:', err);
        return false;
      }
    },
    [slug]
  );

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

      const success = await savePage(updatedPage);
      if (!success) {
        // Revert on error
        setPage(page);
      }
    },
    [page, savePage]
  );

  const addComponent = useCallback(
    async (component: ComponentSchema, position?: number) => {
      if (!page) return;

      const newComponents = [...page.components];
      if (position !== undefined && position >= 0 && position <= newComponents.length) {
        // Insert at specific position
        newComponents.splice(position, 0, component);
      } else {
        // Add at end
        newComponents.push(component);
      }

      const updatedPage: PageSchema = {
        ...page,
        components: newComponents,
      };

      // Optimistically update local state
      setPage(updatedPage);

      const success = await savePage(updatedPage);
      if (!success) {
        // Revert on error
        setPage(page);
      }
    },
    [page, savePage]
  );

  const removeComponent = useCallback(
    async (componentId: string) => {
      if (!page) return;

      const updatedPage: PageSchema = {
        ...page,
        components: page.components.filter((c) => c.id !== componentId),
      };

      // Optimistically update local state
      setPage(updatedPage);

      const success = await savePage(updatedPage);
      if (!success) {
        // Revert on error
        setPage(page);
      }
    },
    [page, savePage]
  );

  const reorderComponents = useCallback(
    async (componentIds: string[]) => {
      if (!page) return;

      // Create a map for quick lookup
      const componentMap = new Map(page.components.map((c) => [c.id, c]));

      // Reorder based on the provided IDs
      const reorderedComponents = componentIds
        .map((id) => componentMap.get(id))
        .filter((c): c is ComponentSchema => c !== undefined);

      const updatedPage: PageSchema = {
        ...page,
        components: reorderedComponents,
      };

      // Optimistically update local state
      setPage(updatedPage);

      const success = await savePage(updatedPage);
      if (!success) {
        // Revert on error
        setPage(page);
      }
    },
    [page, savePage]
  );

  return {
    page,
    loading,
    error,
    updateComponent,
    addComponent,
    removeComponent,
    reorderComponents,
  };
}
