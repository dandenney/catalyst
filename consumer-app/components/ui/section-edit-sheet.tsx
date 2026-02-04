"use client";

import { useCatalyst } from "catalyst";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { type ReactNode,useState } from "react";

import { Button } from "./button";
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
  const hasVariants = variantKeys.length > 0;
  let baseValue = "__base__";
  if (variantKeys.includes(baseValue)) {
    baseValue = "__base_default__";
  }
  const selectedVariant = currentVariant ?? baseValue;

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
        <div className="space-y-3 py-6">
          {hasVariants && onVariantChange && selectedVariant && (
            <div className="space-y-3">
              <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Variant
              </div>
              <div className="relative">
                <select
                  value={selectedVariant}
                  onChange={(event) => {
                    const value = event.target.value;
                    onVariantChange(value === baseValue ? null : value);
                  }}
                  className="border-input bg-background text-foreground h-10 w-full appearance-none rounded-md border px-3 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value={baseValue}>Default</option>
                  {variantKeys.map((variant) => (
                    <option key={variant} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
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
