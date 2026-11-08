import type { QuestionTypeDefinition } from "../types";
import {
  singleChoiceContentSchema,
  singleChoiceAnswerKeySchema,
  singleChoiceUserAnswerSchema,
  type SingleChoiceContent,
  type SingleChoiceAnswerKey,
  type SingleChoiceUserAnswer,
} from "./schema";
import { gradeSingleChoice } from "./grade";
import { SingleChoiceEditor } from "./Editor";
import { SingleChoicePlayer } from "./Player";

export const singleChoiceDefinition: QuestionTypeDefinition<
  SingleChoiceContent,
  SingleChoiceAnswerKey,
  SingleChoiceUserAnswer
> = {
  type: "single_choice",
  name: "Trắc nghiệm 1 đáp án",
  description: "Dạng câu hỏi 4 lựa chọn quen thuộc, người chơi chọn 1 đáp án duy nhất.",
  isPlus: false,
  contentSchema: singleChoiceContentSchema,
  answerKeySchema: singleChoiceAnswerKeySchema,
  userAnswerSchema: singleChoiceUserAnswerSchema,
  defaultContent: () => ({
    prompt: "Thủ đô của Việt Nam là thành phố nào?",
    image_url: null,
    options: [
      { id: "opt_1", text: "Hà Nội" },
      { id: "opt_2", text: "Huế" },
      { id: "opt_3", text: "Đà Nẵng" },
      { id: "opt_4", text: "TP. Hồ Chí Minh" },
    ],
  }),
  defaultAnswerKey: () => ({
    correct: "opt_1",
  }),
  grade: gradeSingleChoice,
  Editor: SingleChoiceEditor,
  Player: SingleChoicePlayer,
};

