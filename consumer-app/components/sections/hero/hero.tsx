import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

interface HeroProps {
  /** Small mono label above the heading */
  label?: ReactNode;
  /** Main heading */
  heading?: ReactNode;
  /** Subtitle / description paragraph */
  subtitle?: ReactNode;
  /** Primary CTA (e.g. "Get started for free") */
  primaryCta?: ReactNode;
  /** Secondary CTA (e.g. "Request a demo") */
  secondaryCta?: ReactNode;
  /** Product screenshot or image below the CTAs */
  productImage?: ReactNode;
  className?: string;
  /** Slot for edit chrome (e.g., SectionEditBar) */
  editBar?: ReactNode;
}

/**
 * Hero section — display only (no data hookup yet).
 * Retro-futuristic minimalist developer SaaS style.
 * Layout: label → heading → subtitle → accent line → buttons → product image.
 */
export function Hero({
  label,
  heading,
  subtitle,
  primaryCta,
  secondaryCta,
  productImage,
  className,
  editBar,
}: HeroProps) {
  const hasCtas = primaryCta || secondaryCta;

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

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        {label && (
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
            {label}
          </span>
        )}

        {heading && (
          <h1 className="max-w-3xl text-4xl font-medium tracking-tight text-[#F1F5F9] text-balance sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
        )}

        {subtitle && (
          <p className="max-w-xl text-base leading-relaxed text-[#94A3B8] text-pretty sm:text-lg">
            {subtitle}
          </p>
        )}

        {/* Gradient accent line */}
        {hasCtas && (
          <div className="h-px w-16 bg-gradient-to-r from-[#3B82F6] to-transparent" />
        )}

        {hasCtas && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {primaryCta}
            {secondaryCta}
          </div>
        )}

        {productImage && (
          <div className="mt-8 w-full max-w-4xl overflow-hidden rounded-lg border border-[#1E293B] shadow-[0_0_40px_rgba(0,0,0,0.4)]">
            {productImage}
          </div>
        )}
      </div>
    </Section>
  );
}
