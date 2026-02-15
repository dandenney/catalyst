"use client";

import { type ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

export interface ContentTab {
  /** Tab label displayed in the horizontal tab bar */
  title: ReactNode;
  /** Pre-rendered card components for this tab */
  cards: ReactNode[];
  /** Remove handler (edit mode only) */
  onRemove?: () => void;
}

interface ContentCardsProps {
  /** Small mono label above the section heading */
  label?: ReactNode;
  /** Main section heading */
  heading?: ReactNode;
  /** Section description below heading */
  description?: ReactNode;
  /** Array of tab categories with their cards */
  tabs: ContentTab[];
  className?: string;
  /** Slot for edit chrome (e.g., SectionEditBar) */
  editBar?: ReactNode;
  /** Slot for add tab button (edit mode) */
  addTabButton?: ReactNode;
  /** Controlled active index (edit mode) */
  activeIndex?: number;
  /** Controlled active index change handler (edit mode) */
  onActiveIndexChange?: (index: number) => void;
}

/**
 * Content cards section — pure display.
 * Horizontal tabs filter a grid of cards below.
 * Cards are pre-rendered by type-specific card components.
 */
export function ContentCards({
  label,
  heading,
  description,
  tabs,
  className,
  editBar,
  addTabButton,
  activeIndex: controlledIndex,
  onActiveIndexChange,
}: ContentCardsProps) {
  const [internalIndex, setInternalIndex] = useState(0);

  const activeIndex = controlledIndex ?? internalIndex;
  const setActiveIndex = onActiveIndexChange ?? setInternalIndex;
  const activeTab = tabs[activeIndex];

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
        {/* Section header */}
        {(label || heading || description) && (
          <div className="mb-10 flex flex-col items-center gap-4 text-center">
            {label && (
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
                {label}
              </span>
            )}

            {heading && (
              <h2 className="max-w-2xl text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance sm:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}

            {/* Gradient accent line */}
            {heading && description && (
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent" />
            )}

            {description && (
              <p className="max-w-xl text-base leading-relaxed text-[#94A3B8] text-pretty">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Horizontal tab bar */}
        <div className="mb-10 flex items-center justify-center">
          <div className="flex gap-1 rounded-lg border border-[#1E293B] bg-[#0A0E1A]/80 p-1">
            {tabs.map((tab, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                  className={cn(
                    "relative cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#1E293B] text-[#F1F5F9]"
                      : "text-[#94A3B8] hover:text-[#F1F5F9]",
                  )}
                >
                  {tab.title}
                </div>
              );
            })}
            {addTabButton}
          </div>
        </div>

        {/* Card grid */}
        {activeTab && activeTab.cards.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeTab.cards.map((card, cardIndex) => (
              <div key={cardIndex}>{card}</div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {activeTab && activeTab.cards.length === 0 && (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-[#1E293B] py-16">
            <p className="text-sm text-[#94A3B8]">
              No items selected. Use the picker to add content.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
