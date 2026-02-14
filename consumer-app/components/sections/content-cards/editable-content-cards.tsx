"use client";

import {
  EditableText,
  type FieldToggleConfig,
  getDisabledFields,
  getLocalizedValue,
  isFieldEnabled,
  type LocalizedContent,
  type ContentTabField,
  type ContentCardsSectionSchema,
  useCatalyst,
  useVariantHandling,
} from "catalyst";
import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useContentDataMap } from "@/hooks/use-content-data";
import {
  type ContentType,
  CONTENT_TYPE_LABELS,
} from "@/types/content";

import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import { renderContentCard } from "./cards/render-card";
import { ContentCards } from "./content-cards";
import { ContentPicker } from "./content-picker";

// Edit mode styling
const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

// Field toggle configuration
const CONTENT_CARDS_FIELD_TOGGLES: FieldToggleConfig[] = [
  { key: "label", label: "Label" },
  { key: "heading", label: "Heading" },
  { key: "description", label: "Description" },
];

// Default tab for adding new tabs
function createDefaultTab(): ContentTabField {
  return {
    type: "contentTab",
    title: { en: "Courses" },
    contentType: "courses",
    selectedIds: [],
  };
}

interface EditableContentCardsProps {
  schema: ContentCardsSectionSchema;
  onUpdate?: (schema: ContentCardsSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

export function EditableContentCards({
  schema,
  onUpdate,
  className,
  sectionControls,
}: EditableContentCardsProps) {
  const { isEditMode, locale, personalization } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;
  const [activeIndex, setActiveIndex] = useState(0);

  // ─────────────────────────────────────────────────────────────────────────
  // Migration: detect old schema shape and convert
  // ─────────────────────────────────────────────────────────────────────────

  const hasMigrated = useRef(false);
  useEffect(() => {
    if (hasMigrated.current || !onUpdate) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawTabs = fields.tabs.value as any[];
    const needsMigration = rawTabs.some((tab) => "cards" in tab && !("contentType" in tab));
    if (needsMigration) {
      hasMigrated.current = true;
      const migratedTabs: ContentTabField[] = rawTabs.map((tab) => {
        if ("cards" in tab && !("contentType" in tab)) {
          return {
            type: "contentTab" as const,
            title: tab.title,
            contentType: "courses",
            selectedIds: [] as string[],
          };
        }
        return tab as ContentTabField;
      });
      onUpdate({
        ...schema,
        fields: {
          ...schema.fields,
          tabs: { ...schema.fields.tabs, value: migratedTabs },
        },
      });
    }
  }, [fields.tabs.value, onUpdate, schema]);

  // ─────────────────────────────────────────────────────────────────────────
  // Data fetching
  // ─────────────────────────────────────────────────────────────────────────

  const tabs = fields.tabs.value as ContentTabField[];

  // In edit mode fetch all types (for the picker); in view mode only used types
  const allTypes: ContentType[] = ["courses", "projects", "assessments", "learning_paths"];
  const usedTypes = [...new Set(tabs.map((t) => t.contentType as ContentType))];
  const typesToFetch = isEditMode ? allTypes : usedTypes;

  const { dataMap, loading } = useContentDataMap(typesToFetch);

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const resolvedDisabledFields = getDisabledFields(schema, editingVariant);

  const handleToggleField = (fieldKey: string) => {
    if (!onUpdate) return;

    const currentDisabled = [...resolvedDisabledFields];
    const isCurrentlyDisabled = currentDisabled.includes(fieldKey);

    const updatedDisabled = isCurrentlyDisabled
      ? currentDisabled.filter((key) => key !== fieldKey)
      : [...currentDisabled, fieldKey];

    const cleanDisabled =
      updatedDisabled.length > 0 ? updatedDisabled : undefined;

    if (editingVariant) {
      const updatedVariantDisabled = {
        ...schema.variantDisabledFields,
      };
      if (cleanDisabled) {
        updatedVariantDisabled[editingVariant] = cleanDisabled;
      } else {
        delete updatedVariantDisabled[editingVariant];
      }
      const updatedSchema: ContentCardsSectionSchema = {
        ...schema,
        variantDisabledFields:
          Object.keys(updatedVariantDisabled).length > 0
            ? updatedVariantDisabled
            : undefined,
      };
      onUpdate(updatedSchema);
    } else {
      const updatedSchema: ContentCardsSectionSchema = {
        ...schema,
        disabledFields: cleanDisabled,
      };
      onUpdate(updatedSchema);
    }
  };

  const handleLabelUpdate = (content: LocalizedContent) => {
    updateField("label", content, onUpdate);
  };

  const handleHeadingUpdate = (content: LocalizedContent) => {
    updateField("heading", content, onUpdate);
  };

  const handleDescriptionUpdate = (content: LocalizedContent) => {
    updateField("description", content, onUpdate);
  };

  const handleTabTitleUpdate = (
    tabIndex: number,
    content: LocalizedContent,
  ) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex] = { ...updatedTabs[tabIndex], title: content };
    updateField("tabs", updatedTabs, onUpdate);
  };

