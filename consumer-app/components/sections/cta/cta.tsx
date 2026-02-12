import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

interface CTAProps {
  /** Label content - accepts string or ReactNode. Small mono tag above heading. Omit to hide. */
  label?: ReactNode;
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
 * Retro-futuristic minimalist developer SaaS style: spacious layout,
 * Swiss-inspired typography, restrained accent, subtle sci-fi hints.
 */
export function CTA({
  label,
  image,
  heading,
  description,
  link,
  className,
  editBar,
}: CTAProps) {
  return (
    <Section
      className={cn(
        "relative overflow-hidden border-t border-[#1E293B] bg-[#0A0E1A] group",
        className,
      )}
    >
      {editBar}

      {/* Subtle dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(148,163,184,0.8) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        {label && (
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
            {label}
          </span>
        )}

        {heading && (
          <h2 className="text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
        )}

        {/* Gradient accent line */}
        {(heading && (description || link)) && (
          <div className="h-px w-16 bg-gradient-to-r from-[#3B82F6] to-transparent" />
        )}

        {description && (
          <p className="max-w-lg text-base leading-relaxed text-[#94A3B8] text-pretty">
            {description}
          </p>
        )}

        {image && (
          <div className="max-w-[200px] flex-shrink-0 overflow-hidden rounded-lg border border-[#1E293B]">
            {image}
          </div>
        )}

        {link && <div className="pt-2">{link}</div>}
      </div>
    </Section>
  );
}
