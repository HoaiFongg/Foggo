import type { QuestionTypeDefinition } from "../types";
import { DragOrderEditor } from "./Editor";
import { DragOrderPlayer } from "./Player";
import { gradeDragOrder } from "./grade";
import {
  dragOrderContentSchema,
  dragOrderAnswerKeySchema,
  dragOrderUserAnswerSchema,
  type DragOrderContent,
  type DragOrderAnswerKey,
  type DragOrderUserAnswer,
} from "./schema";

export const dragOrderQuestionType: QuestionTypeDefinition<
  DragOrderContent,
  DragOrderAnswerKey,
  DragOrderUserAnswer
> = {
  type: "drag_order",
  name: "Kéo thả sắp xếp thứ tự",
  description: "Sắp xếp các bước hoặc mốc thời gian theo đúng trình tự từ trên xuống dưới.",
  isPlus: true,
  contentSchema: dragOrderContentSchema,
  answerKeySchema: dragOrderAnswerKeySchema,
  userAnswerSchema: dragOrderUserAnswerSchema,
  grade: gradeDragOrder,
  Editor: DragOrderEditor,
  Player: DragOrderPlayer,
  defaultContent: () => ({
    prompt: "Sắp xếp quy trình nhóm lửa sinh tồn theo thứ tự đúng:",
    items: [
      { id: "item_1", text: "Thu thập bùi nhùi khô và củi nhỏ" },
      { id: "item_2", text: "Đánh tia lửa bằng đá lửa vào bùi nhùi" },
      { id: "item_3", text: "Thổi nhẹ cho than bén lửa" },
      { id: "item_4", text: "Xếp thêm cành củi lớn để duy trì ngọn lửa" },
    ],
  }),
  defaultAnswerKey: () => ({
    correct_order: ["item_1", "item_2", "item_3", "item_4"],
    scoring: "exact",
  }),
};
