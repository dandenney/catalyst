"use client";

import {
  type CTASectionSchema,
  EditableText,
  type LocalizedContent,
  useCatalyst,
  useEditableLink,
  useVariantHandling,
} from "catalyst";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";
import Glow from "../../ui/glow";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Section } from "../../ui/section";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";

const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

interface SchemaCTAProps {
  schema: CTASectionSchema;
  onUpdate?: (schema: CTASectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

export default function SchemaCTA({
  schema,
  onUpdate,
  className,
  sectionControls,
}: SchemaCTAProps) {
  const { locale } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleHeadingUpdate = (content: LocalizedContent) => {
    updateField("heading", content, onUpdate);
  };

  const handleDescriptionUpdate = (content: LocalizedContent) => {
    updateField("description", content, onUpdate);
  };

  const handleButtonUpdate = ({
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
        buttonText: { ...schema.fields.buttonText, value: text },
        buttonUrl: { ...schema.fields.buttonUrl, value: href },
      },
    };
    onUpdate(updatedSchema);
  };

  const button = useEditableLink({
    href: fields.buttonUrl.value,
    text: fields.buttonText.value,
    onUpdate: handleButtonUpdate,
    editClassName: EDIT_CLASS,
    editingClassName: EDITING_CLASS,
  });

  const hasVariants = schema.variants && Object.keys(schema.variants).length > 0;

  return (
    <Section className={cn("group relative overflow-hidden", className)}>
      <SectionEditBar
        sectionType={schema.type}
        controls={sectionControls}
        variants={hasVariants ? schema.variants : undefined}
        currentVariant={editingVariant}
        onVariantChange={setEditingVariant}
      />
      <div className="max-w-container relative z-10 mx-auto flex flex-col items-center gap-6 text-center sm:gap-8">
        <EditableText
          content={fields.heading.value}
          onUpdate={handleHeadingUpdate}
          as="h2"
          className="max-w-[640px] text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight"
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
        <EditableText
          content={fields.description.value}
          onUpdate={handleDescriptionUpdate}
          as="p"
          className="text-muted-foreground max-w-[640px] text-base sm:text-lg"
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
        <div className="flex justify-center gap-4">
          <Popover
            open={button.isOpen}
            onOpenChange={(open) => button.setIsOpen(open)}
          >
            <PopoverTrigger asChild>
              <Button size="lg" asChild>
                <a
                  href={button.isEditMode ? undefined : button.displayHref}
                  onClick={button.handleClick}
                  className={cn(button.editModeClassName)}
                  title={button.isEditMode ? "Click to edit button" : undefined}
                >
                  {button.displayText}
                </a>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" onKeyDown={button.handleKeyDown}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cta-button-text">
                    Button Text ({locale.toUpperCase()})
                  </Label>
                  <Input
                    id="cta-button-text"
                    type="text"
                    value={button.editText}
                    onChange={(event) => button.setEditText(event.target.value)}
                    placeholder="Get Started"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta-button-url">
                    URL ({locale.toUpperCase()})
                  </Label>
                  <Input
                    id="cta-button-url"
                    type="text"
                    value={button.editHref}
                    onChange={(event) => button.setEditHref(event.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={button.handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={button.handleSave}>
                    Save
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Cmd+Enter to save, Esc to cancel
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
        <Glow variant="bottom" />
      </div>
    </Section>
  );
}
