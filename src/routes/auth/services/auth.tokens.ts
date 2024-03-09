import { enviromentVariables } from "@/lib/env";
import { Context, Env } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { BlankInput } from "hono/types";

export async function createAccessToken(c: Context<Env, "/", BlankInput>, payload: { id: string }) {
  const { ACCESS_TOKEN_SECRET } = enviromentVariables(c);
  const access_token = await sign(payload, ACCESS_TOKEN_SECRET);
  return access_token;
}

export async function readRefreshToken(c: Context<Env, "/", BlankInput>) {
  const { REFRESH_TOKEN_SECRET } = enviromentVariables(c);
  const refresh_token = getCookie(c, "kjz");
  if (!refresh_token) {
    return c.json({
      error: "Unauthorized",
      message: "Refresh token not found",
    });
  }
  const refresh_token_payload = await verify(refresh_token, REFRESH_TOKEN_SECRET);
  return refresh_token_payload;
}

export async function createRefreshToken(
  c: Context<Env, "/", BlankInput>,
  payload: { id: string }
) {
  const { REFRESH_TOKEN_SECRET } = enviromentVariables(c);
  const refresh_token = await sign(payload, REFRESH_TOKEN_SECRET);
  setCookie(c, "kjz", refresh_token, { path: "/", httpOnly: true });
  return refresh_token;
}

export async function refreshAccessToken(
  c: Context<Env, "/", BlankInput>,
  payload: { id: string }
) {
  await readRefreshToken(c);
  const { ACCESS_TOKEN_SECRET } = enviromentVariables(c);
  const new_access_token = await sign(payload, ACCESS_TOKEN_SECRET);
  return new_access_token;
}

export async function deleteRefreshToken(c: Context<Env, "/", BlankInput>) {
  deleteCookie(c, "kjz");
}

export async function verifyAccessToken(c: Context<Env, "/", BlankInput>, accesToken: string) {
  const payload = await verify(accesToken, enviromentVariables(c).ACCESS_TOKEN_SECRET);
  return payload;
}
