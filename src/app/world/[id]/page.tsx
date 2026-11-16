import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

  // Tự động đóng hầm ngục sau 1 ngày (24 giờ) hoạt động theo quy định
  const nowMs = Date.now();
  const createdAtMs = new Date(session.created_at).getTime();
  const endsAtMs = session.ends_at
    ? new Date(session.ends_at).getTime()
    : createdAtMs + 24 * 60 * 60 * 1000;
  const isExpired =
    session.kind !== "solo" &&
    (nowMs >= endsAtMs || nowMs - createdAtMs >= 24 * 60 * 60 * 1000);

  if (isExpired && session.status === "open") {
    const adminClient = createAdminClient();
    await adminClient.from("game_sessions").update({ status: "closed" }).eq("id", id);
    session.status = "closed";
  }

  if (session.status === "closed" && session.kind !== "solo") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 text-center">
        <div className="max-w-md w-full bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-white font-mono uppercase tracking-wide">
            HẦM NGỤC ĐÃ ĐÓNG CỬA
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Hầm ngục này đã tự động đóng lại sau 1 ngày (24 giờ) hoạt động theo quy định. Bạn hãy liên hệ giáo viên để mở đợt thử thách mới nhé!
          </p>
          <a
            href="/worlds"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs uppercase transition-all shadow-md cursor-pointer"
          >
            Quay lại Danh sách Thế giới
          </a>
        </div>
      </div>
    );
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

  // 3.1. Đảm bảo an toàn sinh tồn cho nhân vật (tránh trường hợp session cũ bị kẹt ngày hoặc ngất)
  const nowSec = Math.floor(Date.now() / 1000);
  const rawState = player.state && typeof player.state === "object" ? player.state : {};
  if (
    (rawState.playSec && rawState.playSec > 480) ||
    (rawState.hp !== undefined && rawState.hp <= 0) ||
    !rawState.lastTickTimestamp
  ) {
    const safeState = {
      ...rawState,
      playSec: Math.min(rawState.playSec || 0, 480),
      hp: Math.max(rawState.hp || 0, 100),
      hunger: Math.max(rawState.hunger || 0, 100),
      lastTickTimestamp: nowSec,
    };
    player.state = safeState;
    player.hp = safeState.hp;
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

  // 4. Tải các câu hỏi của bộ câu hỏi thuộc thế giới (hoặc lấy ngẫu nhiên từ lớp & trường của học sinh)
  let questions: any[] = [];
  const adminClient = createAdminClient();

  // A. Nếu thế giới có set_id cụ thể (hầm ngục do giáo viên mở có gắn bộ đề)
  if (session.set_id) {
    const { data: qList } = await adminClient
      .from("questions")
      .select("id, type, content, points")
      .eq("set_id", session.set_id)
      .order("position", { ascending: true });
    questions = qList || [];
  }

  // B. Nếu chưa có câu hỏi (bãi solo farm hoặc bộ đề trống): Lấy ngẫu nhiên câu hỏi của LỚP và TRƯỜNG học sinh đang theo học
  if (questions.length === 0) {
    // 1. Tìm thông tin trường và lớp của học sinh
    const { data: userProfile } = await adminClient
      .from("profiles")
      .select("id, school_id, class_id")
      .eq("id", user.id)
      .maybeSingle();

    const teacherIds: string[] = [];

    // Tìm giáo viên phụ trách lớp của học sinh
    if (userProfile?.class_id) {
      const { data: classRow } = await adminClient
        .from("classes")
        .select("teacher_id")
        .eq("id", userProfile.class_id)
        .maybeSingle();
      if (classRow?.teacher_id) {
        teacherIds.push(classRow.teacher_id);
      }
    }

    // Tìm các giáo viên trong trường của học sinh
    if (userProfile?.school_id) {
      const { data: schoolTeachers } = await adminClient
        .from("profiles")
        .select("id")
        .eq("school_id", userProfile.school_id)
        .in("role", ["teacher", "admin"]);
      if (schoolTeachers && schoolTeachers.length > 0) {
        schoolTeachers.forEach((t) => {
          if (!teacherIds.includes(t.id)) teacherIds.push(t.id);
        });
      }
    }

    // Tìm các bộ đề thuộc các giáo viên này
    if (teacherIds.length > 0) {
      const { data: schoolSets } = await adminClient
        .from("question_sets")
        .select("id")
        .in("owner_id", teacherIds);

      if (schoolSets && schoolSets.length > 0) {
        const setIds = schoolSets.map((s) => s.id);
        const { data: schoolQList } = await adminClient
          .from("questions")
          .select("id, type, content, points")
          .in("set_id", setIds)
          .limit(100);
        if (schoolQList && schoolQList.length > 0) {
          questions = schoolQList;
        }
      }
    }

    // C. Dự phòng: Nếu trường/lớp chưa có câu hỏi, lấy ngẫu nhiên từ kho câu hỏi công khai của hệ thống
    if (questions.length === 0) {
      const { data: fallbackQList } = await adminClient
        .from("questions")
        .select("id, type, content, points")
        .limit(100);
      questions = fallbackQList || [];
    }
  }

  // Xáo trộn ngẫu nhiên thứ tự câu hỏi để mỗi lần farm quái là một trải nghiệm mới
  if (questions.length > 1) {
    questions = [...questions].sort(() => Math.random() - 0.5);
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

