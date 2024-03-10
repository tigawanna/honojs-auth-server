import { OpenAPIHono } from "@hono/zod-openapi";
import { authPostSignupRoute } from "./auth.signup.schema";
import { generateUserAuthTokens } from "../../services/auth-tokens.service";
import { signupUser } from "../../services/auth-user.service";

//  auth/signup route
const app = new OpenAPIHono();

// signup user
app.openapi(authPostSignupRoute, async (c) => {
  try {
    const {
      content: { email, password, username },
    } = c.req.valid("json");
    const user = await signupUser({ email, password, username });
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

export { app as authSignupRoute };
