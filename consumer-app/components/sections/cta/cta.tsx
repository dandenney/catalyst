import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

interface CTAProps {
  /** Image content - accepts img element or EditableImage. Omit to hide. */
  image?: ReactNode;
  /** Heading content - accepts string or ReactNode (e.g., EditableText). Omit to hide. */
  heading?: ReactNode;
  /** Description content - accepts string or ReactNode. Omit to hide. */
  description?: ReactNode;
  /** Link element - accepts full anchor or editable link wrapper. Omit to hide. */
  link?: ReactNode;
  className?: string;
  /** Slot for edit chrome (e.g., SectionEditBar) - rendered before content */
  editBar?: ReactNode;
}

/**
 * Pure display component for CTA section.
 * Accepts ReactNode for content slots, enabling both static strings and editable components.
 * Layout is defined here once - EditableCTA injects editable elements into slots.
 */
export function CTA({
  image,
  heading,
  description,
  link,
  className,
  editBar,
}: CTAProps) {
  return (
    <Section className={cn("bg-upgrade-main group", className)}>
      {editBar}
      <div className="max-w-container mx-auto sm:flex sm:gap-8">
        {image && (
          <div className="max-w-[200px] flex-shrink-0">
            {image}
          </div>
        )}
        {heading && (
          <h2 className="max-w-[288px] flex-shrink-0 text-2xl leading-tight font-semibold sm:leading-tight">
            {heading}
          </h2>
        )}
        {(description || link) && (
          <div>
            {description && (
              <p className="mb-2 text-main text-base">
                {description}
              </p>
            )}
            {link}
          </div>
        )}
      </div>
    </Section>
  );
}
