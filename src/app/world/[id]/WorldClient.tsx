"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Flame,
  Heart,
  Coins,
  Trophy,
  Swords,
  Shield,
  ShieldAlert,
  Backpack,
  SunMedium,
  Moon,
  Sparkles,
  ShoppingBag,
  Crown,
  Utensils,
  AlertCircle,
  Lock,
  Home,
  Trees,
  X,
  CheckCircle2,
  Check,
  XCircle,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { MonsterBestiaryModal } from "@/components/MonsterBestiaryModal";
import { getQuestionType } from "@/question-types/registry";
import { getSurvivalClock } from "@/game-modes/survival/clock";
import { getItemDef, ITEM_REGISTRY } from "@/game-modes/survival/items";
import { getScaledMonster } from "@/game-modes/survival/monsters";
import { submitSurvivalAction, performSurvivalItemAction, emergencyHealOrRevive } from "./actions";
import { MonsterBattleArena } from "./MonsterBattleArena";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { localizeItemDef, localizeMonsterDef, localizeWorldTitle } from "@/lib/i18n/game-translations";
import { localizeQuestion } from "@/lib/i18n/questions-translation";
import { PixelHero } from "@/components/PixelHero";
import { PixelItemIcon } from "@/components/PixelItemIcon";
import type { SurvivalPlayerState } from "@/game-modes/survival/engine";

interface WorldClientProps {
  sessionId: string;
  worldTitle: string;
  initialPlayer: {
    id: string;
    nickname: string;
    score: number;
    gold: number;
    state: any;
  };
  questions: Array<{
    id: string;
    type: string;
    content: any;
    points: number;
  }>;
  leaderboard: Array<{
    id: string;
    nickname: string;
    score: number;
    gold: number;
  }>;
}

