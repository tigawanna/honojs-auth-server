import { z } from "@hono/zod-openapi";
import { AuthResponseSchema } from "../shared/schema";
import { authSigninRoute } from "./auth.signin";

const app = authSigninRoute;
type SigninUserResponse = z.infer<typeof AuthResponseSchema>;

describe("Test Auth/signin route", () => {
  test("POST /auth/signin", async () => {
    const mock_user = {
      emailOrUsername: "boy1@email.com",
      password: "password",
    };
    const res = await app.request("/", {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        content: mock_user,
      }),
    });

    expect(res.status).toBe(200);
    const response_data = (await res.json()) as SigninUserResponse;
    console.log(" ==== res.json() ==== ", response_data);
    expect(mock_user.emailOrUsername).toMatchObject({
      email: expect
        .stringMatching(response_data.user.email)
        .or(expect.stringMatching(response_data.user.username)),
    });
    // expect(await res.json()).toBe("Many posts");
  });
});
