import { Compass, Sparkles, Flame } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Tia laser chạy trên đỉnh */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900 overflow-hidden z-50">
        <div className="h-full w-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-loading-bar" />
      </div>

      {/* Header Skeleton */}
      <div className="border-b border-slate-800/80 bg-slate-950/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div className="w-24 h-5 bg-slate-800 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-8 bg-slate-800 rounded-xl animate-pulse" />
            <div className="w-10 h-10 bg-slate-800 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Nội dung chính Skeleton */}
      <main className="max-w-6xl mx-auto w-full px-4 py-8 space-y-6 flex-1">
        {/* Banner thông báo bé slime đang tải */}
        <div className="flex items-center justify-center gap-2.5 py-2.5 px-4 text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl shadow-sm">
          <div className="w-5 h-5 shrink-0 pixelated animate-bounce">
            <img src="/sprites/slime_idle_1_clean.png" alt="Slime" className="w-full h-full object-contain pixelated" />
          </div>
          <span className="font-semibold">Bé Slime đang chuẩn bị kho báu và hành trình hôm nay cho bạn nè... ✨</span>
        </div>

        {/* Card hồ sơ người dùng skeleton */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 animate-pulse" />
              <div className="space-y-2">
                <div className="w-44 h-6 bg-slate-800 rounded animate-pulse" />
                <div className="w-28 h-4 bg-slate-800/60 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-12 bg-slate-800/80 rounded-2xl border border-slate-800 animate-pulse" />
              <div className="w-24 h-12 bg-slate-800/80 rounded-2xl border border-slate-800 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Card 7 ngày nhận quà skeleton (7 ô) */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 space-y-3">
          <div className="w-40 h-5 bg-slate-800 rounded animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>

        {/* 2 Nút chơi lớn skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-slate-900/80 border border-slate-800 rounded-3xl animate-pulse" />
          <div className="h-40 bg-slate-900/80 border border-slate-800 rounded-3xl animate-pulse" />
        </div>
      </main>
    </div>
  );
}

