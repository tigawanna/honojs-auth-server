import { Context } from "hono";
import { env } from "hono/adapter";
import { BlankInput, Env } from "hono/types";
import { z } from "zod";

export function enviromentVariables(c: Context<Env, "/", BlankInput>) {
  const envSchema = z.object({
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
  });
  return envSchema.parse(env(c));
}
