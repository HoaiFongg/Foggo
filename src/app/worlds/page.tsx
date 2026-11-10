import { createClient } from "@/lib/supabase/server";
import { getOptionalUser } from "@/lib/auth";
import { NavigationHeader } from "@/components/NavigationHeader";
import { WorldsClient } from "./WorldsClient";

export const dynamic = "force-dynamic";

export default async function WorldsPage() {
  const { user, profile } = await getOptionalUser();
  const supabase = await createClient();

  const role = profile?.role || "student";
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isTeacherOrAdmin = isAdmin || isTeacher;

  let myManagedWorlds: any[] = [];
  let allSystemWorlds: any[] = [];
  let joinedWorlds: any[] = [];

  if (user) {
    if (isTeacherOrAdmin) {
      const { data: hosted } = await supabase
        .from("game_sessions")
        .select("*, session_players(count), question_sets(title)")
        .eq("host_id", user.id)
        .order("created_at", { ascending: false });

      myManagedWorlds = hosted || [];
    }

    if (isAdmin) {
      const { data: allSessions } = await supabase
        .from("game_sessions")
        .select("*, session_players(count), question_sets(title), profiles:host_id(display_name)")
        .neq("host_id", user.id)
        .order("created_at", { ascending: false });

      allSystemWorlds = allSessions || [];
    }

    const { data: players } = await supabase
      .from("session_players")
      .select("*, game_sessions(*)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    joinedWorlds = (players || []).map((p) => ({
      playerId: p.id,
      score: p.score,
      gold: p.gold,
      hp: p.state?.hp ?? 100,
      session: p.game_sessions,
    }));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavigationHeader profile={profile} activeItem="worlds" />

      {/* Main Container - Dàn trải đều toàn màn hình */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8">
        <WorldsClient
          myManagedWorlds={myManagedWorlds}
          allSystemWorlds={allSystemWorlds}
          joinedWorlds={joinedWorlds}
          isAdmin={isAdmin}
          isTeacherOrAdmin={isTeacherOrAdmin}
        />
      </main>
    </div>
  );
}
