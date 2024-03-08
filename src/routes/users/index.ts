import { OpenAPIHono, z } from "@hono/zod-openapi";
import { usersGetIndexRoute, usersGetOneIndexRoute} from "./routes/index/index.users";
import { findUserByID, getUserList } from "./service.users";
import { parseZodError } from "@/utils/zodErrorParser";

const app = new OpenAPIHono({
  // @ts-expect-error
  defaultHook: (result, c) => {
    if (!result.success && result.error && result.error instanceof z.ZodError) {
      return c.json(
        {
          message: "Validation error",
          code: 400,
          errors: parseZodError(result.error),
        },
        400
      );
    }
  },
});

app.openapi(usersGetIndexRoute, async (c) => {
  try {
    const { page, perPage } = c.req.valid("query");
    const users = await getUserList(parseInt(page ?? "1"), parseInt(perPage ?? "10"));
    return c.json(users);
  } catch (error: any) {
    return c.json(
      {
        message: error.message,
        code: 400,
      },
      400
    );
  }
});
app.openapi(usersGetOneIndexRoute, async (c) => {
  try {
    const { id } = c.req.valid("param");
    const user_response = await findUserByID(id);
    const { password, tokenVersion, ...user } = user_response?.[0];
    return c.json(user);
  } catch (error: any) {
    return c.json(
      {
        message: error.message,
        code: 400,
      },
      400
    );
  }
});

export { app as usersRoute };
