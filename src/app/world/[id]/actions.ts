"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { gradeQuestion } from "@/question-types/registry";
import {
  initSurvivalState,
  tick,
  applyHunt,
  applyGather,
  applyExplore,
  applyCraft,
  applyEat,
  applyBlacksmith,
  applyEquipGear,
  applyNightDefense,
  applyRevive,
  type SurvivalPlayerState,
} from "@/game-modes/survival/engine";

/**
 * Trả lời câu hỏi và thực hiện hành động sinh tồn
 */
export async function submitSurvivalAction({
  sessionId,
  actionType,
  targetId,
  questionId,
  answer,
  isHotspotCritical = false,
  timeUsedSec = 5,
}: {
  sessionId: string;
  actionType: "hunt" | "gather" | "explore" | "craft" | "defend";
  targetId: string;
  questionId: string;
  answer: any;
  isHotspotCritical?: boolean;
  timeUsedSec?: number;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn" };
  }

  // 1. Tải câu hỏi từ database (đáp án đúng answer_key CHỈ nằm ở server)
  const { data: question } = await supabase
    .from("questions")
    .select("id, type, answer_key, points, explanation")
    .eq("id", questionId)
    .single();

  if (!question) {
    return { error: "Không tìm thấy câu hỏi" };
  }

  // 2. Chấm điểm server-side
  const scoreRatio = gradeQuestion(question.type, answer, question.answer_key);
  const isSuccess = scoreRatio >= 0.5;
  const pointsAwarded = Math.round(question.points * scoreRatio);

  // 3. Tải nhân vật của người chơi trong thế giới này
  const { data: player } = await supabase
    .from("session_players")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!player) {
    return { error: "Không tìm thấy nhân vật trong thế giới này" };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  let state: SurvivalPlayerState = player.state && Object.keys(player.state).length > 3
    ? player.state
    : initSurvivalState(nowSec);

  // Chạy tick() cập nhật đói / đồng hồ trước khi xử lý
  state = tick(state, nowSec);

  let huntResult = null;
  let gatherResult = null;
  let exploreResult = null;
  let craftResult = null;
  let defendResult = null;
  let message = "";

  if (actionType === "hunt") {
    huntResult = applyHunt(state, targetId, scoreRatio, isHotspotCritical, timeUsedSec);
    state = huntResult.state;
    if (huntResult.result === "kill") {
      message = `Hạ gục quái vật! Nhận được ${huntResult.coinsAwarded} xu và ${huntResult.scoreAwarded} điểm.`;
    } else if (huntResult.result === "hit") {
      message = `Tấn công trúng! Gây ${huntResult.damageDealt} sát thương.`;
    } else if (huntResult.result === "death") {
      message = "Bạn đã bị quái vật đánh gục! Hãy hồi sinh tại lửa trại.";
    } else {
      message = `Trả lời chưa chính xác! Bị quái đánh trả ${huntResult.damageTaken} sát thương.`;
    }
  } else if (actionType === "gather") {
    gatherResult = applyGather(state, targetId as any, scoreRatio, timeUsedSec);
    state = gatherResult.state;
    message = gatherResult.qtyObtained > 0
      ? `Thu thập thành công ${gatherResult.qtyObtained} ${gatherResult.itemId}!`
      : "Thu thập thất bại do chọn sai phương án!";
  } else if (actionType === "explore") {
    exploreResult = applyExplore(state, targetId as any, scoreRatio, timeUsedSec);
    state = exploreResult.state;
    message = exploreResult.fogReduced > 0
      ? `Xua tan ${exploreResult.fogReduced}% sương mù! Sương còn lại: ${exploreResult.currentFog}%. ${exploreResult.newDiscovery || ""}`
      : "Lạc đường trong sương mù! Sương mù dày thêm 2%.";
  } else if (actionType === "craft") {
    craftResult = applyCraft(state, targetId, scoreRatio);
    state = craftResult.state;
    message = craftResult.message;
  } else if (actionType === "defend") {
    defendResult = applyNightDefense(state, scoreRatio);
    state = defendResult.state;
    message = defendResult.message;
  }

  // 4. Lưu lượt trả lời vào session_answers bằng adminClient
  const adminClient = createAdminClient();
  await adminClient.from("session_answers").upsert(
    {
      session_id: sessionId,
      player_id: player.id,
      question_id: question.id,
      answer,
      score_ratio: scoreRatio,
      points_awarded: pointsAwarded,
    },
    { onConflict: "player_id,question_id" }
  );

  // 5. Cập nhật nhân vật session_players
  await adminClient
    .from("session_players")
    .update({
      score: state.score,
      gold: state.coins,
      state,
      state_version: (player.state_version || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", player.id);

  // 6. Ghi nhật ký survival_events
  await adminClient.from("survival_events").insert({
    session_id: sessionId,
    player_id: player.id,
    type: actionType,
    payload: {
      targetId,
      scoreRatio,
      isSuccess,
      message,
    },
  });

  return {
    success: true,
    isCorrect: isSuccess,
    scoreRatio,
    message,
    state,
    explanation: question.explanation,
    huntResult,
    gatherResult,
    exploreResult,
    craftResult,
    defendResult,
  };
}

/**
 * Hành động tiêu thụ / mua đồ không cần câu hỏi (Ăn, Thợ rèn, Hồi sinh)
 */
export async function performSurvivalItemAction({
  sessionId,
  action,
  itemId,
  slotIndex,
}: {
  sessionId: string;
  action: "eat" | "buy_gear" | "repair" | "enhance" | "revive" | "equip";
  itemId?: string;
  slotIndex?: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn" };
  }

  const { data: player } = await supabase
    .from("session_players")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!player) {
    return { error: "Không tìm thấy nhân vật" };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  let state: SurvivalPlayerState = player.state && Object.keys(player.state).length > 3
    ? player.state
    : initSurvivalState(nowSec);

  state = tick(state, nowSec);

  let message = "";
  if (action === "eat" && itemId) {
    const res = applyEat(state, itemId);
    state = res.state;
    message = res.message;
  } else if (action === "equip" && typeof slotIndex === "number") {
    const res = applyEquipGear(state, slotIndex);
    state = res.state;
    message = res.message;
  } else if (action === "revive") {
    state = applyRevive(state);
    message = "Bạn đã hồi sinh tại đống lửa trại an toàn!";
  } else if (["buy_gear", "repair", "enhance"].includes(action) && itemId) {
    const res = applyBlacksmith(state, action as any, itemId);
    state = res.state;
    message = res.message;
  }

  const adminClient = createAdminClient();
  await adminClient
    .from("session_players")
    .update({
      score: state.score,
      gold: state.coins,
      state,
      state_version: (player.state_version || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", player.id);

  return {
    success: true,
    message,
    state,
  };
}
