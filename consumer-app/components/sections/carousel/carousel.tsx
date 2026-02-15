import { type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

// ─────────────────────────────────────────────────────────────────────────────
// Slide layout sub-components
// ─────────────────────────────────────────────────────────────────────────────

export interface QuoteSlideLayoutProps {
  quote: ReactNode;
  authorName: ReactNode;
  authorTitle: ReactNode;
  avatar?: ReactNode;
}

export function QuoteSlideLayout({
  quote,
  authorName,
  authorTitle,
  avatar,
}: QuoteSlideLayoutProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-8 text-center sm:px-8 sm:py-12">
      {/* Decorative quote mark */}
      <span className="select-none text-6xl leading-none font-serif text-[#3B82F6]/20">
        &ldquo;
      </span>

      <blockquote className="text-lg leading-relaxed text-[#94A3B8] italic sm:text-xl">
        {quote}
      </blockquote>

      {/* Gradient accent line */}
      <div className="h-px w-16 bg-gradient-to-r from-[#3B82F6] to-transparent" />

      <div className="flex items-center gap-3">
        {avatar && (
          <div className="size-12 flex-shrink-0 overflow-hidden rounded-full border border-[#1E293B]">
            {avatar}
          </div>
        )}
        <div className="text-left">
          <div className="text-sm font-medium text-[#F1F5F9]">
            {authorName}
          </div>
          <div className="text-sm text-[#94A3B8]">{authorTitle}</div>
        </div>
      </div>
    </div>
  );
}

export interface MediaSlideLayoutProps {
  image: ReactNode;
  title: ReactNode;
  description: ReactNode;
  cta?: ReactNode;
}

export function MediaSlideLayout({
  image,
  title,
  description,
  cta,
}: MediaSlideLayoutProps) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 px-4 py-8 sm:px-8 sm:py-12 md:grid-cols-2">
      {/* Image side */}
      <div className="overflow-hidden rounded-lg border border-[#1E293B]">
        {image}
      </div>

      {/* Text side */}
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-medium tracking-tight text-[#F1F5F9] text-balance sm:text-3xl">
          {title}
        </h3>
        <p className="text-base leading-relaxed text-[#94A3B8] text-pretty">
          {description}
        </p>
        {cta && <div className="pt-2">{cta}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main carousel component
// ─────────────────────────────────────────────────────────────────────────────

interface CarouselProps {
  label?: ReactNode;
  heading?: ReactNode;
  description?: ReactNode;
  slides: ReactNode[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  editBar?: ReactNode;
  addSlideButton?: ReactNode;
}

export function Carousel({
  label,
  heading,
  description,
  slides,
  activeIndex,
  onPrev,
  onNext,
  onDotClick,
  showDots = true,
  showArrows = true,
  className,
  editBar,
  addSlideButton,
}: CarouselProps) {
  return (
    <Section
      className={cn(
        "group/section relative overflow-hidden border-t border-[#1E293B] bg-[#0A0E1A]",
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
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center sm:mb-14">
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

            {heading && description && (
              <div className="h-px w-16 bg-gradient-to-r from-[#3B82F6] to-transparent" />
            )}

            {description && (
              <p className="max-w-lg text-base leading-relaxed text-[#94A3B8] text-pretty">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Carousel viewport */}
        <div className="relative">
          {/* Slide track */}
          <div className="overflow-hidden rounded-lg border border-[#1E293B]">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0"
                  aria-hidden={index !== activeIndex}
                >
                  {slide}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow buttons */}
          {showArrows && slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#1E293B] bg-[#0F1629]/80 p-2 text-[#94A3B8] backdrop-blur-sm transition-colors hover:border-[#3B82F6] hover:text-[#F1F5F9] sm:flex"
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={onNext}
                className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#1E293B] bg-[#0F1629]/80 p-2 text-[#94A3B8] backdrop-blur-sm transition-colors hover:border-[#3B82F6] hover:text-[#F1F5F9] sm:flex"
                aria-label="Next slide"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {showDots && slides.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onDotClick(index)}
                className={cn(
                  "size-2 rounded-full transition-all duration-200",
                  index === activeIndex
                    ? "scale-125 bg-[#3B82F6]"
                    : "bg-[#1E293B] hover:bg-[#94A3B8]/50",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Add slide button (edit mode only) */}
        {addSlideButton && <div className="mt-6">{addSlideButton}</div>}
      </div>
    </Section>
  );
}
