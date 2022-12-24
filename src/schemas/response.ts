import { z } from 'zod';
import { articleSchema } from './article';

const paginationSchema = z.object({
  count: z.number(),
  limit: z.number(),
  offset: z.number(),
  total: z.number({
    description: 'Total number of news',
    invalid_type_error: 'Total is NaN',
  }),
});

export const newsResponseSchema = z.object({
  pagination: paginationSchema,
  news: z.array(articleSchema),
});

export type NewsResponse = z.infer<typeof newsResponseSchema>;
