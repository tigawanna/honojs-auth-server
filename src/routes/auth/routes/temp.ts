// import { selectUserSchema } from "@/routes/users/user.table";
// import { createRoute } from "@hono/zod-openapi";
// import { z } from "@hono/zod-openapi";

// export const AuthErrorSchema = z.object({
//   code: z.number().openapi({
//     example: 400,
//   }),
//   message: z.string().openapi({
//     example: "Bad Request",
//   }),
//   errors: z
//     .object({
//       field: z.string(),
//       message: z.string(),
//     })
//     .optional(),
// });

// export const AuthSigninRequestBodySchema = z.object({
//   content: z.object({
//     emailOrUsername: z.string().min(1),
//     password: z.string().min(1),
//   }),
// });
// export const AuthSignupRequestBodySchema = z.object({
//   content: z.object({
//     email: z.string().email(),
//     username: z.string().min(1),
//     password: z.string().min(1),
//   }),
// });

// export const AuthSignedinUserSchema = z
//   .object({
//     accessToken: z.string().openapi({
//       example: "gdhtehshssgetfakkkmd",
//       description: "access token , to be used on subsequent requests",
//     }),
//     user: selectUserSchema,
//   })
//   .openapi({
//     description:
//       "Signin Route , returns user and access token and sets a refresh token cookie with the key , kjz",
//   });

// export const AuthSigninRouteSchema = z
//   .object({
//     accessToken: z.string().openapi({
//       example: "gdhtehshssgetfakkkmd",
//       description: "access token , to be used on subsequent requests",
//     }),
//     user: selectUserSchema,
//   })
//   .openapi({
//     description:
//       "Signin Route , returns user and access token and sets a refresh token cookie with the key , kjz",
//   });

// export const authPostSigninRoute = createRoute({
//   method: "post",
//   path: "/signin",
//   request: {
//     body: {
//       content: {
//         "application/json": {
//           schema: AuthSigninRequestBodySchema,
//         },
//       },
//     },
//   },
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: AuthSigninRouteSchema,
//         },
//       },
//       headers: {
//         "Set-Cookie": {
//           schema: {
//             type: "string",
//             nullable: true,
//           },
//           description: "set a refresh token cookie with the key , kjz",
//         },
//       },

//       description: "Authenticates the user",
//     },
//     400: {
//       content: {
//         "application/json": {
//           schema: AuthErrorSchema,
//         },
//       },
//       description: "Bad request",
//     },
//   },
// });
// export const authPostSignupRoute = createRoute({
//   method: "post",
//   path: "/signup",
//   request: {
//     body: {
//       content: {
//         "application/json": {
//           schema: AuthSignupRequestBodySchema,
//         },
//       },
//     },
//   },
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: AuthSigninRouteSchema,
//         },
//       },
//       headers: {
//         "Set-Cookie": {
//           schema: {
//             type: "string",
//             nullable: true,
//           },
//           description: "set a refresh token cookie with the key , kjz",
//         },
//       },

//       description: "Authenticates the user",
//     },
//     400: {
//       content: {
//         "application/json": {
//           schema: AuthErrorSchema,
//         },
//       },
//       description: "Bad request",
//     },
//   },
// });

// export const authPostCurrentUserRoute = createRoute({
//   method: "post",
//   path: "/current-user",
//   request: {
//     body: {
//       content: {
//         "application/json": {
//           schema: z.object({
//             content: z.object({
//               accessToken: z.string(),
//             }),
//           }),
//         },
//       },
//     },
//     cookies: z.object({
//       kjz: z.string(),
//     }),
//   },
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: AuthSignedinUserSchema,
//         },
//       },

//       headers: {
//         "Set-Cookie": {
//           schema: {
//             type: "string",
//             nullable: true,
//           },
//           description: "set a refresh token cookie with the key , kjz",
//         },
//       },

//       description: "returns the authenticated user ",
//     },
//     400: {
//       content: {
//         "application/json": {
//           schema: AuthErrorSchema,
//         },
//       },
//       description: "Bad request",
//     },
//   },
// });

// export const authPostRefreshTokenRoute = createRoute({
//   method: "post",
//   path: "/refresh-token",
//   request: {
//     cookies: z.object({
//       kjz: z.string(),
//     }),
//   },
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: AuthSignedinUserSchema,
//         },
//       },
//       headers: {
//         "Set-Cookie": {
//           schema: {
//             type: "string",
//             nullable: true,
//           },
//           description: "set a refresh token cookie with the key , kjz",
//         },
//       },

//       description: "refreshes the access token for the authenticated",
//     },
//     400: {
//       content: {
//         "application/json": {
//           schema: AuthErrorSchema,
//         },
//       },
//       description: "Bad request",
//     },
//   },
// });
