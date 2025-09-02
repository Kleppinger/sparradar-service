import { z } from "zod";
import { paginationMetaSchema } from "@/schemas/pagination.ts";

// Market franchise enum for validation
export const marketFranchiseSchema = z.enum([
  "REWE",
  "Penny",
  "Netto",
  "Lidl",
  "Kaufland",
  "Aldi Nord",
  "Aldi Süd",
  "Norma"
]);

// Single market schema
export const marketSchema = z.object({
  id: z.number().meta({
    description: "Unique market identifier",
    example: 1
  }),
  marketId: z.string().meta({
    description: "External market ID from the franchise system",
    example: "840129"
  }),
  franchise: marketFranchiseSchema.meta({
    description: "Market franchise/chain name",
    example: "REWE"
  }),
  name: z.string().meta({
    description: "Market name or branch identifier",
    example: "REWE Markt Hauptstraße"
  }),
  address: z.string().meta({
    description: "Street address of the market",
    example: "Hauptstraße 123"
  }),
  zipCode: z.string().meta({
    description: "Postal code",
    example: "12345"
  }),
  city: z.string().meta({
    description: "City where the market is located",
    example: "Berlin"
  })
});


// Markets list response schema
export const marketsListResponseSchema = z.object({
  data: z.array(marketSchema).meta({
    description: "Array of markets for the current page",
    example: [
      {
        id: 1,
        marketId: "840129",
        franchise: "REWE",
        name: "REWE Markt Hauptstraße",
        address: "Hauptstraße 123",
        zipCode: "12345",
        city: "Berlin"
      },
      {
        id: 2,
        marketId: "840195",
        franchise: "REWE",
        name: "REWE Markt Nebenstraße",
        address: "Nebenstraße 456",
        zipCode: "12346",
        city: "Berlin"
      }
    ]
  }),
  pagination: paginationMetaSchema.meta({
    description: "Pagination information for the current request",
    example: {
      page: 1,
      limit: 10,
      total: 150,
      totalPages: 15,
      hasNext: true,
      hasPrev: false
    }
  })
});

export type Market = z.infer<typeof marketSchema>;
export type MarketsListResponse = z.infer<typeof marketsListResponseSchema>;
