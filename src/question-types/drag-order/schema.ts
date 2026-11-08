import { z } from "zod";

export const dragOrderItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Nội dung mục không được để trống"),
});

export const dragOrderContentSchema = z.object({
  prompt: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  image_url: z.string().nullable().optional(),
  items: z.array(dragOrderItemSchema).min(2, "Cần tối thiểu 2 mục để sắp xếp"),
});

export const dragOrderAnswerKeySchema = z.object({
  correct_order: z.array(z.string()).min(2),
  scoring: z.enum(["exact", "partial"]).default("exact"),
});

export const dragOrderUserAnswerSchema = z.array(z.string());

export type DragOrderItem = z.infer<typeof dragOrderItemSchema>;
export type DragOrderContent = z.infer<typeof dragOrderContentSchema>;
export type DragOrderAnswerKey = z.infer<typeof dragOrderAnswerKeySchema>;
export type DragOrderUserAnswer = z.infer<typeof dragOrderUserAnswerSchema>;
