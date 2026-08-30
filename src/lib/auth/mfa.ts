/** Prepared MFA architecture for PRO+ — not fully implemented */
export interface MfaSetupResult {
  secret: string;
  otpauthUrl: string;
}

export interface MfaVerificationInput {
  userId: string;
  token: string;
}

/**
 * Future: generate TOTP secret for user enrollment.
 * Store only encrypted secret in users.mfa_secret_encrypted.
 */
export function prepareMfaEnrollment(userId: string): MfaSetupResult {
  void userId;
  throw new Error("MFA enrollment not yet implemented");
}

/**
 * Future: verify TOTP during login for PRO+ accounts with mfa_enabled.
 */
export function verifyMfaToken(input: MfaVerificationInput): boolean {
  void input;
  throw new Error("MFA verification not yet implemented");
}

/**
 * Future: encrypt MFA secret with MFA_ENCRYPTION_KEY before persistence.
 */
export function encryptMfaSecret(secret: string): string {
  if (!process.env.MFA_ENCRYPTION_KEY) {
    throw new Error("MFA_ENCRYPTION_KEY not configured");
  }
  return Buffer.from(secret).toString("base64");
}
