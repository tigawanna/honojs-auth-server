import { OpenAPIHono, z } from "@hono/zod-openapi";
import { authGetIndexRoute } from "./routes/index/index.auth";
import { authGetSigninRoute, authGetSignupRoute } from "./routes/signin/auth.signin";
import { createAccessToken, createRefreshToken, signinUser, signupUser } from "./auth.service";
import { parseZodError } from "@/utils/zodErrorParser";

const app = new OpenAPIHono({
  // @ts-expect-error
  defaultHook: (result, c) => {
    if (!result.success && result.error && result.error instanceof z.ZodError) {
      return c.json(
        {
          message: "Validation error",
          code: 400,
          errors: parseZodError(result.error),
        },
        400
      );
    }
  },
});
app.openapi(authGetIndexRoute, (c) => {
  return c.json({
    message: "Hello Hono! auth route",
  });
});

// signin user
app.openapi(authGetSigninRoute, async (c) => {
  try {
    const {
      content: { emailOrUsername, password },
    } = c.req.valid("json");
    const user = await signinUser({ emailOrUsername, password });
    const user_payload = { id: user.id };
    const accessToken = await createAccessToken(c, user_payload);
    await createRefreshToken(c, user_payload);
    return c.json({
      user,
      accessToken,
    });
  } catch (error: any) {
    return c.json(
      {
        message: error.message,
        code: 400,
      },
      400
    );
  }
});

// signup user
app.openapi(authGetSignupRoute, async (c) => {
  try {
    const {
      content: { email, password, username },
    } = c.req.valid("json");
    const user = await signupUser({ email, password, username });
    const user_payload = { id: user.id };
    const accessToken = await createAccessToken(c, user_payload);
    await createRefreshToken(c, user_payload);
    return c.json({
      user,
      accessToken,
    });
  } catch (error: any) {
    return c.json(
      {
        message: error.message,
        code: 400,
      },
      400
    );
  }
});

export { app as authRoute };
