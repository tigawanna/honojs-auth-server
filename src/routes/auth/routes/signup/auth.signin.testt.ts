import { z } from "@hono/zod-openapi";
import { AuthResponseSchema } from "../shared/schema";
import { authSignupRoute } from "./auth.signup";

const app = authSignupRoute;
type SigninUserResponse = z.infer<typeof AuthResponseSchema>;

describe("Test Auth/signup route", () => {
  test("POST /auth/signup", async () => {
    const mock_user = {
      email: "boy1@email.com",
      username: "boy1@email.com",
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
    expect(mock_user.email).toBe(response_data.user.email);
    expect(mock_user.username).toBe(response_data.user.username);
    expect(response_data.accessToken).toBeDefined();

    // expect(await res.json()).toBe("Many posts");
  });
});
