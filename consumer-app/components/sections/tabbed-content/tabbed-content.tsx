"use client";

import { X } from "lucide-react";
import { type ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

export interface TabItem {
  /** Tab title - displayed in the vertical list */
  title: ReactNode;
  /** Description shown when this tab is active */
  description?: ReactNode;
  /** Image or visual shown in the right panel when active */
  image?: ReactNode;
  /** Remove handler (edit mode only) */
  onRemove?: () => void;
}

interface TabbedContentProps {
  /** Small mono label above the section heading */
  label?: ReactNode;
  /** Main section heading */
  heading?: ReactNode;
  /** Section description below heading */
  description?: ReactNode;
  /** Array of tab items */
  tabs: TabItem[];
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
 * Tabbed content section — pure display.
 * Retro-futuristic minimalist developer SaaS style.
 * Vertical feature list on left with expandable descriptions,
 * corresponding image panel on right.
 */
export function TabbedContent({
  label,
  heading,
  description,
  tabs,
  className,
  editBar,
  addTabButton,
  activeIndex: controlledIndex,
  onActiveIndexChange,
}: TabbedContentProps) {
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
          <div className="mb-12 flex flex-col gap-4">
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

            {description && (
              <p className="max-w-xl text-base leading-relaxed text-[#94A3B8] text-pretty">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Two-column layout: feature list + image */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          {/* Left: vertical feature list */}
          <div className="flex flex-col lg:w-[45%]">
            {tabs.map((tab, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={index}
                  className={cn(
                    "group/tab relative border-l-2 transition-all duration-200",
                    isActive
                      ? "border-[#3B82F6]"
                      : "border-[#1E293B] hover:border-[#94A3B8]/40",
                  )}
                >
                  <button
                    onClick={() => setActiveIndex(index)}
                    className="w-full py-4 pl-5 pr-8 text-left"
                  >
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors duration-200 sm:text-base",
                        isActive
                          ? "text-[#F1F5F9]"
                          : "text-[#94A3B8] group-hover/tab:text-[#F1F5F9]",
                      )}
                    >
                      {tab.title}
                    </span>

                    {/* Expanded description for active item */}
                    {isActive && tab.description && (
                      <div className="mt-2 text-sm leading-relaxed text-[#94A3B8] text-pretty">
                        {tab.description}
                      </div>
                    )}
                  </button>

                  {/* Remove button (edit mode) */}
                  {tab.onRemove && (
                    <button
                      type="button"
                      onClick={tab.onRemove}
                      className="absolute right-0 top-4 flex size-6 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-lg transition hover:bg-red-500 group-hover/tab:opacity-100"
                      aria-label="Remove tab"
                      title="Remove tab"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              );
            })}
            {addTabButton}
          </div>

          {/* Right: image panel */}
          {activeTab?.image && (
            <div className="flex-1 overflow-hidden rounded-lg border border-[#1E293B]">
              {activeTab.image}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
