import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Section } from "../../ui/section";

interface CardGridProps {
  heading?: ReactNode;
  subtitle?: ReactNode;
  cards: ReactNode[];
  maxPerRow?: 2 | 3 | 4;
  theme?: "light" | "dark";
  className?: string;
  editBar?: ReactNode;
  addCardButton?: ReactNode;
}

const gridColsClass: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function CardGrid({
  heading,
  subtitle,
  cards,
  maxPerRow = 3,
  theme = "light",
  className,
  editBar,
  addCardButton,
}: CardGridProps) {
  const isDark = theme === "dark";

  return (
    <Section
      className={cn(
        "group",
        isDark && "bg-slate-950 text-white",
        className,
      )}
    >
      {editBar}
      <div className="max-w-container mx-auto">
        {(heading || subtitle) && (
          <div className="mb-8 max-w-2xl">
            {heading && (
              <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
                {heading}
              </h2>
            )}
            {subtitle && (
              <p
                className={cn(
                  "mt-2 text-base",
                  isDark ? "text-white/70" : "text-muted-foreground",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={cn("grid gap-6", gridColsClass[maxPerRow])}>
          {cards}
          {addCardButton}
        </div>
      </div>
    </Section>
  );
}
