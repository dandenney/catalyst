"use client";

import { type Locale, useCatalyst } from "catalyst";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
];

export function LanguageToggle() {
  const { locale } = useCatalyst();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLocaleChange = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set("lang", newLocale);
      router.push(`?${params.toString()}`);
    },
    [locale, router, searchParams]
  );

  return (
    <div className="flex items-center rounded-full bg-blue-700/50 p-0.5">
      {LOCALES.map(({ value, label }) => {
        const isActive = locale === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleLocaleChange(value)}
            className={`
              relative px-3 py-1 text-xs font-semibold rounded-full
              transition-all duration-200 ease-out
              ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-blue-100 hover:text-white hover:bg-blue-600/50"
              }
            `}
            aria-pressed={isActive}
            aria-label={`Switch to ${label}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
