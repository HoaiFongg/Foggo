import type { QuestionTypeDefinition } from "../types";
import {
  trueFalseContentSchema,
  trueFalseAnswerKeySchema,
  trueFalseUserAnswerSchema,
  type TrueFalseContent,
  type TrueFalseAnswerKey,
  type TrueFalseUserAnswer,
} from "./schema";
import { gradeTrueFalse } from "./grade";
import { TrueFalseEditor } from "./Editor";
import { TrueFalsePlayer } from "./Player";

export const trueFalseDefinition: QuestionTypeDefinition<
  TrueFalseContent,
  TrueFalseAnswerKey,
  TrueFalseUserAnswer
> = {
  type: "true_false",
  name: "Đúng / Sai",
  description: "Người chơi đọc nhận định và chọn Đúng hoặc Sai, phản xạ nhanh.",
  isPlus: false,
  contentSchema: trueFalseContentSchema,
  answerKeySchema: trueFalseAnswerKeySchema,
  userAnswerSchema: trueFalseUserAnswerSchema,
  defaultContent: () => ({
    prompt: "Trái Đất quay quanh Mặt Trời theo quỹ đạo hình elip.",
    image_url: null,
  }),
  defaultAnswerKey: () => ({
    correct: true,
  }),
  grade: gradeTrueFalse,
  Editor: TrueFalseEditor,
  Player: TrueFalsePlayer,
};

