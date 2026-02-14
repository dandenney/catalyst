"use client";

import {
  EditableImage,
  EditableText,
  type FieldToggleConfig,
  getDisabledFields,
  getLocalizedValue,
  isFieldEnabled,
  type LocalizedContent,
  type TabItemField,
  type TabbedContentSectionSchema,
  useCatalyst,
  useVariantHandling,
} from "catalyst";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import { TabbedContent } from "./tabbed-content";

// Edit mode styling
const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

// Field toggle configuration
const TABBED_CONTENT_FIELD_TOGGLES: FieldToggleConfig[] = [
  { key: "label", label: "Label" },
  { key: "heading", label: "Heading" },
  { key: "description", label: "Description" },
];

// Default tab for adding new tabs
function createDefaultTab(): TabItemField {
  return {
    type: "tabItem",
    title: { en: "New tab" },
    description: { en: "Add a description for this tab." },
    image: {
      type: "image",
      src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      alt: { en: "New tab image" },
    },
  };
}

interface EditableTabbedContentProps {
  schema: TabbedContentSectionSchema;
  onUpdate?: (schema: TabbedContentSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

export function EditableTabbedContent({
  schema,
  onUpdate,
  className,
  sectionControls,
}: EditableTabbedContentProps) {
  const { isEditMode, locale, personalization } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;
  const [activeIndex, setActiveIndex] = useState(0);

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
      const updatedSchema: TabbedContentSectionSchema = {
        ...schema,
        variantDisabledFields:
          Object.keys(updatedVariantDisabled).length > 0
            ? updatedVariantDisabled
            : undefined,
      };
      onUpdate(updatedSchema);
    } else {
      const updatedSchema: TabbedContentSectionSchema = {
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

  const handleTabTitleUpdate = (index: number, content: LocalizedContent) => {
    const tabs = [...fields.tabs.value] as TabItemField[];
    tabs[index] = { ...tabs[index], title: content };
    updateField("tabs", tabs, onUpdate);
  };

  const handleTabDescriptionUpdate = (
    index: number,
    content: LocalizedContent,
  ) => {
    const tabs = [...fields.tabs.value] as TabItemField[];
    tabs[index] = { ...tabs[index], description: content };
    updateField("tabs", tabs, onUpdate);
  };

  const handleTabImageUpdate = (
    index: number,
    data: { src: string; alt: LocalizedContent },
  ) => {
    const tabs = [...fields.tabs.value] as TabItemField[];
    tabs[index] = {
      ...tabs[index],
      image: { type: "image", src: data.src, alt: data.alt },
    };
    updateField("tabs", tabs, onUpdate);
  };

  const handleAddTab = () => {
    const tabs = [
      ...(fields.tabs.value as TabItemField[]),
      createDefaultTab(),
    ];
    updateField("tabs", tabs, onUpdate);
    setActiveIndex(tabs.length - 1);
  };

  const handleRemoveTab = (index: number) => {
    const tabs = (fields.tabs.value as TabItemField[]).filter(
      (_, i) => i !== index,
    );
    updateField("tabs", tabs, onUpdate);
    if (activeIndex >= tabs.length) {
      setActiveIndex(Math.max(0, tabs.length - 1));
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────────────────

  const activeVariant = isEditMode ? editingVariant : personalization.segment;

  if (!isEditMode) {
    const tabs = (fields.tabs.value as TabItemField[]).map((tab) => ({
      title: getLocalizedValue(tab.title, locale),
      description: getLocalizedValue(tab.description, locale),
      image: tab.image?.src ? (
        <img
          src={tab.image.src}
          alt={getLocalizedValue(tab.image.alt, locale)}
          className="h-full w-full object-cover"
        />
      ) : undefined,
    }));

    return (
      <TabbedContent
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
        tabs={tabs}
        className={className}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Edit Mode
  // ─────────────────────────────────────────────────────────────────────────

  const editTabs = (fields.tabs.value as TabItemField[]).map((tab, index) => ({
    title: (
      <EditableText
        content={tab.title}
        onUpdate={(content) => handleTabTitleUpdate(index, content)}
        editClassName={EDIT_CLASS}
        editingClassName={EDITING_CLASS}
      />
    ),
    description: (
      <EditableText
        content={tab.description}
        onUpdate={(content) => handleTabDescriptionUpdate(index, content)}
        editClassName={EDIT_CLASS}
        editingClassName={EDITING_CLASS}
      />
    ),
    image: tab.image?.src ? (
      <EditableImage
        src={tab.image.src}
        alt={tab.image.alt}
        onUpdate={(data) => handleTabImageUpdate(index, data)}
        className="h-full w-full object-cover"
      />
    ) : undefined,
    onRemove:
      (fields.tabs.value as TabItemField[]).length > 1
        ? () => handleRemoveTab(index)
        : undefined,
  }));

  return (
    <TabbedContent
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
          fieldToggles={TABBED_CONTENT_FIELD_TOGGLES}
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
          className="flex w-full items-center gap-2 border-l-2 border-dashed border-muted-foreground/30 py-4 pl-5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Plus className="size-4" />
          Add tab
        </button>
      }
    />
  );
}
