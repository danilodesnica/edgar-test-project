import { z } from 'zod';

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const quotesQuerySchema = z.object({
    ...paginationSchema.shape,
    tag: z.string().optional(),
});

export const newsQuerySchema = z.object({
    query: z.string().optional(),
});

export const weatherQuerySchema = z.object({
    city: z.string().min(1).default('Belgrade'),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;
export type QuotesQuery = z.infer<typeof quotesQuerySchema>;
export type NewsQuery = z.infer<typeof newsQuerySchema>;
export type WeatherQuery = z.infer<typeof weatherQuerySchema>;