  const handleContentTypeChange = (tabIndex: number, newType: ContentType) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex] = {
      ...updatedTabs[tabIndex],
      contentType: newType,
      selectedIds: [],
      title: { ...updatedTabs[tabIndex].title, en: CONTENT_TYPE_LABELS[newType] },
    };
    updateField("tabs", updatedTabs, onUpdate);
  };

  const handleSelectionChange = (tabIndex: number, ids: string[]) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex] = { ...updatedTabs[tabIndex], selectedIds: ids };
    updateField("tabs", updatedTabs, onUpdate);
  };

  const handleAddTab = () => {
    const updatedTabs = [...tabs, createDefaultTab()];
    updateField("tabs", updatedTabs, onUpdate);
    setActiveIndex(updatedTabs.length - 1);
  };

  const handleRemoveTab = (index: number) => {
    const updatedTabs = tabs.filter((_, i) => i !== index);
    updateField("tabs", updatedTabs, onUpdate);
    if (activeIndex >= updatedTabs.length) {
      setActiveIndex(Math.max(0, updatedTabs.length - 1));
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Resolve cards from API data
  // ─────────────────────────────────────────────────────────────────────────

  const resolveCards = (tab: ContentTabField) => {
    const ct = tab.contentType as ContentType;
    const items = dataMap[ct] ?? [];
    const selected = items.filter((item) => tab.selectedIds.includes(item.id));
    return selected.map((item) => renderContentCard(ct, item));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────────────────

  const activeVariant = isEditMode ? editingVariant : personalization.segment;

  if (!isEditMode) {
    if (loading) return null;

    const viewTabs = tabs.map((tab) => ({
      title: getLocalizedValue(tab.title, locale),
      cards: resolveCards(tab),
    }));

    return (
      <ContentCards
        label={
          isFieldEnabled(schema, "label", activeVariant)
            ? getLocalizedValue(fields.label.value, locale)
            : undefined
        }
        heading={
          isFieldEnabled(schema, "heading", activeVariant)
            ? getLocalizedValue(fields.heading.value, locale)
            : undefined
        }
        description={
          isFieldEnabled(schema, "description", activeVariant)
            ? getLocalizedValue(fields.description.value, locale)
            : undefined
        }
        tabs={viewTabs}
        className={className}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Edit Mode
  // ─────────────────────────────────────────────────────────────────────────

  const editTabs = tabs.map((tab, tabIndex) => {
    const ct = tab.contentType as ContentType;
    const allItems = dataMap[ct] ?? [];
    const cards = resolveCards(tab);

    return {
      title: (
        <div className="flex items-center gap-2">
          <EditableText
            content={tab.title}
            onUpdate={(content) => handleTabTitleUpdate(tabIndex, content)}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
          {tabs.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTab(tabIndex);
              }}
              className="flex size-4 items-center justify-center rounded-full text-red-400 opacity-0 transition hover:text-red-300 group-hover:opacity-100"
              aria-label="Remove tab"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      ),
      cards: [
        ...cards,
        // Picker trigger card
        <div
          key="picker"
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#1E293B] bg-[#0F1629]/50 p-5 transition-colors hover:border-[#3B82F6]/30"
        >
          <p className="text-xs text-[#94A3B8]">
            {tab.selectedIds.length} of {allItems.length} selected
          </p>
          <ContentPicker
            contentType={ct}
            selectedIds={tab.selectedIds}
            availableItems={allItems}
            onContentTypeChange={(type) =>
              handleContentTypeChange(tabIndex, type)
            }
            onSelectionChange={(ids) =>
              handleSelectionChange(tabIndex, ids)
            }
          />
        </div>,
      ],
    };
  });

  return (
    <ContentCards
      className={className}
      activeIndex={activeIndex}
      onActiveIndexChange={setActiveIndex}
      editBar={
        <SectionEditBar
          sectionType={schema.type}
          controls={sectionControls}
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
          fieldToggles={CONTENT_CARDS_FIELD_TOGGLES}
          disabledFields={resolvedDisabledFields}
          onToggleField={handleToggleField}
        />
      }
      label={
        isFieldEnabled(schema, "label", activeVariant) ? (
          <EditableText
            content={fields.label.value}
            onUpdate={handleLabelUpdate}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        ) : undefined
      }
      heading={
        isFieldEnabled(schema, "heading", activeVariant) ? (
          <EditableText
            content={fields.heading.value}
            onUpdate={handleHeadingUpdate}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        ) : undefined
      }
      description={
        isFieldEnabled(schema, "description", activeVariant) ? (
          <EditableText
            content={fields.description.value}
            onUpdate={handleDescriptionUpdate}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        ) : undefined
      }
      tabs={editTabs}
      addTabButton={
        <button
          type="button"
          onClick={handleAddTab}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <Plus className="size-3.5" />
          Add
        </button>
      }
    />
  );
}
