import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";
import Glow from "../../ui/glow";
import { Section } from "../../ui/section";

interface CTAProps {
  heading: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  className?: string;
}

/**
 * Pure display component for CTA section.
 * Accepts resolved strings - no edit mode awareness, no localization logic.
 * For editable version, use EditableCTA.
 */
export function CTA({
  heading,
  description,
  buttonText,
  buttonHref,
  className,
}: CTAProps) {
  return (
    <Section className={cn("group relative overflow-hidden", className)}>
      <div className="max-w-container relative z-10 mx-auto flex flex-col items-center gap-6 text-center sm:gap-8">
        <h2 className="max-w-[640px] text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
          {heading}
        </h2>
        <p className="text-muted-foreground max-w-[640px] text-base sm:text-lg">
          {description}
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <a href={buttonHref}>{buttonText}</a>
          </Button>
        </div>
      </div>
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
        <Glow variant="bottom" />
      </div>
    </Section>
  );
}
