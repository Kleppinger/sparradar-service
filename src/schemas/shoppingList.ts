import { z } from "zod";

export const shoppingListSchema = z
    .array(z.string().min(1, "Item cannot be empty").meta({
        description: "Shopping list item as free text (e.g., '2 kg Äpfel', 'Milch', '500g Hackfleisch')",
        example: "2 kg Äpfel"
    }))
    .nonempty("Items array cannot be empty")
    .meta({
        description: "Array of unstructured shopping list items as strings",
        example: ["2 kg Äpfel", "Milch 1L", "500g Hackfleisch", "Brot"]
    });

export type ShoppingListInput = z.infer<typeof shoppingListSchema>;