import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { OpenAPIHono } from "@hono/zod-openapi";
import { rootRoute } from "./routes/root/index.root";
import { swaggerUI } from "@hono/swagger-ui";

const app = new OpenAPIHono();



// load .env variables
app.use(async (_, next) => {
  dotenv.config();
  await next();
});

app.openapi(rootRoute, (c) => {
return c.json({
    message: "Hello Hono! index route"
  });
});

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
