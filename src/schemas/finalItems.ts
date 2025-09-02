import { z } from "zod";

export const finalItemsSchema = z.object({
    items: z.array(z.object({
        name: z.string().min(1, "Name cannot be empty").meta({
            description: "Parsed and normalized item name",
            example: "Äpfel"
        }),
        amount: z.number().min(1, "Amount must be a positive number").meta({
            description: "Quantity of the item (in pieces, kg, liters, etc.)",
            example: 2
        }),
        productId: z.string().optional().nullable().meta({
            description: "Matched product ID from the database (if found)",
            example: "PROD_12345"
        }),
        productName: z.string().optional().nullable().meta({
            description: "Full product name from the database (if matched)",
            example: "Bio Äpfel Elstar 1kg"
        }),
        price: z.number().optional().nullable().meta({
            description: "Price per unit in euros (if product matched)",
            example: 2.49
        }),
        grammage: z.string().optional().nullable().meta({
            description: "Product grammage/packaging info (if available)",
            example: "1kg"
        })
    })).meta({
        description: "Array of parsed and enriched shopping list items",
        example: [
            {
                name: "Äpfel",
                amount: 2,
                productId: "PROD_12345",
                productName: "Bio Äpfel Elstar 1kg",
                price: 2.49,
                grammage: "1kg"
            },
            {
                name: "Milch",
                amount: 1,
                productId: "PROD_67890",
                productName: "Frische Vollmilch 1L",
                price: 1.29,
                grammage: "1L"
            }
        ]
    }),
    totalPrice: z.number().min(0, "Total price must be a non-negative number").meta({
        description: "Estimated total price of all items in euros",
        example: 15.67
    })
}).meta({
    description: "Structured shopping list with parsed items and pricing information",
    example: {
        items: [
            {
                name: "Äpfel",
                amount: 2,
                productId: "PROD_12345",
                productName: "Bio Äpfel Elstar 1kg",
                price: 2.49,
                grammage: "1kg"
            }
        ],
        totalPrice: 15.67
    }
});

export type FinalItemsSchema = z.infer<typeof finalItemsSchema>;
