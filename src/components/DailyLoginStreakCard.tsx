"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, Gift, Loader2, Coins, CalendarDays, Lock } from "lucide-react";
import { claimDailyLoginReward } from "@/app/dashboard/actions";
import { DAILY_REWARDS_CONFIG } from "@/lib/daily-rewards-config";
import { useLanguage } from "@/lib/i18n/useLanguage";

interface DailyLoginStreakCardProps {
  initialStreakData: {
    streakCount: number;
    lastClaimDate: string | null;
    claimedDays: number[];
  };
}

export function DailyLoginStreakCard({ initialStreakData }: DailyLoginStreakCardProps) {
  const { t, isEn } = useLanguage();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
            <Gift className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {t.dashboard.dailyStreakTitle}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                {isEn ? `Streak: ${streakData.streakCount}/7 days` : `Chuỗi: ${streakData.streakCount}/7 ngày`}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.dashboard.dailyStreakSubtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isAlreadyClaimedToday || isClaiming}
          onClick={handleClaim}
          className={`px-5 py-2.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 ${
            isAlreadyClaimedToday
              ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700/80"
              : "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/25 active:scale-95 animate-pulse"
          }`}
        >
          {isClaiming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isAlreadyClaimedToday ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? "CLAIMED TODAY" : "ĐÃ NHẬN HÔM NAY"}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? "CLAIM REWARD" : "ĐIỂM DANH NHẬN QUÀ"}</span>
            </>
          )}
        </button>
      </div>

      {/* Thanh tiến độ chuỗi 7 ngày */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>{isEn ? "Weekly reward progress:" : "Tiến độ nhận quà tuần:"}</span>
          <span className="text-amber-300 font-bold">
            {isEn ? `${streakData.streakCount % 7}/7 milestones` : `${streakData.streakCount % 7}/7 mốc hoàn thành`}
          </span>
        </div>
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${Math.min(100, ((streakData.streakCount % 7) / 7) * 100)}%` }}
          />
        </div>
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
          const isDay7 = r.day === 7;

          return (
            <div
              key={r.day}
              className={`relative p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                isClaimed
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                  : isTodayTarget
                  ? "bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/15 ring-2 ring-amber-400/50 scale-[1.02]"
                  : isDay7
                  ? "bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/40 text-slate-300"
                  : "bg-slate-900/60 border-slate-800/80 text-slate-400"
              }`}
            >
              {isDay7 && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-mono font-black uppercase tracking-wider shadow-sm">
                  {isEn ? "VIP CHEST" : "RƯƠNG VIP"}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {t.common.day} {r.day}
                  </span>
                  {isClaimed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isTodayTarget ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>

                <div className={`text-3xl my-1.5 text-center transition-transform ${isTodayTarget ? "scale-110" : ""}`}>
                  {r.icon}
                </div>

                <p className="text-xs font-bold text-white text-center line-clamp-1 mb-0.5">
                  +{r.coins} {t.common.gold}
                </p>
                <p className="text-[10px] text-slate-400 text-center font-mono line-clamp-1">
                  +{r.fireflies} {t.common.fireflies}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-center">
                {isClaimed ? (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                    ✓ {t.dashboard.streakClaimed}
                  </span>
                ) : isTodayTarget ? (
                  <span className="text-[10px] font-mono font-black text-amber-300 animate-pulse uppercase">
                    {isEn ? "Claim!" : "Nhận ngay!"}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">
                    {t.dashboard.streakLocked}
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

