import { Swords, Flame, Sparkles } from "lucide-react";

export default function WorldLoading() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between p-3 sm:p-4 select-none">
      {/* Tia laser chạy trên đỉnh */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900 overflow-hidden z-50">
        <div className="h-full w-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-loading-bar" />
      </div>

      {/* 1. Header Bar Skeleton */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800/80 rounded-2xl px-3.5 py-2 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="w-28 h-3.5 bg-slate-800 rounded animate-pulse" />
            <div className="w-16 h-2.5 bg-slate-800/60 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-7 bg-slate-800/80 rounded-xl border border-slate-700/50 animate-pulse" />
          <div className="w-16 h-7 bg-amber-500/10 rounded-xl border border-amber-500/20 animate-pulse" />
        </div>
      </div>

      {/* 2. Sân Đấu Sinh Tồn & Quái Vật (Battle Arena Loading Center) */}
      <div className="flex-1 flex flex-col items-center justify-center my-3 relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 text-center">
        {/* Quầng sáng */}
        <div className="absolute w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute w-60 h-60 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.25)] animate-bounce">
            <Swords className="w-8 h-8 animate-pulse text-rose-400" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              Đang vào Hầm Ngục Sinh Tồn...
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Đang triệu hồi quái vật ngẫu nhiên và chuẩn bị các thử thách câu hỏi của trường lớp.
            </p>
          </div>

          {/* Thanh loading mini */}
          <div className="w-40 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full animate-loading-bar" />
          </div>
        </div>
      </div>

      {/* 3. Bảng Câu Hỏi Skeleton */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shrink-0 space-y-3">
        <div className="w-3/4 h-5 bg-slate-800 rounded-lg mx-auto animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="h-11 bg-slate-800/60 rounded-xl border border-slate-800 animate-pulse" />
          <div className="h-11 bg-slate-800/60 rounded-xl border border-slate-800 animate-pulse" />
          <div className="h-11 bg-slate-800/60 rounded-xl border border-slate-800 animate-pulse" />
          <div className="h-11 bg-slate-800/60 rounded-xl border border-slate-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
