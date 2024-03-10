import { authSigninRoute } from "./auth.signin";

const app = authSigninRoute;

describe("Example", () => {
  test("POST /auth/signin", async () => {
    const res = await app.request("/", {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        content: {
          emailOrUsername: "boy1@email.com",
          password: "password",
        },
      }),
    });

    console.log("=== res statsus tet ===", res.status);
    // console.log("=== res ===", res);
    // expect(res.status).toBe(200);
    const response_data = await res.json();
    console.log(" ==== res.json() ==== ",response_data);
    // expect(await res.json()).toBe("Many posts");
  });
});
