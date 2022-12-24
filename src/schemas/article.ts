import { z } from 'zod';
import { categorySchema } from './category';

export const articleSchema = z.object({
  author: z.string().nullish(),
  category: categorySchema,
  country: z.string(),
  description: z.string().optional(),
  image: z.string().nullish(),
  language: z.string(),
  published_at: z.string(),
  source: z.string(),
  title: z.string(),
  url: z.string(),
});

export type Article = z.infer<typeof articleSchema>;
