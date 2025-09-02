import { Hono } from "hono";
import { sign as signJWT } from "hono/jwt";
import { deleteCookie, setCookie } from "hono/cookie";
import { genSalt, hash, compare } from "bcrypt-ts";
import {
  loginResponseSchema,
  loginUserSchema,
  registerUserSchema,
  registerResponseSchema,
  logoutResponseSchema,
} from "@/schemas/auth";
import { userRepository } from "@/database/models/User";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { errorSchema } from "@/schemas/errors.ts";
import { auth } from "@/middleware/auth.ts";

const app = new Hono();

async function hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
}

app.post("/login",
    describeRoute({
      description: "Authenticate user with email and password",
      summary: "User Login",
      tags: ["Authentication"],
      responses: {
        401: {
          description: "Authentication failed due to invalid credentials",
          content: {
            "application/json": {
              schema: resolver(errorSchema)
            }
          }
        },
        200: {
          description: "User successfully authenticated and session created",
          content: {
            "application/json": {
              schema: resolver(loginResponseSchema)
            }
          },
          headers: {
            "Set-Cookie": {
              description: "HTTP-only authentication cookie for session management",
              schema: {
                type: "string",
                example: "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly;"
              }
            }
          }
        }
      }
    }),
    zValidator('json', loginUserSchema),
    async (c) => {
        const request = c.req.valid("json");
        const user = await userRepository().findOneBy({ email: request.email });

        if (!user) {
            return c.json({ message: "Invalid email or password" }, 401);
        }

        const isPasswordValid = await compare(request.password, user.password);
        if (!isPasswordValid) {
            return c.json({ message: "Invalid email or password" }, 401);
        }

        const payload = {
            id: user.id,
            email: user.email,
            exp: Math.floor(Date.now() / 1000) * 60 * 30
        };

        const token = await signJWT(payload, process.env.JWT_SECRET);

        setCookie(c, "auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });

        // Update last login of user
        user.lastLoginAt = new Date();
        await userRepository().save(user);

        return c.json({ message: "Login successful", data: payload, token: token }, 200);
    }
);

app.post("/register", 
    describeRoute({
      description: "Create a new user account with email and password",
      summary: "User Registration",
      tags: ["Authentication"],
      responses: {
        400: {
          description: "Bad request due to validation errors or duplicate email",
          content: {
            "application/json": {
              schema: resolver(errorSchema)
            }
          }
        },
        500: {
          description: "Server error occurred during user registration process",
          content: {
            "application/json": {
              schema: resolver(errorSchema)
            }
          }
        },
        201: {
          description: "User account created successfully and ready for login",
          content: {
            "application/json": {
              schema: resolver(registerResponseSchema)
            }
          }
        }
      }
    }),
    zValidator('json', registerUserSchema),
    async (c) => {
        const request = c.req.valid("json");
        const hashedPassword = await hashPassword(request.password);

        try {
            const user = userRepository().create({
                first_name: request.firstName,
                last_name: request.lastName,
                email: request.email,
                password: hashedPassword,
                lastLoginAt: new Date()
            });

            // User without password
            let data: any = { ...user };
            delete data.password;

            await userRepository().save(user);
            return c.json({ message: "User registered successfully", data: data }, 201);
        } catch(error) {
            console.error("Error registering user:", error);
            return c.json({ message: "Error registering user", error: error }, 500);
        }

    }
);

app.delete("/logout",
    describeRoute({
      description: "Terminate user session and clear authentication cookie",
      summary: "User Logout",
      tags: ["Authentication"],
      responses: {
        200: {
          description: "User session terminated successfully and authentication cookie cleared",
          content: {
            "application/json": {
              schema: resolver(logoutResponseSchema)
            }
          }
        }
      },
      security: [{ cookieAuth: [] }],
    }),
    (c) => {
        deleteCookie(c, "auth_token");
        return c.json({ message: "Logged out successfully" }, 200);
    });

app.use("/logout", auth());

export default app;