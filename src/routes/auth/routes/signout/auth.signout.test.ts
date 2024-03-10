import { z } from "@hono/zod-openapi";
import { authSignoutRoute } from "./auth.signout";
import { AuthSignoutResponse } from "./auth.signout.schema";

const app = authSignoutRoute;
type SigninUserResponse = z.infer<typeof AuthSignoutResponse>;

describe("Test Auth/signin route", () => {
  test("POST /auth/signout", async () => {
    const res = await app.request("/", {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    expect(res.status).toBe(200);
    const response_data = (await res.json()) as SigninUserResponse;
    console.log(" ==== res.json() ==== ", response_data);
    expect(response_data.success).toBe(true);
    expect(res.headers.get("Set-Cookie")).toBe("kjz=; Max-Age=0; Path=/");

  });
});
