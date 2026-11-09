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
  Backpack,
  ArrowRight,
  SunMedium,
  Moon,
  Sparkles,
  TreePine,
  Gem,
  Hammer,
  Eye,
  Crosshair,
  RefreshCw,
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Footprints,
} from "lucide-react";
import { getQuestionType } from "@/question-types/registry";
import { getSurvivalClock } from "@/game-modes/survival/clock";
import { getItemDef, ITEM_REGISTRY } from "@/game-modes/survival/items";
import { MONSTER_REGISTRY, getScaledMonster } from "@/game-modes/survival/monsters";
import { CRAFTING_RECIPES } from "@/game-modes/survival/recipes";
import { submitSurvivalAction, performSurvivalItemAction, emergencyHealOrRevive } from "./actions";
import { MonsterBattleArena } from "./MonsterBattleArena";
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
  // Tabs: hunt | gather | explore | craft | blacksmith | backpack | leaderboard
  const [activeTab, setActiveTab] = useState<
    "hunt" | "gather" | "explore" | "craft" | "blacksmith" | "backpack" | "leaderboard"
  >("hunt");

  // Bộ lọc cửa hàng / Thợ rèn
  const [shopTab, setShopTab] = useState<"all" | "weapons" | "defense" | "consumables">("all");

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
    const safeHp = Number.isFinite(raw.hp) ? raw.hp : 100;
    const safeMaxHp = Number.isFinite(raw.maxHp) ? raw.maxHp : 100;
    const safeHunger = Number.isFinite(raw.hunger) ? raw.hunger : 100;
    const safeMaxHunger = Number.isFinite(raw.maxHunger) ? raw.maxHunger : 100;

    return {
      hp: safeHp,
      maxHp: safeMaxHp,
      hunger: safeHunger,
      maxHunger: safeMaxHunger,
      coins: safeCoins,
      score: safeScore,
      playSec: raw.playSec ?? 0,
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

  // Hồi sinh
  async function handleRevive() {
    const res = await performSurvivalItemAction({
      sessionId,
      action: "revive",
    });
    if (res.state) {
      handleUpdatePlayerState(res.state);
      showToast("Bạn đã hồi sinh an toàn tại Trại! Toàn bộ Xu được giữ nguyên.");
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

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  const forestFog = playerState.fog?.forest ?? 100;
  const isDead = playerState.hp <= 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold font-mono text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Thanh trạng thái sinh tồn RPG */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Thế giới */}
          <div className="flex items-center gap-3">
            <Link
              href="/worlds"
              className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-sm"
            >
              🦊
            </Link>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-[150px] sm:max-w-xs">
                {worldTitle}
              </h1>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  {clock.isDay ? (
                    <SunMedium className="w-3 h-3 text-amber-400" />
                  ) : (
                    <Moon className="w-3 h-3 text-indigo-400" />
                  )}
                  <span>Ngày {clock.dayNumber} · {clock.formattedTime}</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className={clock.isDay ? "text-amber-300" : "text-indigo-300 font-bold"}>
                  {clock.isDay ? `Đêm sau ${clock.phaseRemainingSec}s` : `Trời sáng sau ${clock.phaseRemainingSec}s`}
                </span>
              </div>
            </div>
          </div>

          {/* Vitals: HP, Đói, Xu, Điểm */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Máu (HP) */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-rose-500/30">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
              <div className="w-16 sm:w-20 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${(playerState.hp / playerState.maxHp) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-300">
                {playerState.hp}
              </span>
            </div>

            {/* Đói (Hunger) */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-amber-500/30">
              <span className="text-xs">🍗</span>
              <div className="w-14 sm:w-16 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    playerState.hunger > 30 ? "bg-amber-500" : "bg-red-500 animate-pulse"
                  }`}
                  style={{ width: `${(playerState.hunger / playerState.maxHunger) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-300">
                {playerState.hunger}
              </span>
            </div>

            {/* Xu */}
            <div className="flex items-center gap-1.5 bg-amber-500/15 px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{Number.isFinite(playerState?.coins) ? playerState.coins : 0} Xu</span>
            </div>

            {/* Điểm */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-slate-300 text-xs font-mono font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{Number.isFinite(playerState?.score) ? playerState.score : 0}</span>
            </div>
          </div>
        </div>
      </header>

      {/* CẢNH BÁO NẾU ĐANG BỊ NGẤT XỈU */}
      {isDead && (
        <div className="bg-rose-950/95 border-b border-rose-500/40 p-4 sm:p-5 text-center">
          <div className="max-w-lg mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider block">
              ⚠️ BẠN ĐANG HẾT SINH LỰC · BẢO LƯU 100% XU KIẾM ĐƯỢC
            </span>
            <p className="text-xs text-rose-200">
              Bạn có thể mua bình máu để tăng máu tiếp tục trận chiến hoặc hồi sinh miễn phí về trại:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              {/* Mua bình máu cấp cứu 10 xu */}
              <button
                type="button"
                disabled={(Number.isFinite(playerState?.coins) ? playerState.coins : 0) < 10}
                onClick={() => handleEmergencyHealClient("buy_potion")}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                🧪 MUA BÌNH MÁU CẤP CỨU (-10 Xu, +50 HP)
              </button>

              {/* Hồi sinh miễn phí về trại */}
              <button
                type="button"
                onClick={() => handleEmergencyHealClient("free_camp")}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition-all border border-slate-700 cursor-pointer"
              >
                🏕️ HỒI SINH TẠI TRẠI (MIỄN PHÍ)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THANH TAB ĐIỀU HƯỚNG SINH TỒN */}
      <nav className="bg-slate-900 border-b border-slate-800 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar text-xs font-bold font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("hunt")}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "hunt"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Săn Quái</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("gather")}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "gather"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>Hái Lượm</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("explore")}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "explore"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Sương Mù ({forestFog}%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("craft")}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "craft"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>Chế Tạo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("blacksmith")}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "blacksmith"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cửa Hàng & Thợ Rèn</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("backpack")}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "backpack"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Backpack className="w-3.5 h-3.5" />
            <span>Túi Đồ ({playerState.inventory.length}/16)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "leaderboard"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Xếp Hạng</span>
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
                  <span>🌲 Vùng Rừng Xanh (Forest)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Trả lời đúng câu hỏi để vung kiếm tấn công quái vật. Đánh bại quái để thu thập xu và thịt!
                </p>
              </div>
              {playerState.streak > 0 && (
                <div className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>Chuỗi x{playerState.streak} (+{playerState.streak * 8}%)</span>
                </div>
              )}
            </div>

            {/* Banner Vào Đấu Trường Săn Quái Bất Tận (Gauntlet Arena) */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                    Săn Quái RPG Theo Lượt · Quái Xuất Hiện Bất Tận
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>⚔️ Đấu Trường Săn Quái Bất Tận</span>
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed mt-1">
                  Đánh bại con này quái khác sẽ lập tức xuất hiện! Nhân vật lao lên chém khi bạn trả lời đúng, quái phản công khi sai. Có quyền rút lui (bị cào -15 HP &amp; trừ 50 điểm rank).
                </p>
              </div>

              <button
                type="button"
                onClick={() => startAction("hunt", "slime", "Đấu Trường Săn Quái Bất Tận")}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 hover:from-emerald-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Swords className="w-4 h-4" />
                <span>BƯỚC VÀO SÀN ĐẤU NGAY</span>
              </button>
            </div>

            {/* Lưới danh sách quái vật trong khu vực */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {["slime", "wolf", "wild_boar", "boar_king"].map((mId) => {
                const m = getScaledMonster(mId, clock.dayNumber, !clock.isDay);
                const isBossLairLocked = m.isBoss && forestFog > 30;

                return (
                  <div
                    key={m.id}
                    className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
                      m.isBoss
                        ? "bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/40 shadow-xl"
                        : "bg-slate-900/80 border-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{m.avatar}</span>
                        {m.isBoss && (
                          <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 uppercase">
                            TRÙM KHU VỰC
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-white text-base mb-1">
                        {m.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-snug line-clamp-2 mb-3">
                        {m.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">❤️ Máu:</span>
                        <span className="font-bold text-rose-400">{m.hp} HP</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">⚔️ Công:</span>
                        <span className="font-bold text-amber-400">{m.atk} ATK</span>
                      </div>

                      {isBossLairLocked ? (
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-[11px] text-slate-500 font-mono">
                          Khóa! Cần xua sương mù ≤ 30% để mở hang trùm.
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startAction("hunt", m.id, m.name)}
                          className={`w-full py-2.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            m.isBoss
                              ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                              : "bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200"
                          }`}
                        >
                          <Swords className="w-3.5 h-3.5" />
                          <span>Tấn Công</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: HÁI LƯỢM (GATHER) */}
        {activeTab === "gather" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                <span>🌲 Thu Thập Tài Nguyên Rừng</span>
              </h2>
              <p className="text-xs text-slate-400">
                Trả lời đúng để chặt củi, đẽo đá và hái thảo dược chế tạo công cụ.
                {forestFog <= 70 && (
                  <span className="text-amber-400 font-bold ml-1">
                    ⭐ Đã mở Bãi tài nguyên giàu (+100% sản lượng)!
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <span className="text-4xl block">🪵</span>
                <div>
                  <h3 className="font-bold text-white text-base">Cây Gỗ Rừng</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Cung cấp gỗ để nhóm lửa và chế tạo gậy, hàng rào.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startAction("gather", "wood", "Chặt gỗ rừng")}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Chặt Cây Lấy Gỗ
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <span className="text-4xl block">🪨</span>
                <div>
                  <h3 className="font-bold text-white text-base">Mỏ Đá Cuội</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Khai thác đá cứng để làm rìu, kiếm đá và gia cố trại.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startAction("gather", "stone", "Khai thác đá")}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Đào Đá Cuội
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <span className="text-4xl block">🌿</span>
                <div>
                  <h3 className="font-bold text-white text-base">Thảo Dược Xanh</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Hái lá thuốc để chế tạo băng gạc và bình máu phục hồi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startAction("gather", "herb", "Hái thảo dược")}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Hái Thảo Dược
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: THÁM HIỂM SƯƠNG MÙ (EXPLORE) */}
        {activeTab === "explore" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                <span>🌫️ Khám Phá Màn Sương Foggo</span>
              </h2>
              <p className="text-xs text-slate-400">
                Mỗi câu trả lời đúng xua tan màn sương che khuất hòn đảo. Giải mã bí mật để lộ kho báu và hang trùm!
              </p>
            </div>

            {/* Tiến độ tan sương */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Mức độ bao phủ sương mù Rừng Xanh
                </span>
                <span className="text-sm font-mono font-black text-white">
                  {forestFog}%
                </span>
              </div>

              <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${100 - forestFog}%` }}
                />
              </div>

              {/* Các mốc lộ diện */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                <div className={`p-3 rounded-xl border ${forestFog <= 70 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-500"}`}>
                  <span className="font-bold block">≤ 70% Sương:</span>
                  <span>Bãi tài nguyên giàu (x2 thu hoạch)</span>
                </div>
                <div className={`p-3 rounded-xl border ${forestFog <= 50 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-500"}`}>
                  <span className="font-bold block">≤ 50% Sương:</span>
                  <span>Rương kho báu bí ẩn (+50 xu)</span>
                </div>
                <div className={`p-3 rounded-xl border ${forestFog <= 30 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-500"}`}>
                  <span className="font-bold block">≤ 30% Sương:</span>
                  <span>Lộ diện Hang Heo Rừng Chúa</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => startAction("explore", "forest", "Thám hiểm sương mù Rừng Xanh")}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black font-mono text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Footprints className="w-4 h-4" />
                <span>Tiến Vào Màn Sương (Thám Hiểm)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: CHẾ TẠO (CRAFT) */}
        {activeTab === "craft" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                <span>🔨 Bàn Chế Tạo Sinh Tồn</span>
              </h2>
              <p className="text-xs text-slate-400">
                Kết hợp nguyên liệu đã thu thập và trả lời câu hỏi để rèn vũ khí, nấu thức ăn và gia cố trại.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CRAFTING_RECIPES.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-white text-base mb-1">
                      {recipe.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-snug mb-3">
                      {recipe.description}
                    </p>

                    {/* Danh sách nguyên liệu cần */}
                    <div className="space-y-1 py-2 border-t border-slate-800 text-xs font-mono">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Nguyên liệu yêu cầu:
                      </span>
                      {recipe.ingredients.map((ing) => {
                        const itemDef = getItemDef(ing.itemId);
                        const currentQty = playerState.inventory
                          .filter((s) => s.itemId === ing.itemId)
                          .reduce((sum, s) => sum + s.qty, 0);
                        const hasEnough = currentQty >= ing.qty;

                        return (
                          <div
                            key={ing.itemId}
                            className={`flex items-center justify-between ${
                              hasEnough ? "text-slate-300" : "text-rose-400"
                            }`}
                          >
                            <span>{itemDef?.name || ing.itemId}:</span>
                            <span className="font-bold">
                              {currentQty}/{ing.qty}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => startAction("craft", recipe.id, recipe.name)}
                    className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    Bắt Đầu Chế Tạo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TIỆM ĐỒ & THỢ RÈN (SHOP & BLACKSMITH) */}
        {activeTab === "blacksmith" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                <span>🏪 Tiệm Đồ & Lò Rèn Thám Hiểm</span>
              </h2>
              <p className="text-xs text-slate-400">
                Sử dụng xu kiếm được để mua trang bị vũ khí, giáp, mũ, khiên và nhu yếu phẩm.
              </p>
            </div>

            {/* BẢNG TRANG BỊ CỦA NHÂN VẬT (4 Ô: VŨ KHÍ, MŨ, GIÁP, KHIÊN) */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                Trang bị trên người:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Vũ khí */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">⚔️</span>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block">Vũ khí</span>
                      <h4 className="font-bold text-xs text-white truncate max-w-[140px]">
                        {playerState.equipped?.weapon
                          ? getItemDef(playerState.equipped.weapon.itemId)?.name
                          : "Chưa trang bị"}
                        {playerState.equipped?.weapon?.enhancedLevel
                          ? ` +${playerState.equipped.weapon.enhancedLevel}`
                          : ""}
                      </h4>
                      {playerState.equipped?.weapon && (
                        <span className="text-[10px] font-mono text-amber-300 block">
                          +
                          {(getItemDef(playerState.equipped.weapon.itemId)?.atk || 0) +
                            (playerState.equipped.weapon.enhancedLevel || 0) * 4}{" "}
                          Công · Bền: {playerState.equipped.weapon.durability}
                        </span>
                      )}
                    </div>
                  </div>
                  {playerState.equipped?.weapon && (
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => handleBlacksmith("repair", playerState.equipped!.weapon!.itemId)}
                        className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-200 transition-all cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBlacksmith("enhance", playerState.equipped!.weapon!.itemId)}
                        className="flex-1 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-[10px] font-mono font-bold text-slate-950 transition-all cursor-pointer"
                      >
                        Cường hóa (+4)
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Mũ bảo hộ */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🪖</span>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block">Mũ bảo hộ</span>
                      <h4 className="font-bold text-xs text-white truncate max-w-[140px]">
                        {playerState.equipped?.helmet
                          ? getItemDef(playerState.equipped.helmet.itemId)?.name
                          : "Chưa trang bị"}
                      </h4>
                      {playerState.equipped?.helmet && (
                        <span className="text-[10px] font-mono text-emerald-300 block">
                          -
                          {Math.round(
                            (getItemDef(playerState.equipped.helmet.itemId)?.defensePct || 0) * 100
                          )}
                          % Sát thương · Bền: {playerState.equipped.helmet.durability}
                        </span>
                      )}
                    </div>
                  </div>
                  {playerState.equipped?.helmet && (
                    <div className="mt-3 pt-2 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => handleBlacksmith("repair", playerState.equipped!.helmet!.itemId)}
                        className="w-full py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-200 transition-all cursor-pointer"
                      >
                        Sửa chữa
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Áo giáp */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block">Áo giáp</span>
                      <h4 className="font-bold text-xs text-white truncate max-w-[140px]">
                        {playerState.equipped?.armor
                          ? getItemDef(playerState.equipped.armor.itemId)?.name
                          : "Chưa trang bị"}
                      </h4>
                      {playerState.equipped?.armor && (
                        <span className="text-[10px] font-mono text-emerald-300 block">
                          -
                          {Math.round(
                            (getItemDef(playerState.equipped.armor.itemId)?.defensePct || 0) * 100
                          )}
                          % Sát thương · Bền: {playerState.equipped.armor.durability}
                        </span>
                      )}
                    </div>
                  </div>
                  {playerState.equipped?.armor && (
                    <div className="mt-3 pt-2 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => handleBlacksmith("repair", playerState.equipped!.armor!.itemId)}
                        className="w-full py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-200 transition-all cursor-pointer"
                      >
                        Sửa chữa
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Khiên chắn */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block">Khiên chắn</span>
                      <h4 className="font-bold text-xs text-white truncate max-w-[140px]">
                        {playerState.equipped?.shield
                          ? getItemDef(playerState.equipped.shield.itemId)?.name
                          : "Chưa trang bị"}
                      </h4>
                      {playerState.equipped?.shield && (
                        <span className="text-[10px] font-mono text-emerald-300 block">
                          -
                          {Math.round(
                            (getItemDef(playerState.equipped.shield.itemId)?.defensePct || 0) * 100
                          )}
                          % Sát thương · Bền: {playerState.equipped.shield.durability}
                        </span>
                      )}
                    </div>
                  </div>
                  {playerState.equipped?.shield && (
                    <div className="mt-3 pt-2 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => handleBlacksmith("repair", playerState.equipped!.shield!.itemId)}
                        className="w-full py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-200 transition-all cursor-pointer"
                      >
                        Sửa chữa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BỘ LỌC CỬA HÀNG */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              {[
                { id: "all", label: "🌟 Tất Cả" },
                { id: "weapons", label: "⚔️ Kiếm & Vũ Khí" },
                { id: "defense", label: "🛡️ Giáp, Mũ & Khiên" },
                { id: "consumables", label: "🧪 Nhu Yếu Phẩm & Thức Ăn" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setShopTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
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
                // Kiếm & Vũ khí
                ...(shopTab === "all" || shopTab === "weapons"
                  ? ["wooden_club", "wooden_sword", "stone_axe", "stone_sword", "iron_sword"]
                  : []),
                // Giáp, Mũ & Khiên
                ...(shopTab === "all" || shopTab === "defense"
                  ? [
                      "straw_hat",
                      "leather_helmet",
                      "iron_helmet",
                      "cloth_armor",
                      "leather_armor",
                      "iron_armor",
                      "wooden_shield",
                      "iron_shield",
                    ]
                  : []),
                // Nhu yếu phẩm & Thức ăn
                ...(shopTab === "all" || shopTab === "consumables"
                  ? ["apple", "bread", "cooked_meat", "bandage", "small_healing_potion", "healing_potion"]
                  : []),
              ].map((itemId) => {
                const item = getItemDef(itemId);
                if (!item) return null;
                const canAfford = (Number.isFinite(playerState?.coins) ? playerState.coins : 0) >= item.buyPrice;

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">
                          {item.category === "weapon"
                            ? "⚔️"
                            : item.category === "helmet"
                            ? "🪖"
                            : item.category === "armor"
                            ? "🛡️"
                            : item.category === "shield"
                            ? "🛡️"
                            : item.category === "food"
                            ? "🍖"
                            : "🧪"}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          {item.category === "weapon"
                            ? "VŨ KHÍ"
                            : item.category === "helmet"
                            ? "MŨ"
                            : item.category === "armor"
                            ? "GIÁP"
                            : item.category === "shield"
                            ? "KHIÊN"
                            : item.category === "food"
                            ? "THỨC ĂN"
                            : "TIÊU HAO"}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-base mb-1">{item.name}</h3>
                      <p className="text-xs text-slate-400 leading-snug mb-3">
                        {item.description}
                      </p>

                      <div className="text-xs font-mono space-y-1 text-slate-300 py-2 border-t border-slate-800/80">
                        {item.atk !== undefined && <div>⚔️ Sát thương: +{item.atk} ATK</div>}
                        {item.defensePct !== undefined && (
                          <div>🛡️ Phòng thủ: -{Math.round(item.defensePct * 100)}% sát thương</div>
                        )}
                        {item.healHp !== undefined && (
                          <div>❤️ Hồi phục: {item.healHp > 0 ? `+${item.healHp}` : item.healHp} HP</div>
                        )}
                        {item.healHunger !== undefined && <div>🍗 Giảm đói: +{item.healHunger} điểm</div>}
                        {item.durability !== undefined && <div>🔨 Độ bền: {item.durability}</div>}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleBlacksmith("buy_gear", item.id)}
                      className={`w-full mt-4 py-2.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        canAfford
                          ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Mua ({item.buyPrice} Xu)</span>
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
                  <span>🎒 Túi Đồ Sinh Tồn ({playerState.inventory.length}/16 ô)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Chạm vào vũ khí/giáp/mũ/khiên để trang bị, chạm thức ăn/bình máu để sử dụng ngay.
                </p>
              </div>
            </div>

            {/* Lưới 16 ô ba lô */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {Array.from({ length: 16 }).map((_, idx) => {
                const slot = playerState.inventory.find((s) => s.slotIndex === idx);
                const itemDef = slot ? getItemDef(slot.itemId) : null;

                if (!slot || !itemDef) {
                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-center text-slate-700 font-mono text-xs"
                    >
                      {idx + 1}
                    </div>
                  );
                }

                const isEquippable = ["weapon", "armor", "helmet", "shield"].includes(
                  itemDef.category
                );
                const canEat = itemDef.category === "food" || itemDef.category === "consumable";

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (isEquippable) handleEquipItem(slot.slotIndex);
                      else if (canEat) handleEatItem(itemDef.id);
                    }}
                    className={`aspect-square p-2.5 rounded-2xl border flex flex-col justify-between transition-all select-none ${
                      isEquippable
                        ? "bg-slate-900 border-amber-500/40 hover:border-amber-400 cursor-pointer shadow-md hover:scale-[1.02]"
                        : canEat
                        ? "bg-slate-900 border-emerald-500/40 hover:border-emerald-400 cursor-pointer shadow-md hover:scale-[1.02]"
                        : "bg-slate-900/70 border-slate-800"
                    }`}
                    title={
                      isEquippable
                        ? `Chạm để trang bị ${itemDef.name}`
                        : canEat
                        ? `Chạm để sử dụng ${itemDef.name}`
                        : itemDef.name
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">
                        {itemDef.category === "food"
                          ? "🍖"
                          : itemDef.category === "weapon"
                          ? "⚔️"
                          : itemDef.category === "helmet"
                          ? "🪖"
                          : itemDef.category === "armor"
                          ? "🛡️"
                          : itemDef.category === "shield"
                          ? "🛡️"
                          : itemDef.category === "consumable"
                          ? "🧪"
                          : "🪵"}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        x{slot.qty}
                      </span>
                    </div>

                    <div className="truncate">
                      <span className="text-[11px] font-bold text-white block truncate">
                        {itemDef.name}
                      </span>
                      {isEquippable && (
                        <span className="text-[9px] font-mono font-bold text-amber-400 block">
                          [Trang bị]
                        </span>
                      )}
                      {canEat && (
                        <span className="text-[9px] font-mono font-bold text-emerald-400 block">
                          [Dùng]
                        </span>
                      )}
                    </div>
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
                <span>🏆 Bảng Vinh Danh Đảo Foggo</span>
              </h2>
              <p className="text-xs text-slate-400">
                Thành tích của những nhà sinh tồn xuất sắc nhất trong thế giới.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Hạng</th>
                    <th className="py-3 px-4">Học Sinh</th>
                    <th className="py-3 px-4 text-right">Xu</th>
                    <th className="py-3 px-4 text-right">Điểm Số</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {initialLeaderboard.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={p.id === initialPlayer.id ? "bg-amber-500/10 font-bold" : ""}
                    >
                      <td className="py-3 px-4 text-amber-400">#{idx + 1}</td>
                      <td className="py-3 px-4 text-white">{p.nickname}</td>
                      <td className="py-3 px-4 text-right text-amber-300">{p.gold}</td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                        {p.score}
                      </td>
                    </tr>
                  ))}
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
            {/* Nút đóng */}
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setActiveAction(null);
                setFeedback(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header hành động */}
            <div className="text-center space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
                {activeAction.targetName}
              </span>
              <p className="text-xs text-slate-400">
                Trả lời chính xác để hoàn thành hành động này!
              </p>
            </div>

            {/* Feedback nếu vừa nộp bài */}
            {feedback ? (
              <div
                className={`p-5 rounded-2xl border text-center space-y-3 ${
                  feedback.isCorrect
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2 font-bold text-sm sm:text-base">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span>{feedback.message}</span>
                </div>

                {feedback.explanation && (
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-left">
                    💡 <strong>Giải thích:</strong> {feedback.explanation}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setActiveAction(null);
                    setFeedback(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition-all shadow-md cursor-pointer"
                >
                  Tiếp Tục Cuộc Sinh Tồn
                </button>
              </div>
            ) : (
              /* Giao diện câu hỏi từ Registry */
              <div className="space-y-6">
                {PlayerComponent ? (
                  <PlayerComponent
                    content={question.content}
                    value={userAnswer}
                    onChange={(val) => setUserAnswer(val)}
                    disabled={submitting}
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    Chưa tải được dạng câu hỏi
                  </div>
                )}

                {/* Nút nộp bài */}
                <button
                  type="button"
                  disabled={userAnswer === null || submitting}
                  onClick={handleSubmitAnswer}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black font-mono text-sm transition-all shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{submitting ? "Đang xử lý..." : "XÁC NHẬN HÀNH ĐỘNG"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
