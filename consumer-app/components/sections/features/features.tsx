import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

interface FeatureBulletProps {
  icon: ReactNode;
  text: ReactNode;
  onRemove?: () => void;
}

interface FeatureSetProps {
  title: ReactNode;
  description: ReactNode;
  bullets: FeatureBulletProps[];
  cta?: ReactNode;
  image: ReactNode;
  /** Edit button overlay for this set (edit mode only) */
  editButton?: ReactNode;
  /** Remove handler (edit mode only) */
  onRemove?: () => void;
  /** Add-bullet button (edit mode only) */
  addBulletButton?: ReactNode;
}

interface FeaturesSectionProps {
  label?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  sets: FeatureSetProps[];
  className?: string;
  editBar?: ReactNode;
  addSetButton?: ReactNode;
}

/**
 * Pure display component for zig-zag Features section.
 * Alternating text/image layout: odd sets image-left, even sets image-right.
 * On mobile, image is always first.
 */
export function Features({
  label,
  title,
  description,
  sets,
  className,
  editBar,
  addSetButton,
}: FeaturesSectionProps) {
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
            {title && (description || sets.length > 0) && (
              <div className="h-px w-16 bg-gradient-to-r from-[#3B82F6] to-transparent" />
            )}

            {description && (
              <p className="max-w-lg text-base leading-relaxed text-[#94A3B8] text-pretty">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Feature sets */}
        <div className="flex flex-col gap-16">
          {sets.map((set, index) => (
            <FeatureSet key={index} index={index} {...set} />
          ))}
          {addSetButton}
        </div>
      </div>
    </Section>
  );
}

function FeatureSet({
  index,
  title,
  description,
  bullets,
  cta,
  image,
  editButton,
  onRemove,
  addBulletButton,
}: FeatureSetProps & { index: number }) {
  // Zig-zag: image first in DOM for mobile-first, then flex-row or flex-row-reverse on desktop
  const zigzagClass =
    index % 2 === 0
      ? "flex flex-col lg:flex-row"
      : "flex flex-col lg:flex-row-reverse";

  return (
    <div
      className={cn(
        "group/set relative items-center gap-8 lg:gap-16",
        zigzagClass,
        index > 0 && "border-t border-[#1E293B] pt-16",
      )}
    >
      {/* Remove set button */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-2 -top-2 z-10 flex size-6 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-lg transition-all hover:bg-red-500 group-hover/set:opacity-100"
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

      {/* Image column */}
      <div className="w-full flex-shrink-0 lg:w-1/2">
        <div className="overflow-hidden rounded-lg border border-[#1E293B]">
          {image}
        </div>
      </div>

      {/* Text column */}
      <div className="flex w-full flex-col gap-4 lg:w-1/2">
        {editButton}

        <h3 className="text-2xl font-medium tracking-tight text-[#F1F5F9] sm:text-3xl">
          {title}
        </h3>

        <p className="text-base leading-relaxed text-[#94A3B8] text-pretty">
          {description}
        </p>

        {/* Bullet list */}
        {bullets.length > 0 && (
          <ul className="mt-2 flex flex-col gap-3">
            {bullets.map((bullet, bulletIndex) => (
              <FeatureBullet key={bulletIndex} {...bullet} />
            ))}
          </ul>
        )}

        {addBulletButton}

        {cta && <div className="mt-4">{cta}</div>}
      </div>
    </div>
  );
}

function FeatureBullet({ icon, text, onRemove }: FeatureBulletProps) {
  return (
    <li className="group/bullet relative flex items-start gap-3">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -left-5 top-0.5 z-10 flex size-4 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-lg transition-all hover:bg-red-500 group-hover/bullet:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
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

      <span className="mt-0.5 flex size-5 flex-shrink-0 items-center justify-center text-[#3B82F6]">
        {icon}
      </span>
      <span className="text-sm leading-relaxed text-[#94A3B8]">{text}</span>
    </li>
  );
}
