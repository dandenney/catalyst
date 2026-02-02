"use client";

import { useState } from "react";
import {
  type FAQSectionSchema,
  type HeroSectionSchema,
  type LogosSectionSchema,
  type ItemsSectionSchema,
  type StatsSectionSchema,
  createComponent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "catalyst";

import CTA from "../components/sections/cta/default";
import SchemaFAQ from "../components/sections/faq/schema-faq";
import Footer from "../components/sections/footer/default";
import SchemaHero from "../components/sections/hero/schema-hero";
import SchemaItems from "../components/sections/items/schema-items";
import SchemaLogos from "../components/sections/logos/schema-logos";
import Navbar from "../components/sections/navbar/default";
import Pricing from "../components/sections/pricing/default";
import SchemaStats from "../components/sections/stats/schema-stats";
import { EditModeIndicator } from "../components/ui/edit-mode-indicator";
import { LayoutLines } from "../components/ui/layout-lines";
import {
  type SectionControls,
  type SectionType,
} from "../components/ui/section-dropdown-items";

export default function Home() {
  const [sections, setSections] = useState(() => {
    const heroSchema = createComponent("HeroSection") as HeroSectionSchema;
    const logosSchema = createComponent("LogosSection") as LogosSectionSchema;
    const itemsSchema = createComponent("ItemsSection") as ItemsSectionSchema;
    const statsSchema = createComponent("StatsSection") as StatsSectionSchema;
    const faqSchema = createComponent("FAQSection") as FAQSectionSchema;

    return [
      {
        type: "HeroSection",
        schema: {
          ...heroSchema,
          variants: {
            finance: {
              title: {
                type: "text",
                value: {
                  en: "Enterprise financial solutions built for scale",
                  es: "Soluciones financieras empresariales diseñadas para escalar",
                },
              },
              description: {
                type: "text",
                value: {
                  en: "Secure, compliant, and powerful financial infrastructure trusted by leading institutions worldwide.",
                  es: "Infraestructura financiera segura, conforme y potente en la que confían instituciones líderes en todo el mundo.",
                },
              },
            },
            startup: {
              title: {
                type: "text",
                value: {
                  en: "Ship faster, iterate quicker",
                  es: "Envía más rápido, itera más rápido",
                },
              },
              description: {
                type: "text",
                value: {
                  en: "The modern toolkit for startups who need to move fast without breaking things.",
                  es: "El kit de herramientas moderno para startups que necesitan moverse rápido sin romper nada.",
                },
              },
            },
          },
        } as HeroSectionSchema,
      },
      {
        type: "LogosSection",
        schema: {
          ...logosSchema,
          variants: {
            finance: {
              title: {
                type: "text",
                value: {
                  en: "Trusted by leading enterprises worldwide",
                  es: "Con la confianza de empresas líderes en todo el mundo",
                },
              },
              badgeText: {
                type: "text",
                value: { en: "Enterprise partners", es: "Socios empresariales" },
              },
            },
            startup: {
              title: {
                type: "text",
                value: {
                  en: "Built with modern tools for fast iteration",
                  es: "Construido con herramientas modernas para iterar rápido",
                },
              },
              badgeText: {
                type: "text",
                value: { en: "Startup stack", es: "Stack para startups" },
              },
            },
          },
        } as LogosSectionSchema,
      },
      {
        type: "ItemsSection",
        schema: {
          ...itemsSchema,
          variants: {
            finance: {
              title: {
                type: "text",
                value: {
                  en: "Enterprise-grade features for financial services",
                  es: "Funciones de nivel empresarial para servicios financieros",
                },
              },
            },
            startup: {
              title: {
                type: "text",
                value: {
                  en: "Ship fast with everything you need built-in",
                  es: "Lanza rápido con todo lo que necesitas integrado",
                },
              },
            },
          },
        } as ItemsSectionSchema,
      },
      {
        type: "StatsSection",
        schema: {
          ...statsSchema,
          variants: {
            finance: {
              stats: {
                type: "list",
                value: [
                  {
                    type: "statItem",
                    label: { en: "trusted by" },
                    value: { en: "500" },
                    suffix: { en: "+" },
                    description: { en: "financial institutions worldwide" },
                  },
                  {
                    type: "statItem",
                    label: { en: "processing" },
                    value: { en: "2.5" },
                    suffix: { en: "B" },
                    description: { en: "transactions annually" },
                  },
                  {
                    type: "statItem",
                    label: { en: "uptime" },
                    value: { en: "99.99" },
                    suffix: { en: "%" },
                    description: { en: "guaranteed availability" },
                  },
                  {
                    type: "statItem",
                    label: { en: "compliance" },
                    value: { en: "50" },
                    suffix: { en: "+" },
                    description: { en: "regulatory frameworks supported" },
                  },
                ],
              },
            },
            startup: {
              stats: {
                type: "list",
                value: [
                  {
                    type: "statItem",
                    label: { en: "launched" },
                    value: { en: "10" },
                    suffix: { en: "k" },
                    description: { en: "startups using our platform" },
                  },
                  {
                    type: "statItem",
                    label: { en: "raised" },
                    value: { en: "5" },
                    suffix: { en: "B" },
                    description: { en: "in funding by our customers" },
                  },
                  {
                    type: "statItem",
                    label: { en: "shipped" },
                    value: { en: "3x" },
                    description: { en: "faster than industry average" },
                  },
                  {
                    type: "statItem",
                    label: { en: "saved" },
                    value: { en: "200" },
                    suffix: { en: "+" },
                    description: { en: "engineering hours per month" },
                  },
                ],
              },
            },
          },
        } as StatsSectionSchema,
      },
      {
        type: "FAQSection",
        schema: faqSchema,
      },
    ];
  });

  const updateSectionSchema = (
    index: number,
    schema: HeroSectionSchema | LogosSectionSchema | ItemsSectionSchema | StatsSectionSchema,
  ) => {
    setSections((prev) =>
      prev.map((section, i) => (i === index ? { ...section, schema } : section)),
    );
  };

  const moveSection = (from: number, to: number) => {
    setSections((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const createSchemaByType = (type: SectionType) => {
    const schema = createComponent(type) as
      | HeroSectionSchema
      | LogosSectionSchema
      | ItemsSectionSchema
      | StatsSectionSchema
      | FAQSectionSchema;
    return { type, schema };
  };

  const addSectionAfter = (index: number, type: SectionType) => {
    setSections((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, createSchemaByType(type));
      return next;
    });
  };

  const addFirstSection = (type: SectionType) => {
    setSections([createSchemaByType(type)]);
  };

  const addSectionOptions: Array<{ type: SectionType; label: string }> = [
    { type: "HeroSection", label: "Hero section" },
    { type: "LogosSection", label: "Logos section" },
    { type: "ItemsSection", label: "Items section" },
    { type: "StatsSection", label: "Stats section" },
    { type: "FAQSection", label: "FAQ section" },
  ];

  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <LayoutLines />
      <EditModeIndicator />
      <Navbar />
      {sections.length === 0 && (
        <div className="max-w-container mx-auto flex justify-center py-16">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur"
              >
                Add section
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {addSectionOptions.map((option) => (
                <DropdownMenuItem
                  key={option.type}
                  onClick={() => addFirstSection(option.type)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {sections.map((section, index) => {
        const sectionControls: SectionControls = {
          canMoveUp: index > 0,
          canMoveDown: index < sections.length - 1,
          onMoveUp: () => moveSection(index, index - 1),
          onMoveDown: () => moveSection(index, index + 1),
          onRemove: () => removeSection(index),
          onAddSection: (type) => addSectionAfter(index, type),
        };

        switch (section.type) {
          case "HeroSection":
            return (
              <SchemaHero
                key={section.schema.id}
                schema={section.schema as HeroSectionSchema}
                onUpdate={(schema) => updateSectionSchema(index, schema)}
                sectionControls={sectionControls}
              />
            );
          case "LogosSection":
            return (
              <SchemaLogos
                key={section.schema.id}
                schema={section.schema as LogosSectionSchema}
                onUpdate={(schema) => updateSectionSchema(index, schema)}
                sectionControls={sectionControls}
              />
            );
          case "ItemsSection":
            return (
              <SchemaItems
                key={section.schema.id}
                schema={section.schema as ItemsSectionSchema}
                onUpdate={(schema) => updateSectionSchema(index, schema)}
                sectionControls={sectionControls}
              />
            );
          case "StatsSection":
            return (
              <SchemaStats
                key={section.schema.id}
                schema={section.schema as StatsSectionSchema}
                onUpdate={(schema) => updateSectionSchema(index, schema)}
                sectionControls={sectionControls}
              />
            );
          case "FAQSection":
            return (
              <SchemaFAQ
                key={section.schema.id}
                schema={section.schema as FAQSectionSchema}
                onUpdate={(schema) => updateSectionSchema(index, schema)}
                sectionControls={sectionControls}
              />
            );
          default:
            return null;
        }
      })}
      <Pricing />
      
      <CTA />
      <Footer />
    </main>
  );
}
