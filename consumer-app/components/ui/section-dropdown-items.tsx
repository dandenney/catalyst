"use client";

import * as React from "react";

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "catalyst";

export type SectionType =
  | "HeroSection"
  | "LogosSection"
  | "ItemsSection"
  | "StatsSection"
  | "FAQSection"
  | "PricingSection"
  | "CTASection"
  | "FooterSection";

export interface SectionControls {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onAddSection?: (type: SectionType) => void;
}

const SECTION_LABELS: Record<SectionType, string> = {
  HeroSection: "Hero section",
  LogosSection: "Logos section",
  ItemsSection: "Items section",
  StatsSection: "Stats section",
  FAQSection: "FAQ section",
  PricingSection: "Pricing section",
  CTASection: "CTA section",
  FooterSection: "Footer section",
};

function SectionDropdownItems({ controls }: { controls: SectionControls }) {
  return (
    <>
      <DropdownMenuLabel className="text-xs uppercase tracking-wide text-white/60">
        Section
      </DropdownMenuLabel>
      <DropdownMenuItem onClick={controls.onMoveUp} disabled={!controls.canMoveUp}>
        Move up
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={controls.onMoveDown}
        disabled={!controls.canMoveDown}
      >
        Move down
      </DropdownMenuItem>
      <DropdownMenuItem className="text-red-300" onClick={controls.onRemove}>
        Remove section
      </DropdownMenuItem>

      {controls.onAddSection && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs uppercase tracking-wide text-white/60">
            Add section
          </DropdownMenuLabel>
          {(Object.keys(SECTION_LABELS) as SectionType[]).map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => controls.onAddSection?.(type)}
            >
              {SECTION_LABELS[type]}
            </DropdownMenuItem>
          ))}
        </>
      )}
    </>
  );
}

export { SectionDropdownItems };
