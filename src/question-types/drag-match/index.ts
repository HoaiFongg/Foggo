import type { QuestionTypeDefinition } from "../types";
import { DragMatchEditor } from "./Editor";
import { DragMatchPlayer } from "./Player";
import { gradeDragMatch } from "./grade";
import {
  dragMatchContentSchema,
  dragMatchAnswerKeySchema,
  dragMatchUserAnswerSchema,
  type DragMatchContent,
  type DragMatchAnswerKey,
  type DragMatchUserAnswer,
} from "./schema";

export const dragMatchQuestionType: QuestionTypeDefinition<
  DragMatchContent,
  DragMatchAnswerKey,
  DragMatchUserAnswer
> = {
  type: "drag_match",
  name: "Kéo ghép cặp (Match)",
  description: "Ghép các vế tương ứng giữa 2 cột (Cột A và Cột B)",
  isPlus: true,
  contentSchema: dragMatchContentSchema,
  answerKeySchema: dragMatchAnswerKeySchema,
  userAnswerSchema: dragMatchUserAnswerSchema,
  grade: gradeDragMatch,
  Editor: DragMatchEditor,
  Player: DragMatchPlayer,
  defaultContent: () => ({
    prompt: "Ghép các công cụ sinh tồn với công dụng tương ứng:",
    pairs: [
      { id: "p1", left: "Đèn Bão (Lantern)", right: "Xua tan sương mù và quái bóng tối" },
      { id: "p2", left: "Rìu Đá (Stone Axe)", right: "Chặt cây lấy gỗ xây dựng hàng rào" },
      { id: "p3", left: "Bình Máu (Potion)", right: "Hồi phục sinh lực khi bị quái cắn" },
    ],
  }),
  defaultAnswerKey: () => ({
    matches: {
      p1: "p1",
      p2: "p2",
      p3: "p3",
    },
  }),
};
