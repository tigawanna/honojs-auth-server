import { z } from "@hono/zod-openapi";

export const RootRouteSchema = z
  .object({
    message: z.string().openapi({
      example: "hello world",
    }),
  })
  .openapi("Root");
