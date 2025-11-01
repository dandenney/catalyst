/**
 * Generate Component Preview Images
 * Uses Playwright to screenshot components in isolation
 */

import { chromium } from 'playwright';
import { getAvailableComponents } from '@catalyst/core';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '../public/component-previews');
const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 600;

async function generatePreviews() {
  console.log('🎬 Starting preview generation...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Created output directory: ${OUTPUT_DIR}\n`);
  }

  // Launch browser
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
  });
  const page = await context.newPage();

  // Get all available components
  const components = getAvailableComponents();
  console.log(`📸 Generating previews for ${components.length} components:\n`);

  for (const component of components) {
    const url = `${BASE_URL}/preview/${component.type}`;
    const outputPath = path.join(OUTPUT_DIR, `${component.type}.png`);

    try {
      console.log(`  → ${component.label} (${component.type})`);
      console.log(`    URL: ${url}`);

      // Navigate to preview page
      await page.goto(url, { waitUntil: 'networkidle' });

      // Wait a bit for any animations or lazy loading
      await page.waitForTimeout(500);

      // Take screenshot
      await page.screenshot({
        path: outputPath,
        fullPage: false,
      });

      console.log(`    ✅ Saved to: ${outputPath}\n`);
    } catch (error) {
      console.error(`    ❌ Error generating preview for ${component.type}:`, error);
    }
  }

  await browser.close();
  console.log('🎉 Preview generation complete!');
}

// Run the script
generatePreviews().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
