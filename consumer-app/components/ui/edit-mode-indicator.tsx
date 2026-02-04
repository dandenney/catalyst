"use client";

import { useCatalyst } from "catalyst";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "./button";
import { type SectionType } from "./section-controls";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

interface AddSectionOption {
  type: SectionType;
  label: string;
}

interface EditModeIndicatorProps {
  addSectionOptions?: AddSectionOption[];
  onAddSection?: (type: SectionType) => void;
}

export function EditModeIndicator({
  addSectionOptions,
  onAddSection,
}: EditModeIndicatorProps) {
  const { isEditMode, locale, personalization } = useCatalyst();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const canAdd = !!addSectionOptions?.length && !!onAddSection;

  if (!isEditMode) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-0 right-0 z-50 flex justify-center">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-blue-500/40" />
      <div className="pointer-events-auto relative flex items-center gap-3 rounded-full bg-blue-600 px-4 py-2 text-sm text-white shadow-lg">
        <div className="text-center">
          <div className="font-semibold">Edit Mode</div>
          <div className="text-blue-200 text-xs">
            Locale: {locale}
            {personalization.segment && ` | Segment: ${personalization.segment}`}
          </div>
        </div>
        {canAdd && (
          <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="glow"
                size="icon"
                className="size-8 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-400"
                aria-label="Add section"
                title="Add section"
              >
                <Plus className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add section</SheetTitle>
                <SheetDescription>Select a section to add</SheetDescription>
              </SheetHeader>
              <div className="space-y-3 py-6">
                {addSectionOptions?.map((option) => (
                  <Button
                    key={option.type}
                    type="button"
                    variant="outline"
                    onClick={() => {
                      onAddSection?.(option.type);
                      setIsAddOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}
