"use client";

import {
  EditableImage,
  EditableText,
  type FeatureBulletField,
  type FeatureSetField,
  type FeaturesSectionSchema,
  type FieldToggleConfig,
  getDisabledFields,
  getLocalizedValue,
  type ImageField,
  isFieldEnabled,
  type Locale,
  type LocalizedContent,
  useCatalyst,
  useVariantHandling,
} from "catalyst";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getIconComponent } from "@/lib/icon-registry";

import { Button } from "../../ui/button";
import { IconPicker } from "../../ui/icon-picker";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import { Features } from "./features";

// Edit mode styling
const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

// Field toggle configuration
const FEATURES_FIELD_TOGGLES: FieldToggleConfig[] = [
  { key: "label", label: "Label" },
  { key: "title", label: "Heading" },
  { key: "description", label: "Description" },
];

// Default factories
function createDefaultBullet(): FeatureBulletField {
  return {
    type: "featureBullet",
    icon: { type: "icon", iconKey: "sparkles" },
    text: { en: "New bullet point" },
  };
}

function createDefaultFeatureSet(): FeatureSetField {
  return {
    type: "featureSet",
    title: { en: "New feature" },
    description: { en: "Add a description for this feature." },
    bullets: [createDefaultBullet()],
    ctaText: { en: "Learn more" },
    ctaUrl: { en: "#" },
    image: {
      type: "image",
      src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
      alt: { en: "Feature image" },
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-bullet icon editor popover
// ─────────────────────────────────────────────────────────────────────────────

interface BulletEditorProps {
  bullet: FeatureBulletField;
  onSave: (updated: FeatureBulletField) => void;
}

function BulletEditor({ bullet, onSave }: BulletEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editIconKey, setEditIconKey] = useState(bullet.icon.iconKey);

  useEffect(() => {
    if (!isOpen) {
      setEditIconKey(bullet.icon.iconKey);
    }
  }, [bullet, isOpen]);

  const handleSave = useCallback(() => {
    onSave({
      ...bullet,
      icon: { type: "icon", iconKey: editIconKey },
    });
    setIsOpen(false);
  }, [bullet, editIconKey, onSave]);

  const handleCancel = useCallback(() => {
    setEditIconKey(bullet.icon.iconKey);
    setIsOpen(false);
  }, [bullet]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
      if (e.key === "Enter" && e.metaKey) handleSave();
    },
    [handleCancel, handleSave],
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="absolute -left-1 -top-1 z-10 flex size-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-500 opacity-0 group-hover/bullet:opacity-100"
          title="Edit icon"
        >
          <Pencil className="size-2.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72" onKeyDown={handleKeyDown}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Icon</Label>
            <IconPicker
              value={editIconKey}
              onSelect={setEditIconKey}
              className="[&>div:last-child]:max-h-[120px]"
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
// Per-set CTA editor popover
// ─────────────────────────────────────────────────────────────────────────────

interface SetCtaEditorProps {
  ctaText?: LocalizedContent;
  ctaUrl?: LocalizedContent;
  locale: Locale;
  onSave: (ctaText?: LocalizedContent, ctaUrl?: LocalizedContent) => void;
}

function SetCtaEditor({ ctaText, ctaUrl, locale, onSave }: SetCtaEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editText, setEditText] = useState(
    ctaText ? getLocalizedValue(ctaText, locale) : "",
  );
  const [editUrl, setEditUrl] = useState(
    ctaUrl ? getLocalizedValue(ctaUrl, locale) : "",
  );

  useEffect(() => {
    if (!isOpen) {
      setEditText(ctaText ? getLocalizedValue(ctaText, locale) : "");
      setEditUrl(ctaUrl ? getLocalizedValue(ctaUrl, locale) : "");
    }
  }, [ctaText, ctaUrl, locale, isOpen]);

  const handleSave = useCallback(() => {
    if (editText.trim()) {
      onSave(
        { ...(ctaText || { en: "" }), [locale]: editText },
        { ...(ctaUrl || { en: "" }), [locale]: editUrl },
      );
    } else {
      onSave(undefined, undefined);
    }
    setIsOpen(false);
  }, [editText, editUrl, ctaText, ctaUrl, locale, onSave]);

  const handleCancel = useCallback(() => {
    setEditText(ctaText ? getLocalizedValue(ctaText, locale) : "");
    setEditUrl(ctaUrl ? getLocalizedValue(ctaUrl, locale) : "");
    setIsOpen(false);
  }, [ctaText, ctaUrl, locale]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
      if (e.key === "Enter" && e.metaKey) handleSave();
    },
    [handleCancel, handleSave],
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-500"
          title="Edit CTA"
        >
          <Pencil className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72" onKeyDown={handleKeyDown}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cta-text">
              Button Text ({locale.toUpperCase()})
            </Label>
            <Input
              id="cta-text"
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Learn more"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta-url">URL ({locale.toUpperCase()})</Label>
            <Input
              id="cta-url"
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="https://example.com"
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
            Clear text to remove CTA. Cmd+Enter to save, Esc to cancel
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface EditableFeaturesProps {
  schema: FeaturesSectionSchema;
  onUpdate?: (schema: FeaturesSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

export function EditableFeatures({
  schema,
  onUpdate,
  className,
  sectionControls,
}: EditableFeaturesProps) {
  const { isEditMode, locale, personalization } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

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
      const updatedSchema: FeaturesSectionSchema = {
        ...schema,
        variantDisabledFields:
          Object.keys(updatedVariantDisabled).length > 0
            ? updatedVariantDisabled
            : undefined,
      };
      onUpdate(updatedSchema);
    } else {
      const updatedSchema: FeaturesSectionSchema = {
        ...schema,
        disabledFields: cleanDisabled,
      };
      onUpdate(updatedSchema);
    }
  };

  const handleLabelUpdate = (content: LocalizedContent) => {
    updateField("label", content, onUpdate);
  };

  const handleTitleUpdate = (content: LocalizedContent) => {
    updateField("title", content, onUpdate);
  };

  const handleDescriptionUpdate = (content: LocalizedContent) => {
    updateField("description", content, onUpdate);
  };

  // Per-set handlers
  const getSets = () => [...fields.sets.value] as FeatureSetField[];

  const handleSetTitleUpdate = (
    setIndex: number,
    content: LocalizedContent,
  ) => {
    const sets = getSets();
    sets[setIndex] = { ...sets[setIndex], title: content };
    updateField("sets", sets, onUpdate);
  };

  const handleSetDescriptionUpdate = (
    setIndex: number,
    content: LocalizedContent,
  ) => {
    const sets = getSets();
    sets[setIndex] = { ...sets[setIndex], description: content };
    updateField("sets", sets, onUpdate);
  };

  const handleSetImageUpdate = (
    setIndex: number,
    data: { src: string; alt: LocalizedContent },
  ) => {
    const sets = getSets();
    const updatedImage: ImageField = {
      type: "image",
      src: data.src,
      alt: data.alt,
    };
    sets[setIndex] = { ...sets[setIndex], image: updatedImage };
    updateField("sets", sets, onUpdate);
  };

  const handleSetCtaUpdate = (
    setIndex: number,
    ctaText?: LocalizedContent,
    ctaUrl?: LocalizedContent,
  ) => {
    const sets = getSets();
    sets[setIndex] = { ...sets[setIndex], ctaText, ctaUrl };
    updateField("sets", sets, onUpdate);
  };

  // Per-bullet handlers
  const handleBulletTextUpdate = (
    setIndex: number,
    bulletIndex: number,
    content: LocalizedContent,
  ) => {
    const sets = getSets();
    const bullets = [...sets[setIndex].bullets];
    bullets[bulletIndex] = { ...bullets[bulletIndex], text: content };
    sets[setIndex] = { ...sets[setIndex], bullets };
    updateField("sets", sets, onUpdate);
  };

  const handleBulletUpdate = (
    setIndex: number,
    bulletIndex: number,
    updated: FeatureBulletField,
  ) => {
    const sets = getSets();
    const bullets = [...sets[setIndex].bullets];
    bullets[bulletIndex] = updated;
    sets[setIndex] = { ...sets[setIndex], bullets };
    updateField("sets", sets, onUpdate);
  };

  const handleAddBullet = (setIndex: number) => {
    const sets = getSets();
    const bullets = [...sets[setIndex].bullets, createDefaultBullet()];
    sets[setIndex] = { ...sets[setIndex], bullets };
    updateField("sets", sets, onUpdate);
  };

  const handleRemoveBullet = (setIndex: number, bulletIndex: number) => {
    const sets = getSets();
    const bullets = sets[setIndex].bullets.filter(
      (_, i) => i !== bulletIndex,
    );
    sets[setIndex] = { ...sets[setIndex], bullets };
    updateField("sets", sets, onUpdate);
  };

  // Set-level handlers
  const handleAddSet = () => {
    const sets = [...getSets(), createDefaultFeatureSet()];
    updateField("sets", sets, onUpdate);
  };

  const handleRemoveSet = (setIndex: number) => {
    const sets = getSets().filter((_, i) => i !== setIndex);
    updateField("sets", sets, onUpdate);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────────────────

  const activeVariant = isEditMode ? editingVariant : personalization.segment;

  if (!isEditMode) {
    const viewSets = (fields.sets.value as FeatureSetField[]).map((set) => {
      const ctaText = set.ctaText
        ? getLocalizedValue(set.ctaText, locale)
        : undefined;
      const ctaUrl = set.ctaUrl
        ? getLocalizedValue(set.ctaUrl, locale)
        : undefined;

      return {
        title: getLocalizedValue(set.title, locale),
        description: getLocalizedValue(set.description, locale),
        bullets: set.bullets.map((bullet) => {
          const IconComponent = getIconComponent(bullet.icon.iconKey);
          return {
            icon: IconComponent ? (
              <IconComponent className="size-5" />
            ) : (
              <div className="size-5" />
            ),
            text: getLocalizedValue(bullet.text, locale),
          };
        }),
        cta:
          ctaText && ctaUrl ? (
            <a
              href={ctaUrl}
              className="inline-flex items-center rounded-md border border-white/20 bg-gradient-to-b from-white to-[#C0C7D0] px-5 py-2.5 text-sm font-medium text-[#0A0E1A] transition-all duration-200 hover:from-white hover:to-white hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]"
            >
              {ctaText}
            </a>
          ) : undefined,
        image: (
          <img
            src={set.image.src}
            alt={getLocalizedValue(set.image.alt, locale)}
            className="h-full w-full object-cover"
          />
        ),
      };
    });

    return (
      <Features
        label={
          isFieldEnabled(schema, "label", activeVariant)
            ? getLocalizedValue(fields.label.value, locale)
            : undefined
        }
        title={
          isFieldEnabled(schema, "title", activeVariant)
            ? getLocalizedValue(fields.title.value, locale)
            : undefined
        }
        description={
          isFieldEnabled(schema, "description", activeVariant)
            ? getLocalizedValue(fields.description.value, locale)
            : undefined
        }
        sets={viewSets}
        className={className}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Edit Mode
  // ─────────────────────────────────────────────────────────────────────────

  const featureSets = fields.sets.value as FeatureSetField[];

  const editSets = featureSets.map((set, setIndex) => {
    const ctaText = set.ctaText
      ? getLocalizedValue(set.ctaText, locale)
      : undefined;

    return {
      title: (
        <EditableText
          content={set.title}
          onUpdate={(content) => handleSetTitleUpdate(setIndex, content)}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      ),
      description: (
        <EditableText
          content={set.description}
          onUpdate={(content) =>
            handleSetDescriptionUpdate(setIndex, content)
          }
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      ),
      bullets: set.bullets.map((bullet, bulletIndex) => {
        const IconComponent = getIconComponent(bullet.icon.iconKey);
        return {
          icon: (
            <div className="relative">
              {IconComponent ? (
                <IconComponent className="size-5" />
              ) : (
                <div className="size-5" />
              )}
              <BulletEditor
                bullet={bullet}
                onSave={(updated) =>
                  handleBulletUpdate(setIndex, bulletIndex, updated)
                }
              />
            </div>
          ),
          text: (
            <EditableText
              content={bullet.text}
              onUpdate={(content) =>
                handleBulletTextUpdate(setIndex, bulletIndex, content)
              }
              editClassName={EDIT_CLASS}
              editingClassName={EDITING_CLASS}
            />
          ),
          onRemove: () => handleRemoveBullet(setIndex, bulletIndex),
        };
      }),
      cta: (
        <div className="flex items-center gap-2">
          {ctaText ? (
            <span className="inline-flex items-center rounded-md border border-white/20 bg-gradient-to-b from-white to-[#C0C7D0] px-5 py-2.5 text-sm font-medium text-[#0A0E1A]">
              {ctaText}
            </span>
          ) : (
            <span className="text-sm text-[#94A3B8]/50 italic">No CTA</span>
          )}
          <SetCtaEditor
            ctaText={set.ctaText}
            ctaUrl={set.ctaUrl}
            locale={locale}
            onSave={(text, url) => handleSetCtaUpdate(setIndex, text, url)}
          />
        </div>
      ),
      image: (
        <EditableImage
          src={set.image.src}
          alt={set.image.alt}
          onUpdate={(data) => handleSetImageUpdate(setIndex, data)}
          className="h-full w-full object-cover"
        />
      ),
      onRemove:
        featureSets.length > 1
          ? () => handleRemoveSet(setIndex)
          : undefined,
      addBulletButton: (
        <button
          type="button"
          onClick={() => handleAddBullet(setIndex)}
          className="mt-1 flex items-center gap-1.5 text-sm text-[#94A3B8] transition-colors hover:text-[#3B82F6]"
        >
          <Plus className="size-3.5" />
          <span>Add bullet</span>
        </button>
      ),
    };
  });

  return (
    <Features
      className={className}
      editBar={
        <SectionEditBar
          sectionType={schema.type}
          controls={sectionControls}
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
          fieldToggles={FEATURES_FIELD_TOGGLES}
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
      title={
        isFieldEnabled(schema, "title", activeVariant) ? (
          <EditableText
            content={fields.title.value}
            onUpdate={handleTitleUpdate}
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
      sets={editSets}
      addSetButton={
        <button
          type="button"
          onClick={handleAddSet}
          className="flex min-h-[120px] items-center justify-center rounded-lg border-2 border-dashed border-[#1E293B] text-[#94A3B8] transition-colors hover:border-[#3B82F6]/50 hover:text-[#3B82F6]"
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="size-8" />
            <span className="text-sm font-medium">Add feature set</span>
          </div>
        </button>
      }
    />
  );
}
