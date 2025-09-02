import { z } from "zod";

export const structuredItemsSchema = z.object({
    items: z.array(z.object({
        name: z.string().min(1, "Name cannot be empty"),
        amount: z.number().min(1, "Amount must be a positive number"),
        productId: z.string().optional().nullable()
    })),
    totalPrice: z.number().min(0, "Total price must be a non-negative number").describe("The total price in cents")
});

export type StructuredItemsOutput = z.infer<typeof structuredItemsSchema>;