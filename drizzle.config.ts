import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { resolveDatabaseUrl } from "./src/lib/db/url";

// Drizzle runs outside Next.js, so load the local development environment explicitly.
dotenv.config({ path: ".env.local", quiet: true });

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: resolveDatabaseUrl(),
  },
});
