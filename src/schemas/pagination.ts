import { z } from "zod";

// Core pagination types
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Pagination metadata schema
export const paginationMetaSchema = z.object({
  page: z.number().meta({
    description: "Current page number",
    example: 1
  }),
  limit: z.number().meta({
    description: "Number of items per page",
    example: 10
  }),
  total: z.number().meta({
    description: "Total number of markets available",
    example: 150
  }),
  totalPages: z.number().meta({
    description: "Total number of pages available",
    example: 15
  }),
  hasNext: z.boolean().meta({
    description: "Whether there are more pages available",
    example: true
  }),
  hasPrev: z.boolean().meta({
    description: "Whether there are previous pages available",
    example: false
  })
});

// Simple validation with sensible defaults
export const paginationRequest = () => z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
});

export type PaginationRequestSchema = z.infer<ReturnType<typeof paginationRequest>>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;