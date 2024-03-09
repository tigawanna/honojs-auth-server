import { OpenAPIHono, z } from "@hono/zod-openapi";
import { authGetIndexRoute } from "./routes/index/index.auth";
import {
  authPostCurrentUserRoute,
  authPostRefreshTokenRoute,
  authPostSigninRoute,
  authPostSignupRoute,
} from "./routes/signin/auth.signin";
import {
  createAccessToken,
  createRefreshToken,
  signinUser,
  signupUser,
  verifyAccessToken,
} from "./auth.service";
import { parseZodError } from "@/utils/zodErrorParser";
import { findUserByID } from "../users/service.users";
import { json } from "stream/consumers";
import { verify } from "hono/jwt";
import { enviromentVariables } from "@/lib/env";

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
app.openapi(authPostSigninRoute, async (c) => {
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
app.openapi(authPostSignupRoute, async (c) => {
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

// get current user based on access token
app.openapi(authPostCurrentUserRoute, async (c) => {
  try {
    const {content: { accessToken }} = c.req.valid("json");
  try {
      const payload = await verifyAccessToken(c, accessToken);
      const foundUser = await findUserByID(payload.id);
      const { password, tokenVersion, ...user } = foundUser?.[0];
      return c.json({
        user,
        accessToken,
      });
    } catch (error: any) {
      if (error.message.includes("signature mismatched")) {
        const { kjz } = c.req.valid("cookie");
        if (!kjz) {
          throw new Error("fresh login required");
        }
        const payload = await verify(kjz, enviromentVariables(c).REFRESH_TOKEN_SECRET);
        const accessToken = await createAccessToken(c, payload);
        console.log("===== new access token ==== ", accessToken);
        const foundUser = await findUserByID(payload.id);
        const { password, tokenVersion, ...user } = foundUser?.[0];
        return c.json({
          user,
          accessToken,
        });
      }
      throw error;
    }
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
app.openapi(authPostRefreshTokenRoute, async (c) => {
  try {
    const { kjz } = c.req.valid("cookie");
    if (!kjz) {
      throw new Error("fresh login required");
    }
    const payload = await verify(kjz, enviromentVariables(c).REFRESH_TOKEN_SECRET);
    const accessToken = await createAccessToken(c, payload);
    const foundUser = await findUserByID(payload.id);
    const { password, tokenVersion, ...user } = foundUser?.[0];
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
