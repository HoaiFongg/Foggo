import type { DragOrderAnswerKey, DragOrderUserAnswer } from "./schema";

/**
 * Hàm chấm điểm sắp xếp thứ tự (Drag Order):
 * - exact: đúng toàn bộ thứ tự mới được 1.0, ngược lại 0.0
 * - partial: số phần tử nằm đúng vị trí / tổng số phần tử
 */
export function gradeDragOrder(
  answer: DragOrderUserAnswer,
  key: DragOrderAnswerKey
): number {
  if (!Array.isArray(answer) || !Array.isArray(key?.correct_order)) {
    return 0.0;
  }

  const correctOrder = key.correct_order;
  if (answer.length !== correctOrder.length || correctOrder.length === 0) {
    return 0.0;
  }

  let matches = 0;
  for (let i = 0; i < correctOrder.length; i++) {
    if (answer[i] === correctOrder[i]) {
      matches++;
    }
  }

  const scoring = key.scoring || "exact";

  if (scoring === "exact") {
    return matches === correctOrder.length ? 1.0 : 0.0;
  }

  return Math.round((matches / correctOrder.length) * 1000) / 1000;
}

