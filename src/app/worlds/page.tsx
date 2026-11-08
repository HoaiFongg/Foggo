import Link from "next/link";
import { ArrowLeft, Compass, Flame, Play, Trophy, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOptionalUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function WorldsPage() {
  const { user } = await getOptionalUser();
  const supabase = await createClient();

  let myWorlds: any[] = [];

  if (user) {
    // Lấy các thế giới mà user này đã tham gia
    const { data: players } = await supabase
      .from("session_players")
      .select("*, game_sessions(*)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    myWorlds = (players || []).map((p) => ({
      playerId: p.id,
      score: p.score,
      gold: p.gold,
      hp: p.state?.hp ?? 100,
      session: p.game_sessions,
    }));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
            <Flame className="w-4 h-4 animate-pulse" />
            <span>THẾ GIỚI CỦA BẠN</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white font-sans flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-amber-400" />
            <span>Các Thế Giới Sinh Tồn Đã Tham Gia</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Nhân vật và hòn đảo của bạn được lưu trữ liên tục. Bạn có thể vào chơi bất cứ lúc nào!
          </p>
        </div>

        {myWorlds.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Chưa tham gia thế giới nào</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Bạn có thể xin giáo viên gửi link thế giới của lớp, hoặc mở thế giới riêng nếu bạn là giáo viên!
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
            >
              <span>Về trang chính</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myWorlds.map((w) => {
              const session = w.session;
              if (!session) return null;

              return (
                <div
                  key={w.playerId}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 transition-all shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {session.status === "open" ? "Đang mở" : "Đã đóng"}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {session.mode === "survival" ? "Sinh tồn" : "Yên bình"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">
                      {session.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-4">
                      <span>Máu: <strong className="text-rose-400">{w.hp} HP</strong></span>
                      <span>·</span>
                      <span>Xu: <strong className="text-amber-400">{w.gold}</strong></span>
                      <span>·</span>
                      <span>Điểm: <strong className="text-emerald-400">{w.score}</strong></span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <Link
                      href={`/world/${session.id}`}
                      className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Tiếp tục cuộc hành trình trên Đảo</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

