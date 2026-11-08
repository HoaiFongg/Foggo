import { z } from "zod";

export const dragFillOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Từ không được để trống"),
});

export const dragFillContentSchema = z.object({
  prompt: z.string().min(1, "Nội dung yêu cầu không được để trống"),
  image_url: z.string().optional(),
  /**
   * template: Đoạn văn chứa các chỗ trống đánh dấu theo dạng {{1}}, {{2}}, ...
   */
  template: z.string().min(1, "Đoạn văn không được để trống"),
  options: z.array(dragFillOptionSchema).min(1, "Cần ít nhất 1 từ lựa chọn"),
});

export const dragFillAnswerKeySchema = z.object({
  /**
   * blanks: Bản đồ ánh xạ số thứ tự chỗ trống ("1", "2") -> option_id chính xác
   */
  blanks: z.record(z.string(), z.string()),
});

export const dragFillUserAnswerSchema = z.record(z.string(), z.string());

export type DragFillOption = z.infer<typeof dragFillOptionSchema>;
export type DragFillContent = z.infer<typeof dragFillContentSchema>;
export type DragFillAnswerKey = z.infer<typeof dragFillAnswerKeySchema>;
export type DragFillUserAnswer = z.infer<typeof dragFillUserAnswerSchema>;

