import type { QuestionType } from "@/types/database";
import type { QuestionTypeDefinition } from "./types";
import { singleChoiceDefinition } from "./single-choice";
import { trueFalseDefinition } from "./true-false";

export const QUESTION_TYPES: Record<string, QuestionTypeDefinition> = {
  single_choice: singleChoiceDefinition,
  true_false: trueFalseDefinition,
};

export function getQuestionType(type: string): QuestionTypeDefinition | undefined {
  return QUESTION_TYPES[type];
}

export function getAllQuestionTypes(): QuestionTypeDefinition[] {
  return Object.values(QUESTION_TYPES);
}

/**
 * Hàm chấm điểm trung tâm chạy ở Server.
 * Tuyệt đối không để lộ answer_key ra ngoài.
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

