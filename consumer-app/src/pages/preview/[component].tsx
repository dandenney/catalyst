/**
 * Component Preview Page
 * Renders individual components in isolation for screenshot generation
 */

import { useRouter } from "next/router";
import { ComponentRenderer } from "@catalyst/demo-components";
import { createComponent } from "@catalyst/core";
import Head from "next/head";

export default function ComponentPreview() {
  const router = useRouter();
  const { component } = router.query;

  if (!component || typeof component !== "string") {
    return <div>Invalid component</div>;
  }

  // Create default component instance
  const schema = createComponent(component);

  if (!schema) {
    return <div>Component not found: {component}</div>;
  }

  return (
    <>
      <Head>
        <title>{component} Preview</title>
      </Head>
      <div
        style={{
          width: "800px",
          height: "600px",
          overflow: "hidden",
        }}
      >
        <ComponentRenderer schema={schema} />
      </div>
    </>
  );
}
