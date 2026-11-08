import type { DragFillAnswerKey, DragFillUserAnswer } from "./schema";

/**
 * Hàm chấm điểm Điền từ vào chỗ trống:
 * Tính số lượng chỗ trống điền đúng trên tổng số chỗ trống quy định trong AnswerKey.
 * Trả về 0.0 .. 1.0.
 */
export function gradeDragFill(
  answer: DragFillUserAnswer,
  key: DragFillAnswerKey
): number {
  if (!answer || typeof answer !== "object" || !key?.blanks) {
    return 0.0;
  }

  const expectedEntries = Object.entries(key.blanks);
  if (expectedEntries.length === 0) return 0.0;

  let correctCount = 0;
  for (const [blankId, expectedOptId] of expectedEntries) {
    if (answer[blankId] === expectedOptId) {
      correctCount++;
    }
  }

  return Number((correctCount / expectedEntries.length).toFixed(2));
}

