"use client";

import { useState } from "react";
import { type HeroSectionSchema, createComponent } from "catalyst";

import CTA from "../components/sections/cta/default";
import FAQ from "../components/sections/faq/default";
import Footer from "../components/sections/footer/default";
import SchemaHero from "../components/sections/hero/schema-hero";
import Items from "../components/sections/items/default";
import Logos from "../components/sections/logos/default";
import Navbar from "../components/sections/navbar/default";
import Pricing from "../components/sections/pricing/default";
import Stats from "../components/sections/stats/default";
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

  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <LayoutLines />
      <EditModeIndicator />
      <Navbar />
      <SchemaHero schema={heroSchema} onUpdate={setHeroSchema} />
      <Logos />
      <Items />
      <Stats />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
