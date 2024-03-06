import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";

export const AuthRouteSchema = z
  .object({
    message: z.string().openapi({
      example: "hello world",
    }),
  })
  .openapi("Auth");

export const authGetIndexRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthRouteSchema,
        },
      },
      description: "Retrieve the user",
    },
  },
});
