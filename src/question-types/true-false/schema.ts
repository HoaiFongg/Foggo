import { z } from "zod";

export const trueFalseContentSchema = z.object({
  prompt: z.string().min(1, "Nội dung nhận định không được để trống"),
  image_url: z.string().nullable().optional(),
});

export const trueFalseAnswerKeySchema = z.object({
  correct: z.boolean(),
});

export const trueFalseUserAnswerSchema = z.boolean();

export type TrueFalseContent = z.infer<typeof trueFalseContentSchema>;
export type TrueFalseAnswerKey = z.infer<typeof trueFalseAnswerKeySchema>;
export type TrueFalseUserAnswer = z.infer<typeof trueFalseUserAnswerSchema>;

