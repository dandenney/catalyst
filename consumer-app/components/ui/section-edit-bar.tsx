"use client";

import { type FieldToggleConfig, useCatalyst } from "catalyst";
import { Pencil } from "lucide-react";

import { type SectionControls } from "./section-controls";
import SectionEditSheet from "./section-edit-sheet";

function getSectionLabel(type: string) {
  if (type.endsWith("Section")) {
    return type.slice(0, -"Section".length);
  }
  return type;
}

interface SectionEditBarProps {
  sectionType: string;
  controls?: SectionControls;
  variants?: Record<string, unknown>;
  currentVariant?: string | null;
  onVariantChange?: (variant: string | null) => void;
  fieldToggles?: FieldToggleConfig[];
  disabledFields?: string[];
  onToggleField?: (fieldKey: string) => void;
}

export default function SectionEditBar({
  sectionType,
  controls,
  variants,
  currentVariant,
  onVariantChange,
  fieldToggles,
  disabledFields,
  onToggleField,
}: SectionEditBarProps) {
  const { isEditMode } = useCatalyst();

  if (!isEditMode || !controls) return null;

  const label = `Edit ${getSectionLabel(sectionType)}`;

  return (
    <div className="relative mb-8">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-blue-500/40" />
      <div className="max-w-container mx-auto flex justify-center">
        <SectionEditSheet
          sectionType={sectionType}
          controls={controls}
          variants={variants}
          currentVariant={currentVariant}
          onVariantChange={onVariantChange}
          fieldToggles={fieldToggles}
          disabledFields={disabledFields}
          onToggleField={onToggleField}
          trigger={
            <button
              type="button"
              className="relative z-10 flex items-center gap-3 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500"
              aria-label={label}
              title={label}
            >
              <span className="flex flex-col items-start leading-tight">
                <span className="font-semibold">{label}</span>
              </span>
              <span className="flex size-7 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                <Pencil className="size-4" />
              </span>
            </button>
          }
        />
      </div>
    </div>
  );
}
