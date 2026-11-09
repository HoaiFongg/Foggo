import type { TrueFalseAnswerKey, TrueFalseUserAnswer } from "./schema";

/**
 * Hàm chấm điểm phía server cho dạng câu hỏi Đúng / Sai.
 * - Một câu hỏi có thể chứa một hoặc nhiều nhận định bên trong.
 * - Với mỗi nhận định, người chơi chỉ chọn ĐÚNG (true) hoặc SAI (false).
 * - Điểm số trả về từ 0.0 đến 1.0 (tính theo tỷ lệ số nhận định trả lời chính xác).
 */
export function gradeTrueFalse(
  answer: any,
  key: any
): number {
  if (answer === undefined || answer === null || key === undefined || key === null) {
    return 0.0;
  }

  // Trường hợp 1: Có danh sách đáp án nhiều nhận định (answers: Record<string, boolean>)
  if (key.answers && typeof key.answers === "object") {
    const ids = Object.keys(key.answers);
    if (ids.length === 0) return 0.0;

    const userAnsMap = (typeof answer === "object" && answer !== null) ? answer : {};
    let correctCount = 0;

    for (const id of ids) {
      const expectedBool = key.answers[id];
      if (typeof expectedBool === "boolean" && userAnsMap[id] === expectedBool) {
        correctCount++;
      }
    }

    return correctCount / ids.length;
  }

  // Trường hợp 2: Dữ liệu đơn lẻ cũ (key.correct: boolean)
  if (typeof key.correct === "boolean") {
    if (typeof answer === "boolean") {
      return answer === key.correct ? 1.0 : 0.0;
    }
    if (typeof answer === "object" && answer !== null) {
      const firstVal = Object.values(answer)[0];
      return firstVal === key.correct ? 1.0 : 0.0;
    }
  }

  return 0.0;
}
