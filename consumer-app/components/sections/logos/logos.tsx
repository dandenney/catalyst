import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

interface LogoSlotProps {
  logo: ReactNode;
  onRemove?: () => void;
}

interface LogosSectionProps {
  title?: ReactNode;
  logos: LogoSlotProps[];
  scrollEnabled: boolean;
  paused?: boolean;
  className?: string;
  editBar?: ReactNode;
  addLogoButton?: ReactNode;
}

/**
 * Pure display component for the Logos section.
 * Supports static (centered row) and infinite CSS scroll modes.
 * Accepts ReactNode slots — EditableLogos injects editable components.
 */
export function Logos({
  title,
  logos,
  scrollEnabled,
  paused = false,
  className,
  editBar,
  addLogoButton,
}: LogosSectionProps) {
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

      <div className="relative mx-auto max-w-5xl">
        {/* Section header */}
        {title && (
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center sm:mb-14">
            <h2 className="text-lg font-medium tracking-tight text-[#94A3B8] text-balance sm:text-xl">
              {title}
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-[#3B82F6] to-transparent" />
          </div>
        )}

        {/* Logo display */}
        {scrollEnabled ? (
          <ScrollingLogos logos={logos} paused={paused} />
        ) : (
          <StaticLogos logos={logos} />
        )}

        {/* Add logo button (edit mode only) */}
        {addLogoButton && (
          <div className="mt-8 flex justify-center">{addLogoButton}</div>
        )}
      </div>
    </Section>
  );
}

function StaticLogos({ logos }: { logos: LogoSlotProps[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 lg:gap-16">
      {logos.map((item, index) => (
        <div key={index} className="group/logo relative flex-shrink-0">
          <div className="flex items-center justify-center opacity-60 transition-opacity duration-200 hover:opacity-100">
            {item.logo}
          </div>
          {item.onRemove && <RemoveButton onRemove={item.onRemove} />}
        </div>
      ))}
    </div>
  );
}

function ScrollingLogos({
  logos,
  paused,
}: {
  logos: LogoSlotProps[];
  paused: boolean;
}) {
  // Repeat logos enough times that one "set" is guaranteed wider than the
  // viewport (~2000px). Each logo is ~40px + 64px margin = ~104px.
  // We need ceil(2000 / (count * 104)) repeats minimum.
  const repeatCount = Math.max(2, Math.ceil(2000 / (logos.length * 104)));
  const expandedLogos: LogoSlotProps[] = [];
  for (let i = 0; i < repeatCount; i++) {
    for (const logo of logos) {
      // Only allow remove buttons on the first logical copy
      expandedLogos.push(
        i === 0 ? logo : { logo: logo.logo },
      );
    }
  }

  const duration = Math.max(15, expandedLogos.length * 2);

  return (
    <div className="group/scroll relative">
      {/* Left fade mask */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#0A0E1A] to-transparent sm:w-24" />
      {/* Right fade mask */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#0A0E1A] to-transparent sm:w-24" />

      <div className="overflow-hidden">
        <div
          className="flex items-center"
          style={{
            animation: paused
              ? "none"
              : `logo-scroll ${duration}s linear infinite`,
          }}
          onMouseEnter={(e) => {
            if (!paused) e.currentTarget.style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            if (!paused) e.currentTarget.style.animationPlayState = "running";
          }}
        >
          {/* Render the expanded set twice. The expanded set is already
              wide enough to fill the viewport, so the second copy sits
              off-screen. translateX(-50%) scrolls exactly one copy's
              width, looping seamlessly. margin-right instead of flex gap
              keeps both halves identical in width. */}
          {[...expandedLogos, ...expandedLogos].map((item, index) => (
            <div
              key={index}
              className="group/logo relative mr-14 flex-shrink-0 sm:mr-16"
            >
              <div className="flex items-center justify-center opacity-60 transition-opacity duration-200 hover:opacity-100">
                {item.logo}
              </div>
              {item.onRemove && index < expandedLogos.length && (
                <RemoveButton onRemove={item.onRemove} />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes logo-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function RemoveButton({ onRemove }: { onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="absolute -right-2 -top-2 z-20 flex size-5 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-lg transition-all hover:bg-red-500 group-hover/logo:opacity-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
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
  );
}
