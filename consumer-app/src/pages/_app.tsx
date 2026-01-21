import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CatalystProvider } from "@catalyst/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Import components to register with Catalyst
// Components live in the consumer app - this is the pattern for real-world usage
import { CTASection, HeroBanner, FeatureList } from "@/components";

// Component registry - maps schema type names to React components
const components = {
  CTASection,
  HeroBanner,
  FeatureList,
};

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
      components={components}
    >
      <Component {...pageProps} />
    </CatalystProvider>
  );
}
