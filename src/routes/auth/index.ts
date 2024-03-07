import { OpenAPIHono } from "@hono/zod-openapi";
import { authGetIndexRoute } from "./routes/index/index.auth";
import { authGetSigninRoute, authGetSignupRoute } from "./routes/signin/auth.signin";
import { createAccessToken, createRefreshToken, signinUser, signupUser } from "./auth.service";

const app = new OpenAPIHono();

app.openapi(authGetIndexRoute, (c) => {
  return c.json({
    message: "Hello Hono! auth route",
  });
});
app.openapi(authGetSigninRoute, async (c) => {
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
});
app.openapi(authGetSignupRoute, async (c) => {
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
});

export { app as authRoute };
