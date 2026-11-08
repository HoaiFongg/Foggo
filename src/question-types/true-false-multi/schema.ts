import { z } from "zod";

export const statementSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Nội dung khẳng định không được để trống"),
});

export const trueFalseMultiContentSchema = z.object({
  prompt: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  image_url: z.string().optional(),
  statements: z
    .array(statementSchema)
    .min(2, "Cần ít nhất 2 mệnh đề")
    .max(8, "Tối đa 8 mệnh đề"),
});

export const trueFalseMultiAnswerKeySchema = z.object({
  /**
   * answers: Bản đồ ánh xạ statement_id -> boolean (true: Đúng, false: Sai)
   */
  answers: z.record(z.string(), z.boolean()),
});

export const trueFalseMultiUserAnswerSchema = z.record(z.string(), z.boolean());

export type Statement = z.infer<typeof statementSchema>;
export type TrueFalseMultiContent = z.infer<typeof trueFalseMultiContentSchema>;
export type TrueFalseMultiAnswerKey = z.infer<typeof trueFalseMultiAnswerKeySchema>;
export type TrueFalseMultiUserAnswer = z.infer<typeof trueFalseMultiUserAnswerSchema>;
