import { z } from "zod";

export const statementItemSchema = z.object({
  id: z.string(),
  text: z.string(),
});

export const trueFalseContentSchema = z.object({
  prompt: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  image_url: z.string().nullable().optional(),
  /**
   * Danh sách các nhận định bên trong câu hỏi.
   * Có thể có 1 nhận định hoặc nhiều nhận định (2, 3, 4...).
   */
  statements: z.array(statementItemSchema).optional(),
});

export const trueFalseAnswerKeySchema = z.object({
  /**
   * answers: Bản đồ ánh xạ từng statement_id -> boolean (true: Đúng, false: Sai).
   */
  answers: z.record(z.string(), z.boolean()).optional(),
  /**
   * Hỗ trợ dữ liệu cũ: câu hỏi 1 nhận định đơn lẻ lưu correct dạng boolean.
   */
  correct: z.boolean().optional(),
});

export const trueFalseUserAnswerSchema = z.union([
  z.record(z.string(), z.boolean()),
  z.boolean(),
]);

export type StatementItem = z.infer<typeof statementItemSchema>;
export type TrueFalseContent = z.infer<typeof trueFalseContentSchema>;
export type TrueFalseAnswerKey = z.infer<typeof trueFalseAnswerKeySchema>;
export type TrueFalseUserAnswer = z.infer<typeof trueFalseUserAnswerSchema>;
