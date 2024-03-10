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

    // const response = {
    //   user: {
    //     id: expect.any(String), // Allow any string for the ID
    //     email: expect.stringMatching(/^[^@]+@[^@]+\.[^@]+$/), // Validate email format
    //     username: expect.any(String), // Allow any string for the username
    //     createdAt: expect.any(String), // Allow any string for the timestamp
    //     updatedAt: expect.any(String), // Allow any string for the timestamp
    //   },
    // };
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
    expect(response_data.accessToken).toBeDefined();
    const response_username_email = {
      email: response_data.user.email,
      username: response_data.user.username,
    };
    expect(response_username_email).toEqual({
      email: "boy1@email.com",
      username: "boy1",
    });
  });
});
