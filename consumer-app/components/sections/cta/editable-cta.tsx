"use client";

import {
  type CTASectionSchema,
  EditableImage,
  EditableText,
  type FieldToggleConfig,
  getDisabledFields,
  getLocalizedValue,
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
import { CTA } from "./cta";

// Edit mode styling
const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

// Link style shared between view and edit mode
const LINK_CLASS =
  "inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/20 bg-gradient-to-b from-white to-[#C0C7D0] px-5 py-2.5 text-sm font-medium text-[#0A0E1A] transition-all duration-200 hover:from-white hover:to-white hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]";

// Field toggle configuration for CTA
const CTA_FIELD_TOGGLES: FieldToggleConfig[] = [
  { key: "label", label: "Label" },
  { key: "image", label: "Image" },
  { key: "heading", label: "Heading" },
  { key: "description", label: "Description" },
  { key: "link", label: "Link" },
];

interface EditableCTAProps {
  schema: CTASectionSchema;
  onUpdate?: (schema: CTASectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

/**
 * Editable wrapper for CTA component.
 * Injects editable elements into CTA's slots.
 * Layout is defined in CTA - this component only handles edit logic.
 */
export function EditableCTA({
  schema,
  onUpdate,
  className,
  sectionControls,
}: EditableCTAProps) {
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
      const updatedSchema: CTASectionSchema = {
        ...schema,
        variantDisabledFields: Object.keys(updatedVariantDisabled).length > 0
          ? updatedVariantDisabled
          : undefined,
      };
      onUpdate(updatedSchema);
    } else {
      // Update base disabled fields
      const updatedSchema: CTASectionSchema = {
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

  const handleImageUpdate = (data: { src: string; alt: LocalizedContent }) => {
    if (!onUpdate) return;
    const updatedSchema: CTASectionSchema = {
      ...schema,
      fields: {
        ...schema.fields,
        image: { ...schema.fields.image, src: data.src, alt: data.alt },
      },
    };
    onUpdate(updatedSchema);
  };

  const handleLinkUpdate = ({
    href,
    text,
  }: {
    href: LocalizedContent;
    text: LocalizedContent;
  }) => {
    if (!onUpdate) return;

    const updatedSchema: CTASectionSchema = {
      ...schema,
      fields: {
        ...schema.fields,
        linkText: { ...schema.fields.linkText, value: text },
        linkUrl: { ...schema.fields.linkUrl, value: href },
      },
    };
    onUpdate(updatedSchema);
  };

  // All hooks must be called before any conditional returns
  const link = useEditableLink({
    href: fields.linkUrl.value,
    text: fields.linkText.value,
    onUpdate: handleLinkUpdate,
    editClassName: EDIT_CLASS,
    editingClassName: EDITING_CLASS,
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // View Mode - Pass strings to CTA slots
  // ─────────────────────────────────────────────────────────────────────────────

  // Resolve the active variant for field visibility checks
  const activeVariant = isEditMode ? editingVariant : personalization.segment;

  if (!isEditMode) {
    return (
      <CTA
        label={
          isFieldEnabled(schema, "label", activeVariant)
            ? getLocalizedValue(fields.label.value, locale)
            : undefined
        }
        image={
          isFieldEnabled(schema, "image", activeVariant) && fields.image.src ? (
            <img
              src={fields.image.src}
              alt={getLocalizedValue(fields.image.alt, locale)}
              className="w-full"
            />
          ) : undefined
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
        link={
          isFieldEnabled(schema, "link", activeVariant) ? (
            <a
              href={getLocalizedValue(fields.linkUrl.value, locale)}
              className={LINK_CLASS}
            >
              {getLocalizedValue(fields.linkText.value, locale)}
            </a>
          ) : undefined
        }
        className={className}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Edit Mode - Pass editable components to CTA slots
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <CTA
      className={className}
      editBar={
        <SectionEditBar
          sectionType={schema.type}
          controls={sectionControls}
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
          fieldToggles={CTA_FIELD_TOGGLES}
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
      image={
        isFieldEnabled(schema, "image", activeVariant) && fields.image.src ? (
          <EditableImage
            src={fields.image.src}
            alt={fields.image.alt}
            onUpdate={handleImageUpdate}
            className="w-full"
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
      link={
        isFieldEnabled(schema, "link", activeVariant) ? (
          <Popover open={link.isOpen} onOpenChange={(open) => link.setIsOpen(open)}>
            <PopoverTrigger asChild>
              <a
                href={undefined}
                onClick={link.handleClick}
                className={cn(LINK_CLASS, link.editModeClassName)}
                title="Click to edit link"
              >
                {link.displayText}
              </a>
            </PopoverTrigger>
            <PopoverContent className="w-80" onKeyDown={link.handleKeyDown}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cta-link-text">
                    Link Text ({locale.toUpperCase()})
                  </Label>
                  <Input
                    id="cta-link-text"
                    type="text"
                    value={link.editText}
                    onChange={(event) => link.setEditText(event.target.value)}
                    placeholder="Learn more"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta-link-url">
                    URL ({locale.toUpperCase()})
                  </Label>
                  <Input
                    id="cta-link-url"
                    type="text"
                    value={link.editHref}
                    onChange={(event) => link.setEditHref(event.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={link.handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={link.handleSave}>
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
    />
  );
}
