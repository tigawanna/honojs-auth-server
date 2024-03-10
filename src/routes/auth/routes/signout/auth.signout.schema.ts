import { createRoute, z } from "@hono/zod-openapi";
import { AuthErrorSchema } from "../shared/schema";

export const AuthSignoutResponse = z.object({
  success: z.boolean(),
});

// maps to auth/signin
export const authPostSignoutRoute = createRoute({
  method: "post",
  path: "/",
  // request: {
  //   cookies: z.object({
  //     kjz: z.string(),
  //   })
  // },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthSignoutResponse,
        },
      },

      description: "logs our the user",
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
