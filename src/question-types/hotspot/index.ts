import type { QuestionTypeDefinition } from "../types";
import { HotspotEditor } from "./Editor";
import { HotspotPlayer } from "./Player";
import { gradeHotspot } from "./grade";
import {
  hotspotContentSchema,
  hotspotAnswerKeySchema,
  hotspotUserAnswerSchema,
  type HotspotContent,
  type HotspotAnswerKey,
  type HotspotUserAnswer,
} from "./schema";

export const hotspotQuestionType: QuestionTypeDefinition<
  HotspotContent,
  HotspotAnswerKey,
  HotspotUserAnswer
> = {
  type: "hotspot",
  name: "Chạm điểm yếu (Hotspot)",
  description: "Học sinh click/chạm vào vùng mục tiêu trên ảnh minh họa",
  isPlus: true,
  contentSchema: hotspotContentSchema,
  answerKeySchema: hotspotAnswerKeySchema,
  userAnswerSchema: hotspotUserAnswerSchema,
  grade: gradeHotspot,
  Editor: HotspotEditor,
  Player: HotspotPlayer,
  defaultContent: () => ({
    prompt: "Nhìn hình và chỉ ra điểm yếu của quái vật Sương Mù:",
    image_url:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    max_clicks: 1,
  }),
  defaultAnswerKey: () => ({
    regions: [
      {
        shape: "circle",
        cx: 0.5,
        cy: 0.45,
        r: 0.12,
        label: "Lõi sương mù",
      },
    ],
    mode: "any_region",
  }),
};
