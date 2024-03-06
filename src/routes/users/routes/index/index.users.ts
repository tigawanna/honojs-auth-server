import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";

const RouteSchema = z
  .object({
    message: z.string().openapi({
      example: "hello world",
    }),
  })
  .openapi("Auth");

export const usersGetIndexRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: RouteSchema,
        },
      },
      description: "Retrieve the user",
    },
  },
});
