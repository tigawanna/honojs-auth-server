import { selectUserSchema } from "@/routes/users/user.table";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";

export const AuthSigninRequestBodySchema = z.object({
  content: z.object({
    emailOrUsername: z.string().min(1),
    password: z.string().min(1),
  }),
});
export const AuthSignupRequestBodySchema = z.object({
  content: z.object({
    email: z.string().email(),
    username: z.string().min(1),
    password: z.string().min(1),
  }),
});

export const AuthSigninRouteSchema = z
  .object({
    accessToken: z.string().openapi({
      example: "gdhtehshssgetfakkkmd",
      description: "access token , to be used on subsequent requests",
    }),
    user: selectUserSchema,
  })
  .openapi({
    description:
      "Signin Route , returns user and access token and sets a refresh token cookie with the key , kjz",
  });

export const authGetSigninRoute = createRoute({
  method: "post",
  path: "/signin",
  request: {
    body: {
      content: {
        "application/json": {
          schema: AuthSigninRequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthSigninRouteSchema,
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

      description: "Authenticates the user",
    },
  },
});
export const authGetSignupRoute = createRoute({
  method: "post",
  path: "/signup",
  request: {
    body: {
      content: {
        "application/json": {
          schema: AuthSignupRequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthSigninRouteSchema,
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

      description: "Authenticates the user",
    },
  },
});
