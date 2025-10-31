import { usePage } from "@/hooks/usePage";
import { ComponentRenderer } from "@catalyst/demo-components";
import Head from "next/head";
import { getLocalizedValue, createComponent } from "@catalyst/core";
import {
  useCatalyst,
  ComponentPanel,
  ComponentControls,
  InsertButton
} from "@catalyst/react";
import { useState } from "react";

export default function BlankPage() {
  const { page, loading, error, updateComponent, addComponent, removeComponent, reorderComponents } = usePage("blank");
  const { locale, isEditMode } = useCatalyst();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [insertPosition, setInsertPosition] = useState<number | undefined>(undefined);

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

  const handleSelectComponent = (type: string) => {
    const newComponent = createComponent(type);
    if (newComponent) {
      addComponent(newComponent, insertPosition);
    }
    setIsPanelOpen(false);
    setInsertPosition(undefined);
  };

  const handleInsert = (position: number) => {
    setInsertPosition(position);
    setIsPanelOpen(true);
  };

  const handleMoveComponent = (fromIndex: number, toIndex: number) => {
    const newOrder = [...page.components];
    const [movedComponent] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedComponent);
    reorderComponents(newOrder.map(c => c.id));
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
      </Head>

      <main style={{ minHeight: "100vh" }}>
        {/* Add Component Button (fixed in edit mode) */}
        {isEditMode && (
          <button
            onClick={() => {
              setInsertPosition(undefined);
              setIsPanelOpen(true);
            }}
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              padding: "1rem 1.5rem",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "50px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
              zIndex: 100,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#3b82f6";
            }}
          >
            + Add Component
          </button>
        )}

        {/* Insert button at the start */}
        {isEditMode && page.components.length > 0 && (
          <InsertButton onInsert={() => handleInsert(0)} />
        )}

        {/* Render components with controls */}
        {page.components.map((component, index) => (
          <div key={component.id} style={{ position: "relative" }}>
            {/* Component controls in edit mode */}
            {isEditMode && (
              <ComponentControls
                onRemove={() => removeComponent(component.id)}
                onMoveUp={index > 0 ? () => handleMoveComponent(index, index - 1) : undefined}
                onMoveDown={index < page.components.length - 1 ? () => handleMoveComponent(index, index + 1) : undefined}
                canMoveUp={index > 0}
                canMoveDown={index < page.components.length - 1}
              />
            )}

            {/* The component itself */}
            <ComponentRenderer
              schema={component}
              onUpdate={(updated) => updateComponent(component.id, updated)}
            />

            {/* Insert button after each component */}
            {isEditMode && (
              <InsertButton onInsert={() => handleInsert(index + 1)} />
            )}
          </div>
        ))}

        {/* Show message and insert button if no components */}
        {page.components.length === 0 && (
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
              padding: "2rem"
            }}
          >
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              {pageTitle}
            </h1>
            <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
              This is a blank page. Components can be added here.
            </p>
            {isEditMode && (
              <InsertButton onInsert={() => handleInsert(0)} />
            )}
          </div>
        )}

        {/* Component Panel */}
        <ComponentPanel
          isOpen={isPanelOpen}
          onClose={() => {
            setIsPanelOpen(false);
            setInsertPosition(undefined);
          }}
          onSelectComponent={handleSelectComponent}
        />
      </main>
    </>
  );
}
