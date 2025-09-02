import { searchMultiple } from "@/products/products";
import { tool } from "ai";
import { z } from "zod";

export const searchProductsTool = tool({
    description: "Search for products in the dataset. Accepts an array of multiple products to search",
    inputSchema: z.object({
    query: z.array(z.string()).min(1, "At least one query is required").describe('The queries to search for products')
    }),
    // Make outputSchema dynamic: Record<string, Array<{ title: string, productId: string }>>
    outputSchema: z.record(
        z.string(),
            z.array(
                z.object({
                title: z.string(),
                productId: z.string(),
                price: z.number().min(0, "Price must be a non-negative number"),
                grammage: z.string().optional()
                })
            )
    ),
    execute: async({ query }) => {
        return searchMultiple(query);
    }
});