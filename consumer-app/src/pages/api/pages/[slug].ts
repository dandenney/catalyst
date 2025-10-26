import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonStorageAdapter } from '@catalyst/storage';
import { PageSchema } from '@catalyst/core';
import path from 'path';

const storageAdapter = new JsonStorageAdapter({
  dataDir: path.join(process.cwd(), 'data'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PageSchema | { error: string }>
) {
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  if (req.method === 'GET') {
    try {
      const page = await storageAdapter.getPage(slug);

      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }

      return res.status(200).json(page);
    } catch (error) {
      console.error('Error loading page:', error);
      return res.status(500).json({ error: 'Failed to load page' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const page = req.body as PageSchema;
      await storageAdapter.savePage(page);
      return res.status(200).json(page);
    } catch (error) {
      console.error('Error saving page:', error);
      return res.status(500).json({ error: 'Failed to save page' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
