/**
 * Resolves MySQL connection URL from env vars.
 * Server-side only — never import from client components.
 */
export function isDatabaseConfigured(): boolean {
  const direct = process.env.DATABASE_URL?.trim();
  if (direct) return true;

  const host = process.env.DB_HOST?.trim();
  const name = process.env.DB_NAME?.trim();
  const user = process.env.DB_USER?.trim();

  return Boolean(host && name && user);
}

export function resolveDatabaseUrl(): string {
  const direct = process.env.DATABASE_URL?.trim();
  if (direct) return direct;

  const host = process.env.DB_HOST?.trim();
  const name = process.env.DB_NAME?.trim();
  const user = process.env.DB_USER?.trim();
  const password = process.env.DB_PASSWORD ?? "";

  if (!host || !name || !user) {
    throw new Error(
      "Database not configured. Set DATABASE_URL or DB_HOST, DB_NAME, DB_USER, DB_PASSWORD.",
    );
  }

  const port = process.env.DB_PORT?.trim() || "3306";
  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  return `mysql://${encodedUser}:${encodedPassword}@${host}:${port}/${name}`;
}
