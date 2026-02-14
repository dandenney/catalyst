"use client";

import {
  EditableImage,
  EditableText,
  type FieldToggleConfig,
  getDisabledFields,
  getLocalizedValue,
  isFieldEnabled,
  type LocalizedContent,
  type ContentCardItemField,
  type ContentTabField,
  type ContentCardsSectionSchema,
  useCatalyst,
  useVariantHandling,
} from "catalyst";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import { ContentCards } from "./content-cards";

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

// Default card for adding new cards
function createDefaultCard(): ContentCardItemField {
  return {
    type: "contentCardItem",
    title: { en: "New course" },
    description: { en: "Add a description for this course." },
    tag: { en: "Beginner · 4 hours" },
    image: {
      type: "image",
      src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      alt: { en: "Course image" },
    },
  };
}

// Default tab for adding new tabs
function createDefaultTab(): ContentTabField {
  return {
    type: "contentTab",
    title: { en: "New category" },
    cards: [createDefaultCard()],
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
    const tabs = [...fields.tabs.value] as ContentTabField[];
    tabs[tabIndex] = { ...tabs[tabIndex], title: content };
    updateField("tabs", tabs, onUpdate);
  };

  const handleCardTitleUpdate = (
    tabIndex: number,
    cardIndex: number,
    content: LocalizedContent,
  ) => {
    const tabs = [...fields.tabs.value] as ContentTabField[];
    const cards = [...tabs[tabIndex].cards];
    cards[cardIndex] = { ...cards[cardIndex], title: content };
    tabs[tabIndex] = { ...tabs[tabIndex], cards };
    updateField("tabs", tabs, onUpdate);
  };

  const handleCardDescriptionUpdate = (
    tabIndex: number,
    cardIndex: number,
    content: LocalizedContent,
  ) => {
    const tabs = [...fields.tabs.value] as ContentTabField[];
    const cards = [...tabs[tabIndex].cards];
    cards[cardIndex] = { ...cards[cardIndex], description: content };
    tabs[tabIndex] = { ...tabs[tabIndex], cards };
    updateField("tabs", tabs, onUpdate);
  };

  const handleCardTagUpdate = (
    tabIndex: number,
    cardIndex: number,
    content: LocalizedContent,
  ) => {
    const tabs = [...fields.tabs.value] as ContentTabField[];
    const cards = [...tabs[tabIndex].cards];
    cards[cardIndex] = { ...cards[cardIndex], tag: content };
    tabs[tabIndex] = { ...tabs[tabIndex], cards };
    updateField("tabs", tabs, onUpdate);
  };

  const handleCardImageUpdate = (
    tabIndex: number,
    cardIndex: number,
    data: { src: string; alt: LocalizedContent },
  ) => {
    const tabs = [...fields.tabs.value] as ContentTabField[];
    const cards = [...tabs[tabIndex].cards];
    cards[cardIndex] = {
      ...cards[cardIndex],
      image: { type: "image", src: data.src, alt: data.alt },
    };
    tabs[tabIndex] = { ...tabs[tabIndex], cards };
    updateField("tabs", tabs, onUpdate);
  };

  const handleAddTab = () => {
    const tabs = [
      ...(fields.tabs.value as ContentTabField[]),
      createDefaultTab(),
    ];
    updateField("tabs", tabs, onUpdate);
    setActiveIndex(tabs.length - 1);
  };

  const handleRemoveTab = (index: number) => {
    const tabs = (fields.tabs.value as ContentTabField[]).filter(
      (_, i) => i !== index,
    );
    updateField("tabs", tabs, onUpdate);
    if (activeIndex >= tabs.length) {
      setActiveIndex(Math.max(0, tabs.length - 1));
    }
  };

  const handleAddCard = (tabIndex: number) => {
    const tabs = [...fields.tabs.value] as ContentTabField[];
    tabs[tabIndex] = {
      ...tabs[tabIndex],
      cards: [...tabs[tabIndex].cards, createDefaultCard()],
    };
    updateField("tabs", tabs, onUpdate);
  };

  const handleRemoveCard = (tabIndex: number, cardIndex: number) => {
    const tabs = [...fields.tabs.value] as ContentTabField[];
    const cards = tabs[tabIndex].cards.filter((_, i) => i !== cardIndex);
    tabs[tabIndex] = { ...tabs[tabIndex], cards };
    updateField("tabs", tabs, onUpdate);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────────────────

  const activeVariant = isEditMode ? editingVariant : personalization.segment;

  if (!isEditMode) {
    const viewTabs = (fields.tabs.value as ContentTabField[]).map((tab) => ({
      title: getLocalizedValue(tab.title, locale),
      cards: tab.cards.map((card) => ({
        title: getLocalizedValue(card.title, locale),
        description: getLocalizedValue(card.description, locale),
        tag: getLocalizedValue(card.tag, locale),
        image: card.image?.src ? (
          <img
            src={card.image.src}
            alt={getLocalizedValue(card.image.alt, locale)}
            className="h-full w-full object-cover"
          />
        ) : undefined,
      })),
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

  const editTabs = (fields.tabs.value as ContentTabField[]).map(
    (tab, tabIndex) => ({
      title: (
        <EditableText
          content={tab.title}
          onUpdate={(content) => handleTabTitleUpdate(tabIndex, content)}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      ),
      cards: tab.cards.map((card, cardIndex) => ({
        title: (
          <EditableText
            content={card.title}
            onUpdate={(content) =>
              handleCardTitleUpdate(tabIndex, cardIndex, content)
            }
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        ),
        description: (
          <EditableText
            content={card.description}
            onUpdate={(content) =>
              handleCardDescriptionUpdate(tabIndex, cardIndex, content)
            }
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        ),
        tag: (
          <EditableText
            content={card.tag}
            onUpdate={(content) =>
              handleCardTagUpdate(tabIndex, cardIndex, content)
            }
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        ),
        image: card.image?.src ? (
          <div className="group/cardimg relative h-full w-full">
            <EditableImage
              src={card.image.src}
              alt={card.image.alt}
              onUpdate={(data) =>
                handleCardImageUpdate(tabIndex, cardIndex, data)
              }
              className="h-full w-full object-cover"
            />
            {tab.cards.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveCard(tabIndex, cardIndex)}
                className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-lg transition hover:bg-red-500 group-hover/cardimg:opacity-100"
                aria-label="Remove card"
                title="Remove card"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        ) : undefined,
      })),
      onRemove:
        (fields.tabs.value as ContentTabField[]).length > 1
          ? () => handleRemoveTab(tabIndex)
          : undefined,
    }),
  );

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
