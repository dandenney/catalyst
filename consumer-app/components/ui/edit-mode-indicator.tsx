"use client";

import { useCatalyst } from "catalyst";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "./button";
import { LanguageToggle } from "./language-toggle";
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
  const { isEditMode, personalization } = useCatalyst();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const canAdd = !!addSectionOptions?.length && !!onAddSection;

  if (!isEditMode) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-0 right-0 z-50 flex justify-center">
      <div className="pointer-events-auto relative flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 pl-4 pr-2 py-2 text-sm text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/10">
        {/* Edit Mode Badge */}
        <div className="flex items-center gap-2 pr-2 border-r border-white/20">
          <div className="flex items-center justify-center size-5 rounded-full bg-white/15">
            <Pencil className="size-3" />
          </div>
          <span className="font-medium">Edit Mode</span>
        </div>

        {/* Language Toggle */}
        <div className="px-1">
          <LanguageToggle />
        </div>

        {/* Segment Badge (if active) */}
        {personalization.segment && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-medium">
            <span className="size-1.5 rounded-full bg-amber-400" />
            {personalization.segment}
          </div>
        )}

        {/* Add Section Button */}
        {canAdd && (
          <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white ml-1"
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
