"use client";

import {
  type CardGridSectionSchema,
  type CardItemField,
  EditableImage,
  EditableText,
  type FieldToggleConfig,
  getDisabledFields,
  getLocalizedValue,
  isFieldEnabled,
  type Locale,
  type LocalizedContent,
  useCatalyst,
  useVariantHandling,
} from "catalyst";
import { ExternalLink, Plus, Settings } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import { Switch } from "../../ui/switch";
import { CardGrid } from "./card-grid";
import { CardGridCard } from "./card-grid-card";

// Edit mode styling
const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

// Field toggle configuration
const CARD_GRID_FIELD_TOGGLES: FieldToggleConfig[] = [
  { key: "heading", label: "Heading" },
  { key: "subtitle", label: "Subtitle" },
];

// Default card for adding new cards
function createDefaultCard(): CardItemField {
  return {
    type: "cardItem",
    image: {
      type: "image",
      src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      alt: { en: "New card image" },
    },
    title: { en: "New Card" },
    description: { en: "Add a description for this card." },
    linkText: { en: "Learn more" },
    linkUrl: { en: "#" },
  };
}

interface EditableCardGridProps {
  schema: CardGridSectionSchema;
  onUpdate?: (schema: CardGridSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-card link editor (separate component to manage popover state)
// ─────────────────────────────────────────────────────────────────────────────

interface CardLinkEditorProps {
  card: CardItemField;
  ctaStyle: "link" | "button";
  locale: Locale;
  onSave: (data: {
    linkText: LocalizedContent;
    linkUrl: LocalizedContent;
    openInNewWindow?: boolean;
  }) => void;
}

function CardLinkEditor({
  card,
  ctaStyle,
  locale,
  onSave,
}: CardLinkEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editText, setEditText] = useState(
    getLocalizedValue(card.linkText, locale),
  );
  const [editUrl, setEditUrl] = useState(
    getLocalizedValue(card.linkUrl, locale),
  );
  const [editOpenInNewWindow, setEditOpenInNewWindow] = useState(
    card.openInNewWindow ?? false,
  );

  const displayText = getLocalizedValue(card.linkText, locale);

  useEffect(() => {
    if (!isOpen) {
      setEditText(getLocalizedValue(card.linkText, locale));
      setEditUrl(getLocalizedValue(card.linkUrl, locale));
      setEditOpenInNewWindow(card.openInNewWindow ?? false);
    }
  }, [card.linkText, card.linkUrl, card.openInNewWindow, locale, isOpen]);

  const handleSave = useCallback(() => {
    onSave({
      linkText: { ...card.linkText, [locale]: editText },
      linkUrl: { ...card.linkUrl, [locale]: editUrl },
      openInNewWindow: editOpenInNewWindow || undefined,
    });
    setIsOpen(false);
  }, [
    editText,
    editUrl,
    editOpenInNewWindow,
    card.linkText,
    card.linkUrl,
    locale,
    onSave,
  ]);

  const handleCancel = useCallback(() => {
    setEditText(getLocalizedValue(card.linkText, locale));
    setEditUrl(getLocalizedValue(card.linkUrl, locale));
    setEditOpenInNewWindow(card.openInNewWindow ?? false);
    setIsOpen(false);
  }, [card.linkText, card.linkUrl, card.openInNewWindow, locale]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
      if (e.key === "Enter" && e.metaKey) handleSave();
    },
    [handleCancel, handleSave],
  );

  const ctaElement =
    ctaStyle === "button" ? (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
          EDIT_CLASS,
          isOpen && EDITING_CLASS,
        )}
        title="Click to edit link"
      >
        {displayText}
        {card.openInNewWindow && <ExternalLink className="size-3" />}
      </button>
    ) : (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-semibold text-blue-lighter",
          EDIT_CLASS,
          isOpen && EDITING_CLASS,
        )}
        title="Click to edit link"
      >
        {displayText}
        {card.openInNewWindow && <ExternalLink className="size-3" />}
      </button>
    );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{ctaElement}</PopoverTrigger>
      <PopoverContent className="w-80" onKeyDown={handleKeyDown}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-link-text">
              Link Text ({locale.toUpperCase()})
            </Label>
            <Input
              id="card-link-text"
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Learn more"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-link-url">
              URL ({locale.toUpperCase()})
            </Label>
            <Input
              id="card-link-url"
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="card-link-new-window"
              className="cursor-pointer text-sm"
            >
              Open in new window
            </Label>
            <Switch
              id="card-link-new-window"
              checked={editOpenInNewWindow}
              onCheckedChange={setEditOpenInNewWindow}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Cmd+Enter to save, Esc to cancel
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Column selector skeleton UX
// ─────────────────────────────────────────────────────────────────────────────

