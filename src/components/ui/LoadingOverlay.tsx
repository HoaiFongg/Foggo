import { Flame, Sparkles } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
  subMessage?: string;
  compact?: boolean;
}

export function LoadingOverlay({
  message = "Đang thắp sáng đèn lồng, chờ tí nhé...",
  subMessage = "Đang xử lý dữ liệu và đồng bộ thế giới sinh tồn",
  compact = false,
}: LoadingOverlayProps) {
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-2.5 py-3 px-4 bg-slate-900/90 border border-amber-500/30 rounded-2xl text-amber-300 font-mono text-xs shadow-xl backdrop-blur-md">
        <Flame className="w-4 h-4 text-amber-400 animate-spin" />
        <span className="font-semibold">{message}</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md text-slate-100 select-none animate-in fade-in duration-200">
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-sm px-6 p-8 bg-slate-900/90 border border-amber-500/30 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.2)]">
        {/* Đèn lồng phát sáng */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.3)] animate-bounce">
            <Flame className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-spin">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        {/* Nội dung thông báo */}
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-white font-mono flex items-center justify-center gap-2">
            {message}
          </h4>
          {subMessage && (
            <p className="text-xs text-slate-400 leading-relaxed">
              {subMessage}
            </p>
          )}
        </div>

        {/* Thanh loading tia sáng mini */}
        <div className="w-40 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400 rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
