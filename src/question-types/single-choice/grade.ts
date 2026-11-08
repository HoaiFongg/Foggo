import type { SingleChoiceAnswerKey, SingleChoiceUserAnswer } from "./schema";

/**
 * Hàm chấm điểm phía server cho dạng trắc nghiệm 1 đáp án.
 * Trả về 1.0 nếu đúng hoàn toàn, 0.0 nếu sai.
 */
export function gradeSingleChoice(
  answer: SingleChoiceUserAnswer,
  key: SingleChoiceAnswerKey
): number {
  if (!answer || !key?.correct) return 0.0;
  return String(answer).trim() === String(key.correct).trim() ? 1.0 : 0.0;
}

