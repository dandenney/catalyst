import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

interface ItemsCardProps {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  link?: ReactNode;
  onRemove?: () => void;
}

interface ItemsSectionProps {
  label?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  items: ItemsCardProps[];
  className?: string;
  editBar?: ReactNode;
  addItemButton?: ReactNode;
}

/**
 * Pure display component for Items/Features section.
 * Retro-futuristic minimalist design: dark background, Swiss typography,
 * restrained accent, 4-column responsive grid.
 */
export function Items({
  label,
  title,
  description,
  items,
  className,
  editBar,
  addItemButton,
}: ItemsSectionProps) {
  return (
    <Section
      className={cn(
        "group relative overflow-hidden border-t border-[#1E293B] bg-[#0A0E1A]",
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

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        {(label || title || description) && (
          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-5 text-center">
            {label && (
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
                {label}
              </span>
            )}

            {title && (
              <h2 className="text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance sm:text-4xl">
                {title}
              </h2>
            )}

            {/* Gradient accent line */}
            {title && (description || items.length > 0) && (
              <div className="h-px w-16 bg-gradient-to-r from-[#3B82F6] to-transparent" />
            )}

            {description && (
              <p className="max-w-lg text-base leading-relaxed text-[#94A3B8] text-pretty">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Items grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <ItemCard key={index} {...item} />
          ))}
          {addItemButton}
        </div>
      </div>
    </Section>
  );
}

function ItemCard({ icon, title, description, link, onRemove }: ItemsCardProps) {
  return (
    <div className="group/card relative flex flex-col gap-4">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-2 -top-2 z-10 flex size-6 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-lg transition-all hover:bg-red-500 group-hover/card:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}

      <div className="flex size-10 items-center justify-center">{icon}</div>

      <h3 className="text-lg font-medium tracking-tight text-[#F1F5F9]">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-[#94A3B8]">{description}</p>

      {link && <div className="mt-auto pt-1">{link}</div>}
    </div>
  );
}
