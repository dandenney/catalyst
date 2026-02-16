"use client";

import {
  type BentosSectionSchema,
  type CardGridSectionSchema,
  type CarouselSectionSchema,
  type ContentCardsSectionSchema,
  createComponent,
  type CTASectionSchema,
  type FeaturesSectionSchema,
  type HeroSectionSchema,
  type ItemsSectionSchema,
  type TabbedContentSectionSchema,
} from "catalyst";
import { useParams } from "next/navigation";

import { EditableBentos } from "../../../components/sections/bentos/editable-bentos";
import { EditableCarousel } from "../../../components/sections/carousel/editable-carousel";
import { EditableCardGrid } from "../../../components/sections/card-grid/editable-card-grid";
import { EditableCTA } from "../../../components/sections/cta/editable-cta";
import { EditableFeatures } from "../../../components/sections/features/editable-features";
import { EditableHero } from "../../../components/sections/hero/editable-hero";
import { EditableContentCards } from "../../../components/sections/content-cards/editable-content-cards";
import { EditableItems } from "../../../components/sections/items/editable-items";
import { EditableTabbedContent } from "../../../components/sections/tabbed-content/editable-tabbed-content";

type SectionSchema =
  | HeroSectionSchema
  | CTASectionSchema
  | CardGridSectionSchema
  | BentosSectionSchema
  | TabbedContentSectionSchema
  | ContentCardsSectionSchema
  | ItemsSectionSchema
  | CarouselSectionSchema
  | FeaturesSectionSchema;

export default function PreviewPage() {
  const params = useParams();
  const componentType = params.component as string;

  const schema = createComponent(componentType) as SectionSchema | null;

  if (!schema) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0E1A] text-white">
        <p>Unknown component: {componentType}</p>
      </div>
    );
  }

  return (
    <main className="bg-[#0A0E1A] min-h-screen w-full">
      {renderComponent(componentType, schema)}
    </main>
  );
}

function renderComponent(type: string, schema: SectionSchema) {
  switch (type) {
    case "HeroSection":
      return <EditableHero schema={schema as HeroSectionSchema} />;
    case "CTASection":
      return <EditableCTA schema={schema as CTASectionSchema} />;
    case "CardGridSection":
      return <EditableCardGrid schema={schema as CardGridSectionSchema} />;
    case "BentosSection":
      return <EditableBentos schema={schema as BentosSectionSchema} />;
    case "TabbedContentSection":
      return (
        <EditableTabbedContent
          schema={schema as TabbedContentSectionSchema}
        />
      );
    case "ContentCardsSection":
      return (
        <EditableContentCards
          schema={schema as ContentCardsSectionSchema}
        />
      );
    case "ItemsSection":
      return <EditableItems schema={schema as ItemsSectionSchema} />;
    case "CarouselSection":
      return <EditableCarousel schema={schema as CarouselSectionSchema} />;
    case "FeaturesSection":
      return <EditableFeatures schema={schema as FeaturesSectionSchema} />;
    default:
      return null;
  }
}
