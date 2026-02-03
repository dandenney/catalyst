"use client";

import { useState } from "react";
import {
  type FAQSectionSchema,
  type CTASectionSchema,
  type HeroSectionSchema,
  type LogosSectionSchema,
  type ItemsSectionSchema,
  type StatsSectionSchema,
  type FooterSectionSchema,
  type PricingSectionSchema,
  createComponent,
} from "catalyst";

type SectionSchema =
  | HeroSectionSchema
  | LogosSectionSchema
  | ItemsSectionSchema
  | StatsSectionSchema
  | FAQSectionSchema
  | PricingSectionSchema
  | CTASectionSchema
  | FooterSectionSchema;

interface Section {
  type: string;
  schema: SectionSchema;
}

import SchemaCTA from "../components/sections/cta/schema-cta";
import SchemaFAQ from "../components/sections/faq/schema-faq";
import SchemaFooter from "../components/sections/footer/schema-footer";
import SchemaHero from "../components/sections/hero/schema-hero";
import SchemaItems from "../components/sections/items/schema-items";
import SchemaLogos from "../components/sections/logos/schema-logos";
import Navbar from "../components/sections/navbar/default";
import SchemaPricing from "../components/sections/pricing/schema-pricing";
import SchemaStats from "../components/sections/stats/schema-stats";
import { EditModeIndicator } from "../components/ui/edit-mode-indicator";
import { LayoutLines } from "../components/ui/layout-lines";
import {
  type SectionControls,
  type SectionType,
} from "../components/ui/section-controls";

export default function Home() {
  const [sections, setSections] = useState<Section[]>(() => {
    const heroSchema = createComponent("HeroSection") as HeroSectionSchema;
    const logosSchema = createComponent("LogosSection") as LogosSectionSchema;
    const itemsSchema = createComponent("ItemsSection") as ItemsSectionSchema;
    const statsSchema = createComponent("StatsSection") as StatsSectionSchema;
    const faqSchema = createComponent("FAQSection") as FAQSectionSchema;
    const pricingSchema = createComponent("PricingSection") as PricingSectionSchema;
    const ctaSchema = createComponent("CTASection") as CTASectionSchema;
    const footerSchema = createComponent("FooterSection") as FooterSectionSchema;

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
        schema: {
          ...faqSchema,
          variants: {
            finance: {
              title: {
                type: "text",
                value: {
                  en: "Enterprise FAQ",
                  es: "Preguntas frecuentes empresariales",
                },
              },
            },
            startup: {
              title: {
                type: "text",
                value: {
                  en: "Startup FAQ",
                  es: "Preguntas frecuentes para startups",
                },
              },
            },
          },
        } as FAQSectionSchema,
      },
      {
        type: "PricingSection",
        schema: {
          ...pricingSchema,
          variants: {
            finance: {
              title: {
                type: "text",
                value: {
                  en: "Enterprise pricing that scales with you",
                  es: "Precios empresariales que escalan contigo",
                },
              },
              description: {
                type: "text",
                value: {
                  en: "Flexible plans designed for financial institutions of any size.",
                  es: "Planes flexibles diseñados para instituciones financieras de cualquier tamaño.",
                },
              },
            },
            startup: {
              title: {
                type: "text",
                value: {
                  en: "Startup-friendly pricing",
                  es: "Precios accesibles para startups",
                },
              },
              description: {
                type: "text",
                value: {
                  en: "Start free, scale as you grow. No hidden fees.",
                  es: "Comienza gratis, escala a medida que creces. Sin tarifas ocultas.",
                },
              },
            },
          },
        } as PricingSectionSchema,
      },
      {
        type: "CTASection",
        schema: {
          ...ctaSchema,
          variants: {
            finance: {
              heading: {
                type: "text",
                value: {
                  en: "Ready to transform your financial infrastructure?",
                  es: "¿Listo para transformar tu infraestructura financiera?",
                },
              },
              description: {
                type: "text",
                value: {
                  en: "Join hundreds of financial institutions already using our platform.",
                  es: "Únete a cientos de instituciones financieras que ya usan nuestra plataforma.",
                },
              },
            },
            startup: {
              heading: {
                type: "text",
                value: {
                  en: "Ready to ship your next big thing?",
                  es: "¿Listo para lanzar tu próximo gran proyecto?",
                },
              },
              description: {
                type: "text",
                value: {
                  en: "Join thousands of startups building faster with our tools.",
                  es: "Únete a miles de startups construyendo más rápido con nuestras herramientas.",
                },
              },
            },
          },
        } as CTASectionSchema,
      },
      {
        type: "FooterSection",
        schema: footerSchema,
      },
    ];
  });

  const updateSectionSchema = (
    index: number,
    schema: SectionSchema,
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

  const createSchemaByType = (type: SectionType): Section => {
    const schema = createComponent(type) as SectionSchema;
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
    { type: "PricingSection", label: "Pricing section" },
    { type: "CTASection", label: "CTA section" },
    { type: "FooterSection", label: "Footer section" },
  ];

  const handleAddSection = (type: SectionType) => {
    if (sections.length === 0) {
      addFirstSection(type);
    } else {
      addSectionAfter(sections.length - 1, type);
    }
  };

  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <LayoutLines />
      <EditModeIndicator
        addSectionOptions={addSectionOptions}
        onAddSection={handleAddSection}
      />
      <Navbar />
      {sections.map((section, index) => {
        const sectionControls: SectionControls = {
          canMoveUp: index > 0,
          canMoveDown: index < sections.length - 1,
          onMoveUp: () => moveSection(index, index - 1),
          onMoveDown: () => moveSection(index, index + 1),
          onRemove: () => removeSection(index),
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
          case "PricingSection":
            return (
              <SchemaPricing
                key={section.schema.id}
                schema={section.schema as PricingSectionSchema}
                onUpdate={(schema) => updateSectionSchema(index, schema)}
                sectionControls={sectionControls}
              />
            );
          case "CTASection":
            return (
              <SchemaCTA
                key={section.schema.id}
                schema={section.schema as CTASectionSchema}
                onUpdate={(schema) => updateSectionSchema(index, schema)}
                sectionControls={sectionControls}
              />
            );
          case "FooterSection":
            return (
              <SchemaFooter
                key={section.schema.id}
                schema={section.schema as FooterSectionSchema}
                onUpdate={(schema) => updateSectionSchema(index, schema)}
                sectionControls={sectionControls}
              />
            );
          default:
            return null;
        }
      })}
    </main>
  );
}
