import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorldClient } from "./WorldClient";

interface WorldPageProps {
  params: Promise<{ id: string }>;
}

export default async function WorldPage({ params }: WorldPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Tải thế giới
  const { data: session } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (!session) {
    notFound();
  }

  // 2. Tải thông tin người dùng
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/j/${session.join_token}`);
  }

  // 3. Tải nhân vật của người chơi trong thế giới này
  const { data: player } = await supabase
    .from("session_players")
    .select("*")
    .eq("session_id", id)
    .eq("user_id", user.id)
    .single();

  if (!player) {
    redirect(`/j/${session.join_token}`);
  }

  if (player.banned) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-xl font-bold text-rose-400 font-mono">BẠN ĐÃ BỊ KHÓA KHỎI THẾ GIỚI</h1>
        <p className="text-xs text-slate-400 mt-2">
          Giáo viên đã tạm khóa nhân vật của bạn trong thế giới này. Vui lòng liên hệ giáo viên để được hỗ trợ.
        </p>
      </div>
    );
  }

  // 4. Tải các câu hỏi của bộ câu hỏi thuộc thế giới
  let questions: any[] = [];
  if (session.set_id) {
    const { data: qList } = await supabase
      .from("questions")
      .select("id, type, content, points")
      .eq("set_id", session.set_id)
      .order("position", { ascending: true });
    questions = qList || [];
  }

  // 5. Tải bảng xếp hạng top 20
  const { data: leaderboard } = await supabase
    .from("session_players")
    .select("id, nickname, score, gold")
    .eq("session_id", id)
    .eq("banned", false)
    .order("score", { ascending: false })
    .limit(20);

  return (
    <WorldClient
      sessionId={session.id}
      worldTitle={session.title}
      initialPlayer={player}
      questions={questions}
      leaderboard={leaderboard || []}
    />
  );
}

