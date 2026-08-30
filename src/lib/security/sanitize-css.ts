const MAX_CUSTOM_CSS_CHARS = 8_000;

const FORBIDDEN_PATTERNS: RegExp[] = [
  /<\/?script/i,
  /javascript\s*:/i,
  /expression\s*\(/i,
  /@import/i,
  /behavior\s*:/i,
  /-moz-binding/i,
  /url\s*\(\s*['"]?\s*javascript/i,
  /url\s*\(\s*['"]?\s*data:/i,
  /<\/?iframe/i,
  /<\/?object/i,
  /<\/?embed/i,
  /<\/?link/i,
  /<\/?style/i,
  /<\/?meta/i,
  /<\/?img/i,
  /<\/?svg/i,
  /on\w+\s*=/i,
  /<\s*[a-z]/i,
];

export class UnsafeCssError extends Error {
  constructor(message = "Custom CSS contains disallowed constructs") {
    super(message);
    this.name = "UnsafeCssError";
  }
}

/** Strip comments and reject script/HTML/import injection. Returns sanitized CSS or throws. */
export function sanitizeCustomCss(input: string | null | undefined): string | null {
  if (input == null) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_CUSTOM_CSS_CHARS) {
    throw new UnsafeCssError("Custom CSS exceeds the maximum length");
  }

  const withoutComments = trimmed.replace(/\/\*[\s\S]*?\*\//g, "");

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(withoutComments)) {
      throw new UnsafeCssError();
    }
  }

  return withoutComments.trim() || null;
}
