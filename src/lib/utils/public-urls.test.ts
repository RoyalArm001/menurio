import { afterEach, describe, expect, it } from "vitest";
import { getPlatformBaseUrl } from "@/lib/utils/public-urls";

const ENV_KEYS = [
  "NEXT_PUBLIC_PLATFORM_URL",
  "NEXT_PUBLIC_APP_URL",
  "AUTH_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
] as const;

const originalEnv = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
);

function clearUrlEnv() {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
}

afterEach(() => {
  clearUrlEnv();
  for (const key of ENV_KEYS) {
    const value = originalEnv[key];
    if (value === undefined) continue;
    process.env[key] = value;
  }
});

describe("public URL helpers", () => {
  it("falls back to the production platform URL when env values are empty", () => {
    clearUrlEnv();
    process.env.NEXT_PUBLIC_PLATFORM_URL = "";
    process.env.NEXT_PUBLIC_APP_URL = " ";
    process.env.AUTH_URL = "";

    expect(getPlatformBaseUrl()).toBe("https://menurio.store");
  });

  it("normalizes Vercel hostnames without a protocol", () => {
    clearUrlEnv();
    process.env.VERCEL_URL = "menurio-preview.vercel.app";

    expect(getPlatformBaseUrl()).toBe("https://menurio-preview.vercel.app");
  });

  it("prefers explicit public platform URLs and removes trailing slashes", () => {
    clearUrlEnv();
    process.env.NEXT_PUBLIC_PLATFORM_URL = "https://example.com/";
    process.env.VERCEL_URL = "menurio-preview.vercel.app";

    expect(getPlatformBaseUrl()).toBe("https://example.com");
  });
});
