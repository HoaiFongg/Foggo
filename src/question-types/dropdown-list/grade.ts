import type { DropdownListAnswerKey, DropdownListUserAnswer } from "./schema";

/**
 * Hàm chấm điểm phía server cho dạng câu hỏi: Lựa chọn theo dạng danh sách (Dropdown List).
 * - So khớp giá trị người chơi chọn với đáp án chuẩn cho từng vị trí {D}.
 * - Điểm số từ 0.0 đến 1.0 (tính theo tỷ lệ số vị trí chọn chính xác).
 */
export function gradeDropdownList(
  answer: DropdownListUserAnswer,
  key: DropdownListAnswerKey
): number {
  if (!answer || !key || !key.answers || typeof key.answers !== "object") {
    return 0.0;
  }

  const slotIds = Object.keys(key.answers);
  if (slotIds.length === 0) return 0.0;

  let correctCount = 0;
  for (const id of slotIds) {
    const expected = String(key.answers[id] || "").trim().toLowerCase();
    const actual = String(answer[id] || "").trim().toLowerCase();
    if (expected !== "" && expected === actual) {
      correctCount++;
    }
  }

  return correctCount / slotIds.length;
}

