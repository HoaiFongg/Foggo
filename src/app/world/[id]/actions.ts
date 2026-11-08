"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { gradeQuestion } from "@/question-types/registry";

export async function submitWorldAnswer({
  sessionId,
  questionId,
  answer,
  monsterHp,
}: {
  sessionId: string;
  questionId: string;
  answer: any;
  monsterHp: number;
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

  // 2. Chấm điểm bằng registry
  const scoreRatio = gradeQuestion(question.type, answer, question.answer_key);
  const isCorrect = scoreRatio > 0;
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

  const state = player.state || {};
  let currentHp = state.hp ?? 100;
  let gold = player.gold ?? 0;
  let score = player.score ?? 0;
  let monsterDefeated = false;

  let damageDealt = 0;
  let damageTaken = 0;

  if (isCorrect) {
    damageDealt = 50; // Sát thương gây ra lên quái
    const nextMonsterHp = Math.max(0, monsterHp - damageDealt);
    monsterDefeated = nextMonsterHp <= 0;
    const goldEarned = monsterDefeated ? 15 : 5;
    gold += goldEarned;
    score += pointsAwarded;
  } else {
    damageTaken = 20; // Quái đánh trả khi trả lời sai
    currentHp = Math.max(0, currentHp - damageTaken);
  }

  const nextState = {
    ...state,
    hp: currentHp,
  };

  // 4. Lưu lượt trả lời vào session_answers
  await supabase.from("session_answers").upsert(
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

  // 5. Cập nhật nhân vật
  await supabase
    .from("session_players")
    .update({
      score,
      gold,
      state: nextState,
      updated_at: new Date().toISOString(),
    })
    .eq("id", player.id);

  revalidatePath(`/world/${sessionId}`);

  return {
    isCorrect,
    scoreRatio,
    pointsAwarded,
    damageDealt,
    damageTaken,
    monsterDefeated,
    newHp: currentHp,
    newGold: gold,
    newScore: score,
    explanation: question.explanation || null,
  };
}