function ColumnOption({ count, selected }: { count: number; selected: boolean }) {
  return (
    <div
      className={cn(
        "flex gap-1 rounded-md border-2 p-2 transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-muted hover:border-muted-foreground/30",
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-8 flex-1 rounded-sm",
            selected ? "bg-primary/20" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function EditableCardGrid({
  schema,
  onUpdate,
  className,
  sectionControls,
}: EditableCardGridProps) {
  const { isEditMode, locale, personalization } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;
  const { settings } = schema;

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
      const updatedSchema: CardGridSectionSchema = {
        ...schema,
        variantDisabledFields:
          Object.keys(updatedVariantDisabled).length > 0
            ? updatedVariantDisabled
            : undefined,
      };
      onUpdate(updatedSchema);
    } else {
      const updatedSchema: CardGridSectionSchema = {
        ...schema,
        disabledFields: cleanDisabled,
      };
      onUpdate(updatedSchema);
    }
  };

  const handleHeadingUpdate = (content: LocalizedContent) => {
    updateField("heading", content, onUpdate);
  };

  const handleSubtitleUpdate = (content: LocalizedContent) => {
    updateField("subtitle", content, onUpdate);
  };

  const handleSettingsUpdate = (key: string, value: unknown) => {
    if (!onUpdate) return;
    const updatedSchema: CardGridSectionSchema = {
      ...schema,
      settings: { ...schema.settings, [key]: value },
    };
    onUpdate(updatedSchema);
  };

  const handleCardImageUpdate = (
    index: number,
    data: { src: string; alt: LocalizedContent },
  ) => {
    const cards = [...fields.cards.value] as CardItemField[];
    cards[index] = {
      ...cards[index],
      image: { ...cards[index].image, src: data.src, alt: data.alt },
    };
    updateField("cards", cards, onUpdate);
  };

  const handleCardTitleUpdate = (index: number, content: LocalizedContent) => {
    const cards = [...fields.cards.value] as CardItemField[];
    cards[index] = { ...cards[index], title: content };
    updateField("cards", cards, onUpdate);
  };

  const handleCardDescriptionUpdate = (
    index: number,
    content: LocalizedContent,
  ) => {
    const cards = [...fields.cards.value] as CardItemField[];
    cards[index] = { ...cards[index], description: content };
    updateField("cards", cards, onUpdate);
  };

  const handleCardLinkUpdate = (
    index: number,
    data: {
      linkText: LocalizedContent;
      linkUrl: LocalizedContent;
      openInNewWindow?: boolean;
    },
  ) => {
    const cards = [...fields.cards.value] as CardItemField[];
    cards[index] = { ...cards[index], ...data };
    updateField("cards", cards, onUpdate);
  };

  const handleAddCard = () => {
    const cards = [...(fields.cards.value as CardItemField[]), createDefaultCard()];
    updateField("cards", cards, onUpdate);
  };

  const handleRemoveCard = (index: number) => {
    const cards = (fields.cards.value as CardItemField[]).filter(
      (_, i) => i !== index,
    );
    updateField("cards", cards, onUpdate);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────────────────

  const activeVariant = isEditMode ? editingVariant : personalization.segment;

  if (!isEditMode) {
    const cards = (fields.cards.value as CardItemField[]).map((card, index) => {
      const linkText = getLocalizedValue(card.linkText, locale);
      const linkUrl = getLocalizedValue(card.linkUrl, locale);

      const ctaElement =
        settings.ctaStyle === "button" ? (
          <a
            href={linkUrl}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            {...(card.openInNewWindow && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
          >
            {linkText}
            {card.openInNewWindow && <ExternalLink className="size-3" />}
          </a>
        ) : (
          <a
            href={linkUrl}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-lighter"
            {...(card.openInNewWindow && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
          >
            {linkText}
            {card.openInNewWindow && <ExternalLink className="size-3" />}
          </a>
        );

      return (
        <CardGridCard
          key={index}
          imageMode={settings.imageMode}
          theme={settings.theme}
          image={
            <img
              src={card.image.src}
              alt={getLocalizedValue(card.image.alt, locale)}
              className={cn(
                "w-full object-cover",
                settings.imageMode === "squared" && "aspect-square",
              )}
            />
          }
          title={getLocalizedValue(card.title, locale)}
          description={getLocalizedValue(card.description, locale)}
          cta={ctaElement}
        />
      );
    });

    return (
      <CardGrid
        heading={
          isFieldEnabled(schema, "heading", activeVariant)
            ? getLocalizedValue(fields.heading.value, locale)
            : undefined
        }
        subtitle={
          isFieldEnabled(schema, "subtitle", activeVariant)
            ? getLocalizedValue(fields.subtitle.value, locale)
            : undefined
        }
        cards={cards}
        maxPerRow={settings.maxPerRow}
        theme={settings.theme}
        className={className}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Edit Mode
  // ─────────────────────────────────────────────────────────────────────────

  const settingsPanel = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
        <Settings className="size-3.5" />
        Settings
      </div>

      {/* Columns */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Columns</Label>
        <RadioGroup
          value={String(settings.maxPerRow)}
          onValueChange={(v) => handleSettingsUpdate("maxPerRow", Number(v))}
          className="grid grid-cols-3 gap-2"
        >
          {([2, 3, 4] as const).map((count) => (
            <label key={count} className="cursor-pointer">
              <RadioGroupItem value={String(count)} className="sr-only" />
              <ColumnOption
                count={count}
                selected={settings.maxPerRow === count}
              />
              <span className="mt-1 block text-center text-xs text-muted-foreground">
                {count}
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Image Mode */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Image Mode</Label>
        <RadioGroup
          value={settings.imageMode}
          onValueChange={(v) => handleSettingsUpdate("imageMode", v)}
          className="flex gap-4"
        >
          <label className="flex cursor-pointer items-center gap-2">
            <RadioGroupItem value="natural" />
            <span className="text-sm">Natural</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <RadioGroupItem value="squared" />
            <span className="text-sm">Squared (1:1)</span>
          </label>
        </RadioGroup>
      </div>

      {/* CTA Style */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">CTA Style</Label>
        <RadioGroup
          value={settings.ctaStyle}
          onValueChange={(v) => handleSettingsUpdate("ctaStyle", v)}
          className="flex gap-4"
        >
          <label className="flex cursor-pointer items-center gap-2">
            <RadioGroupItem value="link" />
            <span className="text-sm">Text link</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <RadioGroupItem value="button" />
            <span className="text-sm">Outlined button</span>
          </label>
        </RadioGroup>
      </div>

      {/* Theme */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Theme</Label>
        <RadioGroup
          value={settings.theme}
          onValueChange={(v) => handleSettingsUpdate("theme", v)}
          className="flex gap-4"
        >
          <label className="flex cursor-pointer items-center gap-2">
            <RadioGroupItem value="light" />
            <span className="text-sm">Light</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <RadioGroupItem value="dark" />
            <span className="text-sm">Dark</span>
          </label>
        </RadioGroup>
      </div>
    </div>
  );

  const editCards = (fields.cards.value as CardItemField[]).map(
    (card, index) => (
      <CardGridCard
        key={index}
        imageMode={settings.imageMode}
        theme={settings.theme}
        onRemove={() => handleRemoveCard(index)}
        image={
          <EditableImage
            src={card.image.src}
            alt={card.image.alt}
            onUpdate={(data) => handleCardImageUpdate(index, data)}
            className={cn(
              "w-full object-cover",
              settings.imageMode === "squared" && "aspect-square",
            )}
          />
        }
        title={
          <EditableText
            content={card.title}
            onUpdate={(content) => handleCardTitleUpdate(index, content)}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        }
        description={
          <EditableText
            content={card.description}
            onUpdate={(content) =>
              handleCardDescriptionUpdate(index, content)
            }
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        }
        cta={
          <CardLinkEditor
            card={card}
            ctaStyle={settings.ctaStyle}
            locale={locale}
            onSave={(data) => handleCardLinkUpdate(index, data)}
          />
        }
      />
    ),
  );

  return (
    <CardGrid
      className={className}
      maxPerRow={settings.maxPerRow}
      theme={settings.theme}
      editBar={
        <SectionEditBar
          sectionType={schema.type}
          controls={sectionControls}
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
          fieldToggles={CARD_GRID_FIELD_TOGGLES}
          disabledFields={resolvedDisabledFields}
          onToggleField={handleToggleField}
          settingsPanel={settingsPanel}
        />
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
      subtitle={
        isFieldEnabled(schema, "subtitle", activeVariant) ? (
          <EditableText
            content={fields.subtitle.value}
            onUpdate={handleSubtitleUpdate}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        ) : undefined
      }
      cards={editCards}
      addCardButton={
        <button
          type="button"
          onClick={handleAddCard}
          className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="size-8" />
            <span className="text-sm font-medium">Add card</span>
          </div>
        </button>
      }
    />
  );
}
