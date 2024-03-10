import { OpenAPIHono } from "@hono/zod-openapi";
import { authPostSignoutRoute } from "./auth.signout.schema";
import { deleteCookie } from "hono/cookie";

//  auth/signout route
const app = new OpenAPIHono();
// signin user
app.openapi(authPostSignoutRoute, async (c) => {
  try {
    deleteCookie(c, "kjz");
    return c.json({
      success: true,
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

export { app as authSignoutRoute };
