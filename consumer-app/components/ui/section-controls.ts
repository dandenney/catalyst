export interface SectionControls {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export type SectionType =
  | "HeroSection"
  | "LogosSection"
  | "ItemsSection"
  | "StatsSection"
  | "FAQSection"
  | "PricingSection"
  | "CTASection"
  | "CardGridSection"
  | "BentosSection"
  | "TabbedContentSection"
  | "ContentCardsSection"
  | "CarouselSection"
  | "FeaturesSection"
  | "FooterSection";
