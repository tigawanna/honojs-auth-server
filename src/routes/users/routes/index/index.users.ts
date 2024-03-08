import { createRoute, z } from "@hono/zod-openapi";
import { selectUserSchema } from "../../user.table";

export const UsersErrorSchema = z.object({
  code: z.number().openapi({
    example: 400,
  }),
  message: z.string().openapi({
    example: "Bad Request",
  }),
  errors: z
    .object({
      field: z.string(),
      message: z.string(),
    })
    .optional(),
});

const GetUsersRouteSchema = z.object({
  page: z.number().openapi({
    example: 1,
    description: "the page number",
  }),
  perPage: z.number().openapi({
    example: 10,
    description: "the number of users per page",
  }),
  totalPages: z.number().openapi({
    example: 1,
    description: "the total number of pages",
  }),
  totalItems: z.number().openapi({
    example: 1,
    description: "the total number of items",
  }),
  items: z.array(selectUserSchema).openapi("all users"),
});

const GetUsersRouteQueryParamsSchema = z.object({
  page: z.string().default("1").optional().openapi({
    example: "1",
    description: "the page string oy want default is 1",
  }),
  perPage: z.string().max(40).default("10").optional().openapi({
    example: "10",
    description: "the number of users per page default is 10 maximum is 40",
  }),
});

export const usersGetIndexRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: GetUsersRouteQueryParamsSchema,
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
    400: {
      content: {
        "application/json": {
          schema: UsersErrorSchema,
        },
      },
      description: "Bad request",
    },
  },
});

const GetOneUsersRouteSchema = selectUserSchema.openapi("one user");

export const usersGetOneIndexRoute = createRoute({
  method: "get",
  path: ":id",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetOneUsersRouteSchema,
        },
      },
      description: "Retrieve one user",
    },
    400: {
      content: {
        "application/json": {
          schema: UsersErrorSchema,
        },
      },
      description: "Bad request",
    },
  },
});
