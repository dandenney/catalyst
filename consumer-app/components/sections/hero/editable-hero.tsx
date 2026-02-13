"use client";

import {
  EditableImage,
  EditableText,
  type FieldToggleConfig,
  getDisabledFields,
  getLocalizedValue,
  type HeroSectionSchema,
  isFieldEnabled,
  type LocalizedContent,
  useCatalyst,
  useEditableLink,
  useVariantHandling,
} from "catalyst";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import { Hero } from "./hero";

// Edit mode styling
const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

// Button styles shared between view and edit mode
const PRIMARY_CTA_CLASS =
  "inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/20 bg-gradient-to-b from-white to-[#C0C7D0] px-5 py-2.5 text-sm font-medium text-[#0A0E1A] transition-all duration-200 hover:from-white hover:to-white hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]";

const SECONDARY_CTA_CLASS =
  "inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#1E293B] px-5 py-2.5 text-sm font-medium text-[#F1F5F9] transition-all duration-200 hover:border-[#334155] hover:bg-white/5";

// Field toggle configuration for Hero
const HERO_FIELD_TOGGLES: FieldToggleConfig[] = [
  { key: "label", label: "Label" },
  { key: "heading", label: "Heading" },
  { key: "subtitle", label: "Subtitle" },
  { key: "primaryCta", label: "Primary CTA" },
  { key: "secondaryCta", label: "Secondary CTA" },
  { key: "image", label: "Product Image" },
];

