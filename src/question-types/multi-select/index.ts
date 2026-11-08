import type { QuestionTypeDefinition } from "../types";
import { MultiSelectEditor } from "./Editor";
import { MultiSelectPlayer } from "./Player";
import { gradeMultiSelect } from "./grade";
import {
  multiSelectContentSchema,
  multiSelectAnswerKeySchema,
  multiSelectUserAnswerSchema,
  type MultiSelectContent,
  type MultiSelectAnswerKey,
  type MultiSelectUserAnswer,
} from "./schema";

export const multiSelectQuestionType: QuestionTypeDefinition<
  MultiSelectContent,
  MultiSelectAnswerKey,
  MultiSelectUserAnswer
> = {
  type: "multi_select",
  name: "Nhiều lựa chọn đúng",
  description: "Người chơi chọn một hoặc nhiều phương án chính xác trong danh sách.",
  isPlus: false,
  contentSchema: multiSelectContentSchema,
  answerKeySchema: multiSelectAnswerKeySchema,
  userAnswerSchema: multiSelectUserAnswerSchema,
  grade: gradeMultiSelect,
  Editor: MultiSelectEditor,
  Player: MultiSelectPlayer,
  defaultContent: () => ({
    prompt: "Những vật dụng nào sau đây cần thiết khi sinh tồn trong rừng rậm sương mù?",
    min_select: 1,
    options: [
      { id: "opt_1", text: "Đèn bão / Ngọn đuốc" },
      { id: "opt_2", text: "Rìu đá chặt củi" },
      { id: "opt_3", text: "Kính râm chống nắng gắt" },
      { id: "opt_4", text: "Lương khô và bi đông nước" },
    ],
  }),
  defaultAnswerKey: () => ({
    correct: ["opt_1", "opt_2", "opt_4"],
    scoring: "partial",
  }),
};
