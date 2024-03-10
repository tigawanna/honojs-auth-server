import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths"; 
import { loadEnv } from "vite";

const env = loadEnv("", process.cwd(), "");
Object.assign(process.env, env);

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["dotenv/config"],
  },
  plugins: [tsconfigPaths()],
});


