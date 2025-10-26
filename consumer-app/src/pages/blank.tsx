import { usePage } from "@/hooks/usePage";
import { ComponentRenderer } from "@catalyst/demo-components";
import Head from "next/head";
import { getLocalizedValue } from "@catalyst/core";
import { useCatalyst } from "@catalyst/react";

export default function BlankPage() {
  const { page, loading, error, updateComponent } = usePage("blank");
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

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {page.components.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              {pageTitle}
            </h1>
            <p style={{ color: "#6b7280" }}>
              This is a blank page. Components can be added here.
            </p>
          </div>
        ) : (
          page.components.map((component) => (
            <ComponentRenderer
              key={component.id}
              schema={component}
              onUpdate={(updated) => updateComponent(component.id, updated)}
            />
          ))
        )}
      </main>
    </>
  );
}
