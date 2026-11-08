import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  // 1. Chốt các thế giới đã hết hạn (ends_at < now và status = 'playing')
  const { data: closedSessions, error: sessionErr } = await supabase
    .from("game_sessions")
    .update({ status: "finished" })
    .lt("ends_at", now)
    .eq("status", "playing")
    .select("id, title");

  // 2. Chuyển các gói Plus đã quá hạn về Free
  const { data: expiredProfiles, error: profileErr } = await supabase
    .from("profiles")
    .update({ plan: "free" })
    .lt("plan_expires_at", now)
    .eq("plan", "plus")
    .select("id, username");

  return NextResponse.json({
    success: true,
    closedWorldsCount: closedSessions?.length || 0,
    expiredPlusCount: expiredProfiles?.length || 0,
    timestamp: now,
  });
}
