"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { generateJoinToken } from "@/lib/tokens";

export async function createWorld(formData: FormData) {
  const { user } = await requireUser(["teacher", "admin"]);
  const title = String(formData.get("title") || "").trim();
  const setId = String(formData.get("setId") || "").trim() || null;
  const allowGuests = formData.get("allowGuests") === "on";
  const mode = String(formData.get("mode") || "survival");
  const kind = (String(formData.get("kind") || "link")) as "class" | "link" | "solo" | "quick";
  const dailyLimitMin = Number(formData.get("dailyLimitMin") || 30);

  // Cấu hình vật phẩm hiếm & tỉ lệ rớt trong hầm ngục lớp
  const rawDrops = formData.getAll("dungeonDrops") as string[];
  const dropRate = Number(formData.get("dungeonDropRate") || 25);
  const dungeonDrops = rawDrops.map((itemId) => ({ itemId, dropRate }));

  if (!title) {
    return { error: "Vui lòng nhập tên cho Thế giới" };
  }

  const token = generateJoinToken();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("game_sessions")
    .insert({
      host_id: user.id,
      teacher_id: user.id,
      title,
      set_id: setId,
      mode,
      kind,
      join_token: token,
      allow_guests: allowGuests,
      status: "open",
      starts_at: new Date().toISOString(),
      settings: {
        dailyPlayLimitMinutes: dailyLimitMin,
        fogDensity: 1.0,
        isClassDungeon: true,
        dungeonDrops,
      },
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message || "Không thể tạo Thế giới" };
  }

  revalidatePath("/teacher/worlds");
  revalidatePath("/worlds");
  redirect(`/teacher/worlds/${data.id}`);
}

/**
 * Chế độ Farm Quái Tại Nhà (Home Solo Farming Mode)
 * Tự động đưa học sinh vào bãi luyện quái, cày xu mua trang bị khi không có hầm ngục trên lớp
 */
export async function startHomeFarmSession(): Promise<void> {
  const { user, profile } = await requireUser(["student", "teacher", "admin"]);
  const supabase = await createClient();

  // Kiểm tra xem đã có phiên Solo Farm đang mở chưa
  const { data: existingPlayer } = await supabase
    .from("session_players")
    .select("session_id, game_sessions(*)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (
    existingPlayer &&
    (existingPlayer.game_sessions as any)?.kind === "solo" &&
    (existingPlayer.game_sessions as any)?.status === "open"
  ) {
    redirect(`/world/${existingPlayer.session_id}`);
  }

  // Lấy bộ câu hỏi công khai đầu tiên để làm ngân hàng câu hỏi
  const { data: sampleSet } = await supabase
    .from("question_sets")
    .select("id")
    .eq("visibility", "public")
    .limit(1)
    .single();

  const token = generateJoinToken();
  const { data: session, error } = await supabase
    .from("game_sessions")
    .insert({
      host_id: user.id,
      title: `Bãi Farm Quái Của ${profile.display_name || "Nhà Thám Hiểm"}`,
      set_id: sampleSet?.id || null,
      mode: "survival",
      kind: "solo",
      join_token: token,
      allow_guests: false,
      status: "open",
      starts_at: new Date().toISOString(),
      settings: {
        isHomeFarm: true,
        dailyPlayLimitMinutes: 0,
        fogDensity: 0.8,
      },
    })
    .select("id")
    .single();

  if (error || !session) {
    throw new Error("Không thể tạo bãi farm quái luyện tập");
  }

  // Khởi tạo người chơi với túi đồ cơ bản và 50 xu để ghé Thợ rèn & Tiệm đồ
  await supabase.from("session_players").insert({
    session_id: session.id,
    user_id: user.id,
    nickname: profile.display_name || "Nhà Thám Hiểm",
    hp: 100,
    max_hp: 100,
    score: 0,
    gold: 50,
    inventory: [
      { slotIndex: 0, itemId: "wooden_club", qty: 1, durability: 40 },
      { slotIndex: 1, itemId: "apple", qty: 3 },
    ],
    equipment: { weapon: "wooden_club" },
    state: { hp: 100, hunger: 100, fogLevel: 0.8 },
  });

  revalidatePath("/worlds");
  redirect(`/world/${session.id}`);
}

export async function pauseWorld(sessionId: string) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let query = supabase.from("game_sessions").update({ status: "paused" }).eq("id", sessionId);
  if (!isAdmin) {
    query = query.eq("host_id", user.id);
  }
  await query;

  revalidatePath(`/teacher/worlds/${sessionId}`);
  revalidatePath("/worlds");
  return { success: true };
}

export async function resumeWorld(sessionId: string) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let query = supabase.from("game_sessions").update({ status: "open" }).eq("id", sessionId);
  if (!isAdmin) {
    query = query.eq("host_id", user.id);
  }
  await query;

  revalidatePath(`/teacher/worlds/${sessionId}`);
  revalidatePath("/worlds");
  return { success: true };
}

export async function closeWorld(sessionId: string) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let query = supabase
    .from("game_sessions")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (!isAdmin) {
    query = query.eq("host_id", user.id);
  }
  await query;

  revalidatePath(`/teacher/worlds/${sessionId}`);
  revalidatePath("/worlds");
  return { success: true };
}

export async function regenerateJoinToken(sessionId: string) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";
  const newToken = generateJoinToken();

  let query = supabase.from("game_sessions").update({ join_token: newToken }).eq("id", sessionId);
  if (!isAdmin) {
    query = query.eq("host_id", user.id);
  }

  const { error } = await query;
  if (error) return { error: error.message };

  revalidatePath(`/teacher/worlds/${sessionId}`);
  return { success: true, newToken };
}

export async function toggleBanPlayer(
  playerId: string,
  sessionId: string,
  banned: boolean
) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  // Kiểm tra quyền chủ phòng hoặc Admin
  if (!isAdmin) {
    const { data: session } = await supabase
      .from("game_sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("host_id", user.id)
      .single();

    if (!session) return { error: "Không có quyền thực hiện" };
  }

  await supabase
    .from("session_players")
    .update({ banned })
    .eq("id", playerId)
    .eq("session_id", sessionId);

  revalidatePath(`/teacher/worlds/${sessionId}`);
  return { success: true };
}