interface EditableHeroProps {
  schema: HeroSectionSchema;
  onUpdate?: (schema: HeroSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

/**
 * Editable wrapper for Hero component.
 * Injects editable elements into Hero's slots.
 * Layout is defined in Hero - this component only handles edit logic.
 */
export function EditableHero({
  schema,
  onUpdate,
  className,
  sectionControls,
}: EditableHeroProps) {
  const { isEditMode, locale, personalization } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  // Resolve which disabled fields to show in the panel based on current editing context
  const resolvedDisabledFields = getDisabledFields(schema, editingVariant);

  const handleToggleField = (fieldKey: string) => {
    if (!onUpdate) return;

    const currentDisabled = [...resolvedDisabledFields];
    const isCurrentlyDisabled = currentDisabled.includes(fieldKey);

    const updatedDisabled = isCurrentlyDisabled
      ? currentDisabled.filter((key) => key !== fieldKey)
      : [...currentDisabled, fieldKey];

    // Clean up: use undefined instead of empty arrays
    const cleanDisabled = updatedDisabled.length > 0 ? updatedDisabled : undefined;

    if (editingVariant) {
      // Update variant-specific disabled fields
      const updatedVariantDisabled = {
        ...schema.variantDisabledFields,
      };
      if (cleanDisabled) {
        updatedVariantDisabled[editingVariant] = cleanDisabled;
      } else {
        delete updatedVariantDisabled[editingVariant];
      }
      const updatedSchema: HeroSectionSchema = {
        ...schema,
        variantDisabledFields: Object.keys(updatedVariantDisabled).length > 0
          ? updatedVariantDisabled
          : undefined,
      };
      onUpdate(updatedSchema);
    } else {
      // Update base disabled fields
      const updatedSchema: HeroSectionSchema = {
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

  const handleSubtitleUpdate = (content: LocalizedContent) => {
    updateField("subtitle", content, onUpdate);
  };

  const handleImageUpdate = (data: { src: string; alt: LocalizedContent }) => {
    if (!onUpdate) return;
    const updatedSchema: HeroSectionSchema = {
      ...schema,
      fields: {
        ...schema.fields,
        image: { ...schema.fields.image, src: data.src, alt: data.alt },
      },
    };
    onUpdate(updatedSchema);
  };

  const handlePrimaryCtaUpdate = ({
    href,
    text,
  }: {
    href: LocalizedContent;
    text: LocalizedContent;
  }) => {
    if (!onUpdate) return;
    const updatedSchema: HeroSectionSchema = {
      ...schema,
      fields: {
        ...schema.fields,
        primaryCtaText: { ...schema.fields.primaryCtaText, value: text },
        primaryCtaUrl: { ...schema.fields.primaryCtaUrl, value: href },
      },
    };
    onUpdate(updatedSchema);
  };

  const handleSecondaryCtaUpdate = ({
    href,
    text,
  }: {
    href: LocalizedContent;
    text: LocalizedContent;
  }) => {
    if (!onUpdate) return;
    const updatedSchema: HeroSectionSchema = {
      ...schema,
      fields: {
        ...schema.fields,
        secondaryCtaText: { ...schema.fields.secondaryCtaText, value: text },
        secondaryCtaUrl: { ...schema.fields.secondaryCtaUrl, value: href },
      },
    };
    onUpdate(updatedSchema);
  };

  // All hooks must be called before any conditional returns
  const primaryCta = useEditableLink({
    href: fields.primaryCtaUrl.value,
    text: fields.primaryCtaText.value,
    onUpdate: handlePrimaryCtaUpdate,
    editClassName: EDIT_CLASS,
    editingClassName: EDITING_CLASS,
  });

  const secondaryCta = useEditableLink({
    href: fields.secondaryCtaUrl.value,
    text: fields.secondaryCtaText.value,
    onUpdate: handleSecondaryCtaUpdate,
    editClassName: EDIT_CLASS,
    editingClassName: EDITING_CLASS,
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // View Mode - Pass strings to Hero slots
  // ─────────────────────────────────────────────────────────────────────────────

  // Resolve the active variant for field visibility checks
  const activeVariant = isEditMode ? editingVariant : personalization.segment;

  if (!isEditMode) {
    return (
      <Hero
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
        subtitle={
          isFieldEnabled(schema, "subtitle", activeVariant)
            ? getLocalizedValue(fields.subtitle.value, locale)
            : undefined
        }
        primaryCta={
          isFieldEnabled(schema, "primaryCta", activeVariant) ? (
            <a
              href={getLocalizedValue(fields.primaryCtaUrl.value, locale)}
              className={PRIMARY_CTA_CLASS}
            >
              {getLocalizedValue(fields.primaryCtaText.value, locale)}
            </a>
          ) : undefined
        }
        secondaryCta={
          isFieldEnabled(schema, "secondaryCta", activeVariant) ? (
            <a
              href={getLocalizedValue(fields.secondaryCtaUrl.value, locale)}
              className={SECONDARY_CTA_CLASS}
            >
              {getLocalizedValue(fields.secondaryCtaText.value, locale)}
            </a>
          ) : undefined
        }
        productImage={
          isFieldEnabled(schema, "image", activeVariant) ? (
            <img
              src={fields.image.src}
              alt={getLocalizedValue(fields.image.alt, locale)}
              className="w-full"
            />
          ) : undefined
        }
        className={className}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Edit Mode - Pass editable components to Hero slots
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Hero
      className={className}
      editBar={
        <SectionEditBar
          sectionType={schema.type}
          controls={sectionControls}
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
          fieldToggles={HERO_FIELD_TOGGLES}
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
      primaryCta={
        isFieldEnabled(schema, "primaryCta", activeVariant) ? (
          <Popover open={primaryCta.isOpen} onOpenChange={(open) => primaryCta.setIsOpen(open)}>
            <PopoverTrigger asChild>
              <a
                href={undefined}
                onClick={primaryCta.handleClick}
                className={cn(PRIMARY_CTA_CLASS, primaryCta.editModeClassName)}
                title="Click to edit link"
              >
                {primaryCta.displayText}
              </a>
            </PopoverTrigger>
            <PopoverContent className="w-80" onKeyDown={primaryCta.handleKeyDown}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-primary-cta-text">
                    Button Text ({locale.toUpperCase()})
                  </Label>
                  <Input
                    id="hero-primary-cta-text"
                    type="text"
                    value={primaryCta.editText}
                    onChange={(event) => primaryCta.setEditText(event.target.value)}
                    placeholder="Get started for free"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-primary-cta-url">
                    URL ({locale.toUpperCase()})
                  </Label>
                  <Input
                    id="hero-primary-cta-url"
                    type="text"
                    value={primaryCta.editHref}
                    onChange={(event) => primaryCta.setEditHref(event.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={primaryCta.handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={primaryCta.handleSave}>
                    Save
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Cmd+Enter to save, Esc to cancel
                </p>
              </div>
            </PopoverContent>
          </Popover>
        ) : undefined
      }
      secondaryCta={
        isFieldEnabled(schema, "secondaryCta", activeVariant) ? (
          <Popover open={secondaryCta.isOpen} onOpenChange={(open) => secondaryCta.setIsOpen(open)}>
            <PopoverTrigger asChild>
              <a
                href={undefined}
                onClick={secondaryCta.handleClick}
                className={cn(SECONDARY_CTA_CLASS, secondaryCta.editModeClassName)}
                title="Click to edit link"
              >
                {secondaryCta.displayText}
              </a>
            </PopoverTrigger>
            <PopoverContent className="w-80" onKeyDown={secondaryCta.handleKeyDown}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-secondary-cta-text">
                    Button Text ({locale.toUpperCase()})
                  </Label>
                  <Input
                    id="hero-secondary-cta-text"
                    type="text"
                    value={secondaryCta.editText}
                    onChange={(event) => secondaryCta.setEditText(event.target.value)}
                    placeholder="Request a demo"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-secondary-cta-url">
                    URL ({locale.toUpperCase()})
                  </Label>
                  <Input
                    id="hero-secondary-cta-url"
                    type="text"
                    value={secondaryCta.editHref}
                    onChange={(event) => secondaryCta.setEditHref(event.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={secondaryCta.handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={secondaryCta.handleSave}>
                    Save
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Cmd+Enter to save, Esc to cancel
                </p>
              </div>
            </PopoverContent>
          </Popover>
        ) : undefined
      }
      productImage={
        isFieldEnabled(schema, "image", activeVariant) ? (
          <EditableImage
            src={fields.image.src}
            alt={fields.image.alt}
            onUpdate={handleImageUpdate}
            className="w-full"
          />
        ) : undefined
      }
    />
  );
}
