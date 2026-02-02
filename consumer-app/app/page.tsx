"use client";

import { createComponent,type HeroSectionSchema, type ItemsSectionSchema, type LogosSectionSchema, type StatsSectionSchema } from "catalyst";
import { useState } from "react";

import CTA from "../components/sections/cta/default";
import FAQ from "../components/sections/faq/default";
import Footer from "../components/sections/footer/default";
import SchemaHero from "../components/sections/hero/schema-hero";
import SchemaItems from "../components/sections/items/schema-items";
import SchemaLogos from "../components/sections/logos/schema-logos";
import Navbar from "../components/sections/navbar/default";
import Pricing from "../components/sections/pricing/default";
import SchemaStats from "../components/sections/stats/schema-stats";
import { EditModeIndicator } from "../components/ui/edit-mode-indicator";
import { LayoutLines } from "../components/ui/layout-lines";

export default function Home() {
  const [heroSchema, setHeroSchema] = useState<HeroSectionSchema>(() => {
    const baseSchema = createComponent('HeroSection') as HeroSectionSchema;
    // Add demo variants
    return {
      ...baseSchema,
      variants: {
        finance: {
          title: {
            type: 'text',
            value: {
              en: 'Enterprise financial solutions built for scale',
              es: 'Soluciones financieras empresariales diseñadas para escalar',
            },
          },
          description: {
            type: 'text',
            value: {
              en: 'Secure, compliant, and powerful financial infrastructure trusted by leading institutions worldwide.',
              es: 'Infraestructura financiera segura, conforme y potente en la que confían instituciones líderes en todo el mundo.',
            },
          },
        },
        startup: {
          title: {
            type: 'text',
            value: {
              en: 'Ship faster, iterate quicker',
              es: 'Envía más rápido, itera más rápido',
            },
          },
          description: {
            type: 'text',
            value: {
              en: 'The modern toolkit for startups who need to move fast without breaking things.',
              es: 'El kit de herramientas moderno para startups que necesitan moverse rápido sin romper nada.',
            },
          },
        },
      },
    };
  });
  const [logosSchema, setLogosSchema] = useState<LogosSectionSchema>(() => {
    const baseSchema = createComponent("LogosSection") as LogosSectionSchema;
    return {
      ...baseSchema,
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
    };
  });
  const [itemsSchema, setItemsSchema] = useState<ItemsSectionSchema>(() => {
    const baseSchema = createComponent("ItemsSection") as ItemsSectionSchema;
    return {
      ...baseSchema,
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
    };
  });
  const [statsSchema, setStatsSchema] = useState<StatsSectionSchema>(() => {
    const baseSchema = createComponent("StatsSection") as StatsSectionSchema;
    return {
      ...baseSchema,
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
    };
  });

  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <LayoutLines />
      <EditModeIndicator />
      <Navbar />
      <SchemaHero schema={heroSchema} onUpdate={setHeroSchema} />
      <SchemaLogos schema={logosSchema} onUpdate={setLogosSchema} />
      <SchemaItems schema={itemsSchema} onUpdate={setItemsSchema} />
      <SchemaStats schema={statsSchema} onUpdate={setStatsSchema} />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
