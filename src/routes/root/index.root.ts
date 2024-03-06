import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";

export const RootRouteSchema = z
  .object({
    message: z.string().openapi({
      example: "hello world",
    }),
  })
  .openapi("Root");

const ErrorSchema = z.object({
  code: z.number().openapi({
    example: 400,
  }),
  message: z.string().openapi({
    example: "Bad Request",
  }),
});

export const rootGetRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: RootRouteSchema,
        },
      },
      description: "Retrieve the root route",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Returns an error",
    },
  },
});
