import type { QuestionTypeDefinition } from "./types";
import { singleChoiceDefinition } from "./single-choice";
import { trueFalseDefinition } from "./true-false";
import { multiSelectQuestionType } from "./multi-select";
import { dragOrderQuestionType } from "./drag-order";
import { hotspotQuestionType } from "./hotspot";
import { dragMatchQuestionType } from "./drag-match";
import { dragFillQuestionType } from "./drag-fill";
import { trueFalseMultiQuestionType } from "./true-false-multi";

export const QUESTION_TYPES: Record<string, QuestionTypeDefinition<any, any, any>> = {
  single_choice: singleChoiceDefinition,
  true_false: trueFalseDefinition,
  multi_select: multiSelectQuestionType,
  drag_order: dragOrderQuestionType,
  hotspot: hotspotQuestionType,
  drag_match: dragMatchQuestionType,
  drag_fill: dragFillQuestionType,
  true_false_multi: trueFalseMultiQuestionType,
};

export function getQuestionType(type: string): QuestionTypeDefinition<any, any, any> | undefined {
  return QUESTION_TYPES[type];
}

export function getAllQuestionTypes(): QuestionTypeDefinition<any, any, any>[] {
  return Object.values(QUESTION_TYPES);
}

/**
 * Hàm chấm điểm trung tâm chạy ở Server.
 * Tuyệt đối không để lộ answer_key ra ngoài client.
 */
export function gradeQuestion(
  type: string,
  userAnswer: any,
  answerKey: any
): number {
  const def = getQuestionType(type);
  if (!def) {
    console.warn(`Không tìm thấy định nghĩa cho dạng câu hỏi: ${type}`);
    return 0.0;
  }
  try {
    return def.grade(userAnswer, answerKey);
  } catch (error) {
    console.error(`Lỗi chấm điểm dạng câu hỏi ${type}:`, error);
    return 0.0;
  }
}
