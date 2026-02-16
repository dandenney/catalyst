/**
 * Generate component preview screenshots using Playwright.
 *
 * Usage:
 *   1. Start the dev server: pnpm dev
 *   2. Run this script:      npx tsx scripts/generate-previews.ts
 *
 * Screenshots are saved to public/component-previews/
 */

import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const COMPONENT_TYPES = [
  "HeroSection",
  "CTASection",
  "CardGridSection",
  "BentosSection",
  "TabbedContentSection",
  "ContentCardsSection",
  "ItemsSection",
  "CarouselSection",
  "FeaturesSection",
];

const OUTPUT_DIR = path.join(__dirname, "..", "public", "component-previews");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const VIEWPORT = { width: 1280, height: 900 };

async function main() {
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
  });

  console.log(`Generating previews for ${COMPONENT_TYPES.length} components...`);

  for (const type of COMPONENT_TYPES) {
    const page = await context.newPage();
    const url = `${BASE_URL}/preview/${type}`;

    try {
      await page.goto(url, { waitUntil: "networkidle" });

      // Wait a moment for any images/fonts to settle
      await page.waitForTimeout(1000);

      // Screenshot the first section element (the component itself)
      const section = page.locator("[data-slot='section']").first();
      const outputPath = path.join(OUTPUT_DIR, `${type}.png`);

      await section.screenshot({
        path: outputPath,
        type: "png",
      });

      console.log(`  ✓ ${type}`);
    } catch (error) {
      console.error(`  ✗ ${type}: ${error}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\nDone! Screenshots saved to ${OUTPUT_DIR}`);
}

main().catch(console.error);
