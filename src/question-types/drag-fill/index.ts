import type { QuestionTypeDefinition } from "../types";
import { DragFillEditor } from "./Editor";
import { DragFillPlayer } from "./Player";
import { gradeDragFill } from "./grade";
import {
  dragFillContentSchema,
  dragFillAnswerKeySchema,
  dragFillUserAnswerSchema,
  type DragFillContent,
  type DragFillAnswerKey,
  type DragFillUserAnswer,
} from "./schema";

export const dragFillQuestionType: QuestionTypeDefinition<
  DragFillContent,
  DragFillAnswerKey,
  DragFillUserAnswer
> = {
  type: "drag_fill",
  name: "Điền từ vào chỗ trống",
  description: "Kéo hoặc chạm từ khóa thích hợp vào các ô trống {{1}}, {{2}}",
  isPlus: true,
  contentSchema: dragFillContentSchema,
  answerKeySchema: dragFillAnswerKeySchema,
  userAnswerSchema: dragFillUserAnswerSchema,
  grade: gradeDragFill,
  Editor: DragFillEditor,
  Player: DragFillPlayer,
  defaultContent: () => ({
    prompt: "Hoàn thiện bí kíp sinh tồn của đảo Foggo:",
    template: "Đêm xuống, hãy nhóm {{1}} để sưởi ấm và chế tạo {{2}} để phòng thủ quái vật.",
    options: [
      { id: "opt_fire", text: "lửa trại" },
      { id: "opt_fence", text: "hàng rào gỗ" },
      { id: "opt_ice", text: "tảng băng" },
    ],
  }),
  defaultAnswerKey: () => ({
    blanks: {
      "1": "opt_fire",
      "2": "opt_fence",
    },
  }),
};
