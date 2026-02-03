"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { getIconComponent } from "@/lib/icon-registry";

import {
  EditableText,
  type LocalizedContent,
  type ItemsSectionSchema,
  type ItemField,
  getLocalizedValue,
  useCatalyst,
  useVariantHandling,
} from "catalyst";

import { Button } from "../../ui/button";
import { IconPicker } from "../../ui/icon-picker";
import { Input } from "../../ui/input";
import { Item, ItemDescription, ItemIcon, ItemTitle } from "../../ui/item";
import { Label } from "../../ui/label";
import { Section } from "../../ui/section";
import { type SectionControls } from "../../ui/section-controls";
import SectionEditBar from "../../ui/section-edit-bar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";
import { Textarea } from "../../ui/textarea";

// Consistent edit-mode styling for all editable items
const EDIT_CLASS =
  "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const EDITING_CLASS =
  "outline-2 outline-solid outline-primary outline-offset-2";

interface SchemaItemsProps {
  schema: ItemsSectionSchema;
  onUpdate?: (schema: ItemsSectionSchema) => void;
  className?: string;
  sectionControls?: SectionControls;
}

interface EditableItemProps {
  item: ItemField;
  index: number;
  onUpdate: (index: number, item: ItemField) => void;
}

function EditableItem({ item, index, onUpdate }: EditableItemProps) {
  const { isEditMode, locale } = useCatalyst();
  const [isOpen, setIsOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIconKey, setEditIconKey] = useState("");

  const displayTitle = getLocalizedValue(item.title, locale);
  const displayDescription = getLocalizedValue(item.description, locale);
  const IconComponent = getIconComponent(item.icon.iconKey);

  const handleOpen = () => {
    if (!isEditMode) return;
    setEditTitle(displayTitle);
    setEditDescription(displayDescription);
    setEditIconKey(item.icon.iconKey);
    setIsOpen(true);
  };

  const handleSave = () => {
    const updatedItem: ItemField = {
      ...item,
      title: { ...item.title, [locale]: editTitle },
      description: { ...item.description, [locale]: editDescription },
      icon: { type: "icon", iconKey: editIconKey },
    };
    onUpdate(index, updatedItem);
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
      <Item
        className={cn(editOutlineClass, isEditMode && "cursor-pointer")}
        onClick={handleOpen}
        title={isEditMode ? "Click to edit item" : undefined}
      >
        <ItemTitle className="flex items-center gap-2">
          <ItemIcon>
            {IconComponent && <IconComponent className="size-5 stroke-1" />}
          </ItemIcon>
          {displayTitle}
        </ItemTitle>
        <ItemDescription>{displayDescription}</ItemDescription>
      </Item>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Item</SheetTitle>
            <SheetDescription>
              Edit the title, description, and icon for this item.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor={`item-title-${index}`}>
                Title ({locale.toUpperCase()})
              </Label>
              <Input
                id={`item-title-${index}`}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Item title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`item-description-${index}`}>
                Description ({locale.toUpperCase()})
              </Label>
              <Textarea
                id={`item-description-${index}`}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Item description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <IconPicker value={editIconKey} onSelect={setEditIconKey} />
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

export default function SchemaItems({
  schema,
  onUpdate,
  className,
  sectionControls,
}: SchemaItemsProps) {
  const { displaySchema, editingVariant, setEditingVariant, updateField } =
    useVariantHandling({ schema });

  const { fields } = displaySchema;

  const handleTitleUpdate = (content: LocalizedContent) => {
    updateField("title", content, onUpdate);
  };

  const handleItemUpdate = (index: number, updatedItem: ItemField) => {
    const newItems = [...fields.items.value];
    newItems[index] = updatedItem;
    updateField("items", newItems, onUpdate);
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
      <div className="max-w-container mx-auto flex flex-col items-center gap-6 sm:gap-20">
        <EditableText
          content={fields.title.value}
          onUpdate={handleTitleUpdate}
          as="h2"
          className="max-w-[560px] text-center text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight"
          editClassName={EDIT_CLASS}
          editingClassName={EDITING_CLASS}
        />
        {fields.items.value.length > 0 && (
          <div className="grid auto-rows-fr grid-cols-2 gap-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {fields.items.value.map((item, index) => (
              <EditableItem
                key={`item-${index}`}
                item={item}
                index={index}
                onUpdate={handleItemUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
