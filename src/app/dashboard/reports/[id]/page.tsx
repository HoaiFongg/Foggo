import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReportClient } from "./ReportClient";

export default async function SessionReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sessionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Tải thông tin phiên thế giới
  const { data: session } = await supabase
    .from("game_sessions")
    .select(`
      id,
      title,
      status,
      kind,
      created_at,
      ends_at,
      question_sets (
        id,
        title,
        questions (
          id,
          type,
          content,
          points
        )
      )
    `)
    .eq("id", sessionId)
    .single();

  if (!session) {
    notFound();
  }

  // 2. Tải danh sách người chơi
  const { data: players } = await supabase
    .from("session_players")
    .select("*")
    .eq("session_id", sessionId)
    .order("score", { ascending: false });

  // 3. Tải danh sách các lượt trả lời
  const { data: answers } = await supabase
    .from("session_answers")
    .select("*")
    .eq("session_id", sessionId);

  // 4. Tải các sự kiện sinh tồn (survival_events)
  const { data: events } = await supabase
    .from("survival_events")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <ReportClient
      session={session}
      players={players || []}
      answers={answers || []}
      events={events || []}
    />
  );
}
