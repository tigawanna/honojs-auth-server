import { OpenAPIHono } from "@hono/zod-openapi";
import { authPostRefreshTokenRoute } from "./auth.refresh-token.schema";
import { createAccessToken} from "../../services/auth-tokens.service";
import { enviromentVariables } from "@/lib/env";
import { findUserByID } from "@/routes/users/service.users";
import { verify } from "hono/jwt";

//  auth/refresh-token route
const app = new OpenAPIHono();

// refresh-token user

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

export { app as authRefreshTokenRoute };
