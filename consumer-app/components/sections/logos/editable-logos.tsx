"use client";

import {
  EditableText,
  getLocalizedValue,
  type LocalizedContent,
  type LogoItemField,
  type LogosSectionSchema,
  useCatalyst,
  useVariantHandling,
} from "catalyst";
import { Check, Plus, Settings } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import { Switch } from "../../ui/switch";
import { ALL_LOGOS, LOGO_MAP } from "./logo-map";
import { Logos } from "./logos";

const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

interface EditableLogosProps {
  schema: LogosSectionSchema;
  onUpdate?: (schema: LogosSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

export function EditableLogos({
  schema,
  onUpdate,
  className,
  sectionControls,
}: EditableLogosProps) {
  const { isEditMode, locale } = useCatalyst();
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;
  const { settings } = schema;
  const logos = fields.logos.value as LogoItemField[];

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const handleTitleUpdate = (content: LocalizedContent) => {
    updateField("title", content, onUpdate);
  };

  const handleSettingsUpdate = (key: string, value: unknown) => {
    if (!onUpdate) return;
    onUpdate({
      ...schema,
      settings: { ...schema.settings, [key]: value },
    });
  };

  const handleAddLogo = (imageKey: string) => {
    const entry = ALL_LOGOS.find((l) => l.key === imageKey);
    if (!entry) return;
    const newLogo: LogoItemField = {
      type: "logoItem",
      name: { en: entry.label },
      imageKey,
    };
    const updated = [...logos, newLogo];
    updateField("logos", updated, onUpdate);
  };

  const handleRemoveLogo = (index: number) => {
    if (logos.length <= 1) return;
    const updated = logos.filter((_, i) => i !== index);
    updateField("logos", updated, onUpdate);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────────────────

  if (!isEditMode) {
    const viewLogos = logos.map((logo) => ({
      logo: LOGO_MAP[logo.imageKey] ?? (
        <div className="flex size-10 items-center justify-center text-xs text-[#94A3B8]">
          {getLocalizedValue(logo.name, locale)}
        </div>
      ),
    }));

    return (
      <Logos
        title={getLocalizedValue(fields.title.value, locale)}
        logos={viewLogos}
        scrollEnabled={settings.scrollEnabled}
        className={className}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Edit Mode
  // ─────────────────────────────────────────────────────────────────────────

  const editLogos = logos.map((logo, index) => ({
    logo: LOGO_MAP[logo.imageKey] ?? (
      <div className="flex size-10 items-center justify-center text-xs text-[#94A3B8]">
        {getLocalizedValue(logo.name, locale)}
      </div>
    ),
    onRemove: logos.length > 1 ? () => handleRemoveLogo(index) : undefined,
  }));

  const existingKeys = new Set(logos.map((l) => l.imageKey));
  const availableLogos = ALL_LOGOS.filter((l) => !existingKeys.has(l.key));

  const settingsPanel = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Settings className="size-3.5" />
        Settings
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="logos-scroll" className="cursor-pointer text-sm">
          Enable scrolling
        </Label>
        <Switch
          id="logos-scroll"
          checked={settings.scrollEnabled}
          onCheckedChange={(v) => handleSettingsUpdate("scrollEnabled", v)}
        />
      </div>
    </div>
  );

  return (
    <Logos
      className={className}
      scrollEnabled={settings.scrollEnabled}
      paused
      editBar={
        <SectionEditBar
          sectionType={schema.type}
          controls={sectionControls}
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
          settingsPanel={settingsPanel}
        />
      }
      title={
        <EditableText
          content={fields.title.value}
          onUpdate={handleTitleUpdate}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      }
      logos={editLogos}
      addLogoButton={
        availableLogos.length > 0 ? (
          <AddLogoButton
            availableLogos={availableLogos}
            onAdd={handleAddLogo}
          />
        ) : undefined
      }
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Add logo popover
// ─────────────────────────────────────────────────────────────────────────────

interface AddLogoButtonProps {
  availableLogos: typeof ALL_LOGOS;
  onAdd: (imageKey: string) => void;
}

function AddLogoButton({ availableLogos, onAdd }: AddLogoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border-2 border-dashed border-[#1E293B] px-4 py-2 text-[#94A3B8] transition-colors hover:border-[#3B82F6]/50 hover:text-[#3B82F6]"
        >
          <Plus className="size-4" />
          <span className="text-sm font-medium">Add logo</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <Label>Available logos</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableLogos.map((logo) => (
              <Button
                key={logo.key}
                variant="outline"
                size="sm"
                className="flex items-center justify-start gap-2"
                onClick={() => {
                  onAdd(logo.key);
                  setIsOpen(false);
                }}
              >
                <span className="flex size-5 items-center justify-center [&>svg]:size-5">
                  {logo.icon}
                </span>
                <span className="truncate text-xs">{logo.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
