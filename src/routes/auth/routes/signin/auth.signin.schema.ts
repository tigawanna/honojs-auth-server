import { createRoute, z } from "@hono/zod-openapi";
import { AuthErrorSchema, AuthResponseSchema } from "../shared/schema";


export const AuthSigninRequestBodySchema = z.object({
  content: z.object({
    emailOrUsername: z.string().min(1),
    password: z.string().min(1),
  }),
});

// maps to auth/signin 
export const authPostSigninRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: AuthSigninRequestBodySchema,
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
