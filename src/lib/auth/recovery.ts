import { randomBytes, createHash, timingSafeEqual } from "crypto";

// Mã phục hồi dạng XXXX-XXXX-XXXX (không dùng chữ dễ nhầm 0/O, 1/I)
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRecoveryCode(): string {
  const bytes = randomBytes(12);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}

export function hashRecovery(code: string): string {
  return createHash("sha256")
    .update(code.replace(/-/g, "").toUpperCase())
    .digest("hex");
}

export function verifyRecovery(code: string, hash: string): boolean {
  try {
    const a = Buffer.from(hashRecovery(code), "hex");
    const b = Buffer.from(hash, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

