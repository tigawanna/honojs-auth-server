import { OpenAPIHono } from "@hono/zod-openapi";
import { usersGetIndexRoute, usersGetOneIndexRoute} from "./routes/index/index.users";
import { findUserByID, getUserList } from "./service.users";

const app = new OpenAPIHono();

app.openapi(usersGetIndexRoute, async (c) => {
  try {
    const { page, perPage } = c.req.valid("query");
    const users = await getUserList(parseInt(page ?? "1"), parseInt(perPage ?? "10"));
    return c.json(users);
  } catch (error: any) {
    return c.json({
      error: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    });
  }
});
app.openapi(usersGetOneIndexRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");
    const user_response = await findUserByID(id);
    const {password,tokenVersion,...user} = user_response?.[0]
    return c.json(user);
  } catch (error: any) {
    return c.json({
      error: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    });
  }
});

export { app as usersRoute };
