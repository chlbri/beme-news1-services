import { z } from 'zod';

export const articleSchema = z.object({
  author: z.string().optional(),
  URL: z.string(),
  imageURL: z.string().optional(),
  content: z.string().optional(),
  language: z.string().default('en'),
  publishedAt: z.string().datetime(),
  source: z.string().optional(),
  title: z.string(),
});

export type Article = z.output<typeof articleSchema>;
