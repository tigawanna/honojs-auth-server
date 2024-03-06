import { OpenAPIHono } from "@hono/zod-openapi";
import { authGetIndexRoute } from "./routes/index/index.auth";
import { authGetSigninRoute } from "./routes/signin/auth.signin";

const app = new OpenAPIHono();

app.openapi(authGetIndexRoute, (c) => {
  return c.json({
    message: "Hello Hono! auth route",
  });
});
app.openapi(authGetSigninRoute, (c) => {
    return c.json({
        message: "Hello Hono! auth/signin auth route",
    })
})

export { app as authRoute };
