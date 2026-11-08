import { z } from "zod";

export const multiSelectOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Nội dung đáp án không được để trống"),
});

export const multiSelectContentSchema = z.object({
  prompt: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  image_url: z.string().nullable().optional(),
  options: z.array(multiSelectOptionSchema).min(2, "Cần tối thiểu 2 lựa chọn"),
  min_select: z.number().int().min(1).default(1),
  max_select: z.number().int().min(1).optional(),
});

export const multiSelectAnswerKeySchema = z.object({
  correct: z.array(z.string()).min(1, "Cần chọn ít nhất 1 đáp án đúng"),
  scoring: z
    .enum(["all_or_nothing", "partial", "per_option"])
    .default("partial"),
});

export const multiSelectUserAnswerSchema = z.array(z.string());

export type MultiSelectOption = z.infer<typeof multiSelectOptionSchema>;
export type MultiSelectContent = z.infer<typeof multiSelectContentSchema>;
export type MultiSelectAnswerKey = z.infer<typeof multiSelectAnswerKeySchema>;
export type MultiSelectUserAnswer = z.infer<typeof multiSelectUserAnswerSchema>;

