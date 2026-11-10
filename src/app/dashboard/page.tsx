import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NavigationHeader } from "@/components/NavigationHeader";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user, profile } = await getOptionalUser();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !user) {
    redirect("/login");
  }

  const role = profile?.role || "student";
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isTeacherOrAdmin = isAdmin || isTeacher;
  const displayName =
    profile?.display_name || user?.user_metadata?.display_name || "Nhà Thám Hiểm";

  const supabase = await createClient();

  // Dành riêng cho Giáo viên & Admin: Tải hầm ngục và bộ đề gần nhất
  let recentWorlds: any[] = [];
  let recentSets: any[] = [];
  if (user && isTeacherOrAdmin) {
    const { data: worlds } = await supabase
      .from("game_sessions")
      .select("id, title, status, mode, created_at, session_players(count)")
      .eq("host_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);
    recentWorlds = worlds || [];

    const { data: sets } = await supabase
      .from("question_sets")
      .select("id, title, subject, play_count, questions(count)")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(3);
    recentSets = sets || [];
  }

  // Dành riêng cho Học sinh: Tải Trường, Lớp, Hầm ngục đang mở, Phiên solo farm và Trang bị
  let studentSchoolName = "";
  let studentClassName = "";
  let openClassWorld: any = null;
  let mySoloFarmSession: any = null;
  let myRecentPlayedWorlds: any[] = [];
  let totalScore = 0;
  let currentGold = 0;
  let currentHp = 100;
  let equipped: any = {
    weapon: null,
    helmet: null,
    armor: null,
    shield: null,
  };

  if (user && !isTeacherOrAdmin) {
    // 1. Lấy thông tin Trường & Lớp
    if (profile?.school_id) {
      const { data: s } = await supabase
        .from("schools")
        .select("name")
        .eq("id", profile.school_id)
        .maybeSingle();
      if (s) studentSchoolName = s.name;
    }
    if (profile?.class_id) {
      const { data: c } = await supabase
        .from("classes")
        .select("name")
        .eq("id", profile.class_id)
        .maybeSingle();
      if (c) studentClassName = c.name;
    }

    // 2. Lấy danh sách các thế giới đã tham gia
    const { data: playerSessions } = await supabase
      .from("session_players")
      .select("*, game_sessions(*)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (playerSessions && playerSessions.length > 0) {
      myRecentPlayedWorlds = playerSessions.slice(0, 5);

      // Tìm phòng lớp đang mở
      const classOpen = playerSessions.find(
        (p) =>
          p.game_sessions &&
          p.game_sessions.status === "open" &&
          p.game_sessions.kind !== "solo"
      );
      if (classOpen) {
        openClassWorld = classOpen.game_sessions;
      }

      // Tìm phiên solo farm mở gần nhất
      const soloOpen = playerSessions.find(
        (p) =>
          p.game_sessions &&
          p.game_sessions.status === "open" &&
          p.game_sessions.kind === "solo"
      );
      if (soloOpen) {
        mySoloFarmSession = soloOpen;
      }

      // Lấy trang bị và chỉ số từ phiên mới nhất
      const latestPlayer = mySoloFarmSession || playerSessions[0];
      if (latestPlayer) {
        currentGold = latestPlayer.gold ?? 0;
        totalScore = latestPlayer.score ?? 0;
        const state = latestPlayer.state || {};
        currentHp = state.hp ?? 100;
        if (state.equipped) {
          equipped = {
            weapon: state.equipped.weapon || null,
            helmet: state.equipped.helmet || null,
            armor: state.equipped.armor || null,
            shield: state.equipped.shield || null,
          };
        }
      }
    }
  }

  // Tính tổng chỉ số phòng thủ từ trang bị hiện có
  const helmetDef = equipped.helmet?.defense ?? 0;
  const armorDef = equipped.armor?.defense ?? 0;
  const shieldDef = equipped.shield?.defense ?? 0;
  const totalDefensePercent = Math.min(60, Math.round((helmetDef + armorDef + shieldDef) * 100));
  const weaponAtk = equipped.weapon?.atk ?? 25; // Kiếm Gỗ mặc định Atk 25

  // Dữ liệu điểm danh đăng nhập 7 ngày
  const streakData = user?.user_metadata?.daily_streak || {
    streakCount: 0,
    lastClaimDate: null,
    claimedDays: [],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavigationHeader profile={profile} activeItem="dashboard" />
      <DashboardClient
        user={user}
        profile={profile}
        role={role}
        isAdmin={isAdmin}
        isTeacher={isTeacher}
        isTeacherOrAdmin={isTeacherOrAdmin}
        displayName={displayName}
        recentWorlds={recentWorlds}
        recentSets={recentSets}
        studentSchoolName={studentSchoolName}
        studentClassName={studentClassName}
        openClassWorld={openClassWorld}
        mySoloFarmSession={mySoloFarmSession}
        myRecentPlayedWorlds={myRecentPlayedWorlds}
        totalScore={totalScore}
        currentGold={currentGold}
        currentHp={currentHp}
        equipped={equipped}
        totalDefensePercent={totalDefensePercent}
        weaponAtk={weaponAtk}
        streakData={streakData}
      />
    </div>
  );
}