"use client";

import {
  type BentoCellField,
  type BentoFeatureCell,
  type BentoFeatureListCell,
  type BentoFeaturedCell,
  type BentoQuoteCell,
  type BentosSectionSchema,
  type BentoStatCell,
  EditableText,
  type FieldToggleConfig,
  getDisabledFields,
  getLocalizedValue,
  isFieldEnabled,
  type LocalizedContent,
  useCatalyst,
  useVariantHandling,
} from "catalyst";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import { Bentos, type BentoCell } from "./bentos";

// Edit mode styling
const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

// Field toggle configuration
const BENTOS_FIELD_TOGGLES: FieldToggleConfig[] = [
  { key: "label", label: "Label" },
  { key: "heading", label: "Heading" },
  { key: "description", label: "Description" },
];

// Cell type metadata
const CELL_TYPE_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "stat", label: "Stat" },
  { value: "feature", label: "Feature" },
  { value: "featureList", label: "Feature List" },
  { value: "quote", label: "Quote" },
] as const;

const SIZE_OPTIONS = [
  { value: "regular", label: "1×1" },
  { value: "wide", label: "2×1" },
  { value: "tall", label: "1×2" },
  { value: "large", label: "2×2" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Default cell factories
// ─────────────────────────────────────────────────────────────────────────────

function createDefaultCell(
  cellType: BentoCellField["cellType"],
  size: BentoCellField["size"] = "regular",
): BentoCellField {
  const base = { type: "bentoCell" as const, size };
  switch (cellType) {
    case "featured":
      return {
        ...base,
        cellType: "featured",
        label: { en: "Featured" },
        title: { en: "New featured content" },
        description: { en: "Add a description here." },
      };
    case "stat":
      return {
        ...base,
        cellType: "stat",
        label: { en: "Metric" },
        value: { en: "100%" },
        suffix: { en: "uptime" },
      };
    case "feature":
      return {
        ...base,
        cellType: "feature",
        icon: "⚡",
        title: { en: "New feature" },
        description: { en: "Describe this feature." },
      };
    case "featureList":
      return {
        ...base,
        cellType: "featureList",
        title: { en: "Feature list" },
        items: [{ en: "First item" }, { en: "Second item" }],
      };
    case "quote":
      return {
        ...base,
        cellType: "quote",
        quote: { en: "Add a testimonial here." },
        attribution: { en: "Author Name" },
      };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-cell editor popover
// ─────────────────────────────────────────────────────────────────────────────

interface BentoCellEditorProps {
  cell: BentoCellField;
  index: number;
  locale: string;
  onUpdate: (index: number, cell: BentoCellField) => void;
  onRemove: (index: number) => void;
}

function BentoCellEditorPopover({
  cell,
  index,
  locale,
  onUpdate,
  onRemove,
}: BentoCellEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeChange = (newType: BentoCellField["cellType"]) => {
    if (newType === cell.cellType) return;
    onUpdate(index, createDefaultCell(newType, cell.size));
  };

  const handleSizeChange = (newSize: BentoCellField["size"]) => {
    onUpdate(index, { ...cell, size: newSize });
  };

  const handleFieldChange = (field: string, value: string) => {
    const loc = locale as "en" | "es";
    switch (cell.cellType) {
      case "featured": {
        const updated = { ...cell };
        if (field === "label")
          updated.label = { ...cell.label, [loc]: value };
        if (field === "title")
          updated.title = { ...cell.title, [loc]: value };
        if (field === "description")
          updated.description = { ...cell.description, [loc]: value };
        onUpdate(index, updated);
        break;
      }
      case "stat": {
        const updated = { ...cell };
        if (field === "label")
          updated.label = { ...cell.label, [loc]: value };
        if (field === "value")
          updated.value = { ...cell.value, [loc]: value };
        if (field === "suffix")
          updated.suffix = { ...cell.suffix, [loc]: value };
        onUpdate(index, updated);
        break;
      }
      case "feature": {
        const updated = { ...cell };
        if (field === "icon") updated.icon = value;
        if (field === "title")
          updated.title = { ...cell.title, [loc]: value };
        if (field === "description")
          updated.description = { ...cell.description, [loc]: value };
        onUpdate(index, updated);
        break;
      }
      case "featureList": {
        const updated = { ...cell };
        if (field === "title")
          updated.title = { ...cell.title, [loc]: value };
        onUpdate(index, updated);
        break;
      }
      case "quote": {
        const updated = { ...cell };
        if (field === "quote")
          updated.quote = { ...cell.quote, [loc]: value };
        if (field === "attribution")
          updated.attribution = { ...cell.attribution, [loc]: value };
        onUpdate(index, updated);
        break;
      }
    }
  };

  const handleListItemAdd = () => {
    if (cell.cellType !== "featureList") return;
    const loc = locale as "en" | "es";
    onUpdate(index, {
      ...cell,
      items: [...cell.items, { en: "New item", ...(loc !== "en" ? { [loc]: "New item" } : {}) }],
    });
  };

  const handleListItemRemove = (itemIndex: number) => {
    if (cell.cellType !== "featureList") return;
    onUpdate(index, {
      ...cell,
      items: cell.items.filter((_, i) => i !== itemIndex),
    });
  };

  const handleListItemUpdate = (itemIndex: number, value: string) => {
    if (cell.cellType !== "featureList") return;
    const loc = locale as "en" | "es";
    const items = [...cell.items];
    items[itemIndex] = { ...items[itemIndex], [loc]: value };
    onUpdate(index, { ...cell, items });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg opacity-0 transition-all hover:bg-blue-500 group-hover/cell:opacity-100"
          title="Edit cell"
        >
          <Pencil className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[70vh] overflow-y-auto" side="right" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Edit Cell</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={() => {
                onRemove(index);
                setIsOpen(false);
              }}
              title="Remove cell"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          {/* Cell type selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Type</Label>
            <RadioGroup
              value={cell.cellType}
              onValueChange={(v) => handleTypeChange(v as BentoCellField["cellType"])}
              className="flex flex-wrap gap-2"
            >
              {CELL_TYPE_OPTIONS.map((opt) => (
                <label key={opt.value} className="cursor-pointer">
                  <RadioGroupItem value={opt.value} className="sr-only" />
                  <span
                    className={cn(
                      "inline-block rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      cell.cellType === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    {opt.label}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Size selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Size</Label>
            <RadioGroup
              value={cell.size}
              onValueChange={(v) => handleSizeChange(v as BentoCellField["size"])}
              className="grid grid-cols-4 gap-2"
            >
              {SIZE_OPTIONS.map((opt) => (
                <label key={opt.value} className="cursor-pointer">
                  <RadioGroupItem value={opt.value} className="sr-only" />
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-md border-2 p-2 text-xs transition-colors",
                      cell.size === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-muted text-muted-foreground hover:border-muted-foreground/30",
                    )}
                  >
                    {opt.label}
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Type-specific fields */}
          {cell.cellType === "feature" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Icon (emoji)</Label>
              <Input
                value={cell.icon}
                onChange={(e) => handleFieldChange("icon", e.target.value)}
                className="w-20"
              />
            </div>
          )}

          {cell.cellType === "featureList" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Items ({locale.toUpperCase()})
              </Label>
              <div className="space-y-1.5">
                {cell.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Input
                      value={getLocalizedValue(item, locale as "en" | "es")}
                      onChange={(e) => handleListItemUpdate(i, e.target.value)}
                      className="text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 flex-shrink-0 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleListItemRemove(i)}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={handleListItemAdd}
                >
                  <Plus className="mr-1 size-3" /> Add item
                </Button>
              </div>
            </div>
          )}

          {cell.cellType === "featured" && cell.image && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Background Image</Label>
              <p className="text-xs text-muted-foreground">
                Click the cell background to change the image.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cell content renderers
// ─────────────────────────────────────────────────────────────────────────────

function renderFeaturedCellView(cell: BentoFeaturedCell, locale: "en" | "es") {
  const hasImage = !!cell.image?.src;
  return (
    <div className="relative flex h-full flex-col justify-end p-6">
      {/* Background: image or decorative pattern */}
      {hasImage ? (
        <img
          src={cell.image!.src}
          alt={getLocalizedValue(cell.image!.alt, locale)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #3B82F6 0.5px, transparent 0.5px), linear-gradient(225deg, #3B82F6 0.5px, transparent 0.5px)",
            backgroundSize: "20px 20px",
          }}
        />
      )}
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1629] via-[#0F1629]/80 to-[#0F1629]/30" />
      <div className="relative">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
          {getLocalizedValue(cell.label, locale)}
        </span>
        <h3 className="mt-2 text-xl font-medium tracking-tight text-[#F1F5F9] sm:text-2xl">
          {getLocalizedValue(cell.title, locale)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
          {getLocalizedValue(cell.description, locale)}
        </p>
      </div>
    </div>
  );
}

function renderStatCellView(cell: BentoStatCell, locale: "en" | "es") {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
        {getLocalizedValue(cell.label, locale)}
      </span>
      <span className="mt-2 font-mono text-4xl font-medium tracking-tight text-[#F1F5F9] sm:text-5xl">
        {getLocalizedValue(cell.value, locale)}
      </span>
      <span className="mt-1 text-sm text-[#94A3B8]">
        {getLocalizedValue(cell.suffix, locale)}
      </span>
    </div>
  );
}

function renderFeatureCellView(cell: BentoFeatureCell, locale: "en" | "es") {
  return (
    <div className="flex h-full flex-col justify-center p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-[#1E293B] bg-[#0A0E1A] text-lg">
        {cell.icon}
      </div>
      <h3 className="text-sm font-medium text-[#F1F5F9]">
        {getLocalizedValue(cell.title, locale)}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">
        {getLocalizedValue(cell.description, locale)}
      </p>
    </div>
  );
}

function renderFeatureListCellView(
  cell: BentoFeatureListCell,
  locale: "en" | "es",
) {
  return (
    <div className="flex h-full flex-col p-5">
      <h3 className="text-sm font-medium text-[#F1F5F9]">
        {getLocalizedValue(cell.title, locale)}
      </h3>
      <div className="mt-1 h-px w-8 bg-gradient-to-r from-[#3B82F6] to-transparent" />
      <ul className="mt-4 flex flex-col gap-3">
        {cell.items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs text-[#94A3B8]"
          >
            <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#3B82F6]" />
            {getLocalizedValue(item, locale)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderQuoteCellView(cell: BentoQuoteCell, locale: "en" | "es") {
  return (
    <div className="flex h-full items-center gap-4 p-5">
      <div className="h-full w-1 flex-shrink-0 rounded-full bg-gradient-to-b from-[#3B82F6] to-transparent" />
      <div>
        <p className="text-sm leading-relaxed text-[#94A3B8] text-pretty italic">
          &ldquo;{getLocalizedValue(cell.quote, locale)}&rdquo;
        </p>
        <p className="mt-2 font-mono text-xs text-[#F1F5F9]">
          &mdash; {getLocalizedValue(cell.attribution, locale)}
        </p>
      </div>
    </div>
  );
}

function renderCellView(cell: BentoCellField, locale: "en" | "es") {
  switch (cell.cellType) {
    case "featured":
      return renderFeaturedCellView(cell, locale);
    case "stat":
      return renderStatCellView(cell, locale);
    case "feature":
      return renderFeatureCellView(cell, locale);
    case "featureList":
      return renderFeatureListCellView(cell, locale);
    case "quote":
      return renderQuoteCellView(cell, locale);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Edit mode cell content (with EditableText)
// ─────────────────────────────────────────────────────────────────────────────

function FeaturedImageEditor({
  cell,
  index,
  onImageUpdate,
}: {
  cell: BentoFeaturedCell;
  index: number;
  onImageUpdate: (index: number, data: { src: string; alt: LocalizedContent }) => void;
}) {
  const { locale } = useCatalyst();
  const [isOpen, setIsOpen] = useState(false);
  const [editSrc, setEditSrc] = useState(cell.image?.src ?? "");
  const [editAlt, setEditAlt] = useState(
    cell.image ? getLocalizedValue(cell.image.alt, locale) : "",
  );

  // Sync state when props change (and popover is closed)
  const imgSrc = cell.image?.src;
  const imgAlt = cell.image?.alt;
  // biome-ignore lint: only sync when popover closes or source data changes
  useEffect(() => {
    if (!isOpen) {
      setEditSrc(imgSrc ?? "");
      setEditAlt(imgAlt ? getLocalizedValue(imgAlt, locale) : "");
    }
  }, [imgSrc, imgAlt, locale, isOpen]);

  const handleSave = () => {
    const updatedAlt: LocalizedContent = {
      ...(cell.image?.alt ?? { en: "" }),
      [locale]: editAlt,
    };
    onImageUpdate(index, { src: editSrc, alt: updatedAlt });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditSrc(cell.image?.src ?? "");
    setEditAlt(
      cell.image ? getLocalizedValue(cell.image.alt, locale) : "",
    );
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleCancel();
    if (e.key === "Enter" && e.metaKey) handleSave();
  };

  if (!cell.image?.src) {
    return (
      <button
        type="button"
        onClick={() =>
          onImageUpdate(index, {
            src: "https://placehold.co/800x600/0F172A/1E293B?text=Background",
            alt: { en: "Background image" },
          })
        }
        className="absolute top-2 left-2 z-20 rounded-md border border-[#1E293B] bg-[#0A0E1A]/90 px-2 py-1 text-xs text-[#94A3B8] hover:text-[#F1F5F9]"
      >
        + Add image
      </button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <img
          src={cell.image.src}
          alt={getLocalizedValue(cell.image.alt, locale)}
          onClick={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
          tabIndex={0}
          role="button"
          className={cn(
            "absolute inset-0 z-0 h-full w-full object-cover",
            EDIT_CLASS,
            isOpen && EDITING_CLASS,
          )}
          title="Click to edit image"
        />
      </PopoverTrigger>
      <PopoverContent className="w-80" onKeyDown={handleKeyDown}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={`bento-img-url-${index}`}>Image URL</Label>
            <Input
              id={`bento-img-url-${index}`}
              type="text"
              value={editSrc}
              onChange={(e) => setEditSrc(e.target.value)}
              placeholder="https://example.com/image.jpg"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`bento-img-alt-${index}`}>
              Alt Text ({locale.toUpperCase()})
            </Label>
            <Input
              id={`bento-img-alt-${index}`}
              type="text"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              placeholder="Describe the image"
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

function renderFeaturedCellEdit(
  cell: BentoFeaturedCell,
  index: number,
  onTextUpdate: (index: number, field: string, content: LocalizedContent) => void,
  onImageUpdate: (index: number, data: { src: string; alt: LocalizedContent }) => void,
) {
  const hasImage = !!cell.image?.src;
  return (
    <div className="relative flex h-full flex-col justify-end p-6">
      {/* Background: image (clickable to edit) or decorative pattern */}
      {!hasImage && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #3B82F6 0.5px, transparent 0.5px), linear-gradient(225deg, #3B82F6 0.5px, transparent 0.5px)",
            backgroundSize: "20px 20px",
          }}
        />
      )}
      <FeaturedImageEditor
        cell={cell}
        index={index}
        onImageUpdate={onImageUpdate}
      />
      {/* Gradient overlay for text readability (clicks pass through to image) */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#0F1629] via-[#0F1629]/80 to-transparent" />
      <div className="relative z-10">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
          <EditableText
            content={cell.label}
            onUpdate={(c) => onTextUpdate(index, "label", c)}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        </span>
        <h3 className="mt-2 text-xl font-medium tracking-tight text-[#F1F5F9] sm:text-2xl">
          <EditableText
            content={cell.title}
            onUpdate={(c) => onTextUpdate(index, "title", c)}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
          <EditableText
            content={cell.description}
            onUpdate={(c) => onTextUpdate(index, "description", c)}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        </p>
      </div>
    </div>
  );
}

function renderStatCellEdit(
  cell: BentoStatCell,
  index: number,
  onTextUpdate: (index: number, field: string, content: LocalizedContent) => void,
) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
        <EditableText
          content={cell.label}
          onUpdate={(c) => onTextUpdate(index, "label", c)}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      </span>
      <span className="mt-2 font-mono text-4xl font-medium tracking-tight text-[#F1F5F9] sm:text-5xl">
        <EditableText
          content={cell.value}
          onUpdate={(c) => onTextUpdate(index, "value", c)}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      </span>
      <span className="mt-1 text-sm text-[#94A3B8]">
        <EditableText
          content={cell.suffix}
          onUpdate={(c) => onTextUpdate(index, "suffix", c)}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      </span>
    </div>
  );
}

function renderFeatureCellEdit(
  cell: BentoFeatureCell,
  index: number,
  onTextUpdate: (index: number, field: string, content: LocalizedContent) => void,
) {
  return (
    <div className="flex h-full flex-col justify-center p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-[#1E293B] bg-[#0A0E1A] text-lg">
        {cell.icon}
      </div>
      <h3 className="text-sm font-medium text-[#F1F5F9]">
        <EditableText
          content={cell.title}
          onUpdate={(c) => onTextUpdate(index, "title", c)}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">
        <EditableText
          content={cell.description}
          onUpdate={(c) => onTextUpdate(index, "description", c)}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      </p>
    </div>
  );
}

function renderFeatureListCellEdit(
  cell: BentoFeatureListCell,
  index: number,
  onTextUpdate: (index: number, field: string, content: LocalizedContent) => void,
) {
  return (
    <div className="flex h-full flex-col p-5">
      <h3 className="text-sm font-medium text-[#F1F5F9]">
        <EditableText
          content={cell.title}
          onUpdate={(c) => onTextUpdate(index, "title", c)}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      </h3>
      <div className="mt-1 h-px w-8 bg-gradient-to-r from-[#3B82F6] to-transparent" />
      <ul className="mt-4 flex flex-col gap-3">
        {cell.items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs text-[#94A3B8]"
          >
            <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#3B82F6]" />
            {getLocalizedValue(item, "en")}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-[#94A3B8]/50">
        Use cell editor to manage list items
      </p>
    </div>
  );
}

function renderQuoteCellEdit(
  cell: BentoQuoteCell,
  index: number,
  onTextUpdate: (index: number, field: string, content: LocalizedContent) => void,
) {
  return (
    <div className="flex h-full items-center gap-4 p-5">
      <div className="h-full w-1 flex-shrink-0 rounded-full bg-gradient-to-b from-[#3B82F6] to-transparent" />
      <div>
        <p className="text-sm leading-relaxed text-[#94A3B8] text-pretty italic">
          &ldquo;
          <EditableText
            content={cell.quote}
            onUpdate={(c) => onTextUpdate(index, "quote", c)}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
          &rdquo;
        </p>
        <p className="mt-2 font-mono text-xs text-[#F1F5F9]">
          &mdash;{" "}
          <EditableText
            content={cell.attribution}
            onUpdate={(c) => onTextUpdate(index, "attribution", c)}
            editClassName={EDIT_CLASS}
            editingClassName={EDITING_CLASS}
          />
        </p>
      </div>
    </div>
  );
}

function renderCellEdit(
  cell: BentoCellField,
  index: number,
  onTextUpdate: (index: number, field: string, content: LocalizedContent) => void,
  onImageUpdate: (index: number, data: { src: string; alt: LocalizedContent }) => void,
) {
  switch (cell.cellType) {
    case "featured":
      return renderFeaturedCellEdit(cell, index, onTextUpdate, onImageUpdate);
    case "stat":
      return renderStatCellEdit(cell, index, onTextUpdate);
    case "feature":
      return renderFeatureCellEdit(cell, index, onTextUpdate);
    case "featureList":
      return renderFeatureListCellEdit(cell, index, onTextUpdate);
    case "quote":
      return renderQuoteCellEdit(cell, index, onTextUpdate);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface EditableBentosProps {
  schema: BentosSectionSchema;
  onUpdate?: (schema: BentosSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

export function EditableBentos({
  schema,
  onUpdate,
  className,
  sectionControls,
}: EditableBentosProps) {
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
      const updatedSchema: BentosSectionSchema = {
        ...schema,
        variantDisabledFields:
          Object.keys(updatedVariantDisabled).length > 0
            ? updatedVariantDisabled
            : undefined,
      };
      onUpdate(updatedSchema);
    } else {
      const updatedSchema: BentosSectionSchema = {
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

  const handleCellUpdate = (index: number, cell: BentoCellField) => {
    const cells = [...fields.cells.value] as BentoCellField[];
    cells[index] = cell;
    updateField("cells", cells, onUpdate);
  };

  const handleCellTextUpdate = (
    index: number,
    field: string,
    content: LocalizedContent,
  ) => {
    const cells = [...fields.cells.value] as BentoCellField[];
    const cell = { ...cells[index] };
    (cell as Record<string, unknown>)[field] = content;
    cells[index] = cell as BentoCellField;
    updateField("cells", cells, onUpdate);
  };

  const handleCellImageUpdate = (
    index: number,
    data: { src: string; alt: LocalizedContent },
  ) => {
    const cells = [...fields.cells.value] as BentoCellField[];
    const cell = cells[index];
    if (cell.cellType === "featured") {
      cells[index] = {
        ...cell,
        image: { type: "image", src: data.src, alt: data.alt },
      };
      updateField("cells", cells, onUpdate);
    }
  };

  const handleAddCell = () => {
    const cells = [
      ...(fields.cells.value as BentoCellField[]),
      createDefaultCell("feature"),
    ];
    updateField("cells", cells, onUpdate);
  };

  const handleRemoveCell = (index: number) => {
    const cells = (fields.cells.value as BentoCellField[]).filter(
      (_, i) => i !== index,
    );
    updateField("cells", cells, onUpdate);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────────────────

  const activeVariant = isEditMode ? editingVariant : personalization.segment;
  const typedLocale = locale as "en" | "es";

  if (!isEditMode) {
    const viewCells: BentoCell[] = (
      fields.cells.value as BentoCellField[]
    ).map((cell) => ({
      size: cell.size,
      content: renderCellView(cell, typedLocale),
    }));

    return (
      <Bentos
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
        description={
          isFieldEnabled(schema, "description", activeVariant)
            ? getLocalizedValue(fields.description.value, locale)
            : undefined
        }
        cells={viewCells}
        className={className}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Edit Mode
  // ─────────────────────────────────────────────────────────────────────────

  const editCells: BentoCell[] = (
    fields.cells.value as BentoCellField[]
  ).map((cell, index) => ({
    size: cell.size,
    content: (
      <div className="group/cell relative h-full">
        <BentoCellEditorPopover
          cell={cell}
          index={index}
          locale={locale}
          onUpdate={handleCellUpdate}
          onRemove={handleRemoveCell}
        />
        {renderCellEdit(cell, index, handleCellTextUpdate, handleCellImageUpdate)}
      </div>
    ),
  }));

  return (
    <Bentos
      className={className}
      editBar={
        <SectionEditBar
          sectionType={schema.type}
          controls={sectionControls}
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
          fieldToggles={BENTOS_FIELD_TOGGLES}
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
      cells={editCells}
      addCellButton={
        <button
          type="button"
          onClick={handleAddCell}
          className="flex min-h-[160px] items-center justify-center rounded-lg border-2 border-dashed border-[#1E293B] text-[#94A3B8] transition-colors hover:border-[#3B82F6]/50 hover:text-[#3B82F6]"
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="size-8" />
            <span className="text-sm font-medium">Add cell</span>
          </div>
        </button>
      }
    />
  );
}
