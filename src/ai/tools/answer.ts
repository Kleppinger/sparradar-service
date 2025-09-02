import { z } from "zod";
import { tool } from "ai";
import { structuredItemsSchema } from "@/schemas/structuredItems";

export const answerTool = tool({
    description: "A tool for providing the final answer",
    inputSchema: z.object({
        answer: structuredItemsSchema
    })
});