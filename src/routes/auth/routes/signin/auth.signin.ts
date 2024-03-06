import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";

export const AuthSigninRouteSchema = z
  .object({
    message: z.string().openapi({
      example: "signin route",
    }),
  })
  .openapi("Signin");

export const  authGetSigninRoute = createRoute({
  method: "post",
  path: "/signin",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthSigninRouteSchema,
        },
      },
      description: "Authenticates the user",
    },
  },
});
