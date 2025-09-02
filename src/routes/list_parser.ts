import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { generateText, stepCountIs } from "ai";
import { model } from "@/ai/llm";
import { products } from "@/products/products";
import { SYSTEM_PROMPT } from "@/ai/prompts";
import { shoppingListSchema, type ShoppingListInput } from "@/schemas/shoppingList";
import { finalItemsSchema, type FinalItemsSchema } from "@/schemas/finalItems";
import { type StructuredItemsOutput } from "@/schemas/structuredItems";
import { searchProductsTool } from "@/ai/tools/searchProducts";
import { calculateTool } from "@/ai/tools/calculate";
import { answerTool } from "@/ai/tools/answer";
import { auth } from "@/middleware/auth";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { errorSchema } from "@/schemas/errors";

const app = new Hono();

/**
 * Extracts the answer tool call from AI response
 * @param toolCalls Array of tool calls from the AI response
 * @returns The answer tool call or null if not found
 */
function extractAnswerToolCall(toolCalls: any[]): any | null {
    return toolCalls.find(tc => tc.toolName === "answer") || null;
}

/**
 * Enriches structured items with product details
 * @param structuredItems Output from AI parsing
 * @returns Final items with complete product information
 */
function enrichItemsWithProductDetails(structuredItems: StructuredItemsOutput): FinalItemsSchema {
    const enrichedItems = structuredItems.items.map(item => {
        const product = products.find(p => p.productId === item.productId);
        
        return {
            name: item.name,
            amount: item.amount,
            productId: item.productId,
            productName: product?.title,
            price: product?.retailPrice,
            grammage: product?.grammage
        };
    });

    return {
        items: enrichedItems,
        totalPrice: structuredItems.totalPrice
    };
}

/**
 * Parses an unstructured shopping list into a structured format using AI
 * @param items Array of shopping list items as strings
 * @returns Structured items with names and amounts, or null if parsing fails
 */
async function parseShoppingList(items: ShoppingListInput): Promise<FinalItemsSchema | null> {
    try {
        const response = await generateText({
            model,
            stopWhen: stepCountIs(5),
            toolChoice: "required",
            system: SYSTEM_PROMPT,
            prompt: items.join(", "),
            tools: {
                searchProducts: searchProductsTool,
                calculate: calculateTool,
                answer: answerTool
            }
        });

        const answerToolCall = extractAnswerToolCall(response.toolCalls);
        
        if (!answerToolCall) {
            console.warn("No 'answer' tool call found in response.");
            console.log("Available tool calls:", response.toolCalls.map(tc => tc.toolName));
            return null;
        }

        const structuredItems = answerToolCall.input["answer"] as StructuredItemsOutput;
        return enrichItemsWithProductDetails(structuredItems);

    } catch (error) {
        console.error("Failed to parse shopping list:", error);
        return null;
    }
}

app.use("*", auth());

// Route handler
app.post(
    "/parse",
    describeRoute({
      description: "Transform unstructured shopping list items into structured data with product matching and pricing",
      summary: "Parse Shopping List",
      tags: ["Shopping List"],
      requestBody: {
        description: "Array of unstructured shopping list items as strings",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: { type: "string", example: "2 kg Äpfel" },
              minItems: 1,
              example: ["2 kg Äpfel", "Milch 1L", "500g Hackfleisch", "Brot"]
            }
          }
        }
      },
      responses: {
        401: {
          description: "Unauthorized - Authentication required",
          content: {
            "application/json": {
              schema: resolver(errorSchema)
            }
          }
        },
        400: {
          description: "Bad request - Invalid input or AI parsing failed",
          content: {
            "application/json": {
              schema: resolver(errorSchema)
            }
          }
        },
        500: {
          description: "Internal server error occurred during AI processing",
          content: {
            "application/json": {
              schema: resolver(errorSchema)
            }
          }
        },
        200: {
          description: "Successfully parsed shopping list with structured items, product matches, and total pricing",
          content: {
            "application/json": {
              schema: resolver(finalItemsSchema)
            }
          }
        }
      },
      security: [{ cookieAuth: [] }]
    }),
    zValidator('json', shoppingListSchema),
    async (c) => {
        const items = c.req.valid("json");
        const structuredItems = await parseShoppingList(items);
        
        if (!structuredItems) {
            return c.json(
                { error: "Failed to parse shopping list" }, 
                400
            );
        }
        
        return c.json(structuredItems);
    }
);

export default app;
