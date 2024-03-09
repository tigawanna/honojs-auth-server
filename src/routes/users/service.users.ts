import { db } from "@/db/client";
import { users_table } from "./user.table";
import { count, eq, or } from "drizzle-orm";

export async function getUserList(page: number, perPage: number) {
  try {
    const offset = (page - 1) * perPage;
    const total_users = await db.select({ value: count() }).from(users_table);
    const totalItems = total_users[0].value;
    const users = await db
      .select({
        id: users_table.id,
        username: users_table.username,
        email: users_table.email,
        createdAt: users_table.createdAt,
        updatedAt: users_table.updatedAt,
      })
      .from(users_table)
      .limit(perPage) // Fetch only the specified number of users
      .offset(offset); // Skip the initial rows based on offset

    return {
      items: users,
      page,
      perPage,
      totalPages: Math.ceil(total_users[0].value / perPage),
      totalItems,
    };
  } catch (error) {
    // Handle errors appropriately
    throw error;
  }
}

export async function findUserByID(id: string) {
  try {
    const user = await db.select().from(users_table).where(eq(users_table.id, id));
    return user;
  } catch (error) {
    throw error;
  }
}

export async function findUserByEmailOrUsername(emailOrUsername: string) {
  try {
    const user = await db
      .select()
      .from(users_table)
      .where(or(eq(users_table.email, emailOrUsername), eq(users_table.username, emailOrUsername)));
    return user;
  } catch (error) {
    throw error;
  }
}

export async function createUser(user: (typeof users_table)["$inferInsert"]) {
  try {
    const createdUser = await db
      .insert(users_table)
      .values({
        id: crypto.randomUUID(),
        email: user.email,
        password: user.password,
        username: user.username,
      })
      .returning({
        id: users_table.id,
        email: users_table.email,
        username: users_table.username,
        createdAt: users_table.createdAt,
        updatedAt: users_table.updatedAt,
      });
    return createdUser[0];
  } catch (error) {
    throw error;
  }
}

export async function bumpUserTokenVersion(id: string) {
  try {
    const user = await db.select().from(users_table).where(eq(users_table.id, id));
    const user_token_version = user[0].tokenVersion ?? 0;
    //  increment the user_table.token version +1
    const updatedUser = await db.update(users_table).set({ tokenVersion: user_token_version + 1 })
    .returning({
      id: users_table.id,
      tokenVersion: users_table.tokenVersion
    })
    return updatedUser?.[0];
  } catch (error) {
    throw error;
  }
}
