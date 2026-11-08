export const INTERNAL_EMAIL_DOMAIN =
  process.env.INTERNAL_EMAIL_DOMAIN || "student.foggo.vn";

export function toInternalEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${INTERNAL_EMAIL_DOMAIN}`;
}

export function isInternalEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${INTERNAL_EMAIL_DOMAIN}`);
}

