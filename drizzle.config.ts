import type { Config } from "drizzle-kit";

export default {
  schema: "./src/routes/**/*.table.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "sqlite.db", // 👈 this could also be a path to the local sqlite file
  },
} satisfies Config;
