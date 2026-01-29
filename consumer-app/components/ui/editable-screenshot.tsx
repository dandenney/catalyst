"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import {
  type LocalizedContent,
  getLocalizedValue,
  useCatalyst,
} from "catalyst";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface EditableScreenshotProps {
  srcLight: string;
  srcDark?: string;
  alt: LocalizedContent;
  width: number;
  height: number;
  className?: string;
  onUpdate?: (data: {
    srcLight: string;
    srcDark?: string;
    alt: LocalizedContent;
  }) => void;
  /** Custom class for edit mode outline */
  editClassName?: string;
  /** Custom class for active/open state outline */
  editingClassName?: string;
}

const defaultEditClass = "cursor-pointer outline-1 outline-dashed outline-primary/50 outline-offset-2";
const defaultEditingClass = "outline-2 outline-solid outline-primary outline-offset-2";

export default function EditableScreenshot({
  srcLight,
  srcDark,
  alt,
  width,
  height,
  className,
  onUpdate,
  editClassName,
  editingClassName,
}: EditableScreenshotProps) {
  const { locale, isEditMode } = useCatalyst();
  const { resolvedTheme } = useTheme();
  const [src, setSrc] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editSrcLight, setEditSrcLight] = useState(srcLight);
  const [editSrcDark, setEditSrcDark] = useState(srcDark || "");
  const [editAlt, setEditAlt] = useState(getLocalizedValue(alt, locale));

  useEffect(() => {
    if (resolvedTheme) {
      setSrc(resolvedTheme === "light" ? srcLight : srcDark || srcLight);
    }
  }, [resolvedTheme, srcLight, srcDark]);

  // Sync edit state when props change or popover closes
  useEffect(() => {
    if (!isOpen) {
      setEditSrcLight(srcLight);
      setEditSrcDark(srcDark || "");
      setEditAlt(getLocalizedValue(alt, locale));
    }
  }, [isOpen, srcLight, srcDark, alt, locale]);

  const handleSave = useCallback(() => {
    onUpdate?.({
      srcLight: editSrcLight,
      srcDark: editSrcDark || undefined,
      alt: { ...alt, [locale]: editAlt },
    });
    setIsOpen(false);
  }, [editSrcLight, editSrcDark, editAlt, alt, locale, onUpdate]);

  const handleCancel = useCallback(() => {
    setEditSrcLight(srcLight);
    setEditSrcDark(srcDark || "");
    setEditAlt(getLocalizedValue(alt, locale));
    setIsOpen(false);
  }, [srcLight, srcDark, alt, locale]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      } else if (e.key === "Enter" && e.metaKey) {
        handleSave();
      }
    },
    [handleCancel, handleSave],
  );

  if (!src) {
    return (
      <div
        style={{ width, height }}
        className={cn("bg-muted", className)}
        aria-label={getLocalizedValue(alt, locale)}
      />
    );
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => isEditMode && setIsOpen(open)}
    >
      <PopoverTrigger asChild>
        <div
          onClick={() => isEditMode && setIsOpen(true)}
          className={cn(
            isEditMode && (editClassName ?? defaultEditClass),
            isOpen && (editingClassName ?? defaultEditingClass),
          )}
          title={isEditMode ? "Click to edit image" : undefined}
        >
          <Image
            src={src}
            alt={getLocalizedValue(alt, locale)}
            width={width}
            height={height}
            className={className}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80" onKeyDown={handleKeyDown}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="screenshot-light-url">Light Image URL</Label>
            <Input
              id="screenshot-light-url"
              type="text"
              value={editSrcLight}
              onChange={(e) => setEditSrcLight(e.target.value)}
              placeholder="/image-light.png…"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot-dark-url">Dark Image URL</Label>
            <Input
              id="screenshot-dark-url"
              type="text"
              value={editSrcDark}
              onChange={(e) => setEditSrcDark(e.target.value)}
              placeholder="/image-dark.png (optional)…"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot-alt">
              Alt Text ({locale.toUpperCase()})
            </Label>
            <Input
              id="screenshot-alt"
              type="text"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              placeholder="Describe the image…"
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
