import { usePage } from "@/hooks/usePage";
import { ComponentRenderer } from "@catalyst/demo-components";
import Head from "next/head";
import { getLocalizedValue } from "@catalyst/core";
import { useCatalyst } from "@catalyst/react";

export default function DemoPage() {
  const { page, loading, error, updateComponent } = usePage("demo");
  const { locale } = useCatalyst();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <p style={{ color: "red" }}>Error: {error.message}</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <p>Page not found</p>
      </div>
    );
  }

  const pageTitle = getLocalizedValue(page.metadata.title, locale);
  const pageDescription = page.metadata.description
    ? getLocalizedValue(page.metadata.description, locale)
    : undefined;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
      </Head>

      <main style={{ minHeight: "100vh" }}>
        {page.components.map((component) => (
          <ComponentRenderer
            key={component.id}
            schema={component}
            onUpdate={(updated) => updateComponent(component.id, updated)}
          />
        ))}
      </main>
    </>
  );
}
