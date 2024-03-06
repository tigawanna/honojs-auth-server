import { createRoute } from "@hono/zod-openapi";
import { RootRouteSchema } from "./routeSchema";

export const rootRoute = createRoute({
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
  },
});
