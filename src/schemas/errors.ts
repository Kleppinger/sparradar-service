import { z } from "zod";

export const errorSchema = z.object({
  message: z.string().describe("Message describing the error")
});

export type ErrorResponse = z.infer<typeof errorSchema>;