import type { MultiSelectAnswerKey, MultiSelectUserAnswer } from "./schema";

/**
 * Chấm điểm cho dạng Chọn nhiều đáp án (Multi Select):
 * - all_or_nothing: đúng toàn bộ và không chọn thừa mới được 1.0, ngược lại 0.0
 * - partial: (đúng - sai) / tổng_đúng (tối thiểu 0.0)
 * - per_option: tỷ lệ lựa chọn chính xác theo từng option
 */
export function gradeMultiSelect(
  answer: MultiSelectUserAnswer,
  key: MultiSelectAnswerKey,
  totalOptionsCount: number = 4
): number {
  if (!Array.isArray(answer) || !Array.isArray(key?.correct) || key.correct.length === 0) {
    return 0.0;
  }

  const selectedSet = new Set(answer);
  const correctSet = new Set(key.correct);

  let correctCount = 0;
  let wrongCount = 0;

  for (const item of selectedSet) {
    if (correctSet.has(item)) {
      correctCount++;
    } else {
      wrongCount++;
    }
  }

  const scoring = key.scoring || "partial";

  if (scoring === "all_or_nothing") {
    return correctCount === correctSet.size && wrongCount === 0 ? 1.0 : 0.0;
  }

  if (scoring === "partial") {
    const score = (correctCount - wrongCount) / correctSet.size;
    return Math.max(0.0, Math.min(1.0, Math.round(score * 1000) / 1000));
  }

  if (scoring === "per_option") {
    // Mỗi lựa chọn được tính 1 quyết định đúng (chọn nếu đúng, không chọn nếu sai)
    let correctDecisions = 0;
    // Giả sử có totalOptionsCount
    for (const optId of correctSet) {
      if (selectedSet.has(optId)) correctDecisions++;
    }
    const ratio = correctDecisions / Math.max(1, correctSet.size);
    return Math.max(0.0, Math.min(1.0, ratio));
  }

  return 0.0;
}

