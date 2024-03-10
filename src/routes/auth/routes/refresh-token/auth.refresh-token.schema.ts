import { createRoute, z } from "@hono/zod-openapi";
import { AuthErrorSchema, AuthSignedinUserSchema } from "../shared/schema";

export const authPostRefreshTokenRoute = createRoute({
  method: "post",
  path: "/refresh-token",
  request: {
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

      description: "refreshes the access token for the authenticated",
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
