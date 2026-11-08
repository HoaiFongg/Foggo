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
  name: "Nhiều mệnh đề Đúng/Sai",
  description: "Đánh giá Đúng hoặc Sai cho một danh sách các khẳng định",
  isPlus: true,
  contentSchema: trueFalseMultiContentSchema,
  answerKeySchema: trueFalseMultiAnswerKeySchema,
  userAnswerSchema: trueFalseMultiUserAnswerSchema,
  grade: gradeTrueFalseMulti,
  Editor: TrueFalseMultiEditor,
  Player: TrueFalseMultiPlayer,
  defaultContent: () => ({
    prompt: "Đọc các nhận định sau về cơ chế sinh tồn trên đảo Foggo:",
    statements: [
      { id: "s1", text: "Đèn bão có thể ngăn quái vật sương mù tới gần trại." },
      { id: "s2", text: "Học sinh có thể xem đáp án đúng trong bảng mã nguồn F12." },
      { id: "s3", text: "Trả lời đúng câu hỏi sẽ giúp gây sát thương lên quái vật." },
    ],
  }),
  defaultAnswerKey: () => ({
    answers: {
      s1: true,
      s2: false,
      s3: true,
    },
  }),
};
