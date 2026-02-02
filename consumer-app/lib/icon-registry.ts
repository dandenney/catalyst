/**
 * Icon Registry
 * Curated set of Lucide icons for the Items section
 */

import {
  ArrowRightIcon,
  AwardIcon,
  BlocksIcon,
  CheckIcon,
  ChevronRightIcon,
  CloudIcon,
  CodeIcon,
  DatabaseIcon,
  EclipseIcon,
  EyeIcon,
  FastForwardIcon,
  GlobeIcon,
  LanguagesIcon,
  LockIcon,
  MinusIcon,
  MonitorSmartphoneIcon,
  PlusIcon,
  RocketIcon,
  ScanFaceIcon,
  ShieldIcon,
  SparklesIcon,
  SquarePenIcon,
  StarIcon,
  TargetIcon,
  TerminalIcon,
  XIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

export interface IconEntry {
  key: string;
  label: string;
  component: LucideIcon;
}

/**
 * Curated icon registry with ~25 commonly used icons
 * Sorted alphabetically by key
 */
export const ICON_REGISTRY: IconEntry[] = [
  { key: "arrow-right", label: "Arrow Right", component: ArrowRightIcon },
  { key: "award", label: "Award", component: AwardIcon },
  { key: "blocks", label: "Blocks", component: BlocksIcon },
  { key: "check", label: "Check", component: CheckIcon },
  { key: "chevron-right", label: "Chevron Right", component: ChevronRightIcon },
  { key: "cloud", label: "Cloud", component: CloudIcon },
  { key: "code", label: "Code", component: CodeIcon },
  { key: "database", label: "Database", component: DatabaseIcon },
  { key: "eclipse", label: "Eclipse", component: EclipseIcon },
  { key: "eye", label: "Eye", component: EyeIcon },
  { key: "fast-forward", label: "Fast Forward", component: FastForwardIcon },
  { key: "globe", label: "Globe", component: GlobeIcon },
  { key: "languages", label: "Languages", component: LanguagesIcon },
  { key: "lock", label: "Lock", component: LockIcon },
  { key: "minus", label: "Minus", component: MinusIcon },
  { key: "monitor-smartphone", label: "Monitor Smartphone", component: MonitorSmartphoneIcon },
  { key: "plus", label: "Plus", component: PlusIcon },
  { key: "rocket", label: "Rocket", component: RocketIcon },
  { key: "scan-face", label: "Scan Face", component: ScanFaceIcon },
  { key: "shield", label: "Shield", component: ShieldIcon },
  { key: "sparkles", label: "Sparkles", component: SparklesIcon },
  { key: "square-pen", label: "Square Pen", component: SquarePenIcon },
  { key: "star", label: "Star", component: StarIcon },
  { key: "target", label: "Target", component: TargetIcon },
  { key: "terminal", label: "Terminal", component: TerminalIcon },
  { key: "x", label: "X", component: XIcon },
  { key: "zap", label: "Zap", component: ZapIcon },
];

/**
 * Get icon component by key
 */
export function getIconComponent(iconKey: string): LucideIcon | undefined {
  const entry = ICON_REGISTRY.find((icon) => icon.key === iconKey);
  return entry?.component;
}

/**
 * Get icon entry by key
 */
export function getIconEntry(iconKey: string): IconEntry | undefined {
  return ICON_REGISTRY.find((icon) => icon.key === iconKey);
}
