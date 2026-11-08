import { randomBytes } from "crypto";

/**
 * Sinh join_token ngẫu nhiên ~22 ký tự (128-bit entropy).
 * Không thể đoán, thay thế hoàn toàn mã PIN 6 số dễ lộ/dò quét.
 */
export function generateJoinToken(): string {
  return randomBytes(16).toString("base64url");
}

