import * as React from "react";

import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brand" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        {
          // Variants
          "bg-primary text-primary-foreground": variant === "default",
          "bg-primary/10 text-primary": variant === "brand",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "border border-border bg-transparent": variant === "outline",
          // Sizes
          "px-2 py-0.5 text-xs": size === "sm",
          "px-2.5 py-0.5 text-sm": size === "md",
          "px-3 py-1 text-sm": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
