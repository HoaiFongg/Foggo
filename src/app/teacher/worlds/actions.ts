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

  if (!title) {
    return { error: "Vui lòng nhập tên cho Thế giới" };
  }

  const token = generateJoinToken();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("game_sessions")
    .insert({
      host_id: user.id,
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
      },
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message || "Không thể tạo Thế giới" };
  }

  revalidatePath("/teacher/worlds");
  redirect(`/teacher/worlds/${data.id}`);
}

export async function pauseWorld(sessionId: string) {
  const { user } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();

  await supabase
    .from("game_sessions")
    .update({ status: "paused" })
    .eq("id", sessionId)
    .eq("host_id", user.id);

  revalidatePath(`/teacher/worlds/${sessionId}`);
  return { success: true };
}

export async function resumeWorld(sessionId: string) {
  const { user } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();

  await supabase
    .from("game_sessions")
    .update({ status: "open" })
    .eq("id", sessionId)
    .eq("host_id", user.id);

  revalidatePath(`/teacher/worlds/${sessionId}`);
  return { success: true };
}

export async function closeWorld(sessionId: string) {
  const { user } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();

  await supabase
    .from("game_sessions")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .eq("host_id", user.id);

  revalidatePath(`/teacher/worlds/${sessionId}`);
  return { success: true };
}

export async function regenerateJoinToken(sessionId: string) {
  const { user } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const newToken = generateJoinToken();

  const { error } = await supabase
    .from("game_sessions")
    .update({ join_token: newToken })
    .eq("id", sessionId)
    .eq("host_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/teacher/worlds/${sessionId}`);
  return { success: true, newToken };
}

export async function toggleBanPlayer(
  playerId: string,
  sessionId: string,
  banned: boolean
) {
  const { user } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();

  // Kiểm tra quyền chủ phòng
  const { data: session } = await supabase
    .from("game_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("host_id", user.id)
    .single();

  if (!session) return { error: "Không có quyền thực hiện" };

  await supabase
    .from("session_players")
    .update({ banned })
    .eq("id", playerId)
    .eq("session_id", sessionId);

  revalidatePath(`/teacher/worlds/${sessionId}`);
  return { success: true };
}

