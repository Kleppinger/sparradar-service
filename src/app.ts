import "reflect-metadata";
import { Hono } from "hono";
import "@/types/env.d.ts";
import { cors } from 'hono/cors'
import { loadProducts, productsFuse } from "@/products/products.ts";
import { initializeDatabase } from "@/database/database";

// Import routes
import list_parser from "@/routes/list_parser.ts";
import auth from "@/routes/auth.ts";
import markets from "@/routes/markets.ts";
import { openAPISpecs } from "hono-openapi";
import { swaggerUI } from "@hono/swagger-ui";

const app = new Hono().basePath("/api/v1");

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.route("/auth", auth);
app.route("/shopping_list", list_parser);
app.route("/markets", markets);

app.get(
  '/spec',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'SparRadar Service API',
        version: '1.0.0',
        description: 'API for the SparRadar application',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local Development Server' },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "auth_token"
          }
        }
      }
    },
  })
)

app.get("/spec/ui", swaggerUI({url: "/api/v1/spec"}));

await loadProducts();
await initializeDatabase();

export default app;
