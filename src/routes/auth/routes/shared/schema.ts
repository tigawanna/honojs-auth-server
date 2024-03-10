import { selectUserSchema } from "@/routes/users/user.table";
import { z } from "@hono/zod-openapi";

export const AuthErrorSchema = z.object({
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

export const AuthResponseSchema = z
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

  export const AuthSignedinUserSchema = z
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
