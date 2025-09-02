import { auth } from "@/middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { paginationRequest } from "../schemas/pagination.js";
import { executePaginatedQuery } from "../database/pagination.js";
import { marketRepository } from "../database/models/Market.js";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { marketsListResponseSchema } from "../schemas/markets.js";
import { errorSchema } from "../schemas/errors.js";

const app = new Hono();

app.use("*", auth());

app.get(
  "/",
  describeRoute({
    description: "Retrieve a paginated list of all available markets",
    summary: "Get Markets",
    tags: ["Markets"],
    parameters: [
      {
        name: "page",
        in: "query",
        required: false,
        description: "Page number for pagination (starts from 1)",
        schema: {
          type: "integer",
          minimum: 1,
          default: 1,
          example: 1,
        },
      },
      {
        name: "limit",
        in: "query",
        required: false,
        description: "Number of markets to return per page (max 100)",
        schema: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          default: 10,
          example: 10,
        },
      },
    ],
    responses: {
      401: {
        description: "Unauthorized - Authentication required",
        content: {
          "application/json": {
            schema: resolver(errorSchema),
          },
        },
      },
      500: {
        description: "Internal server error occurred while fetching markets",
        content: {
          "application/json": {
            schema: resolver(errorSchema),
          },
        },
      },
      200: {
        description:
          "Successfully retrieved paginated list of markets with metadata",
        content: {
          "application/json": {
            schema: resolver(marketsListResponseSchema),
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
  }),
  zValidator("query", paginationRequest()),
  async (c) => {
    const query = c.req.valid("query");

    try {
      const result = await executePaginatedQuery(
        marketRepository().createQueryBuilder("market"),
        query
      );

      return c.json(result);
    } catch (error) {
      console.error("Error fetching markets:", error);
      return c.json({ error: "Failed to fetch markets" }, 500);
    }
  }
);

export default app;