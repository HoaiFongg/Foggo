import { z } from "zod";

export const matchPairSchema = z.object({
  id: z.string(),
  left: z.string().min(1, "Vế trái không được để trống"),
  right: z.string().min(1, "Vế phải không được để trống"),
});

export const dragMatchContentSchema = z.object({
  prompt: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  image_url: z.string().optional(),
  pairs: z.array(matchPairSchema).min(2, "Cần ít nhất 2 cặp để ghép").max(8, "Tối đa 8 cặp ghép"),
});

export const dragMatchAnswerKeySchema = z.object({
  /**
   * matches: Bản đồ ánh xạ left_id -> right_id (ở đây pair.id tương ứng với cả left và right)
   */
  matches: z.record(z.string(), z.string()),
});

export const dragMatchUserAnswerSchema = z.record(z.string(), z.string());

export type MatchPair = z.infer<typeof matchPairSchema>;
export type DragMatchContent = z.infer<typeof dragMatchContentSchema>;
export type DragMatchAnswerKey = z.infer<typeof dragMatchAnswerKeySchema>;
export type DragMatchUserAnswer = z.infer<typeof dragMatchUserAnswerSchema>;

