import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

export interface BentoCell {
  content: ReactNode;
  size: "regular" | "wide" | "tall" | "large";
}

interface BentosProps {
  /** Small mono label above the heading */
  label?: ReactNode;
  /** Main heading */
  heading?: ReactNode;
  /** Description paragraph below heading */
  description?: ReactNode;
  /** Array of bento cells with size hints */
  cells: BentoCell[];
  className?: string;
  /** Slot for edit chrome (e.g., SectionEditBar) */
  editBar?: ReactNode;
  /** Slot for add cell button in edit mode */
  addCellButton?: ReactNode;
}

const SIZE_CLASSES: Record<BentoCell["size"], string> = {
  regular: "",
  wide: "sm:col-span-2",
  tall: "sm:row-span-2",
  large: "sm:col-span-2 sm:row-span-2",
};

/**
 * Bento grid section — display only.
 * Retro-futuristic minimalist developer SaaS style.
 * Asymmetric grid with mixed content types.
 * Uses grid-auto-flow: dense for dynamic cell placement.
 */
export function Bentos({
  label,
  heading,
  description,
  cells,
  className,
  editBar,
  addCellButton,
}: BentosProps) {
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

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        {(label || heading || description) && (
          <div className="mb-10 flex flex-col items-center gap-4 text-center">
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

            {(heading && description) && (
              <div className="h-px w-16 bg-gradient-to-r from-[#3B82F6] to-transparent" />
            )}

            {description && (
              <p className="max-w-lg text-base leading-relaxed text-[#94A3B8] text-pretty">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Bento grid — stacks on mobile, asymmetric grid on sm+ */}
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-5"
          style={{ gridAutoFlow: "dense" }}
        >
          {cells.map((cell, index) => (
            <div
              key={index}
              className={cn(
                "min-h-[160px] overflow-hidden rounded-lg border border-[#1E293B] bg-[#0F1629]",
                SIZE_CLASSES[cell.size],
              )}
            >
              {cell.content}
            </div>
          ))}
          {addCellButton}
        </div>
      </div>
    </Section>
  );
}
