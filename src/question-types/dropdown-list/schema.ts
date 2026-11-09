import { z } from "zod";

export const dropdownSlotSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  options: z.array(z.string().min(1, "Phương án không được để trống")).min(2, "Cần ít nhất 2 phương án cho mỗi danh sách thả xuống"),
});

export const dropdownListContentSchema = z.object({
  /**
   * Câu hỏi / Đề bài ở phía trên.
   * Ví dụ: "Đối với mỗi nhận định sau về an toàn thông tin, hãy chọn câu trả lời thích hợp:"
   */
  prompt: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  /**
   * Nội dung các câu nhận định ở phía dưới có chèn ký tự {D} và <br>.
   * Ví dụ: "{D} Bạn nên tắt tính năng tự động chạy (Autorun)... <br>{D} Bạn nên lưu trữ..."
   */
  passage: z.string().optional(),
  image_url: z.string().nullable().optional(),
  /**
   * Danh sách cấu hình cho từng vị trí {D}.
   */
  dropdowns: z.array(dropdownSlotSchema).min(1, "Cần ít nhất 1 vị trí danh sách lựa chọn {D}"),
});

export const dropdownListAnswerKeySchema = z.object({
  /**
   * answers: Bản đồ ánh xạ từng dropdown_id -> đáp án đúng (dạng chuỗi văn bản).
   * Ví dụ: { d1: "Đúng", d2: "Đúng", d3: "Sai" } hoặc { d1: "Có", d2: "Có", d3: "Không" }
   */
  answers: z.record(z.string(), z.string()),
});

export const dropdownListUserAnswerSchema = z.record(z.string(), z.string());

export type DropdownSlot = z.infer<typeof dropdownSlotSchema>;
export type DropdownListContent = z.infer<typeof dropdownListContentSchema>;
export type DropdownListAnswerKey = z.infer<typeof dropdownListAnswerKeySchema>;
export type DropdownListUserAnswer = z.infer<typeof dropdownListUserAnswerSchema>;
