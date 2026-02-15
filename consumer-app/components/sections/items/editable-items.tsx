"use client";

import {
  EditableText,
  type FieldToggleConfig,
  getDisabledFields,
  getLocalizedValue,
  isFieldEnabled,
  type ItemField,
  type ItemsSectionSchema,
  type Locale,
  type LocalizedContent,
  useCatalyst,
  useVariantHandling,
} from "catalyst";
import { ArrowRight, Check, Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getIconComponent } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";
import { IconPicker } from "../../ui/icon-picker";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import { Items } from "./items";

// Edit mode styling
const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

// Field toggle configuration
const ITEMS_FIELD_TOGGLES: FieldToggleConfig[] = [
  { key: "label", label: "Label" },
  { key: "title", label: "Heading" },
  { key: "description", label: "Description" },
];

// Curated icon color palette — all tested to work on #0A0E1A background
const ICON_COLORS = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Amber" },
  { value: "#EF4444", label: "Red" },
  { value: "#06B6D4", label: "Cyan" },
];

const DEFAULT_ICON_COLOR = "#3B82F6";

// Default item for adding new items
function createDefaultItem(): ItemField {
  return {
    type: "item",
    title: { en: "New feature" },
    description: { en: "Add a description for this feature." },
    icon: { type: "icon", iconKey: "sparkles" },
    linkText: { en: "Learn more" },
    linkUrl: { en: "#" },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-item editor popover (icon picker, color, link fields)
// ─────────────────────────────────────────────────────────────────────────────

interface ItemEditorProps {
  item: ItemField;
  locale: Locale;
  onSave: (updatedItem: ItemField) => void;
}

function ItemEditor({ item, locale, onSave }: ItemEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editIconKey, setEditIconKey] = useState(item.icon.iconKey);
  const [editIconColor, setEditIconColor] = useState(
    item.iconColor || DEFAULT_ICON_COLOR,
  );
  const [editLinkText, setEditLinkText] = useState(
    item.linkText ? getLocalizedValue(item.linkText, locale) : "Learn more",
  );
  const [editLinkUrl, setEditLinkUrl] = useState(
    item.linkUrl ? getLocalizedValue(item.linkUrl, locale) : "#",
  );

  useEffect(() => {
    if (!isOpen) {
      setEditIconKey(item.icon.iconKey);
      setEditIconColor(item.iconColor || DEFAULT_ICON_COLOR);
      setEditLinkText(
        item.linkText ? getLocalizedValue(item.linkText, locale) : "Learn more",
      );
      setEditLinkUrl(
        item.linkUrl ? getLocalizedValue(item.linkUrl, locale) : "#",
      );
    }
  }, [item, locale, isOpen]);

  const handleSave = useCallback(() => {
    onSave({
      ...item,
      icon: { type: "icon", iconKey: editIconKey },
      iconColor: editIconColor === DEFAULT_ICON_COLOR ? undefined : editIconColor,
      linkText: { ...(item.linkText || { en: "" }), [locale]: editLinkText },
      linkUrl: { ...(item.linkUrl || { en: "" }), [locale]: editLinkUrl },
    });
    setIsOpen(false);
  }, [item, editIconKey, editIconColor, editLinkText, editLinkUrl, locale, onSave]);

  const handleCancel = useCallback(() => {
    setEditIconKey(item.icon.iconKey);
    setEditIconColor(item.iconColor || DEFAULT_ICON_COLOR);
    setEditLinkText(
      item.linkText ? getLocalizedValue(item.linkText, locale) : "Learn more",
    );
    setEditLinkUrl(
      item.linkUrl ? getLocalizedValue(item.linkUrl, locale) : "#",
    );
    setIsOpen(false);
  }, [item, locale]);

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
          className="absolute -right-2 -top-2 z-10 flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-500 opacity-0 group-hover/card:opacity-100"
          title="Edit item"
        >
          <Pencil className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[70vh] overflow-y-auto" onKeyDown={handleKeyDown}>
        <div className="space-y-4">
          {/* Icon picker */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <IconPicker value={editIconKey} onSelect={setEditIconKey} className="[&>div:last-child]:max-h-[120px]" />
          </div>

          {/* Icon color */}
          <div className="space-y-2">
            <Label>Icon Color</Label>
            <div className="flex gap-2">
              {ICON_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setEditIconColor(color.value)}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border-2 transition-all",
                    editIconColor === color.value
                      ? "border-white scale-110"
                      : "border-transparent hover:border-white/40",
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                >
                  {editIconColor === color.value && (
                    <Check className="size-3.5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Link text */}
          <div className="space-y-2">
            <Label htmlFor="item-link-text">
              Link Text ({locale.toUpperCase()})
            </Label>
            <Input
              id="item-link-text"
              type="text"
              value={editLinkText}
              onChange={(e) => setEditLinkText(e.target.value)}
              placeholder="Learn more"
            />
          </div>

          {/* Link URL */}
          <div className="space-y-2">
            <Label htmlFor="item-link-url">
              URL ({locale.toUpperCase()})
            </Label>
            <Input
              id="item-link-url"
              type="text"
              value={editLinkUrl}
              onChange={(e) => setEditLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          {/* Actions */}
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
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface EditableItemsProps {
  schema: ItemsSectionSchema;
  onUpdate?: (schema: ItemsSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

export function EditableItems({
  schema,
  onUpdate,
  className,
  sectionControls,
}: EditableItemsProps) {
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
      const updatedSchema: ItemsSectionSchema = {
        ...schema,
        variantDisabledFields:
          Object.keys(updatedVariantDisabled).length > 0
            ? updatedVariantDisabled
            : undefined,
      };
      onUpdate(updatedSchema);
    } else {
      const updatedSchema: ItemsSectionSchema = {
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

  const handleItemTitleUpdate = (index: number, content: LocalizedContent) => {
    const items = [...fields.items.value] as ItemField[];
    items[index] = { ...items[index], title: content };
    updateField("items", items, onUpdate);
  };

  const handleItemDescriptionUpdate = (
    index: number,
    content: LocalizedContent,
  ) => {
    const items = [...fields.items.value] as ItemField[];
    items[index] = { ...items[index], description: content };
    updateField("items", items, onUpdate);
  };

  const handleItemUpdate = (index: number, updatedItem: ItemField) => {
    const items = [...fields.items.value] as ItemField[];
    items[index] = updatedItem;
    updateField("items", items, onUpdate);
  };

  const handleAddItem = () => {
    const items = [
      ...(fields.items.value as ItemField[]),
      createDefaultItem(),
    ];
    updateField("items", items, onUpdate);
  };

  const handleRemoveItem = (index: number) => {
    const items = (fields.items.value as ItemField[]).filter(
      (_, i) => i !== index,
    );
    updateField("items", items, onUpdate);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // View Mode
  // ─────────────────────────────────────────────────────────────────────────

  const activeVariant = isEditMode ? editingVariant : personalization.segment;

  if (!isEditMode) {
    const viewItems = (fields.items.value as ItemField[]).map((item) => {
      const IconComponent = getIconComponent(item.icon.iconKey);
      const iconColor = item.iconColor || DEFAULT_ICON_COLOR;
      const linkText = item.linkText
        ? getLocalizedValue(item.linkText, locale)
        : undefined;
      const linkUrl = item.linkUrl
        ? getLocalizedValue(item.linkUrl, locale)
        : undefined;

      return {
        icon: IconComponent ? (
          <IconComponent className="size-6" style={{ color: iconColor }} />
        ) : (
          <div className="size-6" />
        ),
        title: getLocalizedValue(item.title, locale),
        description: getLocalizedValue(item.description, locale),
        link:
          linkText && linkUrl ? (
            <a
              href={linkUrl}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#3B82F6] transition-colors hover:text-[#60A5FA]"
            >
              {linkText}
              <ArrowRight className="size-3.5" />
            </a>
          ) : undefined,
      };
    });

    return (
      <Items
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
        items={viewItems}
        className={className}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Edit Mode
  // ─────────────────────────────────────────────────────────────────────────

  const editItems = (fields.items.value as ItemField[]).map((item, index) => {
    const IconComponent = getIconComponent(item.icon.iconKey);
    const iconColor = item.iconColor || DEFAULT_ICON_COLOR;
    const linkText = item.linkText
      ? getLocalizedValue(item.linkText, locale)
      : "Learn more";

    return {
      icon: IconComponent ? (
        <IconComponent className="size-6" style={{ color: iconColor }} />
      ) : (
        <div className="size-6" />
      ),
      title: (
        <EditableText
          content={item.title}
          onUpdate={(content) => handleItemTitleUpdate(index, content)}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      ),
      description: (
        <EditableText
          content={item.description}
          onUpdate={(content) => handleItemDescriptionUpdate(index, content)}
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
      ),
      link: (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-[#3B82F6]">
          {linkText}
          <ArrowRight className="size-3.5" />
        </span>
      ),
      onRemove: () => handleRemoveItem(index),
    };
  });

  // Inject per-item editor popovers by wrapping each item card
  const editItemsWithEditors = editItems.map((item, index) => ({
    ...item,
    icon: (
      <div className="relative">
        {item.icon}
        <ItemEditor
          item={(fields.items.value as ItemField[])[index]}
          locale={locale}
          onSave={(updatedItem) => handleItemUpdate(index, updatedItem)}
        />
      </div>
    ),
  }));

  return (
    <Items
      className={className}
      editBar={
        <SectionEditBar
          sectionType={schema.type}
          controls={sectionControls}
          variants={schema.variants}
          currentVariant={editingVariant}
          onVariantChange={setEditingVariant}
          fieldToggles={ITEMS_FIELD_TOGGLES}
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
      items={editItemsWithEditors}
      addItemButton={
        <button
          type="button"
          onClick={handleAddItem}
          className="flex min-h-[160px] items-center justify-center rounded-lg border-2 border-dashed border-[#1E293B] text-[#94A3B8] transition-colors hover:border-[#3B82F6]/50 hover:text-[#3B82F6]"
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="size-8" />
            <span className="text-sm font-medium">Add feature</span>
          </div>
        </button>
      }
    />
  );
}
