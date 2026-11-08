import type { QuestionType, UserPlan } from "@/types/database";

export const PLAN_LIMITS = {
  free: {
    maxSets: 10,
    maxQuestions: 30,
    maxPlayers: 30,
    types: ["single_choice", "true_false"] as QuestionType[],
  },
  plus: {
    maxSets: Infinity,
    maxQuestions: 200,
    maxPlayers: 300,
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

