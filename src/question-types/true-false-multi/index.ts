import type { QuestionTypeDefinition } from "../types";
import { TrueFalseMultiEditor } from "./Editor";
import { TrueFalseMultiPlayer } from "./Player";
import { gradeTrueFalseMulti } from "./grade";
import {
  trueFalseMultiContentSchema,
  trueFalseMultiAnswerKeySchema,
  trueFalseMultiUserAnswerSchema,
  type TrueFalseMultiContent,
  type TrueFalseMultiAnswerKey,
  type TrueFalseMultiUserAnswer,
} from "./schema";

export const trueFalseMultiQuestionType: QuestionTypeDefinition<
  TrueFalseMultiContent,
  TrueFalseMultiAnswerKey,
  TrueFalseMultiUserAnswer
> = {
  type: "true_false_multi",
  name: "Đúng / Sai (Chuẩn IC3 GS6)",
  description: "Bảng nhận định phát biểu chọn Đúng (Yes) hoặc Sai (No) theo chuẩn IC3 GS6 & GDPT 2018",
  isPlus: false,
  contentSchema: trueFalseMultiContentSchema,
  answerKeySchema: trueFalseMultiAnswerKeySchema,
  userAnswerSchema: trueFalseMultiUserAnswerSchema,
  grade: gradeTrueFalseMulti,
  Editor: TrueFalseMultiEditor,
  Player: TrueFalseMultiPlayer,
  defaultContent: () => ({
    prompt: "Đọc các phát biểu sau đây và cho biết phát biểu nào Đúng, phát biểu nào Sai:",
    statements: [
      { id: "s1", text: "" },
      { id: "s2", text: "" },
      { id: "s3", text: "" },
    ],
  }),
  defaultAnswerKey: () => ({
    answers: {
      s1: false,
      s2: false,
      s3: false,
    },
  }),
};
