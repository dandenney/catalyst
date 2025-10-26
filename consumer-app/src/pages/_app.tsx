import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CatalystProvider } from "@catalyst/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [segment, setSegment] = useState<string | undefined>(undefined);

  // Parse query parameters on mount and route changes
  useEffect(() => {
    const { edit, lang, segment: segmentParam } = router.query;

    if (edit === "true") {
      setIsEditMode(true);
    }

    if (lang === "es" || lang === "en") {
      setLocale(lang);
    }

    if (typeof segmentParam === "string") {
      setSegment(segmentParam);
    }
  }, [router.query]);

  return (
    <CatalystProvider
      locale={locale}
      personalization={{ segment }}
      isEditMode={isEditMode}
    >
      <Component {...pageProps} />
    </CatalystProvider>
  );
}
