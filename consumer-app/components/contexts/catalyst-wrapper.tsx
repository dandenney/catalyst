"use client";

import { CatalystProvider, Locale } from "catalyst";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CatalystProviderWithParams({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const isEditMode = searchParams.get("edit") === "true";
  const locale = (searchParams.get("lang") as Locale) || "en";
  const segment = searchParams.get("segment") || undefined;

  return (
    <CatalystProvider
      isEditMode={isEditMode}
      locale={locale}
      personalization={{ segment }}
    >
      {children}
    </CatalystProvider>
  );
}

export function CatalystWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <CatalystProviderWithParams>{children}</CatalystProviderWithParams>
    </Suspense>
  );
}
