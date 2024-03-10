import { OpenAPIHono } from "@hono/zod-openapi";
import { authPostCurrentUserRoute } from "./auth.current-user.schema";
import { enviromentVariables } from "@/lib/env";
import { findUserByID } from "@/routes/users/service.users";
import { verify } from "hono/jwt";
import { verifyAccessToken, createAccessToken } from "../../services/auth-tokens.service";


//  auth/signin route
const app = new OpenAPIHono();
// signin user
// get current user based on access token
app.openapi(authPostCurrentUserRoute, async (c) => {
  try {
    const {
      content: { accessToken },
    } = c.req.valid("json");
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
        // console.log(" ============ kjz ============== ", kjz);
        const payload = await verify(kjz, enviromentVariables(c).REFRESH_TOKEN_SECRET);
        const accessToken = await createAccessToken(c, payload);
        // console.log("===== new access token ==== ", accessToken);
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


export { app as authCurrentUserRoute };
