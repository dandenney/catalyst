"use client";

import {
  type CardGridSectionSchema,
  createComponent,
  type CTASectionSchema,
  type HeroSectionSchema,
  type PageSchema,
} from "catalyst";
import { useCallback, useEffect, useRef,useState } from "react";

type SectionSchema = HeroSectionSchema | CTASectionSchema | CardGridSectionSchema;

interface Section {
  type: string;
  schema: SectionSchema;
}

import { EditableCardGrid } from "../components/sections/card-grid/editable-card-grid";
import { EditableCTA } from "../components/sections/cta/editable-cta";
import { EditableHero } from "../components/sections/hero/editable-hero";
import { EditModeIndicator } from "../components/ui/edit-mode-indicator";
import { LayoutLines } from "../components/ui/layout-lines";
import {
  type SectionControls,
  type SectionType,
} from "../components/ui/section-controls";

const PAGE_SLUG = "home";

export default function Home() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState<PageSchema | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load page data from API
  useEffect(() => {
    async function loadPage() {
      try {
        const response = await fetch(`/api/pages/${PAGE_SLUG}`);
        if (response.ok) {
          const page: PageSchema = await response.json();
          setPageData(page);
          setSections(
            page.components.map((component) => ({
              type: component.type,
              schema: component as SectionSchema,
            }))
          );
        } else {
          // If page doesn't exist, start with empty sections
          console.warn("Page not found, starting with empty state");
        }
      } catch (error) {
        console.error("Failed to load page:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPage();
  }, []);

  // Save page data to API (debounced)
  const savePage = useCallback(
    async (updatedSections: Section[]) => {
      const updatedPage: PageSchema = pageData
        ? {
            ...pageData,
            components: updatedSections.map((s) => s.schema),
          }
        : {
            id: `page-${PAGE_SLUG}`,
            slug: PAGE_SLUG,
            metadata: {
              title: { en: "Home" },
            },
            components: updatedSections.map((s) => s.schema),
          };

      try {
        const response = await fetch(`/api/pages/${PAGE_SLUG}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPage),
        });

        if (response.ok && !pageData) {
          setPageData(updatedPage);
        } else if (!response.ok) {
          console.error("Failed to save page");
        }
      } catch (error) {
        console.error("Failed to save page:", error);
      }
    },
    [pageData]
  );

  // Debounced save - waits 500ms after last change before saving
  const debouncedSave = useCallback(
    (updatedSections: Section[]) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        savePage(updatedSections);
      }, 500);
    },
    [savePage]
  );

  const updateSectionSchema = (
    index: number,
    schema: SectionSchema,
  ) => {
    setSections((prev) => {
      const updated = prev.map((section, i) =>
        i === index ? { ...section, schema } : section
      );
      debouncedSave(updated);
      return updated;
    });
  };

  const moveSection = (from: number, to: number) => {
    setSections((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      debouncedSave(next);
      return next;
    });
  };

  const removeSection = (index: number) => {
    setSections((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      debouncedSave(updated);
      return updated;
    });
  };

  const createSchemaByType = (type: SectionType): Section => {
    const schema = createComponent(type) as SectionSchema;
    return { type, schema };
  };

  const addSectionAfter = (index: number, type: SectionType) => {
    setSections((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, createSchemaByType(type));
      debouncedSave(next);
      return next;
    });
  };

  const addFirstSection = (type: SectionType) => {
    const newSections = [createSchemaByType(type)];
    setSections(newSections);
    debouncedSave(newSections);
  };

  const addSectionOptions: Array<{ type: SectionType; label: string }> = [
    { type: "HeroSection", label: "Hero" },
    { type: "CTASection", label: "CTA section" },
    { type: "CardGridSection", label: "Card Grid" },
  ];

  const handleAddSection = (type: SectionType) => {
    if (sections.length === 0) {
      addFirstSection(type);
    } else {
      addSectionAfter(sections.length - 1, type);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-background text-foreground min-h-screen w-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <LayoutLines />
      <EditModeIndicator
        addSectionOptions={addSectionOptions}
        onAddSection={handleAddSection}
      />

      {sections.map((section, index) => {
        const sectionControls: SectionControls = {
          canMoveUp: index > 0,
          canMoveDown: index < sections.length - 1,
          onMoveUp: () => moveSection(index, index - 1),
          onMoveDown: () => moveSection(index, index + 1),
          onRemove: () => removeSection(index),
        };

        switch (section.type) {
          case "HeroSection":
            return (
              <EditableHero
                key={section.schema.id}
                schema={section.schema as HeroSectionSchema}
                onUpdate={(schema) => updateSectionSchema(index, schema)}
                sectionControls={sectionControls}
              />
            );
          case "CTASection":
            return (
              <EditableCTA
                key={section.schema.id}
                schema={section.schema as CTASectionSchema}
                onUpdate={(schema) => updateSectionSchema(index, schema)}
                sectionControls={sectionControls}
              />
            );
          case "CardGridSection":
            return (
              <EditableCardGrid
                key={section.schema.id}
                schema={section.schema as CardGridSectionSchema}
                onUpdate={(schema) => updateSectionSchema(index, schema)}
                sectionControls={sectionControls}
              />
            );
          default:
            return null;
        }
      })}
    </main>
  );
}
