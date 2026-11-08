import type { HotspotAnswerKey, HotspotUserAnswer, HotspotRegion } from "./schema";

/**
 * Kiểm tra điểm click (x, y) có nằm trong vùng region không.
 * x, y, cx, cy, w, h, r đều được chuẩn hóa theo tỷ lệ 0.0 .. 1.0
 */
export function isPointInsideRegion(
  point: { x: number; y: number },
  region: HotspotRegion
): boolean {
  if (region.shape === "rect") {
    return (
      point.x >= region.x &&
      point.x <= region.x + region.w &&
      point.y >= region.y &&
      point.y <= region.y + region.h
    );
  }

  if (region.shape === "circle") {
    const dx = point.x - region.cx;
    const dy = point.y - region.cy;
    return dx * dx + dy * dy <= region.r * region.r;
  }

  return false;
}

/**
 * Hàm chấm điểm Hotspot:
 * Trả về 1.0 nếu click đúng vào vùng đáp án, 0.0 nếu click trượt.
 */
export function gradeHotspot(
  answer: HotspotUserAnswer,
  key: HotspotAnswerKey
): number {
  if (
    !answer ||
    typeof answer.x !== "number" ||
    typeof answer.y !== "number" ||
    !Array.isArray(key?.regions) ||
    key.regions.length === 0
  ) {
    return 0.0;
  }

  // Chế độ mặc định: Click trúng bất kỳ vùng nào được định nghĩa
  const hit = key.regions.some((region) =>
    isPointInsideRegion(answer, region)
  );

  return hit ? 1.0 : 0.0;
}
