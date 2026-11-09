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

