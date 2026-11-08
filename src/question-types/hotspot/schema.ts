import { z } from "zod";

export const hotspotRegionSchema = z.discriminatedUnion("shape", [
  z.object({
    shape: z.literal("rect"),
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
    w: z.number().min(0).max(1),
    h: z.number().min(0).max(1),
    label: z.string().optional(),
  }),
  z.object({
    shape: z.literal("circle"),
    cx: z.number().min(0).max(1),
    cy: z.number().min(0).max(1),
    r: z.number().min(0).max(1),
    label: z.string().optional(),
  }),
]);

export const hotspotContentSchema = z.object({
  prompt: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  image_url: z.string().min(1, "Dạng câu hỏi Hotspot bắt buộc phải có ảnh minh họa"),
  max_clicks: z.number().int().min(1).default(1),
});

export const hotspotAnswerKeySchema = z.object({
  regions: z.array(hotspotRegionSchema).min(1, "Cần xác định ít nhất 1 vùng đáp án đúng trên ảnh"),
  mode: z.enum(["any_region", "all_regions"]).default("any_region"),
});

export const hotspotUserAnswerSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export type HotspotRegion = z.infer<typeof hotspotRegionSchema>;
export type HotspotContent = z.infer<typeof hotspotContentSchema>;
export type HotspotAnswerKey = z.infer<typeof hotspotAnswerKeySchema>;
export type HotspotUserAnswer = z.infer<typeof hotspotUserAnswerSchema>;

