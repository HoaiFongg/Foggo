"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Swords,
  Flame,
  Shield,
  Heart,
  Coins,
  Sparkles,
  Zap,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Skull,
  PlusCircle,
  Home,
  Package,
} from "lucide-react";
import { getScaledMonster, getRandomFarmMonster, MONSTER_REGISTRY, type MonsterDef } from "@/game-modes/survival/monsters";
import { ITEM_REGISTRY } from "@/game-modes/survival/items";
import { getQuestionType } from "@/question-types/registry";
import { submitSurvivalAction, fleeSurvivalBattle, emergencyHealOrRevive } from "./actions";

interface MonsterBattleArenaProps {
  sessionId: string;
  initialMonsterId?: string;
  clock: { dayNumber: number; isDay: boolean };
  playerState: any;
  questions: Array<{ id: string; type: any; content: any; points?: number; [key: string]: any }>;
  currentQIndex: number;
  onStateUpdate: (newState: any) => void;
  onNextQuestion: () => void;
  onClose: () => void;
}

export function MonsterBattleArena({
  sessionId,
  initialMonsterId,
  clock,
  playerState,
  questions,
  currentQIndex,
  onStateUpdate,
  onNextQuestion,
  onClose,
}: MonsterBattleArenaProps) {
  // 1. Quái vật hiện tại trong đấu trường
  const [monsterDef, setMonsterDef] = useState<MonsterDef>(() => {
    if (initialMonsterId && MONSTER_REGISTRY[initialMonsterId]) {
      return MONSTER_REGISTRY[initialMonsterId];
    }
    return getRandomFarmMonster(true);
  });

  const scaledMonster = getScaledMonster(monsterDef.id, clock.dayNumber, !clock.isDay);
  const [monsterCurrentHp, setMonsterCurrentHp] = useState<number>(() => {
    if (playerState?.currentBattle?.monsterId === monsterDef.id) {
      return playerState.currentBattle.monsterHp;
    }
    return scaledMonster.hp;
  });

  const [monsterMaxHp, setMonsterMaxHp] = useState<number>(scaledMonster.hp);

  // 2. Trạng thái hoạt họa nhân vật & quái vật
  const [heroAnim, setHeroAnim] = useState<"idle" | "attack" | "hurt" | "flee">("idle");
  const [monsterAnim, setMonsterAnim] = useState<"idle" | "jump" | "hit" | "dead" | "spawn">("idle");
  const [slimeFrame, setSlimeFrame] = useState<number>(1);

  // 3. Floating combat text (Sát thương bay lên)
  const [floatingTexts, setFloatingTexts] = useState<
    Array<{ id: number; text: string; color: string; isCrit?: boolean; x: number; y: number }>
  >([]);

  // 4. Trạng thái nộp bài & cứu thương
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [battleNotice, setBattleNotice] = useState<string | null>(null);
  const [showFleeConfirm, setShowFleeConfirm] = useState(false);
  const [isFleeing, setIsFleeing] = useState(false);
  const [healingLoading, setHealingLoading] = useState(false);

  // Câu hỏi hiện tại
  const question = questions[currentQIndex % Math.max(1, questions.length)];
  const typeDef = question ? getQuestionType(question.type) : null;
  const PlayerComponent = typeDef?.Player;

  // Lấy trang bị của nhân vật
  const weaponId = playerState?.equipped?.weapon?.itemId;
  const armorId = playerState?.equipped?.armor?.itemId;
  const helmetId = playerState?.equipped?.helmet?.itemId;
  const shieldId = playerState?.equipped?.shield?.itemId;

  const weaponDef = weaponId ? ITEM_REGISTRY[weaponId] : null;
  const armorDef = armorId ? ITEM_REGISTRY[armorId] : null;
  const helmetDef = helmetId ? ITEM_REGISTRY[helmetId] : null;
  const shieldDef = shieldId ? ITEM_REGISTRY[shieldId] : null;

  const totalDefensePct = Math.min(
    60,
    Math.round(
      ((armorDef?.defensePct || 0) + (helmetDef?.defensePct || 0) + (shieldDef?.defensePct || 0)) * 100
    )
  );

  const playerHp = playerState?.hp ?? 100;
  const playerMaxHp = playerState?.maxHp ?? 100;
  const playerCoins = playerState?.coins ?? 0;
  const isOutOfHp = playerHp <= 0;

  // Danh sách vật phẩm hồi phục trong túi đồ
  const inventory = playerState?.inventory || [];
  const healingItems = inventory.filter(
    (item: any) =>
      ["apple", "bandage", "bread", "roasted_meat", "small_potion", "large_potion"].includes(item.itemId) &&
      item.qty > 0
  );

  // Nhịp thở nhấp nhô cho Slime khi ở trạng thái idle
  useEffect(() => {
    if (monsterDef.id !== "slime" || monsterAnim !== "idle") return;
    const interval = setInterval(() => {
      setSlimeFrame((prev) => (prev === 1 ? 2 : 1));
    }, 700);
    return () => clearInterval(interval);
  }, [monsterDef.id, monsterAnim]);

  // Thêm chữ nổi sát thương
  const addFloatingText = (text: string, color: string, x: number, y: number, isCrit = false) => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id, text, color, x, y, isCrit }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  // Hàm chuyển sang quái tiếp theo ngẫu nhiên
  const spawnNextMonster = () => {
    const next = getRandomFarmMonster(true);
    const scaled = getScaledMonster(next.id, clock.dayNumber, !clock.isDay);
    setMonsterDef(next);
    setMonsterMaxHp(scaled.hp);
    setMonsterCurrentHp(scaled.hp);
    setMonsterAnim("spawn");
    setSlimeFrame(1);
    setBattleNotice(`⚡ Quái vật mới xuất hiện: ${next.name}!`);

    setTimeout(() => {
      setMonsterAnim("idle");
      setBattleNotice(null);
    }, 1000);
  };

  // NỘP BÀI TẤN CÔNG QUÁI
  const handleAttack = async () => {
    if (userAnswer === null || !question || submitting || monsterAnim === "dead" || isOutOfHp) return;
    setSubmitting(true);
    setBattleNotice(null);

    const isHotspot = question.type === "hotspot";

    const res = await submitSurvivalAction({
      sessionId,
      actionType: "hunt",
      targetId: monsterDef.id,
      questionId: question.id,
      answer: userAnswer,
      isHotspotCritical: isHotspot,
    });

    setSubmitting(false);

    if (!res || "error" in res) {
      alert(res?.error || "Có lỗi xảy ra khi nộp bài");
      return;
    }

    // 1. NẾU TRẢ LỜI ĐÚNG -> NHÂN VẬT LAO LÊN TẤN CÔNG QUÁI
    if (res.isCorrect) {
      const damageDealt = res.huntResult?.damageDealt ?? 25;
      const isKill = res.huntResult?.result === "kill";

      setHeroAnim("attack");

      setTimeout(() => {
        if (monsterDef.id === "slime") {
          setSlimeFrame(6); // slime_hit
        }
        setMonsterAnim("hit");
        const nextHp = Math.max(0, monsterCurrentHp - damageDealt);
        setMonsterCurrentHp(nextHp);

        addFloatingText(
          `💥 -${damageDealt} HP!`,
          "text-amber-300",
          65,
          40,
          res.huntResult?.result === "kill"
        );

        setTimeout(() => {
          setHeroAnim("idle");
        }, 300);

        if (isKill || nextHp <= 0) {
          setTimeout(() => {
            if (monsterDef.id === "slime") {
              setSlimeFrame(7); // slime_dead
            }
            setMonsterAnim("dead");
            const coins = res.huntResult?.coinsAwarded ?? 10;
            const score = res.huntResult?.scoreAwarded ?? 500;
            setBattleNotice(`🎉 TIÊU DIỆT ${monsterDef.name.toUpperCase()}! +${coins} Xu 🪙, +${score} Điểm 🏆`);
            addFloatingText(`🪙 +${coins} Xu!`, "text-yellow-300", 65, 30);

            if (res.state) onStateUpdate(res.state);

            setTimeout(() => {
              spawnNextMonster();
              onNextQuestion();
              setUserAnswer(null);
            }, 1400);
          }, 350);
        } else {
          // QUÁI CÒN SỐNG -> PHẢN CÔNG
          setTimeout(() => {
            if (monsterDef.id === "slime") {
              setSlimeFrame(3);
              setTimeout(() => setSlimeFrame(4), 100);
            }
            setMonsterAnim("jump");

            setTimeout(() => {
              setHeroAnim("hurt");
              const damageTaken = res.huntResult?.damageTaken ?? 6;
              addFloatingText(`💔 -${damageTaken} HP`, "text-rose-400", 25, 40);

              if (totalDefensePct > 0) {
                addFloatingText(`🛡️ Giảm -${totalDefensePct}%`, "text-blue-400", 25, 25);
              }

              if (monsterDef.id === "slime") {
                setSlimeFrame(5);
                setTimeout(() => {
                  setSlimeFrame(1);
                  setMonsterAnim("idle");
                }, 200);
              } else {
                setMonsterAnim("idle");
              }

              setTimeout(() => {
                setHeroAnim("idle");
                if (res.state) onStateUpdate(res.state);
                onNextQuestion();
                setUserAnswer(null);
              }, 400);
            }, 300);
          }, 500);
        }
      }, 350);
    } else {
      // 2. TRẢ LỜI SAI -> QUÁI ĐÁNH TRẢ
      setBattleNotice(`❌ Trả lời chưa chính xác! ${monsterDef.name} phản công!`);

      if (monsterDef.id === "slime") {
        setSlimeFrame(3);
        setTimeout(() => setSlimeFrame(4), 100);
      }
      setMonsterAnim("jump");

      setTimeout(() => {
        setHeroAnim("hurt");
        const damageTaken = res.huntResult?.damageTaken ?? 8;
        addFloatingText(`💔 -${damageTaken} HP!`, "text-rose-400", 25, 40);

        if (totalDefensePct > 0) {
          addFloatingText(`🛡️ Giảm -${totalDefensePct}%`, "text-blue-400", 25, 25);
        }

        if (monsterDef.id === "slime") {
          setSlimeFrame(5);
          setTimeout(() => {
            setSlimeFrame(1);
            setMonsterAnim("idle");
          }, 200);
        } else {
          setMonsterAnim("idle");
        }

        setTimeout(() => {
          setHeroAnim("idle");
          if (res.state) onStateUpdate(res.state);
          onNextQuestion();
          setUserAnswer(null);
        }, 400);
      }, 350);
    }
  };

  // HÀNH ĐỘNG RÚT LUI (FLEE)
  const handleFlee = async () => {
    setIsFleeing(true);
    setHeroAnim("flee");

    const res = await fleeSurvivalBattle({
      sessionId,
      monsterId: monsterDef.id,
    });

    setIsFleeing(false);
    setShowFleeConfirm(false);

    if (res.success && res.state) {
      onStateUpdate(res.state);
      alert(res.message);
      onClose();
    } else {
      alert(res.error || "Không thể rút lui lúc này");
      setHeroAnim("idle");
    }
  };

  // CẤP CỨU KHI HẾT MÁU: DÙNG THUỐC / MUA BÌNH MÁU / HỒI SINH TRẠI
  const handleEmergencyHeal = async (action: "use_inventory" | "buy_potion" | "free_camp", itemId?: string) => {
    setHealingLoading(true);
    const res = await emergencyHealOrRevive({
      sessionId,
      action,
      itemId,
    });
    setHealingLoading(false);

    if (res.success && res.state) {
      onStateUpdate(res.state);
      alert(res.message);
      if (action === "free_camp") {
        onClose();
      }
    } else {
      alert(res.error || "Có lỗi xảy ra khi hồi phục sinh lực");
    }
  };

  const monsterHpPercent = Math.max(0, Math.min(100, (monsterCurrentHp / Math.max(1, monsterMaxHp)) * 100));
  const playerHpPercent = Math.max(0, Math.min(100, (playerHp / Math.max(1, playerMaxHp)) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
      {/* ============================================================== */}
      {/* 1. THANH TRẠNG THÁI TRÊN CÙNG: RÚT LUI & CHỈ SỐ               */}
      {/* ============================================================== */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-3 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={submitting || isFleeing}
            onClick={() => setShowFleeConfirm(true)}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>🏃 Rút Lui</span>
          </button>
          <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
            (Rút lui bị cào 15 HP &amp; trừ 50 Điểm rank)
          </span>
        </div>

        <div className="flex items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
            <Coins className="w-4 h-4" />
            <span className="font-bold">{playerCoins} Xu (Không mất khi ngất)</span>
          </div>

          {playerState?.streak > 0 && (
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Streak x{playerState.streak}</span>
            </div>
          )}

          <div className="text-slate-400 hidden md:block">
            Ngày {clock.dayNumber} · {clock.isDay ? "☀️ Ngày" : "🌙 Đêm"}
          </div>
        </div>
      </div>

      {/* POPUP XÁC NHẬN RÚT LUI */}
      {showFleeConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 p-6 sm:p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-white text-lg">Xác Nhận Rút Lui Khỏi Trận?</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Trong lúc quay đầu tháo chạy, <strong>{monsterDef.name}</strong> sẽ đuổi theo cào bạn mất máu (khoảng 15 HP) và bạn bị <strong>trừ 50 Điểm Rank</strong>!
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFleeConfirm(false)}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
              >
                Chiến tiếp!
              </button>
              <button
                type="button"
                disabled={isFleeing}
                onClick={handleFlee}
                className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                {isFleeing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Vẫn Rút Lui"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP CẤP CỨU SINH LỰC KHI HẾT MÁU (THÂN THIỆN CHO TÂN THỦ) */}
      {isOutOfHp && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 p-6 sm:p-8 rounded-3xl max-w-lg w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto animate-pulse">
              <Heart className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-black text-white text-xl">Bạn Đang Hết Sinh Lực!</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Đừng lo, <strong>toàn bộ {playerCoins} Xu của bạn được bảo lưu 100%</strong>! Hãy chọn phương án tiếp sức sinh lực bên dưới để tiếp tục:
              </p>
            </div>

            <div className="space-y-3 text-left">
              {/* Tùy chọn 1: Dùng bình máu có sẵn */}
              {healingItems.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                  <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Package className="w-4 h-4" />
                    <span>Dùng vật phẩm hồi phục có sẵn trong túi:</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {healingItems.map((item: any) => {
                      const def = ITEM_REGISTRY[item.itemId];
                      return (
                        <button
                          key={item.itemId}
                          type="button"
                          disabled={healingLoading}
                          onClick={() => handleEmergencyHeal("use_inventory", item.itemId)}
                          className="px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 hover:bg-emerald-900/30 text-xs font-semibold text-white flex items-center justify-between"
                        >
                          <span>{def?.icon || "🧪"} {def?.name || item.itemId}</span>
                          <span className="text-[10px] text-emerald-400 font-mono">x{item.qty}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tùy chọn 2: Mua bình máu cấp cứu (10 xu) */}
              <button
                type="button"
                disabled={healingLoading || playerCoins < 10}
                onClick={() => handleEmergencyHeal("buy_potion")}
                className="w-full p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-left flex items-center justify-between gap-3 transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                    🧪
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Mua Bình Máu Cấp Cứu (+50 HP)</p>
                    <p className="text-[11px] text-slate-400">Giá hạt dẻ tân thủ: chỉ 10 Xu · Hồi máu đánh tiếp</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 shrink-0">10 Xu</span>
              </button>

              {/* Tùy chọn 3: Hồi sinh miễn phí tại trại */}
              <button
                type="button"
                disabled={healingLoading}
                onClick={() => handleEmergencyHeal("free_camp")}
                className="w-full p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:bg-slate-800 text-left flex items-center justify-between gap-3 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center text-lg">
                    🏕️
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Hồi Sinh Miễn Phí Về Lều Trại (+100 HP)</p>
                    <p className="text-[11px] text-slate-400">Hồi đầy 100% sinh lực · Giữ nguyên 100% Xu kiếm được</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">Miễn Phí</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SÀN ĐẤU 2D RPG (DÀN TRẢI ĐỀU TRÊN MÀN HÌNH MÁY TÍNH)         */}
      {/* ============================================================== */}
      <div className="relative w-full max-w-7xl mx-auto flex-1 min-h-[300px] sm:min-h-[360px] md:min-h-[400px] flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-hidden select-none">
        {/* Nền Sân Đấu Rừng Sương Mù Mở Rộng */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-emerald-950/40 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-emerald-900/40 via-slate-900 to-transparent border-b-4 border-emerald-600/50 pointer-events-none" />

        {/* Thanh Máu 2 Bên Dàn Trải Đều (Player vs Monster) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 lg:gap-16">
          {/* Cột 1: Thông tin Học sinh */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/85 border border-slate-800 backdrop-blur-sm space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
              <span className="font-bold text-white flex items-center gap-2">
                <span>🛡️ Nhà Thám Hiểm</span>
                <span className="text-[11px] text-amber-400 font-semibold">
                  (Công +{weaponDef?.atk || 25})
                </span>
              </span>
              <span className="text-emerald-400 font-bold">{playerHp}/{playerMaxHp} HP</span>
            </div>
            {/* Thanh HP */}
            <div className="w-full h-3.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
          </div>

          {/* Cột 2: Thông tin Quái vật */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/85 border border-slate-800 backdrop-blur-sm space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
              <span className="font-bold text-rose-400 flex items-center gap-2">
                <span>{monsterDef.avatar} {monsterDef.name}</span>
                <span className="text-[11px] text-slate-400">
                  (ATK {scaledMonster.atk})
                </span>
              </span>
              <span className="text-rose-400 font-bold">{monsterCurrentHp}/{monsterMaxHp} HP</span>
            </div>
            {/* Thanh HP */}
            <div className="w-full h-3.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 transition-all duration-300 rounded-full"
                style={{ width: `${monsterHpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Thông báo sự kiện trận đấu */}
        {battleNotice && (
          <div className="relative z-20 mx-auto my-3 px-5 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs sm:text-sm font-bold animate-bounce shadow-xl">
            {battleNotice}
          </div>
        )}

        {/* FLOATING DAMAGE TEXTS */}
        {floatingTexts.map((item) => (
          <div
            key={item.id}
            className={`absolute z-30 font-black font-mono transition-all duration-1000 pointer-events-none animate-out fade-out slide-out-to-top-8 ${
              item.isCrit ? "text-2xl sm:text-3xl text-yellow-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.9)]" : "text-lg sm:text-xl " + item.color
            }`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
          >
            {item.text}
          </div>
        ))}

        {/* KHÔNG GIAN ĐỐI KHÁNG DÀN ĐỀU RỘNG RÃI */}
        <div className="relative z-10 w-full flex items-end justify-between px-8 sm:px-24 lg:px-36 pb-3 min-h-[180px]">
          {/* ========================================================== */}
          {/* A. NHÂN VẬT HỌC SINH (HERO)                                */}
          {/* ========================================================== */}
          <div
            className={`relative flex flex-col items-center transition-all duration-300 ${
              heroAnim === "attack"
                ? "translate-x-36 sm:translate-x-56 lg:translate-x-72 scale-110"
                : heroAnim === "hurt"
                ? "-translate-x-6 scale-95 brightness-125"
                : heroAnim === "flee"
                ? "-translate-x-64 opacity-0 scale-75"
                : "animate-pulse"
            }`}
            style={{
              filter: heroAnim === "hurt" ? "drop-shadow(0 0 16px rgba(239, 68, 68, 0.9))" : undefined,
            }}
          >
            {/* Vệt kiếm chém */}
            {heroAnim === "attack" && (
              <div className="absolute -top-6 -right-12 w-28 h-28 border-r-4 border-t-4 border-amber-400 rounded-full animate-ping pointer-events-none" />
            )}

            {/* Khiên bảo vệ */}
            {heroAnim === "hurt" && totalDefensePct > 0 && (
              <div className="absolute -inset-6 border-2 border-blue-400/80 rounded-full animate-pulse bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-10 h-10 text-blue-400" />
              </div>
            )}

            {/* Model Chiến Binh */}
            <div className="relative w-24 h-32 flex flex-col items-center">
              <div className="relative w-14 h-14 rounded-2xl bg-amber-200 border-2 border-slate-900 shadow-md flex items-center justify-center z-10">
                <div className="flex gap-2.5">
                  <div className="w-2 h-2.5 bg-slate-950 rounded-full" />
                  <div className="w-2 h-2.5 bg-slate-950 rounded-full" />
                </div>
                <div className="absolute -top-2.5 inset-x-0 h-4.5 bg-slate-700 border-t-2 border-slate-500 rounded-t-xl" />
              </div>

              <div className="relative w-16 h-14 -mt-1 rounded-xl bg-slate-800 border-2 border-slate-950 flex items-center justify-between px-1.5 z-0 shadow-lg">
                <div className="absolute -top-1.5 inset-x-1.5 h-2.5 bg-amber-500 rounded-full" />
                <div className="w-5 h-7 rounded bg-blue-600 border border-blue-300 flex items-center justify-center text-xs shadow">
                  🛡️
                </div>
                <div className="w-6 h-9 rounded bg-slate-600 border border-slate-400" />
                <div
                  className={`w-5 h-12 flex flex-col items-center transition-transform ${
                    heroAnim === "attack" ? "rotate-45 translate-x-3" : "-rotate-12"
                  }`}
                >
                  <div className="w-2.5 h-9 bg-slate-200 border border-slate-400 rounded-t shadow" />
                  <div className="w-5 h-2 bg-amber-600 rounded-full" />
                  <div className="w-2 h-2 bg-amber-800 rounded-b" />
                </div>
              </div>

              <div className="flex gap-2.5 -mt-0.5">
                <div className="w-4 h-6 bg-slate-900 rounded-b" />
                <div className="w-4 h-6 bg-slate-900 rounded-b" />
              </div>

              <div className="w-16 h-3 bg-black/40 rounded-full blur-[2px] mt-1" />
            </div>

            <span className="text-xs font-mono font-bold text-white mt-1 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-slate-800">
              Nhà Thám Hiểm
            </span>
          </div>

          {/* ========================================================== */}
          {/* B. QUÁI VẬT ĐỐI THỦ (MONSTER)                              */}
          {/* ========================================================== */}
          <div
            className={`relative flex flex-col items-center transition-all duration-300 ${
              monsterAnim === "jump"
                ? "-translate-x-36 sm:-translate-x-56 lg:-translate-x-72 scale-110"
                : monsterAnim === "hit"
                ? "translate-x-6 scale-95"
                : monsterAnim === "dead"
                ? "scale-y-50 opacity-60 translate-y-3"
                : monsterAnim === "spawn"
                ? "animate-bounce"
                : "animate-pulse"
            }`}
            style={{
              filter: monsterAnim === "hit" ? "drop-shadow(0 0 16px rgba(239, 68, 68, 0.9))" : undefined,
            }}
          >
            {monsterDef.id === "slime" ? (
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-end justify-center">
                <img
                  src={
                    slimeFrame === 1
                      ? "/sprites/slime_idle_1_clean.png"
                      : slimeFrame === 2
                      ? "/sprites/slime_idle_2_clean.png"
                      : slimeFrame === 3
                      ? "/sprites/slime_prep_clean.png"
                      : slimeFrame === 4
                      ? "/sprites/slime_jump_clean.png"
                      : slimeFrame === 5
                      ? "/sprites/slime_land_clean.png"
                      : slimeFrame === 6
                      ? "/sprites/slime_hit_clean.png"
                      : "/sprites/slime_dead_clean.png"
                  }
                  alt="Slime Sprite"
                  className={`max-w-full max-h-full object-contain filter drop-shadow-md select-none transition-transform ${
                    slimeFrame === 4 ? "-translate-y-5" : ""
                  }`}
                  draggable={false}
                />
                <div className="absolute -bottom-1 w-20 h-3.5 bg-black/40 rounded-full blur-[2px]" />
              </div>
            ) : (
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex flex-col items-center justify-end">
                <span className="text-7xl sm:text-8xl filter drop-shadow-lg select-none">
                  {monsterDef.avatar}
                </span>
                <div className="w-20 h-3.5 bg-black/40 rounded-full blur-[2px] mt-1" />
              </div>
            )}

            <span className="text-xs font-mono font-bold text-rose-300 mt-1 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-slate-800">
              {monsterDef.name}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. BẢNG CÂU HỎI DÀN TRẢI ĐỀU RỘNG RÃI (RESPONSIVE CO DÃN)       */}
      {/* ============================================================== */}
      <div className="w-full bg-slate-900 border-t border-slate-800 p-4 sm:p-6 lg:p-8 shadow-2xl">
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto space-y-6">
          {PlayerComponent && question ? (
            <PlayerComponent
              content={question.content}
              value={userAnswer}
              onChange={(val) => setUserAnswer(val)}
              disabled={submitting || monsterAnim === "dead" || isOutOfHp}
            />
          ) : (
            <div className="p-8 text-center text-slate-400">Đang tải câu hỏi...</div>
          )}

          <button
            type="button"
            disabled={userAnswer === null || submitting || monsterAnim === "dead" || isOutOfHp}
            onClick={handleAttack}
            className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black font-mono text-sm sm:text-base transition-all shadow-xl shadow-amber-500/25 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang tung đòn tấn công...</span>
              </>
            ) : isOutOfHp ? (
              <>
                <Heart className="w-5 h-5 text-rose-500" />
                <span>HẾT MÁU! HÃY DÙNG BÌNH MÁU ĐỂ HỒI PHỤC</span>
              </>
            ) : (
              <>
                <Swords className="w-5 h-5" />
                <span>VUNG KIẾM TẤN CÔNG QUÁI VẬT</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
