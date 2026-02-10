import { X } from "lucide-react";
import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CardGridCardProps {
  image?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  cta?: ReactNode;
  imageMode?: "natural" | "squared";
  theme?: "light" | "dark";
  onRemove?: () => void;
}

export function CardGridCard({
  image,
  title,
  description,
  cta,
  imageMode = "natural",
  theme = "light",
  onRemove,
}: CardGridCardProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "group/card relative flex flex-col overflow-hidden rounded-lg border",
        isDark ? "border-white/10 bg-white/5" : "border-border bg-card",
      )}
    >
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-500"
          aria-label="Remove card"
          title="Remove card"
        >
          <X className="size-4" />
        </button>
      )}
      {image && (
        <div
          className={cn(
            "w-full overflow-hidden",
            imageMode === "squared" && "aspect-square",
          )}
        >
          {image}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        <p
          className={cn(
            "text-sm",
            isDark ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
        {cta && <div className="mt-auto pt-2">{cta}</div>}
      </div>
    </div>
  );
}
