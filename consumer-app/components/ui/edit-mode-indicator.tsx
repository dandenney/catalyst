"use client";

import { useCatalyst } from "catalyst";

export function EditModeIndicator() {
  const { isEditMode, locale, personalization } = useCatalyst();

  if (!isEditMode) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-lg">
      <div className="font-semibold">Edit Mode</div>
      <div className="text-blue-200">
        Locale: {locale}
        {personalization.segment && ` | Segment: ${personalization.segment}`}
      </div>
    </div>
  );
}
