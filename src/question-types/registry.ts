import type { QuestionTypeDefinition } from "./types";
import { singleChoiceDefinition } from "./single-choice";
import { trueFalseDefinition } from "./true-false";
import { multiSelectQuestionType } from "./multi-select";
import { dragOrderQuestionType } from "./drag-order";
import { hotspotQuestionType } from "./hotspot";
import { dragMatchQuestionType } from "./drag-match";
import { dragFillQuestionType } from "./drag-fill";

export const QUESTION_TYPES: Record<string, QuestionTypeDefinition<any, any, any>> = {
  single_choice: singleChoiceDefinition,
  true_false: trueFalseDefinition,
  multi_select: multiSelectQuestionType,
  drag_order: dragOrderQuestionType,
  hotspot: hotspotQuestionType,
  drag_match: dragMatchQuestionType,
  drag_fill: dragFillQuestionType,
  // Alias để tương thích ngược 100% với các câu hỏi cũ đã lưu type: "true_false_multi"
  true_false_multi: trueFalseDefinition,
};

export function getQuestionType(type: string): QuestionTypeDefinition<any, any, any> | undefined {
  return QUESTION_TYPES[type];
}

/**
 * Trả về danh sách các dạng câu hỏi chuẩn hiển thị cho người dùng tạo đề.
 * Đã hợp nhất Đúng / Sai thành 1 dạng duy nhất hỗ trợ 1 hoặc nhiều nhận định.
 */
export function getAllQuestionTypes(): QuestionTypeDefinition<any, any, any>[] {
  return [
    singleChoiceDefinition,
    trueFalseDefinition,
    multiSelectQuestionType,
    dragOrderQuestionType,
    hotspotQuestionType,
    dragMatchQuestionType,
    dragFillQuestionType,
  ];
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
