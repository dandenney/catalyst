"use client";

import { useState, useMemo } from "react";

import { cn } from "@/lib/utils";
import { ICON_REGISTRY, type IconEntry } from "@/lib/icon-registry";

import { Input } from "./input";

interface IconPickerProps {
  value: string;
  onSelect: (iconKey: string) => void;
  className?: string;
}

export function IconPicker({ value, onSelect, className }: IconPickerProps) {
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      return ICON_REGISTRY;
    }
    const searchLower = search.toLowerCase();
    return ICON_REGISTRY.filter(
      (icon) =>
        icon.key.toLowerCase().includes(searchLower) ||
        icon.label.toLowerCase().includes(searchLower)
    );
  }, [search]);

  return (
    <div className={cn("space-y-3", className)}>
      <Input
        type="text"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto">
        {filteredIcons.map((icon) => (
          <IconButton
            key={icon.key}
            icon={icon}
            isSelected={value === icon.key}
            onSelect={onSelect}
          />
        ))}
      </div>
      {filteredIcons.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No icons found
        </p>
      )}
    </div>
  );
}

interface IconButtonProps {
  icon: IconEntry;
  isSelected: boolean;
  onSelect: (iconKey: string) => void;
}

function IconButton({ icon, isSelected, onSelect }: IconButtonProps) {
  const IconComponent = icon.component;

  return (
    <button
      type="button"
      onClick={() => onSelect(icon.key)}
      className={cn(
        "flex items-center justify-center p-2 rounded-md border transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isSelected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border"
      )}
      title={icon.label}
    >
      <IconComponent className="size-5 stroke-1" />
    </button>
  );
}
