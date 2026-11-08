import { z } from "zod";

export const singleChoiceOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Nội dung đáp án không được để trống"),
});

export const singleChoiceContentSchema = z.object({
  prompt: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  image_url: z.string().nullable().optional(),
  options: z.array(singleChoiceOptionSchema).min(2, "Cần tối thiểu 2 đáp án lựa chọn"),
});

export const singleChoiceAnswerKeySchema = z.object({
  correct: z.string().min(1, "Phải chọn ít nhất 1 đáp án đúng"),
});

export const singleChoiceUserAnswerSchema = z.string().min(1);

export type SingleChoiceOption = z.infer<typeof singleChoiceOptionSchema>;
export type SingleChoiceContent = z.infer<typeof singleChoiceContentSchema>;
export type SingleChoiceAnswerKey = z.infer<typeof singleChoiceAnswerKeySchema>;
export type SingleChoiceUserAnswer = z.infer<typeof singleChoiceUserAnswerSchema>;

