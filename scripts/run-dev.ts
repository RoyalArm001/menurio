/**
 * Start Next.js dev with .env.local overriding shell env (fixes Windows DATABASE_URL conflicts).
 */
import { spawn } from "node:child_process";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: true });

const child = spawn("next", ["dev"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
