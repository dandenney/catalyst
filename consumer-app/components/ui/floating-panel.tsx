"use client";

import { GripHorizontal, XIcon } from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

interface FloatingPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

const PANEL_WIDTH = 340;
const PANEL_MARGIN = 16;

export function FloatingPanel({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: FloatingPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasAnimated = useRef(false);

  // Set mounted for portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset entrance animation flag when panel closes
  useEffect(() => {
    if (!open) {
      hasAnimated.current = false;
    }
  }, [open]);

  // Default position: top-right
  useEffect(() => {
    if (open && position === null) {
      setPosition({
        x: window.innerWidth - PANEL_WIDTH - PANEL_MARGIN * 2,
        y: 80,
      });
    }
  }, [open, position]);

  const clampPosition = useCallback((x: number, y: number) => {
    const maxX = window.innerWidth - PANEL_WIDTH - PANEL_MARGIN;
    const maxY = window.innerHeight - 100; // leave room at bottom
    return {
      x: Math.max(PANEL_MARGIN, Math.min(x, maxX)),
      y: Math.max(PANEL_MARGIN, Math.min(y, maxY)),
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      dragState.current = {
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      };
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.current) return;
      const newPos = clampPosition(
        e.clientX - dragState.current.offsetX,
        e.clientY - dragState.current.offsetY,
      );
      setPosition(newPos);
    },
    [clampPosition],
  );

  const handlePointerUp = useCallback(() => {
    dragState.current = null;
    setIsDragging(false);
  }, []);

  if (!open || !mounted || !position) return null;

  const showEntrance = !hasAnimated.current;
  if (showEntrance) {
    hasAnimated.current = true;
  }

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label={typeof title === "string" ? title : undefined}
      className={cn(
        "fixed z-50 flex max-h-[calc(100vh-6rem)] flex-col rounded-lg border border-border bg-background shadow-xl dark:border-border/15",
        isDragging && "cursor-grabbing select-none",
        showEntrance && "animate-in fade-in-0 zoom-in-95 duration-200",
      )}
      style={{
        left: position.x,
        top: position.y,
        width: PANEL_WIDTH,
      }}
    >
      {/* Drag handle header */}
      <div
        className="flex cursor-grab items-center justify-between gap-2 border-b border-border/50 px-4 py-3 active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <GripHorizontal className="size-4 shrink-0 text-muted-foreground/50" />
            <h3 className="truncate text-sm font-semibold text-foreground">
              {title}
            </h3>
          </div>
          {description && (
            <p className="mt-0.5 truncate pl-6 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="shrink-0 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-border/50 px-4 py-3">{footer}</div>
      )}
    </div>,
    document.body,
  );
}
