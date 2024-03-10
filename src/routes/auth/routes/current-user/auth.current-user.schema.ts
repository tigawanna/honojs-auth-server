import { createRoute, z } from "@hono/zod-openapi";
import { AuthErrorSchema, AuthSignedinUserSchema } from "../shared/schema";


// maps to auth/current-user
export const authPostCurrentUserRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            content: z.object({
              accessToken: z.string(),
            }),
          }),
        },
      },
    },
    cookies: z.object({
      kjz: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthSignedinUserSchema,
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

      description: "returns the authenticated user ",
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
