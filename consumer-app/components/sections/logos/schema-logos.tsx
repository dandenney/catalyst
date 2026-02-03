"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  EditableText,
  type LocalizedContent,
  type LogosSectionSchema,
  type LogoItemField,
  getLocalizedValue,
  useCatalyst,
  useVariantHandling,
} from "catalyst";

import Figma from "../../logos/figma";
import ReactLogo from "../../logos/react";
import ShadcnUi from "../../logos/shadcn-ui";
import Tailwind from "../../logos/tailwind";
import TypeScript from "../../logos/typescript";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Section } from "../../ui/section";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";

// Consistent edit-mode styling for all editable items
const EDIT_CLASS = "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS = "outline-2 outline-solid outline-primary outline-offset-2";

// Map imageKey to SVG components
const LOGO_IMAGES: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  figma: Figma,
  react: ReactLogo,
  typescript: TypeScript,
  shadcn: ShadcnUi,
  tailwind: Tailwind,
};

interface SchemaLogosProps {
  schema: LogosSectionSchema;
  onUpdate?: (schema: LogosSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

interface EditableLogoProps {
  logo: LogoItemField;
  index: number;
  onUpdate: (index: number, logo: LogoItemField) => void;
}

function EditableLogo({ logo, index, onUpdate }: EditableLogoProps) {
  const { isEditMode, locale } = useCatalyst();
  const [isOpen, setIsOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editVersion, setEditVersion] = useState("");
  const [editBadge, setEditBadge] = useState("");

  const SvgImage = LOGO_IMAGES[logo.imageKey];
  const displayName = getLocalizedValue(logo.name, locale);
  const displayVersion = logo.version ? getLocalizedValue(logo.version, locale) : undefined;
  const displayBadge = logo.badge ? getLocalizedValue(logo.badge, locale) : undefined;

  const handleOpen = () => {
    if (!isEditMode) return;
    setEditName(displayName);
    setEditVersion(displayVersion || "");
    setEditBadge(displayBadge || "");
    setIsOpen(true);
  };

  const handleSave = () => {
    const updatedLogo: LogoItemField = {
      ...logo,
      name: { ...logo.name, [locale]: editName },
      version: editVersion
        ? { en: logo.version?.en || editVersion, ...logo.version, [locale]: editVersion }
        : undefined,
      badge: editBadge
        ? { en: logo.badge?.en || editBadge, ...logo.badge, [locale]: editBadge }
        : undefined,
    };
    onUpdate(index, updatedLogo);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const editOutlineClass = isEditMode
    ? isOpen
      ? EDITING_CLASS
      : EDIT_CLASS
    : "";

  return (
    <Popover open={isOpen} onOpenChange={(open) => isEditMode && setIsOpen(open)}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 text-sm font-medium",
            isEditMode ? "cursor-pointer" : "cursor-default",
            editOutlineClass
          )}
          onClick={handleOpen}
          title={isEditMode ? "Click to edit logo" : undefined}
        >
          {SvgImage && (
            <SvgImage
              width={24}
              height={24}
              aria-hidden="true"
              className="max-h-full max-w-full opacity-70"
            />
          )}
          <span>{displayName}</span>
          {displayVersion && (
            <span className="text-muted-foreground">{displayVersion}</span>
          )}
          {displayBadge && (
            <Badge variant="brand" size="sm">
              {displayBadge}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" onKeyDown={handleKeyDown}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`logo-name-${index}`}>
              Name ({locale.toUpperCase()})
            </Label>
            <Input
              id={`logo-name-${index}`}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Logo name…"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`logo-version-${index}`}>
              Version ({locale.toUpperCase()})
            </Label>
            <Input
              id={`logo-version-${index}`}
              type="text"
              value={editVersion}
              onChange={(e) => setEditVersion(e.target.value)}
              placeholder="e.g., 1.0.0 (optional)…"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`logo-badge-${index}`}>
              Badge ({locale.toUpperCase()})
            </Label>
            <Input
              id={`logo-badge-${index}`}
              type="text"
              value={editBadge}
              onChange={(e) => setEditBadge(e.target.value)}
              placeholder="e.g., New (optional)…"
            />
          </div>

          <div className="flex gap-2 justify-end">
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

export default function SchemaLogos({
  schema,
  onUpdate,
  className,
  sectionControls,
}: SchemaLogosProps) {
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleTitleUpdate = (content: LocalizedContent) => {
    updateField("title", content, onUpdate);
  };

  const handleBadgeTextUpdate = (content: LocalizedContent) => {
    updateField("badgeText", content, onUpdate);
  };

  const handleLogoUpdate = (index: number, updatedLogo: LogoItemField) => {
    const newLogos = [...fields.logos.value];
    newLogos[index] = updatedLogo;
    updateField("logos", newLogos, onUpdate);
  };

  const hasVariants = schema.variants && Object.keys(schema.variants).length > 0;

  return (
    <Section className={className}>
      <SectionEditBar
        sectionType={schema.type}
        controls={sectionControls}
        variants={hasVariants ? schema.variants : undefined}
        currentVariant={editingVariant}
        onVariantChange={setEditingVariant}
      />
      <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <Badge variant="outline" className="border-brand/30 text-brand">
            <EditableText
              content={fields.badgeText.value}
              onUpdate={handleBadgeTextUpdate}
              as="span"
              editClassName={EDIT_CLASS}
              editingClassName={EDITING_CLASS}
            />
          </Badge>
          <EditableText
            content={fields.title.value}
            onUpdate={handleTitleUpdate}
            as="h2"
            className="text-md font-semibold sm:text-2xl"
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        </div>
        {fields.logos.value.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-8">
            {fields.logos.value.map((logo, index) => (
              <EditableLogo
                key={`${logo.imageKey}-${index}`}
                logo={logo}
                index={index}
                onUpdate={handleLogoUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