export function WorldClient({
  sessionId,
  worldTitle,
  initialPlayer,
  questions,
  leaderboard: initialLeaderboard,
}: WorldClientProps) {
  const { t, language, isEn } = useLanguage();

  // Tabs: hunt | blacksmith | backpack | leaderboard
  const [activeTab, setActiveTab] = useState<
    "hunt" | "blacksmith" | "backpack" | "leaderboard"
  >("hunt");

  // Bộ lọc cửa hàng / Thợ rèn
  const [shopTab, setShopTab] = useState<"all" | "weapons" | "defense" | "consumables">("all");
  const [showBestiary, setShowBestiary] = useState(false);

  // State người chơi - Đảm bảo luôn khởi tạo an toàn, không bao giờ crash nếu DB cũ thiếu trường
  const [playerState, setPlayerState] = useState<SurvivalPlayerState>(() => {
    const raw =
      initialPlayer.state && typeof initialPlayer.state === "object" ? initialPlayer.state : {};
    const safeCoins = Number.isFinite(raw.coins)
      ? raw.coins
      : (Number.isFinite(initialPlayer.gold) ? initialPlayer.gold : 30);
    const safeScore = Number.isFinite(raw.score)
      ? raw.score
      : (Number.isFinite(initialPlayer.score) ? initialPlayer.score : 0);
    const safeHp = Number.isFinite(raw.hp) && raw.hp > 0 ? raw.hp : 100;
    const safeMaxHp = Number.isFinite(raw.maxHp) && raw.maxHp > 0 ? raw.maxHp : 100;
    const safeHunger = Number.isFinite(raw.hunger) && raw.hunger > 0 ? raw.hunger : 100;
    const safeMaxHunger = Number.isFinite(raw.maxHunger) && raw.maxHunger > 0 ? raw.maxHunger : 100;
    const safePlaySec = Math.min(Math.max(0, raw.playSec ?? 0), 480);

    return {
      hp: safeHp,
      maxHp: safeMaxHp,
      hunger: safeHunger,
      maxHunger: safeMaxHunger,
      coins: safeCoins,
      score: safeScore,
      playSec: safePlaySec,
      lastTickTimestamp: raw.lastTickTimestamp ?? Math.floor(Date.now() / 1000),
      streak: raw.streak ?? 0,
      currentZone: raw.currentZone ?? "forest",
      fog: raw.fog ?? { forest: 100, cave: 100, swamp: 100 },
      revealedPoints: Array.isArray(raw.revealedPoints) ? raw.revealedPoints : [],
      camp: raw.camp ?? { level: 1, hp: 100, maxHp: 100, hasCampfire: false, barricades: 0 },
      equipped:
        raw.equipped && typeof raw.equipped === "object"
          ? raw.equipped
          : {
              weapon: { itemId: "wooden_club", durability: 35, enhancedLevel: 0 },
            },
      inventory: Array.isArray(raw.inventory)
        ? raw.inventory
        : [
            { slotIndex: 0, itemId: "wooden_club", qty: 1, durability: 35 },
            { slotIndex: 1, itemId: "apple", qty: 3 },
            { slotIndex: 2, itemId: "bandage", qty: 1 },
          ],
      monstersKilled: raw.monstersKilled ?? 0,
      bossesKilled: raw.bossesKilled ?? 0,
      deaths: raw.deaths ?? 0,
      nightWavesSurvived: raw.nightWavesSurvived ?? 0,
      currentBattle: raw.currentBattle ?? null,
    };
  });

  const handleUpdatePlayerState = (st: any) => {
    if (!st || typeof st !== "object") return;
    const coins = Number.isFinite(st.coins) ? st.coins : (Number.isFinite(st.gold) ? st.gold : 0);
    const score = Number.isFinite(st.score) ? st.score : 0;
    const hp = Number.isFinite(st.hp) ? st.hp : 0;
    const maxHp = Number.isFinite(st.maxHp) ? st.maxHp : 100;
    const hunger = Number.isFinite(st.hunger) ? st.hunger : 0;
    const maxHunger = Number.isFinite(st.maxHunger) ? st.maxHunger : 100;
    setPlayerState({
      ...st,
      coins,
      score,
      hp,
      maxHp,
      hunger,
      maxHunger,
    });
  };

  // Câu hỏi hiện tại
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal / Đấu trường câu hỏi
  const [activeAction, setActiveAction] = useState<{
    actionType: "hunt" | "gather" | "explore" | "craft" | "defend";
    targetId: string;
    targetName: string;
  } | null>(null);

  // Feedback sau khi trả lời
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    explanation?: string | null;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const clock = useMemo(
    () => getSurvivalClock(playerState.playSec),
    [playerState.playSec]
  );

  const question = questions[currentQIndex % Math.max(1, questions.length)];
  const typeDef = question ? getQuestionType(question.type) : null;
  const PlayerComponent = typeDef?.Player;

  // Bắt đầu một hành động
  function startAction(
    actionType: "hunt" | "gather" | "explore" | "craft" | "defend",
    targetId: string,
    targetName: string
  ) {
    if (playerState.hp <= 0) {
      alert("Bạn đang bị ngất xỉu! Hãy nhấn nút Hồi sinh ở thanh trạng thái.");
      return;
    }
    setActiveAction({ actionType, targetId, targetName });
    setUserAnswer(null);
    setFeedback(null);
  }

  // Nộp câu trả lời cho hành động
  async function handleSubmitAnswer() {
    if (userAnswer === null || !question || !activeAction) return;
    setSubmitting(true);

    const isHotspot = question.type === "hotspot";

    const res = await submitSurvivalAction({
      sessionId,
      actionType: activeAction.actionType,
      targetId: activeAction.targetId,
      questionId: question.id,
      answer: userAnswer,
      isHotspotCritical: isHotspot,
    });

    setSubmitting(false);

    if (!res || "error" in res) {
      alert(res?.error || "Có lỗi xảy ra khi nộp bài");
      return;
    }

    setFeedback({
      isCorrect: res.isCorrect,
      message: res.message,
      explanation: res.explanation,
    });

    if (res.state) {
      handleUpdatePlayerState(res.state);
    }

    // Chuyển sang câu hỏi tiếp theo cho lần sau
    setCurrentQIndex((prev) => prev + 1);
  }

  // Ăn / Tiêu dùng vật phẩm
  async function handleEatItem(itemId: string) {
    const res = await performSurvivalItemAction({
      sessionId,
      action: "eat",
      itemId,
    });
    if (res.state) {
      handleUpdatePlayerState(res.state);
      showToast(res.message);
    }
  }

  // Mặc / Đổi trang bị từ túi đồ
  async function handleEquipItem(slotIndex: number) {
    const res = await performSurvivalItemAction({
      sessionId,
      action: "equip",
      slotIndex,
    });
    if (res.state) {
      handleUpdatePlayerState(res.state);
      showToast(res.message);
    } else {
      alert(res.error || res.message);
    }
  }

  // Bán vật phẩm trong túi đồ đổi lấy Xu (Tối ưu phản hồi siêu tốc 0ms Optimistic UI)
  async function handleSellItem(slotIndex: number, e?: React.MouseEvent) {
    if (e) e.stopPropagation();

    const targetSlot = playerState.inventory?.find((s: any) => s.slotIndex === slotIndex);
    if (!targetSlot) return;

    const itemDef = ITEM_REGISTRY[targetSlot.itemId];
    const unitPrice = itemDef?.sellPrice && itemDef.sellPrice > 0 ? itemDef.sellPrice : 1;
    const countToSell = targetSlot.qty;
    const coinsEarned = unitPrice * countToSell;

    // Cập nhật lạc quan (Optimistic update) ngay lập tức
    const previousState = playerState;
    const optimisticInventory = playerState.inventory.filter((s: any) => s.slotIndex !== slotIndex);
    const optimisticState = {
      ...playerState,
      coins: (playerState.coins || 0) + coinsEarned,
      inventory: optimisticInventory,
    };
    handleUpdatePlayerState(optimisticState);
    showToast(
      isEn
        ? `Sold ${countToSell}x ${itemDef?.name || targetSlot.itemId} for +${coinsEarned} Coins!`
        : `Đã bán ${countToSell}x ${itemDef?.name || targetSlot.itemId} nhận +${coinsEarned} Xu!`
    );

    try {
      const res = await performSurvivalItemAction({
        sessionId,
        action: "sell_item",
        slotIndex,
      });
      if (res.state) {
        handleUpdatePlayerState(res.state);
      } else {
        handleUpdatePlayerState(previousState);
        alert(res.error || res.message);
      }
    } catch (err: any) {
      handleUpdatePlayerState(previousState);
      alert(err.message || "Lỗi khi bán đồ");
    }
  }

  // Mua đồ Thợ rèn
  async function handleBlacksmith(action: "buy_gear" | "repair" | "enhance", itemId: string) {
    const res = await performSurvivalItemAction({
      sessionId,
      action,
      itemId,
    });
    if (res.state) {
      handleUpdatePlayerState(res.state);
      showToast(res.message);
    } else {
      alert(res.error || res.message);
    }
  }

  // Tháo trang bị về túi đồ
  async function handleUnequipGear(gearSlot: "weapon" | "armor" | "helmet" | "shield") {
    if (!sessionId || !playerState?.equipped?.[gearSlot]) return;
    try {
      const res = await performSurvivalItemAction({
        sessionId,
        action: "unequip",
        gearSlot,
      });
      if (res.state) {
        handleUpdatePlayerState(res.state);
        showToast(
          isEn
            ? `Unequipped ${gearSlot} back into your backpack!`
            : `Đã tháo ${
                gearSlot === "weapon"
                  ? "vũ khí"
                  : gearSlot === "helmet"
                  ? "mũ"
                  : gearSlot === "armor"
                  ? "áo giáp"
                  : "khiên"
              } cất vào túi đồ!`
        );
      } else {
        alert(res.error || res.message);
      }
    } catch (err: any) {
      alert(err.message || (isEn ? "Failed to unequip" : "Lỗi khi tháo trang bị"));
    }
  }

  // Hồi sinh
  async function handleRevive() {
    const res = await performSurvivalItemAction({
      sessionId,
      action: "revive",
    });
    if (res.state) {
      handleUpdatePlayerState(res.state);
      showToast(isEn ? "Safely revived at camp!" : "Bạn đã hồi sinh an toàn tại Trại!");
    }
  }

  // Cấp cứu sinh lực tân thủ
  async function handleEmergencyHealClient(action: "use_inventory" | "buy_potion" | "free_camp", itemId?: string) {
    const res = await emergencyHealOrRevive({
      sessionId,
      action,
      itemId,
    });
    if (res.state) {
      handleUpdatePlayerState(res.state);
      showToast(res.message);
    } else {
      alert(res.error || res.message);
    }
  }

  function showToast(msg?: string | null) {
    if (!msg) return;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  const isDead = playerState.hp <= 0;

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-16">
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold font-mono text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 motion-reduce:animate-none">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Thanh trạng thái sinh tồn RPG (Apple Glass Nav) */}
      <header className="apple-glass-nav sticky top-0 z-40 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* NÚT TRỞ VỀ NẰM Ở GÓC BÊN TRÁI TRÊN CÙNG & THÔNG TIN THẾ GIỚI */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/dashboard"
              className="pixel-btn-neutral px-3 sm:px-3.5 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 font-mono text-xs font-bold flex items-center gap-1.5 border border-rose-500/40 hover:bg-rose-500/10 transition-all shadow-xs cursor-pointer"
              title={isEn ? "Return to Dashboard" : "Trở về Bảng điều khiển"}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="font-pixel text-[10px]">{isEn ? "RETURN" : "TRỞ VỀ"}</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowBestiary(true)}
              className="pixel-btn-amber px-2.5 sm:px-3 py-1.5 rounded-xl text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title={isEn ? "View Monster Codex (7 species)" : "Xem sổ tay quái vật (7 loài)"}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="font-pixel text-[10px] hidden sm:inline">{isEn ? "BESTIARY (7)" : "QUÁI VẬT (7)"}</span>
            </button>

            <div>
              <h1 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate max-w-[130px] sm:max-w-xs apple-headline">
                {localizeWorldTitle(worldTitle, language)}
              </h1>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  {clock.isDay ? (
                    <SunMedium className="w-3 h-3 text-amber-500" />
                  ) : (
                    <Moon className="w-3 h-3 text-indigo-500" />
                  )}
                  <span>{t.common.day} {clock.dayNumber} · {clock.formattedTime}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className={clock.isDay ? "text-amber-600 dark:text-amber-300" : "text-indigo-600 dark:text-indigo-300 font-bold"}>
                  {clock.isDay
                    ? (isEn ? `Night in ${clock.phaseRemainingSec}s` : `Đêm sau ${clock.phaseRemainingSec}s`)
                    : (isEn ? `Dawn in ${clock.phaseRemainingSec}s` : `Trời sáng sau ${clock.phaseRemainingSec}s`)}
                </span>
              </div>
            </div>
          </div>

          {/* Vitals: HP, Đói, Xu, Điểm & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Máu (HP) - Retro Pixel Box */}
            <div className="pixel-panel flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-rose-500/30 bg-rose-500/10">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
              <div className="w-16 sm:w-20 bg-slate-950 h-2 border border-slate-700 overflow-hidden shadow-inner">
                <div
                  className="bg-rose-500 h-full"
                  style={{ width: `${(playerState.hp / playerState.maxHp) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-300">
                {playerState.hp}
              </span>
            </div>

            {/* Đói (Hunger) - Retro Pixel Box */}
            <div className="pixel-panel flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-amber-500/30 bg-amber-500/10">
              <Utensils className="w-3.5 h-3.5 text-amber-500" />
              <div className="w-14 sm:w-16 bg-slate-950 h-2 border border-slate-700 overflow-hidden shadow-inner">
                <div
                  className={`h-full ${
                    playerState.hunger > 30 ? "bg-amber-500" : "bg-red-500 animate-pulse"
                  }`}
                  style={{ width: `${(playerState.hunger / playerState.maxHunger) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300">
                {playerState.hunger}
              </span>
            </div>

            {/* Xu - Retro Pixel Box */}
            <div className="pixel-panel-amber flex items-center gap-1.5 px-3 py-1 rounded-lg text-amber-700 dark:text-amber-300 text-xs font-mono font-bold bg-amber-500/10">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{Number.isFinite(playerState?.coins) ? playerState.coins : 0} {t.common.coins}</span>
            </div>

            {/* Điểm - Retro Pixel Box */}
            <div className="pixel-panel hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold bg-black/[0.03] dark:bg-slate-950/80">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{Number.isFinite(playerState?.score) ? playerState.score : 0}</span>
            </div>

            {/* Nút đổi ngôn ngữ tức thì */}
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* CẢNH BÁO NẾU ĐANG BỊ NGẤT XỈU */}
      {isDead && (
        <div className="bg-rose-950/95 border-b border-rose-500/40 p-4 sm:p-5 text-center">
          <div className="max-w-lg mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-rose-300 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{isEn ? "You are out of HP" : "Bạn đang hết sinh lực"}</span>
            </span>
            <p className="text-xs text-rose-200">
              {isEn ? "You can buy a potion to continue fighting or revive for free at the camp:" : "Bạn có thể mua bình máu để tăng máu tiếp tục trận chiến hoặc hồi sinh miễn phí về trại:"}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              {/* Mua bình máu cấp cứu 10 xu */}
              <button
                type="button"
                disabled={(Number.isFinite(playerState?.coins) ? playerState.coins : 0) < 10}
                onClick={() => handleEmergencyHealClient("buy_potion")}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-colors duration-150 shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEn ? "Buy emergency potion (-10 Coins, +50 HP)" : "Mua bình máu cấp cứu (-10 Xu, +50 HP)"}</span>
              </button>

              {/* Hồi sinh miễn phí về trại */}
              <button
                type="button"
                onClick={() => handleEmergencyHealClient("free_camp")}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition-colors duration-150 border border-slate-700 cursor-pointer flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isEn ? "Camp revival (Free)" : "Hồi sinh tại trại (Miễn phí)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THANH TAB ĐIỀU HƯỚNG RETRO PIXEL RPG CHO HỌC SINH */}
      <nav className="bg-slate-900 border-b-2 border-slate-800 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-start gap-2.5 overflow-x-auto py-2.5 no-scrollbar text-xs font-bold font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("hunt")}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeTab === "hunt"
                ? "pixel-btn-amber text-slate-950 font-black shadow-md"
                : "pixel-btn-neutral text-slate-400 hover:text-white"
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>{t.battle.huntTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("blacksmith")}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeTab === "blacksmith"
                ? "pixel-btn-amber text-slate-950 font-black shadow-md"
                : "pixel-btn-neutral text-slate-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t.battle.blacksmithTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("backpack")}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeTab === "backpack"
                ? "pixel-btn-amber text-slate-950 font-black shadow-md"
                : "pixel-btn-neutral text-slate-400 hover:text-white"
            }`}
          >
            <Backpack className="w-3.5 h-3.5" />
            <span>{t.battle.inventoryTab} ({playerState.inventory.length}/30)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeTab === "leaderboard"
                ? "pixel-btn-amber text-slate-950 font-black shadow-md"
                : "pixel-btn-neutral text-slate-400 hover:text-white"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{t.battle.leaderboardTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBestiary(true)}
            className="px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 cursor-pointer pixel-btn-neutral text-amber-400 hover:text-amber-300 border border-amber-500/30 font-bold"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{isEn ? "Monster Codex (7)" : "Sổ Tay Quái (7)"}</span>
          </button>
        </div>
      </nav>

      {/* VÙNG NỘI DUNG CHÍNH THEO TAB */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        {/* TAB 1: SĂN QUÁI (HUNT) */}
        {activeTab === "hunt" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                  <Trees className="w-5 h-5 text-emerald-400" />
                  <span>{isEn ? "Forest Practice Zone" : "Vùng Rừng Xanh"}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {isEn
                    ? "Practice answering questions to defeat target monsters and collect rewards."
                    : "Luyện tập trả lời câu hỏi, chinh phục mục tiêu và tích lũy phần thưởng."}
                </p>
              </div>
              {playerState.streak > 0 && (
                <div className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>
                    {isEn ? `Streak x${playerState.streak} (+${playerState.streak * 8}%)` : `Chuỗi x${playerState.streak} (+${playerState.streak * 8}%)`}
                  </span>
                </div>
              )}
            </div>

            {/* ĐẤU TRƯỜNG SINH TỒN TRI THỨC (CHUẨN GOOGLE & RPG) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? "Continuous Practice & Battle Arena" : "Đấu Trường Luyện Tập & Săn Quái"}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {isEn ? "Infinite Knowledge Gauntlet" : "Đấu Trường Sinh Tồn Tri Thức"}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {isEn
                      ? "Monsters spawn randomly. Answer questions correctly to strike monsters without taking damage. Defeat 5 normal monsters to summon the Regional Boss!"
                      : "Quái vật xuất hiện ngẫu nhiên theo bộ câu hỏi. Trả lời đúng để tung đòn tấn công quái (quái không thể đánh lại bạn). Cứ hạ đủ 5 quái nhỏ sẽ triệu hồi 1 Trùm Khu Vực!"}
                  </p>

                  {/* 3 quy tắc cốt lõi hiển thị sinh động theo phong cách Google Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{isEn ? "Correct Answer" : "Trả lời đúng"}</p>
                        <p className="text-[11px] text-slate-400">{isEn ? "Attack monster · You stay safe" : "Tấn công quái · Quái không thể phản đòn"}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{isEn ? "Incorrect Answer" : "Trả lời sai"}</p>
                        <p className="text-[11px] text-slate-400">{isEn ? "Monster attacks you" : "Bạn không thể tấn công · Quái đánh trả"}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{isEn ? "Boss Summon" : "Triệu hồi Boss"}</p>
                        <p className="text-[11px] text-slate-400">{isEn ? "Every 5 normal monsters" : "Cứ đủ 5 quái nhỏ sẽ xuất hiện 1 Boss"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nút hành động Bước Vào Sàn Đấu - Chuẩn Retro Pixel RPG */}
                <div className="flex flex-col items-center justify-center gap-3 shrink-0 p-5 rounded-2xl pixel-panel bg-slate-950/80 border-2 border-slate-700 text-center shadow-lg">
                  <div className="w-16 h-16 rounded-xl pixel-panel bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center p-2">
                    <img
                      src="/sprites/slime_idle_1_clean.png"
                      alt="Slime"
                      className="w-12 h-12 object-contain pixelated animate-pulse motion-reduce:animate-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => startAction("hunt", "slime", isEn ? "Infinite Monster Arena" : "Đấu Trường Săn Quái Bất Tận")}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl pixel-btn-amber text-slate-950 font-black font-mono text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl uppercase cursor-pointer"
                  >
                    <Swords className="w-4 h-4" />
                    <span>{isEn ? "ENTER ARENA NOW" : "BƯỚC VÀO SÀN ĐẤU NGAY"}</span>
                  </button>

                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {isEn ? "[ Random monster encounter ]" : "[ Gặp quái ngẫu nhiên ]"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIỆM ĐỒ & THỢ RÈN (SHOP & BLACKSMITH) */}
        {activeTab === "blacksmith" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>{isEn ? "Shop & Explorer's Forge" : "Tiệm Đồ & Lò Rèn Thám Hiểm"}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {isEn
                  ? "Use earned coins to purchase weapons, armor, helmets, shields, and survival supplies."
                  : "Sử dụng xu kiếm được để mua trang bị vũ khí, giáp, mũ, khiên và nhu yếu phẩm."}
              </p>
            </div>

            {/* BẢNG TRANG BỊ CỦA NHÂN VẬT (4 Ô: VŨ KHÍ, MŨ, GIÁP, KHIÊN) KÈM PREVIEW HIỆP SĨ PIXEL ART */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-5">
                {/* 1. Preview Hiệp sĩ Pixel Art phản ánh trang bị trực tiếp */}
                <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 shrink-0 shadow-inner w-full md:w-44">
                  <span className="text-[10px] font-mono font-bold text-amber-400 mb-1">
                    {isEn ? "Explorer Live Preview" : "Diện mạo Hiệp Sĩ"}
                  </span>
                  <PixelHero
                    weaponId={playerState.equipped?.weapon?.itemId}
                    armorId={playerState.equipped?.armor?.itemId}
                    helmetId={playerState.equipped?.helmet?.itemId}
                    shieldId={playerState.equipped?.shield?.itemId}
                    size={96}
                    showShadow={true}
                  />
                  <span className="text-[9px] font-mono text-slate-400 mt-1 text-center">
                    {isEn ? "Live Equipment" : "Trang bị trực quan"}
                  </span>
                </div>

                {/* 2. Lưới 4 ô trang bị */}
                <div className="flex-1 w-full space-y-2">
                  <span className="text-[11px] font-mono font-bold text-amber-400 block">
                    {isEn ? "Equipped Gear Slots:" : "Chi tiết 4 ô trang bị:"}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Vũ khí */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      {playerState.equipped?.weapon ? (
                        <PixelItemIcon itemId={playerState.equipped.weapon.itemId} size={28} />
                      ) : (
                        <Swords className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">
                        {isEn ? "Weapon" : "Vũ khí"}
                      </span>
                      <h4 className="font-bold text-xs text-white truncate max-w-[140px]">
                        {playerState.equipped?.weapon
                          ? localizeItemDef(getItemDef(playerState.equipped.weapon.itemId), language).name
                          : (isEn ? "Not equipped" : "Chưa trang bị")}
                        {playerState.equipped?.weapon?.enhancedLevel
                          ? ` +${playerState.equipped.weapon.enhancedLevel}`
                          : ""}
                      </h4>
                      {playerState.equipped?.weapon && (
                        <span className="text-[10px] font-mono text-amber-300 block">
                          +
                          {(getItemDef(playerState.equipped.weapon.itemId)?.atk || 0) +
                            (playerState.equipped.weapon.enhancedLevel || 0) * 4}{" "}
                          {isEn ? "ATK · Durability:" : "Công · Bền:"} {playerState.equipped.weapon.durability}
                        </span>
                      )}
                    </div>
                  </div>
                  {playerState.equipped?.weapon && (
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => handleBlacksmith("repair", playerState.equipped!.weapon!.itemId)}
                        className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-200 transition-colors duration-150 cursor-pointer"
                      >
                        {isEn ? "Repair" : "Sửa"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBlacksmith("enhance", playerState.equipped!.weapon!.itemId)}
                        className="flex-1 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-[10px] font-mono font-bold text-slate-950 transition-colors duration-150 cursor-pointer"
                      >
                        {isEn ? "Enhance (+4)" : "Cường hóa (+4)"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUnequipGear("weapon")}
                        className="py-1 px-2.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold transition-colors duration-150 cursor-pointer"
                        title={isEn ? "Unequip into backpack" : "Tháo cất vào túi đồ"}
                      >
                        {isEn ? "Unequip" : "Tháo"}
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Mũ bảo hộ */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      {playerState.equipped?.helmet ? (
                        <PixelItemIcon itemId={playerState.equipped.helmet.itemId} size={28} />
                      ) : (
                        <Crown className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">
                        {isEn ? "Helmet" : "Mũ bảo hộ"}
                      </span>
                      <h4 className="font-bold text-xs text-white truncate max-w-[140px]">
                        {playerState.equipped?.helmet
                          ? localizeItemDef(getItemDef(playerState.equipped.helmet.itemId), language).name
                          : (isEn ? "Not equipped" : "Chưa trang bị")}
                      </h4>
                      {playerState.equipped?.helmet && (
                        <span className="text-[10px] font-mono text-emerald-300 block">
                          -
                          {Math.round(
                            (getItemDef(playerState.equipped.helmet.itemId)?.defensePct || 0) * 100
                          )}
                          {isEn ? "% Dmg Red. · Durability:" : "% Sát thương · Bền:"} {playerState.equipped.helmet.durability}
                        </span>
                      )}
                    </div>
                  </div>
                  {playerState.equipped?.helmet && (
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => handleBlacksmith("repair", playerState.equipped!.helmet!.itemId)}
                        className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-200 transition-colors duration-150 cursor-pointer"
                      >
                        {isEn ? "Repair" : "Sửa chữa"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUnequipGear("helmet")}
                        className="py-1 px-2.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold transition-colors duration-150 cursor-pointer"
                        title={isEn ? "Unequip into backpack" : "Tháo cất vào túi đồ"}
                      >
                        {isEn ? "Unequip" : "Tháo"}
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Áo giáp */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      {playerState.equipped?.armor ? (
                        <PixelItemIcon itemId={playerState.equipped.armor.itemId} size={28} />
                      ) : (
                        <Shield className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">
                        {isEn ? "Armor" : "Áo giáp"}
                      </span>
                      <h4 className="font-bold text-xs text-white truncate max-w-[140px]">
                        {playerState.equipped?.armor
                          ? localizeItemDef(getItemDef(playerState.equipped.armor.itemId), language).name
                          : (isEn ? "Not equipped" : "Chưa trang bị")}
                      </h4>
                      {playerState.equipped?.armor && (
                        <span className="text-[10px] font-mono text-emerald-300 block">
                          -
                          {Math.round(
                            (getItemDef(playerState.equipped.armor.itemId)?.defensePct || 0) * 100
                          )}
                          {isEn ? "% Dmg Red. · Durability:" : "% Sát thương · Bền:"} {playerState.equipped.armor.durability}
                        </span>
                      )}
                    </div>
                  </div>
                  {playerState.equipped?.armor && (
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => handleBlacksmith("repair", playerState.equipped!.armor!.itemId)}
                        className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-200 transition-colors duration-150 cursor-pointer"
                      >
                        {isEn ? "Repair" : "Sửa chữa"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUnequipGear("armor")}
                        className="py-1 px-2.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold transition-colors duration-150 cursor-pointer"
                        title={isEn ? "Unequip into backpack" : "Tháo cất vào túi đồ"}
                      >
                        {isEn ? "Unequip" : "Tháo"}
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Khiên chắn */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                      {playerState.equipped?.shield ? (
                        <PixelItemIcon itemId={playerState.equipped.shield.itemId} size={28} />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">
                        {isEn ? "Shield" : "Khiên chắn"}
                      </span>
                      <h4 className="font-bold text-xs text-white truncate max-w-[140px]">
                        {playerState.equipped?.shield
                          ? localizeItemDef(getItemDef(playerState.equipped.shield.itemId), language).name
                          : (isEn ? "Not equipped" : "Chưa trang bị")}
                      </h4>
                      {playerState.equipped?.shield && (
                        <span className="text-[10px] font-mono text-emerald-300 block">
                          -
                          {Math.round(
                            (getItemDef(playerState.equipped.shield.itemId)?.defensePct || 0) * 100
                          )}
                          {isEn ? "% Dmg Red. · Durability:" : "% Sát thương · Bền:"} {playerState.equipped.shield.durability}
                        </span>
                      )}
                    </div>
                  </div>
                  {playerState.equipped?.shield && (
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => handleBlacksmith("repair", playerState.equipped!.shield!.itemId)}
                        className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-200 transition-colors duration-150 cursor-pointer"
                      >
                        {isEn ? "Repair" : "Sửa chữa"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUnequipGear("shield")}
                        className="py-1 px-2.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold transition-colors duration-150 cursor-pointer"
                        title={isEn ? "Unequip into backpack" : "Tháo cất vào túi đồ"}
                      >
                        {isEn ? "Unequip" : "Tháo"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
                </div>
              </div>
            </div>

            {/* BỘ LỌC CỬA HÀNG */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              {[
                { id: "all", label: isEn ? "All Items" : "Tất Cả" },
                { id: "weapons", label: isEn ? "Swords & Weapons" : "Kiếm & Vũ Khí" },
                { id: "defense", label: isEn ? "Armor, Helmets & Shields" : "Giáp, Mũ & Khiên" },
                { id: "consumables", label: isEn ? "Supplies & Food" : "Nhu Yếu Phẩm & Thức Ăn" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setShopTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors duration-150 cursor-pointer ${
                    shopTab === tab.id
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* DANH SÁCH MẶT HÀNG TRONG CỬA HÀNG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                // Kiếm & Vũ khí (Cận chiến, Cung tên, Gậy phép)
                ...(shopTab === "all" || shopTab === "weapons"
                  ? [
                      "wooden_club",
                      "wooden_sword",
                      "stone_axe",
                      "stone_sword",
                      "iron_sword",
                      "steel_sword",
                      "hunting_bow",
                      "iron_bow",
                      "magic_staff",
                      "fire_staff",
                      "crystal_sword",
                    ]
                  : []),
                // Giáp, Mũ & Khiên
                ...(shopTab === "all" || shopTab === "defense"
                  ? [
                      "straw_hat",
                      "leather_helmet",
                      "iron_helmet",
                      "cloth_armor",
                      "leather_armor",
                      "mage_robe",
                      "iron_armor",
                      "knight_armor",
                      "wooden_shield",
                      "iron_shield",
                      "magic_shield",
                    ]
                  : []),
                // Nhu yếu phẩm & Thức ăn
                ...(shopTab === "all" || shopTab === "consumables"
                  ? ["apple", "bread", "cooked_meat", "bandage", "small_healing_potion", "healing_potion"]
                  : []),
              ].map((itemId) => {
                const item = getItemDef(itemId);
                if (!item) return null;
                const locItem = localizeItemDef(item, language);
                const canAfford = (Number.isFinite(playerState?.coins) ? playerState.coins : 0) >= item.buyPrice;

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors duration-150"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center p-1.5 shadow-inner shrink-0">
                          <PixelItemIcon itemId={item.id} size={32} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          {item.category === "weapon"
                            ? (isEn ? "Weapon" : "Vũ khí")
                            : item.category === "helmet"
                            ? (isEn ? "Helmet" : "Mũ")
                            : item.category === "armor"
                            ? (isEn ? "Armor" : "Giáp")
                            : item.category === "shield"
                            ? (isEn ? "Shield" : "Khiên")
                            : item.category === "food"
                            ? (isEn ? "Food" : "Thức ăn")
                            : (isEn ? "Consumable" : "Tiêu hao")}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-base mb-1">{locItem.name}</h3>
                      <p className="text-xs text-slate-400 leading-snug mb-3">
                        {locItem.description}
                      </p>

                      <div className="text-xs font-mono space-y-1 text-slate-300 py-2 border-t border-slate-800/80">
                        {item.atk !== undefined && (
                          <div className="flex items-center gap-1">
                            <Swords className="w-3 h-3 text-amber-400" />
                            <span>{isEn ? `Damage: +${item.atk} ATK` : `Sát thương: +${item.atk} ATK`}</span>
                          </div>
                        )}
                        {item.defensePct !== undefined && (
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-blue-400" />
                            <span>{isEn ? `Defense: -${Math.round(item.defensePct * 100)}% dmg` : `Phòng thủ: -${Math.round(item.defensePct * 100)}% sát thương`}</span>
                          </div>
                        )}
                        {item.healHp !== undefined && (
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-400" />
                            <span>{isEn ? `Recovery: ${item.healHp > 0 ? `+${item.healHp}` : item.healHp} HP` : `Hồi phục: ${item.healHp > 0 ? `+${item.healHp}` : item.healHp} HP`}</span>
                          </div>
                        )}
                        {item.healHunger !== undefined && (
                          <div className="flex items-center gap-1">
                            <Utensils className="w-3 h-3 text-amber-400" />
                            <span>{isEn ? `Hunger Relief: +${item.healHunger} pts` : `Giảm đói: +${item.healHunger} điểm`}</span>
                          </div>
                        )}
                        {item.durability !== undefined && (
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>{isEn ? `Durability: ${item.durability}` : `Độ bền: ${item.durability}`}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleBlacksmith("buy_gear", item.id)}
                      className={`w-full mt-4 py-2.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        canAfford
                          ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{isEn ? `Buy (${item.buyPrice} Coins)` : `Mua (${item.buyPrice} Xu)`}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: TÚI ĐỒ (BACKPACK) */}
        {activeTab === "backpack" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                  <Backpack className="w-5 h-5 text-amber-400" />
                  <span>{isEn ? `Survival Backpack (${playerState.inventory.length}/30 slots)` : `Túi Đồ Sinh Tồn (${playerState.inventory.length}/30 ô)`}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {isEn
                    ? "Tap gear to equip, food to consume, or sell monster drops for coins."
                    : "Chạm để trang bị/sử dụng hoặc nhấn 'Bán' để đổi chiến lợi phẩm săn quái lấy Xu!"}
                </p>
              </div>
            </div>

            {/* Lưới 30 ô ba lô - Retro Pixel Inventory Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2.5">
              {Array.from({ length: 30 }).map((_, idx) => {
                const slot = playerState.inventory.find((s) => s.slotIndex === idx);
                const itemDef = slot ? getItemDef(slot.itemId) : null;
                const locItem = itemDef ? localizeItemDef(itemDef, language) : null;

                if (!slot || !itemDef) {
                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl pixel-panel bg-slate-950/80 border-2 border-slate-800 flex items-center justify-center text-slate-600 font-mono text-xs shadow-inner"
                    >
                      {idx + 1}
                    </div>
                  );
                }

                const isEquippable = ["weapon", "armor", "helmet", "shield"].includes(
                  itemDef.category
                );
                const canEat = itemDef.category === "food" || itemDef.category === "consumable";
                const totalSellPrice = (itemDef.sellPrice && itemDef.sellPrice > 0 ? itemDef.sellPrice : 1) * slot.qty;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (isEquippable) handleEquipItem(slot.slotIndex);
                      else if (canEat) handleEatItem(itemDef.id);
                    }}
                    className={`aspect-square p-2 rounded-xl pixel-panel border-2 flex flex-col justify-between transition-transform duration-150 select-none ${
                      isEquippable
                        ? "bg-slate-900 border-amber-500/80 hover:border-amber-400 cursor-pointer shadow-md hover:scale-[1.02]"
                        : canEat
                        ? "bg-slate-900 border-emerald-500/80 hover:border-emerald-400 cursor-pointer shadow-md hover:scale-[1.02]"
                        : "bg-slate-900/90 border-slate-700"
                    }`}
                    title={
                      isEquippable
                        ? (isEn ? `Tap to equip ${locItem?.name}` : `Chạm để trang bị ${itemDef.name}`)
                        : canEat
                        ? (isEn ? `Tap to use ${locItem?.name}` : `Chạm để sử dụng ${itemDef.name}`)
                        : locItem?.name || itemDef.name
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 flex items-center justify-center p-0.5">
                        <PixelItemIcon itemId={itemDef.id} size={24} />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-amber-300">
                        x{slot.qty}
                      </span>
                    </div>

                    <div className="truncate">
                      <span className="text-[10px] font-bold text-white block truncate">
                        {locItem?.name || itemDef.name}
                      </span>
                      {isEquippable && (
                        <span className="text-[8px] font-mono font-bold text-amber-400 block">
                          [{isEn ? "Equip" : "Trang bị"}]
                        </span>
                      )}
                      {canEat && (
                        <span className="text-[8px] font-mono font-bold text-emerald-400 block">
                          [{isEn ? "Use" : "Dùng"}]
                        </span>
                      )}
                    </div>

                    {/* Nút bán vật phẩm để đổi lấy Xu */}
                    <button
                      type="button"
                      onClick={(e) => handleSellItem(slot.slotIndex, e)}
                      className="w-full py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/30 text-amber-300 border border-amber-500/25 text-[9px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors active:scale-95 focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:outline-none"
                      title={isEn ? `Sell for +${totalSellPrice} Coins` : `Bán lấy +${totalSellPrice} Xu`}
                    >
                      <span>{isEn ? "Sell" : "Bán"} +{totalSellPrice}</span>
                      <Coins className="w-2.5 h-2.5 text-amber-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 7: BẢNG XẾP HẠNG (LEADERBOARD) */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>{isEn ? "Foggo Island Hall of Fame" : "Bảng Vinh Danh Đảo Foggo"}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {isEn
                  ? "Achievements of top survivors in this world."
                  : "Thành tích của những nhà sinh tồn xuất sắc nhất trong thế giới."}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">{isEn ? "Rank" : "Hạng"}</th>
                    <th className="py-3 px-4">{isEn ? "Student" : "Học Sinh"}</th>
                    <th className="py-3 px-4 text-right">{isEn ? "Coins" : "Xu"}</th>
                    <th className="py-3 px-4 text-right">{isEn ? "Score" : "Điểm Số"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {initialLeaderboard.map((p, idx) => {
                    const isSelf = p.id === initialPlayer.id;
                    const isTop1 = idx === 0;
                    const isTop2 = idx === 1;
                    const isTop3 = idx === 2;

                    return (
                      <tr
                        key={p.id}
                        className={`transition-colors duration-150 ${
                          isSelf
                            ? "bg-amber-500/15 font-bold border-l-4 border-amber-400"
                            : isTop1
                            ? "bg-amber-500/5"
                            : "hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold font-mono">
                          {isTop1 ? (
                            <span className="inline-flex items-center gap-1.5 text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
                              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Top 1
                            </span>
                          ) : isTop2 ? (
                            <span className="inline-flex items-center gap-1.5 text-slate-200 bg-slate-700/40 px-2 py-0.5 rounded-lg border border-slate-600">
                              <Trophy className="w-3.5 h-3.5 text-slate-300" /> Top 2
                            </span>
                          ) : isTop3 ? (
                            <span className="inline-flex items-center gap-1.5 text-amber-500 bg-amber-900/30 px-2 py-0.5 rounded-lg border border-amber-700/40">
                              <Trophy className="w-3.5 h-3.5 text-amber-600" /> Top 3
                            </span>
                          ) : (
                            <span className="text-slate-400">#{idx + 1}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">{p.nickname}</span>
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-mono font-bold">
                                {isEn ? "You" : "Bạn"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-amber-300 font-mono font-bold">
                          {p.gold} {t.common.coins}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold font-mono">
                          {p.score} {isEn ? "Points" : "Điểm"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ĐẤU TRƯỜNG SĂN QUÁI RPG (BATTLE ARENA) */}
      {activeAction && activeAction.actionType === "hunt" ? (
        <MonsterBattleArena
          sessionId={sessionId}
          initialMonsterId={activeAction.targetId}
          clock={clock}
          playerState={playerState}
          questions={questions}
          currentQIndex={currentQIndex}
          onStateUpdate={handleUpdatePlayerState}
          onNextQuestion={() => setCurrentQIndex((prev) => prev + 1)}
          onClose={() => {
            setActiveAction(null);
            setFeedback(null);
          }}
        />
      ) : activeAction && question && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 motion-reduce:animate-none">
          <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
            {/* Nút đóng */}
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setActiveAction(null);
                setFeedback(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors duration-150 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header hành động */}
            <div className="text-center space-y-1">
              <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
                {activeAction.targetName}
              </span>
              <p className="text-xs text-slate-400">
                {isEn
                  ? "Answer correctly to complete this action!"
                  : "Trả lời chính xác để hoàn thành hành động này!"}
              </p>
            </div>

            {/* Feedback nếu vừa nộp bài (Chuẩn Google Material 3) */}
            {feedback ? (
              <div
                className={`p-6 sm:p-7 rounded-3xl border-2 text-center space-y-4 shadow-sm ${
                  feedback.isCorrect
                    ? "bg-[#E6F4EA] border-[#34A853] text-[#137333] dark:bg-[#34A853]/20 dark:border-[#34A853] dark:text-[#81C995]"
                    : "bg-[#FCE8E6] border-[#EA4335] text-[#C5221F] dark:bg-[#EA4335]/20 dark:border-[#EA4335] dark:text-[#F28B82]"
                }`}
              >
                <div className="flex items-center justify-center gap-2.5 font-bold text-base sm:text-lg font-sans">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-[#34A853]" />
                  ) : (
                    <XCircle className="w-6 h-6 text-[#EA4335]" />
                  )}
                  <span>{feedback.message}</span>
                </div>

                {feedback.explanation && (
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 text-left flex items-start gap-2 shadow-xs">
                    <Sparkles className="w-4 h-4 text-[#FBBC05] shrink-0 mt-0.5" />
                    <span><strong>{isEn ? "Explanation:" : "Giải thích:"}</strong> {feedback.explanation}</span>
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setActiveAction(null);
                    setFeedback(null);
                  }}
                  className="px-8 py-3.5 rounded-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold text-sm transition-all duration-150 shadow-xs cursor-pointer active:scale-95"
                >
                  {isEn ? "Continue Survival Quest" : "Tiếp Tục Cuộc Sinh Tồn"}
                </button>
              </div>
            ) : (
              /* Giao diện câu hỏi từ Registry - ĐÃ ÁP DỤNG LOCALIZATION */
              <div className="space-y-6">
                {PlayerComponent ? (
                  <PlayerComponent
                    content={localizeQuestion(question, language).content}
                    value={userAnswer}
                    onChange={(val) => setUserAnswer(val)}
                    disabled={submitting}
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    {isEn ? "Could not load question type" : "Chưa tải được dạng câu hỏi"}
                  </div>
                )}

                {/* Nút nộp bài dạng Pill bo tròn Google Blue #4285F4 */}
                <button
                  type="button"
                  disabled={userAnswer === null || submitting}
                  onClick={handleSubmitAnswer}
                  className="w-full py-3.5 px-8 rounded-full bg-[#4285F4] hover:bg-[#3367D6] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white disabled:text-slate-500 font-semibold text-sm transition-all duration-150 shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {submitting
                      ? (isEn ? "Processing..." : "Đang xử lý...")
                      : (isEn ? "CONFIRM ACTION" : "XÁC NHẬN HÀNH ĐỘNG")}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SỔ TAY QUÁI VẬT HẦM NGỤC (7 CHỦNG LOÀI) */}
      <MonsterBestiaryModal
        isOpen={showBestiary}
        onClose={() => setShowBestiary(false)}
        language={language}
      />
    </div>
  );
}
