"use client";

import { type VariantProps } from "class-variance-authority";
import { ArrowRightIcon } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  EditableText,
  type LocalizedContent,
  type HeroSectionSchema,
  type ButtonField,
  getLocalizedValue,
  useCatalyst,
  useEditableLink,
  useVariantHandling,
  VariantSelector,
} from "catalyst";

import { Badge } from "../../ui/badge";
import { Button, buttonVariants } from "../../ui/button";
import EditableScreenshot from "../../ui/editable-screenshot";
import Github from "../../logos/github";
import Glow from "../../ui/glow";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Mockup, MockupFrame } from "../../ui/mockup";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Section } from "../../ui/section";
import {
  type SectionControls,
  SectionDropdownItems,
} from "../../ui/section-dropdown-items";

// Consistent edit-mode styling for all editable items
const EDIT_CLASS = "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS = "outline-2 outline-solid outline-primary outline-offset-2";

interface SchemaHeroProps {
  schema: HeroSectionSchema;
  onUpdate?: (schema: HeroSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

function EditableBadgeLink({
  href,
  text,
  onUpdate,
  children,
}: {
  href: LocalizedContent;
  text: LocalizedContent;
  onUpdate: (data: { href: LocalizedContent; text: LocalizedContent }) => void;
  children?: React.ReactNode;
}) {
  const link = useEditableLink({ href, text, onUpdate });

  const editOutlineClass = link.isEditMode
    ? link.isOpen
      ? EDITING_CLASS
      : EDIT_CLASS
    : "";

  return (
    <Popover
      open={link.isOpen}
      onOpenChange={(open) => link.isEditMode && link.setIsOpen(open)}
    >
      <PopoverTrigger asChild>
        <a
          href={link.isEditMode ? undefined : link.displayHref}
          onClick={link.handleClick}
          className={cn("flex items-center gap-1", editOutlineClass)}
          title={link.isEditMode ? "Click to edit link" : undefined}
        >
          <span>{link.displayText}</span>
          {children}
        </a>
      </PopoverTrigger>
      <PopoverContent className="w-80" onKeyDown={link.handleKeyDown}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="badge-link-text">
              Link Text ({link.locale.toUpperCase()})
            </Label>
            <Input
              id="badge-link-text"
              type="text"
              value={link.editText}
              onChange={(e) => link.setEditText(e.target.value)}
              placeholder="Click here…"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge-link-url">
              URL ({link.locale.toUpperCase()})
            </Label>
            <Input
              id="badge-link-url"
              type="text"
              value={link.editHref}
              onChange={(e) => link.setEditHref(e.target.value)}
              placeholder="https://example.com…"
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
  );
}

function EditableButton({
  button,
  onUpdate,
}: {
  button: ButtonField;
  onUpdate: (button: Partial<ButtonField>) => void;
}) {
  const link = useEditableLink({
    href: button.href,
    text: button.text,
    onUpdate: ({ href, text }) => {
      onUpdate({ href, text });
    },
  });

  const editOutlineClass = link.isEditMode
    ? link.isOpen
      ? EDITING_CLASS
      : EDIT_CLASS
    : "";

  // Map icon string to component
  const iconNode: ReactNode = button.icon === 'github'
    ? <Github className="mr-2 size-4" />
    : null;

  // Determine variant for button
  const buttonVariant = button.variant as VariantProps<typeof buttonVariants>["variant"] || "default";

  return (
    <Popover
      open={link.isOpen}
      onOpenChange={(open) => link.isEditMode && link.setIsOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          size="lg"
          asChild
        >
          <a
            href={link.isEditMode ? undefined : link.displayHref}
            onClick={link.handleClick}
            className={cn(editOutlineClass)}
            title={link.isEditMode ? "Click to edit button" : undefined}
          >
            {button.iconPosition !== 'right' && iconNode}
            {link.displayText}
            {button.iconPosition === 'right' && iconNode}
          </a>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" onKeyDown={link.handleKeyDown}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="btn-text">
              Button Text ({link.locale.toUpperCase()})
            </Label>
            <Input
              id="btn-text"
              type="text"
              value={link.editText}
              onChange={(e) => link.setEditText(e.target.value)}
              placeholder="Click here…"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="btn-url">URL ({link.locale.toUpperCase()})</Label>
            <Input
              id="btn-url"
              type="text"
              value={link.editHref}
              onChange={(e) => link.setEditHref(e.target.value)}
              placeholder="https://example.com…"
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
  );
}

export default function SchemaHero({
  schema,
  onUpdate,
  className,
  sectionControls,
}: SchemaHeroProps) {
  const { isEditMode, locale } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleTitleUpdate = (content: LocalizedContent) => {
    updateField('title', content, onUpdate);
  };

  const handleDescriptionUpdate = (content: LocalizedContent) => {
    updateField('description', content, onUpdate);
  };

  const handleBadgeLabelUpdate = (content: LocalizedContent) => {
    updateField('badge', { label: content }, onUpdate);
  };

  const handleBadgeLinkUpdate = ({
    href,
    text,
  }: {
    href: LocalizedContent;
    text: LocalizedContent;
  }) => {
    updateField('badge', { link: { href, text } }, onUpdate);
  };

  const handleButtonUpdate = (index: number, updatedButton: Partial<ButtonField>) => {
    const currentButtons = [...fields.buttons.value];
    currentButtons[index] = { ...currentButtons[index], ...updatedButton };
    updateField('buttons', currentButtons, onUpdate);
  };

  const handleMockupUpdate = (data: {
    srcLight: string;
    srcDark?: string;
    alt: LocalizedContent;
  }) => {
    updateField('mockup', data, onUpdate);
  };

  const hasVariants = schema.variants && Object.keys(schema.variants).length > 0;
  const showVariantSelector = isEditMode && (hasVariants || !!sectionControls);

  return (
    <Section
      className={cn(
        "fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0",
        className,
      )}
    >
      {showVariantSelector && (
        <div className="max-w-container mx-auto flex justify-end mb-4">
          <VariantSelector
            variants={schema.variants}
            currentVariant={editingVariant}
            onVariantChange={setEditingVariant}
            extraItems={
              sectionControls ? (
                <SectionDropdownItems controls={sectionControls} />
              ) : null
            }
          />
        </div>
      )}
      <div className="max-w-container mx-auto flex flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {fields.badge && (
            <Badge variant="outline" className="animate-appear">
              <EditableText
                content={fields.badge.label}
                onUpdate={handleBadgeLabelUpdate}
                as="span"
                className="text-muted-foreground"
                editClassName={EDIT_CLASS}
                editingClassName={EDITING_CLASS}
              />
              <EditableBadgeLink
                href={fields.badge.link.href}
                text={fields.badge.link.text}
                onUpdate={handleBadgeLinkUpdate}
              >
                <ArrowRightIcon className="size-3" />
              </EditableBadgeLink>
            </Badge>
          )}
          <EditableText
            content={fields.title.value}
            onUpdate={handleTitleUpdate}
            as="h1"
            className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight"
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
          <EditableText
            content={fields.description.value}
            onUpdate={handleDescriptionUpdate}
            as="p"
            className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium text-balance opacity-0 delay-100 sm:text-xl"
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
          {fields.buttons && fields.buttons.value.length > 0 && (
            <div className="animate-appear relative z-10 flex justify-center gap-4 opacity-0 delay-300">
              {fields.buttons.value.map((button, index) => (
                <EditableButton
                  key={index}
                  button={button}
                  onUpdate={(updatedButton) =>
                    handleButtonUpdate(index, updatedButton)
                  }
                />
              ))}
            </div>
          )}
          {fields.mockup && (
            <div className="relative w-full pt-12">
              <MockupFrame
                className="animate-appear opacity-0 delay-700"
                size="small"
              >
                <Mockup
                  type="responsive"
                  className="bg-background/90 w-full rounded-xl border-0"
                >
                  <EditableScreenshot
                    srcLight={fields.mockup.srcLight}
                    srcDark={fields.mockup.srcDark}
                    alt={fields.mockup.alt}
                    width={fields.mockup.width}
                    height={fields.mockup.height}
                    className="w-full"
                    onUpdate={handleMockupUpdate}
                    editClassName={EDIT_CLASS}
                    editingClassName={EDITING_CLASS}
                  />
                </Mockup>
              </MockupFrame>
              <Glow
                variant="top"
                className="animate-appear-zoom opacity-0 delay-1000"
              />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
