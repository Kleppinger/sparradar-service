import { tool } from "ai";
import { evaluate } from "mathjs";
import { z } from "zod";

export const calculateTool = tool({
    description: "A tool to calculate math expressions",
    inputSchema: z.object({
        expression: z.string().min(1, "Expression is required")
    }),
    outputSchema: z.object({
        result: z.any().optional(),
        error: z.string().optional()
    }),
    execute: async({ expression }) => {
        try {
            const result = evaluate(expression);
            return { result };
        } catch (error) {
            console.error("Failed to evaluate expression:", error);
            return { error: "Invalid expression" };
        }
    }
});