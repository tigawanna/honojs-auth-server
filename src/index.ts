import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { rootGetRoute } from "./routes/root/index.root";
import { authRoute } from "./routes/auth";
import { usersRoute } from "./routes/users";

const app = new OpenAPIHono({});

// load .env variables
app.use(async (_, next) => {
  dotenv.config();
  await next();
});

app.openapi(rootGetRoute, (c) => {
  return c.json({
    message: "Welecome to honojs-auth-server",
  });
});
app.route("/auth", authRoute);
app.route("/users", usersRoute);

app.get(
  "/ui",
  swaggerUI({
    url: "/doc",
  })
);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "SIMPLE AUTH SERVER",
  },
});

const port = 5000;
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
