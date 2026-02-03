"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  type LocalizedContent,
  type StatsSectionSchema,
  type StatItemField,
  getLocalizedValue,
  useCatalyst,
  useVariantHandling,
} from "catalyst";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Section } from "../../ui/section";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";

// Consistent edit-mode styling for all editable items
const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

interface SchemaStatsProps {
  schema: StatsSectionSchema;
  onUpdate?: (schema: StatsSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

interface EditableStatProps {
  stat: StatItemField;
  index: number;
  onUpdate: (index: number, stat: StatItemField) => void;
}

function EditableStat({ stat, index, onUpdate }: EditableStatProps) {
  const { isEditMode, locale } = useCatalyst();
  const [isOpen, setIsOpen] = useState(false);
  const [editLabel, setEditLabel] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editSuffix, setEditSuffix] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const displayLabel = stat.label ? getLocalizedValue(stat.label, locale) : "";
  const displayValue = getLocalizedValue(stat.value, locale);
  const displaySuffix = stat.suffix
    ? getLocalizedValue(stat.suffix, locale)
    : "";
  const displayDescription = getLocalizedValue(stat.description, locale);

  const handleOpen = () => {
    if (!isEditMode) return;
    setEditLabel(displayLabel);
    setEditValue(displayValue);
    setEditSuffix(displaySuffix);
    setEditDescription(displayDescription);
    setIsOpen(true);
  };

  const handleSave = () => {
    const updatedStat: StatItemField = {
      ...stat,
      label: editLabel
        ? { ...(stat.label || { en: "" }), [locale]: editLabel }
        : undefined,
      value: { ...stat.value, [locale]: editValue },
      suffix: editSuffix
        ? { ...(stat.suffix || { en: "" }), [locale]: editSuffix }
        : undefined,
      description: { ...stat.description, [locale]: editDescription },
    };
    onUpdate(index, updatedStat);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const editOutlineClass = isEditMode
    ? isOpen
      ? EDITING_CLASS
      : EDIT_CLASS
    : "";

  return (
    <>
      <div
        className={cn(
          "flex flex-col items-start gap-3 text-left",
          editOutlineClass,
          isEditMode && "cursor-pointer"
        )}
        onClick={handleOpen}
        title={isEditMode ? "Click to edit stat" : undefined}
      >
        {displayLabel && (
          <div className="text-muted-foreground text-sm font-semibold">
            {displayLabel}
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <div className="from-foreground to-foreground dark:to-brand bg-linear-to-r bg-clip-text text-4xl font-medium text-transparent drop-shadow-[2px_1px_24px_var(--brand-foreground)] transition-all duration-300 sm:text-5xl md:text-6xl">
            {displayValue}
          </div>
          {displaySuffix && (
            <div className="text-brand text-2xl font-semibold">
              {displaySuffix}
            </div>
          )}
        </div>
        {displayDescription && (
          <div className="text-muted-foreground text-sm font-semibold text-pretty">
            {displayDescription}
          </div>
        )}
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Stat</SheetTitle>
            <SheetDescription>
              Edit the label, value, suffix, and description for this stat.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor={`stat-label-${index}`}>
                Label ({locale.toUpperCase()})
              </Label>
              <Input
                id={`stat-label-${index}`}
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                placeholder="e.g., used by, over, includes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`stat-value-${index}`}>
                Value ({locale.toUpperCase()})
              </Label>
              <Input
                id={`stat-value-${index}`}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="e.g., 76.93, 1829"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`stat-suffix-${index}`}>
                Suffix ({locale.toUpperCase()})
              </Label>
              <Input
                id={`stat-suffix-${index}`}
                type="text"
                value={editSuffix}
                onChange={(e) => setEditSuffix(e.target.value)}
                placeholder="e.g., k, %, +"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`stat-description-${index}`}>
                Description ({locale.toUpperCase()})
              </Label>
              <Input
                id={`stat-description-${index}`}
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description of this stat"
              />
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default function SchemaStats({
  schema,
  onUpdate,
  className,
  sectionControls,
}: SchemaStatsProps) {
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleStatUpdate = (index: number, updatedStat: StatItemField) => {
    const newStats = [...fields.stats.value];
    newStats[index] = updatedStat;
    updateField("stats", newStats, onUpdate);
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
      <div className="container mx-auto max-w-[960px]">
        {fields.stats.value.length > 0 && (
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-4">
            {fields.stats.value.map((stat, index) => (
              <EditableStat
                key={`stat-${index}`}
                stat={stat}
                index={index}
                onUpdate={handleStatUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
