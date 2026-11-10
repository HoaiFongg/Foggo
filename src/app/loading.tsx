import { Flame, Sparkles } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md text-slate-100 select-none">
      {/* Tia laser chạy trên đỉnh */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-loading-bar" />
      </div>

      {/* Quầng sáng sương mù ấm áp */}
      <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Hộp nội dung chính giữa */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm px-6">
        {/* Đèn lồng pixel tỏa sáng */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-bounce">
            <Flame className="w-10 h-10 animate-pulse text-amber-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-spin">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tiêu đề & Thông điệp */}
        <div className="space-y-2">
          <div className="text-2xl font-black tracking-tight text-white font-mono">
            FOG<span className="text-amber-400">GO</span>
          </div>
          <p className="text-sm font-medium text-amber-300/90 font-mono flex items-center justify-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Đang thắp sáng đèn lồng, chờ tí nhé...
          </p>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            Xua tan màn sương tri thức và chuẩn bị thế giới sinh tồn cho bạn.
          </p>
        </div>

        {/* Thanh tiến trình giả lập pixel mini */}
        <div className="w-48 h-2 bg-slate-900 rounded-full border border-slate-800 overflow-hidden p-0.5">
          <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
