import type { QuestionType, UserPlan } from "@/types/database";

export const PLAN_LIMITS = {
  free: {
    name: "Gói Khởi Đầu (Miễn Phí)",
    maxSets: 10,
    maxQuestions: 30,
    maxPlayers: 40,
    priceMonthlyVnd: 0,
    priceYearlyVnd: 0,
    types: [
      "single_choice",
      "true_false",
      "multi_select",
    ] as QuestionType[],
  },
  plus: {
    name: "Gói Giáo Viên Plus",
    maxSets: Infinity,
    maxQuestions: 200,
    maxPlayers: 500,
    priceMonthlyVnd: 89000,
    priceYearlyVnd: 799000,
    types: [
      "single_choice",
      "true_false",
      "multi_select",
      "drag_order",
      "drag_match",
      "drag_fill",
      "hotspot",
      "true_false_multi",
    ] as QuestionType[],
  },
} as const;

export function canUseQuestionType(plan: UserPlan, type: QuestionType): boolean {
  return (PLAN_LIMITS[plan].types as QuestionType[]).includes(type);
}
