import type { TrueFalseAnswerKey, TrueFalseUserAnswer } from "./schema";

/**
 * Hàm chấm điểm phía server cho dạng Đúng / Sai.
 * Trả về 1.0 nếu khớp hoàn toàn, 0.0 nếu sai.
 */
export function gradeTrueFalse(
  answer: TrueFalseUserAnswer,
  key: TrueFalseAnswerKey
): number {
  if (typeof answer !== "boolean" || typeof key?.correct !== "boolean") {
    return 0.0;
  }
  return answer === key.correct ? 1.0 : 0.0;
}

