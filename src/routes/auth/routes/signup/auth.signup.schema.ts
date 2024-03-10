import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { AuthErrorSchema, AuthResponseSchema } from "../shared/schema";

export const AuthSignupRequestBodySchema = z.object({
  content: z.object({
    email: z.string().email(),
    username: z.string().min(1),
    password: z.string().min(1),
  }),
});

// auth/signup route
export const authPostSignupRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: AuthSignupRequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthResponseSchema,
        },
      },
      headers: {
        "Set-Cookie": {
          schema: {
            type: "string",
            nullable: true,
          },
          description: "set a refresh token cookie with the key , kjz",
        },
      },

      description: "Authenticates the user",
    },
    400: {
      content: {
        "application/json": {
          schema: AuthErrorSchema,
        },
      },
      description: "Bad request",
    },
  },
});
