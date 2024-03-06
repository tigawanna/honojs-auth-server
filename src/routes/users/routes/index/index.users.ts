import { createRoute, z } from "@hono/zod-openapi";
import { selectUserSchema } from "../../db-schema";

const GetUsersRouteSchema = z.array(selectUserSchema).openapi("all users");
const GetUsersRouteQueryParamsSchema = z.object({
  page: z.string().optional().openapi({
    example: "1",
    description: "the page number oy want default is 1",
  }),
  page_size: z.string()
  .max(20)
  .optional().openapi({
    example: "10",
    description: "the number of users per page default is 10 maximum is 20",
  }),
});
export const usersGetIndexRoute = createRoute({
  method: "get",
  path: "/",
  request:{
    query: GetUsersRouteQueryParamsSchema
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetUsersRouteSchema,
        },
      },
      description: "Retrieve the users",
    },
  },
});

const GetOneUsersRouteSchema = selectUserSchema.openapi("one user");

export const oneUsersGetIndexRoute = createRoute({
  method: "get",
  path: ":id",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetOneUsersRouteSchema,
        },
      },
      description: "Retrieve one user",
    },
  },
});
