import { OpenAPIHono } from "@hono/zod-openapi";
import { generateUserAuthTokens } from "../../services/auth-tokens.service";
import { signinUser } from "../../services/auth-user.service";
import { authPostSigninRoute } from "./auth.signin.schema";

//  auth/signin route
const app = new OpenAPIHono();
// signin user
app.openapi(authPostSigninRoute, async (c) => {
  try {
    const {
      content: { emailOrUsername, password },
    } = c.req.valid("json");
    const user = await signinUser({ emailOrUsername, password });
    const user_payload = { id: user.id };
    const { accessToken } = await generateUserAuthTokens(c, user_payload);
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

export { app as authSigninRoute };
