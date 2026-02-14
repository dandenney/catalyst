"use client";

import { ArrowDown, ArrowUp, Check, ChevronDown, Settings2, X } from "lucide-react";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  type ContentItem,
  type ContentType,
  CONTENT_TYPE_LABELS,
} from "@/types/content";

const ALL_CONTENT_TYPES: ContentType[] = [
  "courses",
  "projects",
  "assessments",
  "learning_paths",
];

interface ContentPickerProps {
  contentType: ContentType;
  selectedIds: string[];
  availableItems: ContentItem[];
  onContentTypeChange: (type: ContentType) => void;
  onSelectionChange: (ids: string[]) => void;
}

export function ContentPicker({
  contentType,
  selectedIds,
  availableItems,
  onContentTypeChange,
  onSelectionChange,
}: ContentPickerProps) {
  const [open, setOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  const selectedItems = selectedIds
    .map((id) => availableItems.find((item) => item.id === id))
    .filter(Boolean) as ContentItem[];

  const unselectedItems = availableItems.filter(
    (item) => !selectedIds.includes(item.id),
  );

  const addItem = (id: string) => {
    onSelectionChange([...selectedIds, id]);
  };

  const removeItem = (id: string) => {
    onSelectionChange(selectedIds.filter((sid) => sid !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const ids = [...selectedIds];
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    onSelectionChange(ids);
  };

  const moveDown = (index: number) => {
    if (index >= selectedIds.length - 1) return;
    const ids = [...selectedIds];
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    onSelectionChange(ids);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-500"
          title="Edit content selection"
        >
          <Settings2 className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 border-[#1E293B] bg-[#0F1629] p-0"
        side="bottom"
        align="end"
        onInteractOutside={(e) => {
          // Prevent close when interacting with picker internals (portal click-through)
          e.preventDefault();
        }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Content type selector */}
        <div className="border-b border-[#1E293B] p-3">
          <label className="mb-1.5 block text-xs font-medium text-[#94A3B8]">
            Content Type
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              className="flex w-full items-center justify-between rounded-md border border-[#1E293B] bg-[#0A0E1A] px-3 py-2 text-sm text-[#F1F5F9] transition-colors hover:border-[#3B82F6]/50"
            >
              {CONTENT_TYPE_LABELS[contentType]}
              <ChevronDown className="size-3.5 text-[#94A3B8]" />
            </button>
            {typeDropdownOpen && (
              <div className="absolute top-full z-10 mt-1 w-full rounded-md border border-[#1E293B] bg-[#0A0E1A] py-1 shadow-xl">
                {ALL_CONTENT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      onContentTypeChange(type);
                      setTypeDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-[#1E293B] ${
                      type === contentType
                        ? "text-[#3B82F6]"
                        : "text-[#F1F5F9]"
                    }`}
                  >
                    {type === contentType && <Check className="size-3" />}
                    <span className={type === contentType ? "" : "ml-5"}>
                      {CONTENT_TYPE_LABELS[type]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto">
          {/* Selected items — ordered, with reorder controls */}
          {selectedItems.length > 0 && (
            <div className="border-b border-[#1E293B] p-1">
              <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#3B82F6]">
                Selected ({selectedItems.length})
              </p>
              {selectedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-[#1E293B]"
                >
                  {/* Reorder arrows */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="text-[#94A3B8] transition-colors hover:text-[#F1F5F9] disabled:opacity-20"
                      aria-label="Move up"
                    >
                      <ArrowUp className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === selectedItems.length - 1}
                      className="text-[#94A3B8] transition-colors hover:text-[#F1F5F9] disabled:opacity-20"
                      aria-label="Move down"
                    >
                      <ArrowDown className="size-3" />
                    </button>
                  </div>

                  <span className="flex-1 truncate px-1 text-sm text-[#F1F5F9]">
                    {item.title}
                  </span>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="flex size-5 shrink-0 items-center justify-center rounded text-[#94A3B8] transition-colors hover:bg-red-500/20 hover:text-red-400"
                    aria-label={`Remove ${item.title}`}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Available items — unselected, click to add */}
          {unselectedItems.length > 0 && (
            <div className="p-1">
              <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
                Available ({unselectedItems.length})
              </p>
              {unselectedItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addItem(item.id)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[#94A3B8] transition-colors hover:bg-[#1E293B] hover:text-[#F1F5F9]"
                >
                  <span className="size-4 shrink-0 rounded border border-[#1E293B]" />
                  <span className="truncate">{item.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1E293B] px-3 py-2">
          <span className="text-xs text-[#94A3B8]">
            {selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded px-2 py-1 text-xs font-medium text-[#3B82F6] transition-colors hover:bg-[#1E293B]"
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
