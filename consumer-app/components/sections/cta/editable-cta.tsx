"use client";

import {
  type CTASectionSchema,
  EditableText,
  getLocalizedValue,
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
  const { isEditMode, locale } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  const handleHeadingUpdate = (content: LocalizedContent) => {
    updateField("heading", content, onUpdate);
  };

  const handleDescriptionUpdate = (content: LocalizedContent) => {
    updateField("description", content, onUpdate);
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

  if (!isEditMode) {
    return (
      <CTA
        heading={getLocalizedValue(fields.heading.value, locale)}
        description={getLocalizedValue(fields.description.value, locale)}
        link={
          <a
            href={getLocalizedValue(fields.linkUrl.value, locale)}
            className="font-semibold text-blue-lighter"
          >
            {getLocalizedValue(fields.linkText.value, locale)}
          </a>
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
        />
      }
      heading={
        <EditableText
          content={fields.heading.value}
          onUpdate={handleHeadingUpdate}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      }
      description={
        <EditableText
          content={fields.description.value}
          onUpdate={handleDescriptionUpdate}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      }
      link={
        <Popover open={link.isOpen} onOpenChange={(open) => link.setIsOpen(open)}>
          <PopoverTrigger asChild>
            <a
              href={undefined}
              onClick={link.handleClick}
              className={cn("font-semibold text-blue-lighter", link.editModeClassName)}
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
      }
    />
  );
}
