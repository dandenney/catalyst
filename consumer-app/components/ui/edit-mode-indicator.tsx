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
  thumbnail?: string;
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
            <SheetContent
              side="right"
              className="overflow-y-auto !w-full !max-w-3xl"
            >
              <SheetHeader>
                <SheetTitle>Add section</SheetTitle>
                <SheetDescription>
                  Choose a section to add to your page
                </SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-4 py-6">
                {addSectionOptions?.map((option) => (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => {
                      onAddSection?.(option.type);
                      setIsAddOpen(false);
                    }}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#0A0E1A] text-left transition-all hover:border-blue-500/50 hover:ring-1 hover:ring-blue-500/25"
                  >
                    {option.thumbnail ? (
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <img
                          src={option.thumbnail}
                          alt={`${option.label} preview`}
                          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#0F1629] text-[#94A3B8]">
                        <Plus className="size-8 opacity-40" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 border-t border-[#1E293B] px-3 py-2.5">
                      <span className="text-sm font-medium text-[#F1F5F9]">
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}
