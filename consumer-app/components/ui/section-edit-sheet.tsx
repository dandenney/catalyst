"use client";

import { useCatalyst } from "catalyst";
import { ArrowDown, ArrowUp, Pencil, Plus, Users } from "lucide-react";
import { type ReactNode, useState } from "react";

import { Button } from "./button";
import { Input } from "./input";
import { type SectionControls } from "./section-controls";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

interface SectionEditSheetProps {
  sectionType: string;
  controls?: SectionControls;
  variants?: Record<string, unknown>;
  currentVariant?: string | null;
  onVariantChange?: (variant: string | null) => void;
  trigger?: ReactNode;
}

export default function SectionEditSheet({
  sectionType,
  controls,
  variants,
  currentVariant,
  onVariantChange,
  trigger,
}: SectionEditSheetProps) {
  const { isEditMode } = useCatalyst();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingVariant, setIsCreatingVariant] = useState(false);
  const [newVariantName, setNewVariantName] = useState("");

  if (!isEditMode || !controls) return null;

  const handleMoveUp = () => {
    controls.onMoveUp();
  };

  const handleMoveDown = () => {
    controls.onMoveDown();
  };

  const handleRemove = () => {
    controls.onRemove();
    setIsOpen(false);
  };

  const variantKeys = variants ? Object.keys(variants) : [];

  const handleCreateVariant = () => {
    if (!newVariantName.trim() || !onVariantChange) return;
    onVariantChange(newVariantName.trim());
    setNewVariantName("");
    setIsCreatingVariant(false);
  };

  const handleCancelCreate = () => {
    setNewVariantName("");
    setIsCreatingVariant(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="glow"
            size="icon"
            className="size-9 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-500"
            aria-label={`Edit ${sectionType}`}
            title={`Edit ${sectionType}`}
          >
            <Pencil className="size-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="flex h-full flex-col">
        <SheetHeader>
          <SheetTitle>{sectionType}</SheetTitle>
          <SheetDescription>Section controls</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-6">
          {/* Variant Section - Always visible when onVariantChange is provided */}
          {onVariantChange && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                <Users className="size-3.5" />
                Personalization Variants
              </div>

              {/* Variant Selector */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {/* Base/Default option */}
                  <button
                    type="button"
                    onClick={() => onVariantChange(null)}
                    className={`
                      px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                      ${
                        currentVariant === null
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      }
                    `}
                  >
                    Base
                  </button>

                  {/* Existing variants */}
                  {variantKeys.map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => onVariantChange(variant)}
                      className={`
                        px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                        ${
                          currentVariant === variant
                            ? "bg-amber-500 text-white"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        }
                      `}
                    >
                      {variant}
                    </button>
                  ))}
                </div>

                {/* Create new variant */}
                {isCreatingVariant ? (
                  <div className="flex gap-2 mt-3">
                    <Input
                      type="text"
                      value={newVariantName}
                      onChange={(e) => setNewVariantName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateVariant();
                        if (e.key === "Escape") handleCancelCreate();
                      }}
                      placeholder="e.g., premium, mobile, finance..."
                      autoFocus
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateVariant}
                      disabled={!newVariantName.trim()}
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelCreate}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCreatingVariant(true)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
                  >
                    <Plus className="size-3.5" />
                    Add variant
                  </button>
                )}
              </div>

              {/* Help text */}
              <p className="text-xs text-muted-foreground">
                {currentVariant
                  ? `Editing "${currentVariant}" variant. Changes only affect this variant.`
                  : "Editing base content. Create variants for personalized experiences."}
              </p>
            </div>
          )}

          {/* Section Order Controls */}
          <div className="space-y-3">
            <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
              Section Order
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!controls.canMoveUp}
                onClick={handleMoveUp}
                className="flex-1 justify-center gap-2"
              >
                <ArrowUp className="size-4" />
                Move up
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!controls.canMoveDown}
                onClick={handleMoveDown}
                className="flex-1 justify-center gap-2"
              >
                <ArrowDown className="size-4" />
                Move down
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1" />
        <SheetFooter className="pt-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemove}
            className="w-full justify-start"
          >
            Remove section
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
