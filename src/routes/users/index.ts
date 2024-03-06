import { OpenAPIHono } from "@hono/zod-openapi";
import { usersGetIndexRoute } from "./routes/index/index.users";


const app = new OpenAPIHono();

app.openapi(usersGetIndexRoute, (c) => {
  return c.json({
    message: "Hello Hono! users route",
  });
});


export { app as usersRoute };
