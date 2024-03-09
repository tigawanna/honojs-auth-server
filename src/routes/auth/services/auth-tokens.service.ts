import { enviromentVariables } from "@/lib/env";
import { bumpUserTokenVersion, findUserByID } from "@/routes/users/service.users";
import { Context, Env } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { BlankInput } from "hono/types";

export async function createAccessToken(c: Context<Env, "/", BlankInput>, payload: { id: string }) {
  const { ACCESS_TOKEN_SECRET } = enviromentVariables(c);
  const expriesin = Math.floor(Date.now() / 1000) + 30 * 2;
  const access_token = await sign({ ...payload, exp: expriesin }, ACCESS_TOKEN_SECRET);
  return access_token;
}

export async function createRefreshToken(
  c: Context<Env, "/", BlankInput>,
  payload: { id: string }
) {
  const { REFRESH_TOKEN_SECRET } = enviromentVariables(c);
  const {tokenVersion} =await bumpUserTokenVersion(payload.id);
  const twelveDaysInSeconds = 5 * 24 * 60 * 60;
  const expriesin = Math.floor(Date.now() / 1000) + twelveDaysInSeconds;
  const refresh_token = await sign({ ...payload,tokenVersion, exp: expriesin }, REFRESH_TOKEN_SECRET);
  setCookie(c, "kjz", refresh_token, { path: "/", httpOnly: true });
  return refresh_token;
}

export async function verifyRefreshToken(c: Context<Env, "/", BlankInput>) {
  const { REFRESH_TOKEN_SECRET } = enviromentVariables(c);
  const refresh_token = getCookie(c, "kjz");
  if (!refresh_token) {
    return c.json({
      error: "Unauthorized",
      message: "Refresh token not found",
    });
  }
  const refresh_token_payload = (await verify(refresh_token, REFRESH_TOKEN_SECRET)) as {
    id: string;
    tokenVerion: number;
  };
  const matchingUser = await findUserByID(refresh_token_payload.id);
  if (!matchingUser?.[0] || matchingUser?.[0].tokenVersion !== refresh_token_payload.tokenVerion) {
    return c.json({
      error: "Unauthorized",
      message: "Invalid refresh token",
    });
  }
  return refresh_token_payload;
}

export async function verifyAccessToken(c: Context<Env, "/", BlankInput>, accesToken: string) {
  const payload = await verify(accesToken, enviromentVariables(c).ACCESS_TOKEN_SECRET);
  return payload;
}

export async function refreshAccessToken(
  c: Context<Env, "/", BlankInput>,
  payload: { id: string }
) {
  await verifyRefreshToken(c);
  const { ACCESS_TOKEN_SECRET } = enviromentVariables(c);
  const new_access_token = await sign(payload, ACCESS_TOKEN_SECRET);
  return new_access_token;
}

export async function invalidateRefreshToken(c: Context<Env, "/", BlankInput>) {
  const refresh_token_payload = await verifyRefreshToken(c);
  if ("id" in refresh_token_payload && "tokenVerion" in refresh_token_payload) {
    await bumpUserTokenVersion(refresh_token_payload.id);
    deleteCookie(c, "kjz");
  }
}

export async function generateUserAuthTokens(
  c: Context<Env, "/", BlankInput>,
  payload: { id: string }
) {
  const accessToken = await createAccessToken(c, payload);
  const refreshToken = await createRefreshToken(c, payload);
  return { accessToken, refreshToken };
}
