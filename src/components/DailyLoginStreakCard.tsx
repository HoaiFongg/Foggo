"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, Gift, Loader2, Coins, CalendarDays, Lock } from "lucide-react";
import { claimDailyLoginReward } from "@/app/dashboard/actions";
import { DAILY_REWARDS_CONFIG } from "@/lib/daily-rewards-config";

interface DailyLoginStreakCardProps {
  initialStreakData: {
    streakCount: number;
    lastClaimDate: string | null;
    claimedDays: number[];
  };
}

export function DailyLoginStreakCard({ initialStreakData }: DailyLoginStreakCardProps) {
  const [streakData, setStreakData] = useState(initialStreakData);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimNotice, setClaimNotice] = useState<string | null>(null);

  // Tính ngày hiện tại theo GMT+7
  const todayStr = new Date(Date.now() + 7 * 3600 * 1000).toISOString().split("T")[0];
  const isAlreadyClaimedToday = streakData.lastClaimDate === todayStr;

  // Tính ngày sẵn sàng nhận hôm nay
  let readyDay = (streakData.streakCount % 7) + 1;
  if (isAlreadyClaimedToday) {
    readyDay = streakData.streakCount;
  }

  const handleClaim = async () => {
    if (isAlreadyClaimedToday || isClaiming) return;
    setIsClaiming(true);
    setClaimNotice(null);

    const res = await claimDailyLoginReward();
    setIsClaiming(false);

    if (res.success && res.streakData) {
      setStreakData(res.streakData);
      setClaimNotice(res.message);
    } else {
      alert(res.error || "Có lỗi xảy ra khi điểm danh");
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/25 border border-slate-800 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Gift className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Điểm Danh 7 Ngày Liên Tiếp Nhận Quà
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono text-[10px] font-bold">
                Chuỗi: {streakData.streakCount}/7 ngày
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Đăng nhập mỗi ngày để nhận Vàng, Đom Đóm và trang bị xịn cho nhân vật!
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isAlreadyClaimedToday || isClaiming}
          onClick={handleClaim}
          className={`px-5 py-2.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
            isAlreadyClaimedToday
              ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
              : "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20 active:scale-95"
          }`}
        >
          {isClaiming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isAlreadyClaimedToday ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Đã Nhận Hôm Nay</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Điểm Danh Nhận Quà</span>
            </>
          )}
        </button>
      </div>

      {claimNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{claimNotice}</span>
        </div>
      )}

      {/* Lưới 7 Ngày Nhận Quà (Co dãn mượt mà trên desktop & tablet) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {DAILY_REWARDS_CONFIG.map((r) => {
          const isClaimed = streakData.claimedDays?.includes(r.day);
          const isTodayTarget = !isAlreadyClaimedToday && r.day === readyDay;
          const isLocked = !isClaimed && !isTodayTarget;

          return (
            <div
              key={r.day}
              className={`relative p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                isClaimed
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                  : isTodayTarget
                  ? "bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/40"
                  : "bg-slate-900/60 border-slate-800/80 text-slate-400"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Ngày {r.day}
                  </span>
                  {isClaimed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isTodayTarget ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>

                <div className="text-3xl my-1.5 text-center">{r.icon}</div>

                <p className="text-xs font-bold text-white text-center line-clamp-1 mb-1">
                  +{r.coins} Vàng
                </p>
                <p className="text-[10px] text-slate-400 text-center font-mono line-clamp-1">
                  +{r.fireflies} Đom Đóm
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-center">
                {isClaimed ? (
                  <span className="text-[10px] font-mono font-semibold text-emerald-400">
                    ✓ Đã nhận
                  </span>
                ) : isTodayTarget ? (
                  <span className="text-[10px] font-mono font-bold text-amber-300 animate-pulse">
                    Sẵn sàng!
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">
                    Chờ ngày
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

