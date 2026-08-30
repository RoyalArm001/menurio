import { afterEach, describe, expect, it } from "vitest";
import { isDatabaseConfigured, resolveDatabaseUrl } from "@/lib/db/url";

const ENV_KEYS = [
  "DATABASE_URL",
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_PORT",
] as const;

const originalEnv = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
);

function clearDbEnv() {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
}

afterEach(() => {
  clearDbEnv();
  for (const key of ENV_KEYS) {
    const value = originalEnv[key];
    if (value === undefined) continue;
    process.env[key] = value;
  }
});

describe("database URL helpers", () => {
  it("reports missing database config without throwing", () => {
    clearDbEnv();

    expect(isDatabaseConfigured()).toBe(false);
  });

  it("reports direct DATABASE_URL config", () => {
    clearDbEnv();
    process.env.DATABASE_URL = "mysql://user:pass@example.com:3306/menurio";

    expect(isDatabaseConfigured()).toBe(true);
    expect(resolveDatabaseUrl()).toBe(
      "mysql://user:pass@example.com:3306/menurio",
    );
  });

  it("builds a URL from split DB env vars", () => {
    clearDbEnv();
    process.env.DB_HOST = "db.example.com";
    process.env.DB_NAME = "menurio";
    process.env.DB_USER = "menu user";
    process.env.DB_PASSWORD = "p@ss word";

    expect(isDatabaseConfigured()).toBe(true);
    expect(resolveDatabaseUrl()).toBe(
      "mysql://menu%20user:p%40ss%20word@db.example.com:3306/menurio",
    );
  });
});
