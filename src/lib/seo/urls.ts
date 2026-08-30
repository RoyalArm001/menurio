import { getPlatformBaseUrl } from "@/lib/utils/public-urls";

function normalizeBaseUrl(base?: string | null): string {
  const candidate = base?.trim() || getPlatformBaseUrl();
  const withProtocol =
    candidate.startsWith("http://") || candidate.startsWith("https://")
      ? candidate
      : `https://${candidate}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported URL protocol");
    }
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    const fallback = new URL("https://menurio.store");
    return fallback.toString().replace(/\/$/, "");
  }
}

export function buildAbsolutePublicUrl(pathOrUrl: string, base?: string | null): string {
  try {
    const parsed = new URL(pathOrUrl);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // Relative paths are resolved below.
  }

  const root = normalizeBaseUrl(base);
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(path, `${root}/`).toString();
}

export function normalizeSeoLanguages(
  defaultLanguage: string,
  supportedLanguages?: string[] | null,
): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const language of [defaultLanguage, ...(supportedLanguages ?? [])]) {
    const value = language.trim();
    const key = value.toLowerCase();
    if (!value || seen.has(key)) continue;
    seen.add(key);
    normalized.push(value);
  }

  return normalized.length ? normalized : ["en"];
}

export function joinPublicPath(basePath: string, pathSuffix?: string): string {
  const base = (basePath || "/").replace(/\/+$/, "");
  const suffix = pathSuffix?.trim().replace(/^\/+/, "").replace(/\/+$/, "");

  if (!suffix) return base || "/";
  return `${base || ""}/${suffix}`;
}

export function buildLocalizedPublicPath(params: {
  publicBasePath: string;
  language: string;
  defaultLanguage: string;
  pathSuffix?: string;
}): string {
  const path = joinPublicPath(params.publicBasePath, params.pathSuffix);
  if (
    params.language.trim().toLowerCase() ===
    params.defaultLanguage.trim().toLowerCase()
  ) {
    return path;
  }

  const url = new URL(path, "https://menurio.local");
  url.searchParams.set("lang", params.language);
  return `${url.pathname}${url.search}`;
}

export function buildLocalizedPublicUrl(params: {
  publicBasePath: string;
  language: string;
  defaultLanguage: string;
  hostname?: string | null;
  pathSuffix?: string;
}): string {
  return buildAbsolutePublicUrl(
    buildLocalizedPublicPath(params),
    params.hostname
      ? params.hostname.startsWith("http")
        ? params.hostname
        : `https://${params.hostname}`
      : undefined,
  );
}

export function buildHreflangAlternates(params: {
  publicBasePath: string;
  defaultLanguage: string;
  languages: string[];
  hostname?: string | null;
  pathSuffix?: string;
}): Record<string, string> {
  const languages = normalizeSeoLanguages(params.defaultLanguage, params.languages);
  if (languages.length < 2) return {};

  const entries = Object.fromEntries(
    languages.map((language) => [
      language,
      buildLocalizedPublicUrl({
        publicBasePath: params.publicBasePath,
        language,
        defaultLanguage: params.defaultLanguage,
        hostname: params.hostname,
        pathSuffix: params.pathSuffix,
      }),
    ]),
  );

  return {
    ...entries,
    "x-default": buildLocalizedPublicUrl({
      publicBasePath: params.publicBasePath,
      language: params.defaultLanguage,
      defaultLanguage: params.defaultLanguage,
      hostname: params.hostname,
      pathSuffix: params.pathSuffix,
    }),
  };
}
