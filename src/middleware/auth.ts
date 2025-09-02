import type { Context, MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import type { BlankEnv, Next } from "hono/types";

export const auth = () => {
    return createMiddleware(async(c, next) => {
        const token = getCookie(c, "auth_token");
        const secret = process.env.JWT_SECRET;

        if(!token) {
            return c.json({ message: "Unauthorized" }, 401);
        }
        
        try {
            const payload = await verify(token, secret);
            if (!payload) {
                return c.json({ message: "Unauthorized" }, 401);
            }

            c.set("user", payload);
            return next();
        } catch (error) {
            return c.json({ message: "Unauthorized" }, 401);
        }
    });
}