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
  description: "Câu hỏi gồm một hoặc nhiều nhận định bên trong, mỗi nhận định chỉ chọn Đúng hoặc Sai.",
  isPlus: false,
  contentSchema: trueFalseContentSchema,
  answerKeySchema: trueFalseAnswerKeySchema,
  userAnswerSchema: trueFalseUserAnswerSchema,
  defaultContent: () => ({
    prompt: "Đọc các nhận định sau đây và cho biết nhận định nào Đúng, nhận định nào Sai:",
    statements: [
      { id: "s1", text: "Trái Đất quay quanh Mặt Trời theo quỹ đạo hình elip." },
      { id: "s2", text: "Mặt Trăng tự phát ra ánh sáng tương tự như Mặt Trời." },
      { id: "s3", text: "Nước sôi ở nhiệt độ 100°C trong điều kiện áp suất khí quyển tiêu chuẩn." },
    ],
  }),
  defaultAnswerKey: () => ({
    answers: {
      s1: true,
      s2: false,
      s3: true,
    },
  }),
  grade: gradeTrueFalse,
  Editor: TrueFalseEditor,
  Player: TrueFalsePlayer,
};
