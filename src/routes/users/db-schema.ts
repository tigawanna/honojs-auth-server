import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users_table = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull().unique(),
  username: text("username").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Schema for inserting a user - can be used to validate API requests
const insertUserSchema = createInsertSchema(users_table, {
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Schema for selecting a user - can be used to validate API responses
const selectUserSchema = createSelectSchema(users_table, {}).omit({ password: true });

export { insertUserSchema, selectUserSchema };
