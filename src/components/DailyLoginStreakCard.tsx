"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Gift,
  Loader2,
  Coins,
  Lock,
} from "lucide-react";
import { claimDailyLoginReward } from "@/app/dashboard/actions";
import { DAILY_REWARDS_CONFIG } from "@/lib/daily-rewards-config";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { PixelItemIcon } from "@/components/PixelItemIcon";

interface DailyLoginStreakCardProps {
  initialStreakData: {
    streakCount: number;
    lastClaimDate: string | null;
    claimedDays: number[];
  };
}

// Map each day to a pixel art RPG item reward
function getDayPixelReward(day: number) {
  switch (day) {
    case 1:
      return { itemId: "apple", label: "Táo Rừng", labelEn: "Forest Apple" };
    case 2:
      return { itemId: "small_healing_potion", label: "Bình Máu", labelEn: "Healing Potion" };
    case 3:
      return { itemId: "bandage", label: "Băng Gạc", labelEn: "Bandage" };
    case 4:
      return { itemId: "iron_shield", label: "Khiên Sắt", labelEn: "Iron Shield" };
    case 5:
      return { itemId: "cooked_meat", label: "Thịt Nướng", labelEn: "Cooked Meat" };
    case 6:
      return { itemId: "iron_sword", label: "Kiếm Sắt", labelEn: "Iron Sword" };
    case 7:
    default:
      return { itemId: "crystal_sword", label: "Kiếm Pha Lê", labelEn: "Crystal Sword" };
  }
}

export function DailyLoginStreakCard({ initialStreakData }: DailyLoginStreakCardProps) {
  const { t, isEn } = useLanguage();
  const [streakData, setStreakData] = useState(initialStreakData);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimNotice, setClaimNotice] = useState<string | null>(null);

  // Tính ngày hiện tại theo GMT+7
  const todayStr = new Date(Date.now() + 7 * 3600 * 1000).toISOString().split("T")[0];
  const isAlreadyClaimedToday = streakData.lastClaimDate === todayStr;

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

  const progressPercent = Math.min(100, ((streakData.streakCount % 7) / 7) * 100);

  return (
    <div className="pixel-panel rounded-2xl p-6 sm:p-7 shadow-lg space-y-6 bg-white/95 dark:bg-slate-900/95">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl pixel-panel bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-sm shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                {t.dashboard.dailyStreakTitle}
              </h3>
              <span className="px-2.5 py-0.5 rounded-none pixel-panel-amber text-amber-700 dark:text-amber-300 font-pixel text-[10px] font-bold">
                [ {isEn ? `${streakData.streakCount}/7 DAYS` : `${streakData.streakCount}/7 NGÀY`} ]
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
              {t.dashboard.dailyStreakSubtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isAlreadyClaimedToday || isClaiming}
          onClick={handleClaim}
          className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer shrink-0 ${
            isAlreadyClaimedToday
              ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border-2 border-slate-300 dark:border-slate-700"
              : "pixel-btn-amber shadow-md"
          }`}
        >
          {isClaiming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isAlreadyClaimedToday ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{isEn ? "Claimed Today" : "Đã nhận hôm nay"}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? "Claim Reward" : "Điểm danh nhận quà"}</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span>{isEn ? "Weekly Milestone:" : "Tiến độ tuần:"}</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold">
            {streakData.streakCount % 7}/7
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-950 h-2.5 rounded-none border-2 border-slate-300 dark:border-slate-800 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {claimNotice && (
        <div className="p-3.5 rounded-xl pixel-panel bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 font-mono">
          <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{claimNotice}</span>
        </div>
      )}

      {/* 7 Days Grid: Retro Pixel Inventory Reward Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {DAILY_REWARDS_CONFIG.map((r) => {
          const isClaimed = streakData.claimedDays?.includes(r.day);
          const isTodayTarget = !isAlreadyClaimedToday && r.day === readyDay;
          const isDay7 = r.day === 7;
          const reward = getDayPixelReward(r.day);

          return (
            <div
              key={r.day}
              className={`relative p-3 rounded-xl border-2 flex flex-col justify-between transition-all duration-150 ${
                isClaimed
                  ? "bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-800 dark:text-emerald-200 shadow-sm"
                  : isTodayTarget
                  ? "pixel-panel-amber bg-amber-500/10 dark:bg-amber-950/30 border-amber-500 shadow-md scale-[1.03]"
                  : isDay7
                  ? "pixel-panel bg-gradient-to-b from-amber-500/15 to-transparent border-amber-500/40 text-slate-800 dark:text-slate-300"
                  : "pixel-panel bg-black/[0.02] dark:bg-white/[0.03] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {isDay7 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-pixel font-black shadow-sm border border-amber-700">
                  VIP
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                    {t.common.day} {r.day}
                  </span>
                  {isClaimed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : isTodayTarget ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ) : (
                    <Lock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                  )}
                </div>

                {/* Pixel Art Item Slot */}
                <div className="my-1.5 flex justify-center">
                  <div className={`w-12 h-12 rounded-lg pixel-panel bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-inner ${isTodayTarget ? "scale-105 border-amber-500" : ""}`}>
                    <PixelItemIcon itemId={reward.itemId} size={28} />
                  </div>
                </div>

                <p className="text-[11px] font-bold font-mono text-slate-900 dark:text-white text-center line-clamp-1 mb-0.5">
                  +{r.coins} {t.common.gold}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center font-mono line-clamp-1">
                  +{r.fireflies} {t.common.fireflies}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-center">
                {isClaimed ? (
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                    ✓ {t.dashboard.streakClaimed}
                  </span>
                ) : isTodayTarget ? (
                  <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                    {isEn ? "Claim!" : "Nhận ngay!"}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
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
