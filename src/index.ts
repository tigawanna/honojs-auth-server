import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";

const app = new Hono();

// load .env variables
app.use(async (_, next) => {
  dotenv.config();
  await next();
});

app.get("/", (c) => {
  return c.text("Hello Hono! index route");
});

const port = 5000;
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
