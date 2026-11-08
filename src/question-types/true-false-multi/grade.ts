import type { TrueFalseMultiAnswerKey, TrueFalseMultiUserAnswer } from "./schema";

/**
 * Hàm chấm điểm Nhiều mệnh đề Đúng / Sai:
 * Tính tỷ lệ số mệnh đề trả lời chính xác trên tổng số mệnh đề.
 * Trả về 0.0 .. 1.0.
 */
export function gradeTrueFalseMulti(
  answer: TrueFalseMultiUserAnswer,
  key: TrueFalseMultiAnswerKey
): number {
  if (!answer || typeof answer !== "object" || !key?.answers) {
    return 0.0;
  }

  const expectedEntries = Object.entries(key.answers);
  if (expectedEntries.length === 0) return 0.0;

  let correctCount = 0;
  for (const [stmtId, expectedVal] of expectedEntries) {
    if (answer[stmtId] === expectedVal) {
      correctCount++;
    }
  }

  return Number((correctCount / expectedEntries.length).toFixed(2));
}

