/** VAPID configuration — private key stays server-side only */

export function getVapidPublicKey(): string | null {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() || null;
}

export function getVapidPrivateKey(): string | null {
  return process.env.VAPID_PRIVATE_KEY?.trim() || null;
}

export function getVapidSubject(): string {
  return (
    process.env.VAPID_SUBJECT?.trim() ||
    "mailto:hello@menurio.store"
  );
}

export function isPushConfigured(): boolean {
  return Boolean(getVapidPublicKey() && getVapidPrivateKey());
}
