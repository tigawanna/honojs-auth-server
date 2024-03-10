import { OpenAPIHono, z } from "@hono/zod-openapi";
import { authSigninRoute } from "./routes/signin/auth.signin";
import { authSignupRoute } from "./routes/signup/auth.signup";
import { authCurrentUserRoute } from "./routes/current-user/auth.current-user";
import { authRefreshTokenRoute } from "./routes/refresh-token/auth.refresh-token";

const app = new OpenAPIHono();

// signup user
app.route("/signup", authSignupRoute);

// signin user
app.route("/signin", authSigninRoute);

// get current user based on access token
app.route("/current-user", authCurrentUserRoute);

// refresh access token if refresh token exists
app.route("/refresh-token", authRefreshTokenRoute);

export { app as authRoute };
