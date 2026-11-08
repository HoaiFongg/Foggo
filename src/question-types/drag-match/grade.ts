import type { DragMatchAnswerKey, DragMatchUserAnswer } from "./schema";

/**
 * Hàm chấm điểm Ghép cặp:
 * Tính tỷ lệ cặp ghép đúng trên tổng số cặp.
 * Trả về giá trị 0.0 .. 1.0 (chuẩn hóa làm tròn 2 chữ số thập phân).
 */
export function gradeDragMatch(
  answer: DragMatchUserAnswer,
  key: DragMatchAnswerKey
): number {
  if (!answer || typeof answer !== "object" || !key?.matches) {
    return 0.0;
  }

  const expectedEntries = Object.entries(key.matches);
  if (expectedEntries.length === 0) return 0.0;

  let correctCount = 0;
  for (const [leftId, expectedRightId] of expectedEntries) {
    if (answer[leftId] === expectedRightId) {
      correctCount++;
    }
  }

  return Number((correctCount / expectedEntries.length).toFixed(2));
}
