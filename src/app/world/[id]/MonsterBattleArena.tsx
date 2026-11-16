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
  XCircle,
  CheckCircle,
  Check,
  ArrowRight,
  BookOpen,
  SunMedium,
  Moon,
} from "lucide-react";
import { MonsterBestiaryModal } from "@/components/MonsterBestiaryModal";
import { getScaledMonster, getRandomFarmMonster, MONSTER_REGISTRY, type MonsterDef } from "@/game-modes/survival/monsters";
import { ITEM_REGISTRY } from "@/game-modes/survival/items";
import { getQuestionType } from "@/question-types/registry";
import { submitSurvivalAction, fleeSurvivalBattle, emergencyHealOrRevive } from "./actions";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { localizeQuestion } from "@/lib/i18n/questions-translation";
import { PixelHero } from "@/components/PixelHero";
import { PixelItemIcon } from "@/components/PixelItemIcon";

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
  const { t, language, isEn } = useLanguage();

  // 1. Quái vật hiện tại trong đấu trường
  const [monsterDef, setMonsterDef] = useState<MonsterDef>(() => {
    if (initialMonsterId && MONSTER_REGISTRY[initialMonsterId]) {
      return MONSTER_REGISTRY[initialMonsterId];
    }
    return getRandomFarmMonster(true);
  });

  const monsterName = (t.monsters as any)?.[monsterDef.id] || monsterDef.name;

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
  const [monsterFrame, setMonsterFrame] = useState<number>(1);

  // Helper hàm ánh xạ khung hình animation theo từng loại quái vật
  const getMonsterSprite = (id: string, frame: number): string => {
    if (id === "slime") {
      switch (frame) {
        case 1: return "/sprites/slime_idle_1_clean.png";
        case 2: return "/sprites/slime_idle_2_clean.png";
        case 3: return "/sprites/slime_prep_clean.png";
        case 4: return "/sprites/slime_jump_clean.png";
        case 5: return "/sprites/slime_land_clean.png";
        case 6: return "/sprites/slime_hit_clean.png";
        case 7:
        case 8: return "/sprites/slime_dead_clean.png";
        default: return "/sprites/slime_idle_1_clean.png";
      }
    }
    if (id === "baby_wolf" || id === "wolf") {
      switch (frame) {
        case 1: return "/sprites/baby_wolf/frame_1.png"; // Đứng chờ (Idle)
        case 2: return "/sprites/baby_wolf/frame_2.png"; // Chuẩn bị chạy
        case 3: return "/sprites/baby_wolf/frame_3.png"; // Chạy
        case 4: return "/sprites/baby_wolf/frame_4.png"; // Nhảy
        case 5: return "/sprites/baby_wolf/frame_5.png"; // Tiếp đất
        case 6: return "/sprites/baby_wolf/frame_6.png"; // Bị thương (Hurt)
        case 7: return "/sprites/baby_wolf/frame_7.png"; // Nằm xuống (Death)
        case 8: return "/sprites/baby_wolf/frame_8.png"; // Ngồi chờ
        default: return "/sprites/baby_wolf/frame_1.png";
      }
    }
    if (id === "mist_spider") {
      switch (frame) {
        case 1: return "/sprites/mist_spider/frame_1.png"; // Đứng chờ (Idle)
        case 2: return "/sprites/mist_spider/frame_2.png"; // Bò (Crawl)
        case 3: return "/sprites/mist_spider/frame_3.png"; // Chuẩn bị tấn công
        case 4: return "/sprites/mist_spider/frame_4.png"; // Phun sương độc
        case 5: return "/sprites/mist_spider/frame_5.png"; // Bị choáng (Hurt)
        case 6: return "/sprites/mist_spider/frame_6.png"; // Bị đánh bại (Defeated)
        case 7: return "/sprites/mist_spider/frame_7.png"; // Tan biến trong sương
        case 8: return "/sprites/mist_spider/frame_8.png"; // Sương độc còn sót lại
        default: return "/sprites/mist_spider/frame_1.png";
      }
    }
    if (id === "boar_king" || id === "wild_boar") {
      switch (frame) {
        case 1: return "/sprites/boar_king/frame_1.png"; // Idle (Đứng uy nghi)
        case 2: return "/sprites/boar_king/frame_2.png"; // Walk (Đi tuần)
        case 3: return "/sprites/boar_king/frame_3.png"; // Charge (Lao tới)
        case 4: return "/sprites/boar_king/frame_4.png"; // Roar (Gầm thét)
        case 5: return "/sprites/boar_king/frame_5.png"; // Impact (Húc mạnh)
        case 6: return "/sprites/boar_king/frame_6.png"; // Stun (Choáng váng)
        case 7: return "/sprites/boar_king/frame_7.png"; // Defeated (Bị đánh bại)
        case 8: return "/sprites/boar_king/frame_8.png"; // Vanish (Tan biến còn vương miện)
        default: return "/sprites/boar_king/frame_1.png";
      }
    }
    if (id === "forest_goblin" || id === "goblin") {
      switch (frame) {
        case 1: return "/sprites/goblin/frame_1.png"; // Đứng chờ (Idle)
        case 2: return "/sprites/goblin/frame_2.png"; // Đi bộ (Walk)
        case 3: return "/sprites/goblin/frame_3.png"; // Chạy (Run)
        case 4: return "/sprites/goblin/frame_4.png"; // Nhảy (Jump)
        case 5: return "/sprites/goblin/frame_5.png"; // Vui vẻ (Happy)
        case 6: return "/sprites/goblin/frame_6.png"; // Tức giận (Angry)
        case 7: return "/sprites/goblin/frame_7.png"; // Ngủ / Nằm bẹp (Sleep/Defeat)
        case 8: return "/sprites/goblin/frame_8.png"; // Ngồi nghỉ (Sit)
        default: return "/sprites/goblin/frame_1.png";
      }
    }
    if (id === "small_golem" || id === "rock_golem" || id === "golem") {
      switch (frame) {
        case 1: return "/sprites/small_golem/frame_1.png"; // Đứng chờ (Idle)
        case 2: return "/sprites/small_golem/frame_2.png"; // Bò (Crawl)
        case 3: return "/sprites/small_golem/frame_3.png"; // Chuẩn bị tấn công
        case 4: return "/sprites/small_golem/frame_4.png"; // Phun sương độc / khói đá
        case 5: return "/sprites/small_golem/frame_5.png"; // Bị choáng (Hurt)
        case 6: return "/sprites/small_golem/frame_6.png"; // Bị đánh bại (Defeated)
        case 7: return "/sprites/small_golem/frame_7.png"; // Tan biến trong sương (Fade)
        case 8: return "/sprites/small_golem/frame_8.png"; // Tàn tích còn sót lại (Residue)
        default: return "/sprites/small_golem/frame_1.png";
      }
    }
    if (id === "skeleton") {
      switch (frame) {
        case 1: return "/sprites/skeleton/frame_1.png"; // Đứng chờ (Idle)
        case 2: return "/sprites/skeleton/frame_2.png"; // Bò (Crawl)
        case 3: return "/sprites/skeleton/frame_3.png"; // Chuẩn bị tấn công
        case 4: return "/sprites/skeleton/frame_4.png"; // Chém kiếm trăng khuyết tím (Slash)
        case 5: return "/sprites/skeleton/frame_5.png"; // Bị choáng (Hurt)
        case 6: return "/sprites/skeleton/frame_6.png"; // Bị đánh bại (Defeated)
        case 7: return "/sprites/skeleton/frame_7.png"; // Tan biến trong sương / linh hồn
        case 8: return "/sprites/skeleton/frame_8.png"; // Tàn tích còn sót lại (Residue)
        default: return "/sprites/skeleton/frame_1.png";
      }
    }
    return "";
  };

  // 3. Floating combat text (Sát thương bay lên)
  const [floatingTexts, setFloatingTexts] = useState<
    Array<{ id: number; text: string; color: string; isCrit?: boolean; x: number; y: number }>
  >([]);

  // 4. Trạng thái nộp bài & cứu thương
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [battleNotice, setBattleNotice] = useState<string | null>(null);
  const [showFleeConfirm, setShowFleeConfirm] = useState(false);
  const [showBestiary, setShowBestiary] = useState(false);
  const [isFleeing, setIsFleeing] = useState(false);
  const [healingLoading, setHealingLoading] = useState(false);
  const [reviewData, setReviewData] = useState<{
    isCorrect: boolean;
    correctAnswerDisplay?: string;
    explanation?: string | null;
    message?: string;
  } | null>(null);

  // Câu hỏi hiện tại
  const question = questions[currentQIndex % Math.max(1, questions.length)];
  const localizedQuestion = question ? localizeQuestion(question, language) : null;
  const typeDef = localizedQuestion ? getQuestionType(localizedQuestion.type) : null;
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
  const playerCoins = Number.isFinite(playerState?.coins)
    ? playerState.coins
    : (Number.isFinite(playerState?.gold) ? playerState.gold : 0);
  const isOutOfHp = playerHp <= 0;

  // Danh sách vật phẩm hồi phục trong túi đồ
  const inventory = playerState?.inventory || [];
  const healingItems = inventory.filter(
    (item: any) =>
      ["apple", "bandage", "bread", "roasted_meat", "small_potion", "large_potion"].includes(item.itemId) &&
      item.qty > 0
  );

  // Nhịp thở nhấp nhô & hoạt ảnh idle cho quái vật (mượt mà, tự nhiên chuẩn Retro RPG)
  useEffect(() => {
    if (monsterAnim !== "idle") return;
    const interval = setInterval(() => {
      setMonsterFrame((prev) => {
        if (monsterDef.id === "slime") {
          return prev === 1 ? 2 : 1;
        }
        if (monsterDef.id === "baby_wolf" || monsterDef.id === "wolf") {
          return prev === 1 ? 8 : 1;
        }
        if (monsterDef.id === "mist_spider") {
          return prev === 1 ? 2 : 1;
        }
        if (monsterDef.id === "boar_king" || monsterDef.id === "wild_boar") {
          return prev === 1 ? 2 : 1;
        }
        if (monsterDef.id === "forest_goblin" || monsterDef.id === "goblin") {
          return prev === 1 ? 8 : 1;
        }
        if (monsterDef.id === "small_golem" || monsterDef.id === "rock_golem" || monsterDef.id === "golem") {
          return prev === 1 ? 2 : 1;
        }
        if (monsterDef.id === "skeleton") {
          return prev === 1 ? 2 : 1;
        }
        return 1;
      });
    }, 460);
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

  // Đếm số quái nhỏ đã hạ trong lượt hiện tại (cứ 5 quái nhỏ sẽ xuất hiện 1 boss)
  const [monstersDefeatedCount, setMonstersDefeatedCount] = useState<number>(0);

  // Hàm chuyển sang quái tiếp theo: cứ đủ 5 con quái nhỏ sẽ xuất hiện 1 con Boss
  const spawnNextMonster = (countOverride?: number) => {
    const currentCount = typeof countOverride === "number" ? countOverride : monstersDefeatedCount;
    const shouldSpawnBoss = currentCount > 0 && currentCount % 5 === 0 && !monsterDef.isBoss;

    const next = shouldSpawnBoss ? MONSTER_REGISTRY.boar_king : getRandomFarmMonster(true);
    const scaled = getScaledMonster(next.id, clock.dayNumber, !clock.isDay);
    const nextName = (t.monsters as any)?.[next.id] || next.name;
    setMonsterDef(next);
    setMonsterMaxHp(scaled.hp);
    setMonsterCurrentHp(scaled.hp);
    setMonsterAnim("spawn");

    // Khung hình xuất hiện theo từng loại quái
    if (next.id === "boar_king") {
      setMonsterFrame(4); // Roar (Gầm thét khi xuất hiện)
    } else if (next.id === "mist_spider") {
      setMonsterFrame(7); // Fade in từ sương
      setTimeout(() => setMonsterFrame(2), 250);
    } else if (next.id === "baby_wolf" || next.id === "wolf") {
      setMonsterFrame(4); // Nhảy tới
      setTimeout(() => setMonsterFrame(5), 250);
    } else if (next.id === "forest_goblin" || next.id === "goblin") {
      setMonsterFrame(4); // Nhảy xuất hiện
      setTimeout(() => setMonsterFrame(5), 250); // Vui vẻ khích tướng
    } else if (next.id === "small_golem" || next.id === "rock_golem" || next.id === "golem") {
      setMonsterFrame(2); // Bò nhô lên từ lòng đất
    } else if (next.id === "skeleton") {
      setMonsterFrame(7); // Hóa hình từ làn khói tím
      setTimeout(() => setMonsterFrame(2), 250);
    } else if (next.id === "slime") {
      setMonsterFrame(4);
      setTimeout(() => setMonsterFrame(5), 250);
    } else {
      setMonsterFrame(1);
    }

    if (shouldSpawnBoss) {
      setBattleNotice(
        isEn
          ? `👑 WARNING: REGIONAL BOSS APPEARED: ${nextName.toUpperCase()}!`
          : `👑 CẢNH BÁO: TRÙM KHU VỰC XUẤT HIỆN: ${next.name.toUpperCase()}!`
      );
    } else {
      setBattleNotice(isEn ? `⚡ New monster appeared: ${nextName}!` : `⚡ Quái vật mới xuất hiện: ${next.name}!`);
    }

    setTimeout(() => {
      setMonsterAnim("idle");
      setMonsterFrame(1);
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
      alert(res?.error || (isEn ? "An error occurred while submitting" : "Có lỗi xảy ra khi nộp bài"));
      return;
    }

    // 1. NẾU TRẢ LỜI ĐÚNG -> BẠN ĐÁNH QUÁI, QUÁI KHÔNG THỂ ĐÁNH ĐƯỢC BẠN
    if (res.isCorrect) {
      setReviewData(null);
      const damageDealt = res.huntResult?.damageDealt ?? 25;
      const isKill = res.huntResult?.result === "kill";

      setHeroAnim("attack");

      setTimeout(() => {
        if (monsterDef.id === "slime") {
          setMonsterFrame(6); // slime_hit
        } else if (monsterDef.id === "baby_wolf" || monsterDef.id === "wolf") {
          setMonsterFrame(6); // hurt
        } else if (monsterDef.id === "mist_spider") {
          setMonsterFrame(5); // hurt
        } else if (monsterDef.id === "boar_king" || monsterDef.id === "wild_boar") {
          setMonsterFrame(6); // stun
        } else if (monsterDef.id === "forest_goblin" || monsterDef.id === "goblin") {
          setMonsterFrame(6); // angry / hurt
        } else if (monsterDef.id === "small_golem" || monsterDef.id === "rock_golem" || monsterDef.id === "golem") {
          setMonsterFrame(5); // hurt
        } else if (monsterDef.id === "skeleton") {
          setMonsterFrame(5); // hurt
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
        }, 220);

        if (isKill || nextHp <= 0) {
          setTimeout(() => {
            if (monsterDef.id === "slime") {
              setMonsterFrame(7); // slime_dead
            } else if (monsterDef.id === "baby_wolf" || monsterDef.id === "wolf") {
              setMonsterFrame(7); // death
            } else if (monsterDef.id === "mist_spider") {
              setMonsterFrame(6); // defeat
              setTimeout(() => setMonsterFrame(7), 240); // fade
              setTimeout(() => setMonsterFrame(8), 500); // residue
            } else if (monsterDef.id === "boar_king" || monsterDef.id === "wild_boar") {
              setMonsterFrame(7); // defeat
              setTimeout(() => setMonsterFrame(8), 450); // vanish
            } else if (monsterDef.id === "forest_goblin" || monsterDef.id === "goblin") {
              setMonsterFrame(7); // sleep / defeat
            } else if (monsterDef.id === "small_golem" || monsterDef.id === "rock_golem" || monsterDef.id === "golem") {
              setMonsterFrame(6); // defeat
              setTimeout(() => setMonsterFrame(7), 240); // fade
              setTimeout(() => setMonsterFrame(8), 500); // residue
            } else if (monsterDef.id === "skeleton") {
              setMonsterFrame(6); // defeat
              setTimeout(() => setMonsterFrame(7), 240); // fade
              setTimeout(() => setMonsterFrame(8), 500); // residue
            }
            setMonsterAnim("dead");
            const coins = res.huntResult?.coinsAwarded ?? 10;
            const score = res.huntResult?.scoreAwarded ?? 500;
            setBattleNotice(
              isEn
                ? `🎉 DEFEATED ${monsterName.toUpperCase()}! +${coins} Coins 🪙, +${score} Points 🏆`
                : `🎉 TIÊU DIỆT ${monsterDef.name.toUpperCase()}! +${coins} Xu 🪙, +${score} Điểm 🏆`
            );
            addFloatingText(isEn ? `🪙 +${coins} Coins!` : `🪙 +${coins} Xu!`, "text-yellow-300", 65, 30);

            if (res.state) onStateUpdate(res.state);

            const nextCount = monsterDef.isBoss ? 0 : monstersDefeatedCount + 1;
            setMonstersDefeatedCount(nextCount);

            setTimeout(() => {
              spawnNextMonster(nextCount);
              onNextQuestion();
              setUserAnswer(null);
            }, 650);
          }, 240);
        } else {
          // QUÁI CÒN SỐNG -> BẠN ĐÃ TẤN CÔNG THÀNH CÔNG, QUÁI KHÔNG THỂ ĐÁNH LẠI BẠN
          setTimeout(() => {
            setMonsterFrame(1);
            setMonsterAnim("idle");
            if (res.state) onStateUpdate(res.state);
            onNextQuestion();
            setUserAnswer(null);
          }, 280);
        }
      }, 180);
    } else {
      // 2. TRẢ LỜI SAI -> QUÁI PHẢN CÔNG MƯỢT MÀ VỚI NHỊP ĐỘ CHUẨN RPG
      setBattleNotice(isEn ? `❌ Incorrect answer! ${monsterName} counterattacks!` : `❌ Trả lời chưa chính xác! ${monsterDef.name} phản công!`);

      // Giai đoạn 1: Chuẩn bị / Lấy đà (Anticipation)
      if (monsterDef.id === "slime") {
        setMonsterFrame(3); // prep
      } else if (monsterDef.id === "baby_wolf" || monsterDef.id === "wolf") {
        setMonsterFrame(2); // prep run
      } else if (monsterDef.id === "mist_spider") {
        setMonsterFrame(3); // prep attack
      } else if (monsterDef.id === "boar_king" || monsterDef.id === "wild_boar") {
        setMonsterFrame(3); // charge
      } else if (monsterDef.id === "forest_goblin" || monsterDef.id === "goblin") {
        setMonsterFrame(3); // run
      } else if (monsterDef.id === "small_golem" || monsterDef.id === "rock_golem" || monsterDef.id === "golem") {
        setMonsterFrame(3); // attack
      } else if (monsterDef.id === "skeleton") {
        setMonsterFrame(3); // prep slash
      }

      // Giai đoạn 2: Lao tới tấn công (Action / Strike)
      setTimeout(() => {
        setMonsterAnim("jump");
        if (monsterDef.id === "slime") {
          setMonsterFrame(4); // jump
        } else if (monsterDef.id === "baby_wolf" || monsterDef.id === "wolf") {
          setMonsterFrame(4); // jump strike
        } else if (monsterDef.id === "mist_spider") {
          setMonsterFrame(4); // poison cloud
        } else if (monsterDef.id === "boar_king" || monsterDef.id === "wild_boar") {
          setMonsterFrame(5); // impact
        } else if (monsterDef.id === "forest_goblin" || monsterDef.id === "goblin") {
          setMonsterFrame(4); // jump
        } else if (monsterDef.id === "small_golem" || monsterDef.id === "rock_golem" || monsterDef.id === "golem") {
          setMonsterFrame(4); // poison gas
        } else if (monsterDef.id === "skeleton") {
          setMonsterFrame(4); // crescent slash
        }

        // Giai đoạn 3: Va chạm & Hiệp sĩ trúng đòn (Impact)
        setTimeout(() => {
          setHeroAnim("hurt");
          const damageTaken = res.huntResult?.damageTaken ?? 8;
          addFloatingText(`💔 -${damageTaken} HP!`, "text-rose-400", 25, 40);

          if (totalDefensePct > 0) {
            addFloatingText(isEn ? `🛡️ -${totalDefensePct}% Dmg` : `🛡️ Giảm -${totalDefensePct}%`, "text-blue-400", 25, 25);
          }

          // Giai đoạn 4: Tiếp đất / Thu chiêu (Follow-through)
          setTimeout(() => {
            if (monsterDef.id === "slime" || monsterDef.id === "baby_wolf" || monsterDef.id === "wolf") {
              setMonsterFrame(5); // land
            } else if (monsterDef.id === "forest_goblin" || monsterDef.id === "goblin") {
              setMonsterFrame(5); // happy taunt
            } else {
              setMonsterFrame(1);
            }

            // Giai đoạn 5: Trở về vị trí nghỉ ngơi (Recovery)
            setTimeout(() => {
              setMonsterFrame(1);
              setMonsterAnim("idle");
              setHeroAnim("idle");
              if (res.state) onStateUpdate(res.state);

              // Cung cấp bảng ôn tập và hiển thị rõ ràng đáp án đúng cho học sinh
              setReviewData({
                isCorrect: false,
                correctAnswerDisplay: (res as any).correctAnswerDisplay || "Xem lại bài giảng",
                explanation: res.explanation || null,
                message: res.message,
              });
            }, 260);
          }, 260);
        }, 260);
      }, 220);
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

  // Phím tắt Enter để ra đòn nhanh
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
        if (userAnswer !== null && !submitting && monsterAnim !== "dead" && !isOutOfHp) {
          handleAttack();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userAnswer, submitting, monsterAnim, isOutOfHp]);

  const monsterHpPercent = Math.max(0, Math.min(100, (monsterCurrentHp / Math.max(1, monsterMaxHp)) * 100));
  const playerHpPercent = Math.max(0, Math.min(100, (playerHp / Math.max(1, playerMaxHp)) * 100));

  const totalQuestions = Math.max(1, questions.length);
  const currentQuestionNum = (currentQIndex % totalQuestions) + 1;
  const questionProgressPercent = Math.min(100, Math.round((currentQuestionNum / totalQuestions) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] dark:bg-slate-950 flex flex-col h-screen max-h-screen overflow-hidden select-none font-sans text-slate-800 dark:text-slate-100">
      {/* ============================================================== */}
      {/* 1. THANH TRẠNG THÁI TRÊN CÙNG: RETRO PIXEL RPG STATUS BAR      */}
      {/* ============================================================== */}
      <div className="w-full px-3 sm:px-6 py-2 bg-white/95 dark:bg-slate-900/95 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-3 shrink-0 shadow-xs">
        {/* GÓC BÊN TRÁI TRÊN CÙNG: NÚT TRỞ VỀ VÀ SỔ TAY QUÁI VẬT */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={submitting || isFleeing}
            onClick={() => setShowFleeConfirm(true)}
            className="pixel-btn-neutral px-3 sm:px-4 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-xs border-2 border-rose-500/40 hover:bg-rose-500/10"
            title={isEn ? "Return to Base" : "Trở về Căn cứ"}
          >
            <ArrowLeft className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="font-pixel text-[11px]">{isEn ? "RETURN" : "TRỞ VỀ"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBestiary(true)}
            className="pixel-btn-amber px-2.5 sm:px-3 py-1.5 rounded-xl text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-xs"
            title={isEn ? "Inspect Monster Bestiary (7 types)" : "Xem sổ tay quái vật (7 loài)"}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span className="font-pixel text-[10px] hidden sm:inline">{isEn ? "BESTIARY (7)" : "QUÁI VẬT (7)"}</span>
          </button>
        </div>

        {/* CÁC CHỈ SỐ GỌN GÀNG, KHÔNG RƯỜM RÀ NHIỀU CHỮ */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-mono">
          {/* Tiến độ câu hỏi */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg pixel-panel bg-[#E8F0FE] dark:bg-[#4285F4]/15 text-[#1967D2] dark:text-[#8AB4F8] border-[#4285F4]/30 font-bold text-xs">
            <span>[ {isEn ? "Q" : "CÂU"} {currentQuestionNum}/{totalQuestions} ]</span>
          </div>

          {/* Tiến độ Boss: 5 quái nhỏ -> 1 Boss */}
          <div className={`px-2.5 py-1 rounded-lg pixel-panel flex items-center gap-1 font-bold text-xs ${
            monsterDef.isBoss
              ? "pixel-panel-amber bg-amber-500/20 text-amber-500 dark:text-amber-300 animate-pulse"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
          }`}>
            <Skull className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              {monsterDef.isBoss
                ? (isEn ? "BOSS!" : "TRÙM!")
                : (isEn ? `QUÁI ${monstersDefeatedCount % 5 + 1}/5` : `QUÁI ${monstersDefeatedCount % 5 + 1}/5`)}
            </span>
          </div>

          {/* Xu */}
          <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-lg pixel-panel border-amber-500/30 font-bold text-xs">
            <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{playerCoins}</span>
          </div>

          {/* Chuỗi Streak */}
          {playerState?.streak > 0 && (
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 pixel-panel border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
              <span>x{playerState.streak}</span>
            </div>
          )}

          <div className="text-slate-500 dark:text-slate-400 hidden lg:flex items-center gap-1 text-xs">
            <span>D{clock.dayNumber}</span>
            {clock.isDay ? (
              <SunMedium className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            )}
          </div>
        </div>
      </div>

      {/* THANH TIẾN ĐỘ CHUYỂN CÂU (GOOGLE MATERIAL LINEAR PROGRESS INDICATOR) */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#4285F4] transition-all duration-500 ease-out rounded-r-full"
          style={{ width: `${questionProgressPercent}%` }}
        />
      </div>

      {/* POPUP XÁC NHẬN RÚT LUI */}
      {showFleeConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 p-6 sm:p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-white text-lg">{t.battle.fleeConfirm}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isEn
                ? `While retreating, ${monsterName} will chase and scratch you (-15 HP) and you will lose 50 Rank Points!`
                : `Trong lúc quay đầu tháo chạy, ${monsterName} sẽ đuổi theo cào bạn mất máu (khoảng 15 HP) và bạn bị trừ 50 Điểm Rank!`}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFleeConfirm(false)}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer"
              >
                {t.battle.keepFighting}
              </button>
              <button
                type="button"
                disabled={isFleeing}
                onClick={handleFlee}
                className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
              >
                {isFleeing ? <Loader2 className="w-4 h-4 animate-spin" /> : t.battle.stillFlee}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP CẤP CỨU SINH LỰC KHI HẾT MÁU (THÂN THIỆN CHO TÂN THỦ) */}
      {isOutOfHp && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 p-6 sm:p-8 rounded-3xl max-w-lg w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto animate-pulse motion-reduce:animate-none">
              <Heart className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-black text-white text-xl">{t.battle.emergencyTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {t.battle.emergencyDesc}
              </p>
            </div>

            <div className="space-y-3 text-left">
              {/* Tùy chọn 1: Dùng bình máu có sẵn */}
              {healingItems.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                  <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Package className="w-4 h-4" />
                    <span>{isEn ? "Use recovery item from backpack:" : "Dùng vật phẩm hồi phục có sẵn trong túi:"}</span>
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
                          className="px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 hover:bg-emerald-900/30 text-xs font-semibold text-white flex items-center justify-between cursor-pointer transition-colors duration-150"
                        >
                          <span className="flex items-center gap-1.5">
                            <PixelItemIcon itemId={item.itemId} size={18} />
                            <span>{def?.name || item.itemId}</span>
                          </span>
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
                className="w-full p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-left flex items-center justify-between gap-3 transition-colors duration-150 cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center p-1">
                    <PixelItemIcon itemId="small_healing_potion" size={26} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{t.battle.emergencyBuy}</p>
                    <p className="text-[11px] text-slate-400">{isEn ? "Starter price: only 10 Coins · Heal and keep fighting" : "Giá hạt dẻ tân thủ: chỉ 10 Xu · Hồi máu đánh tiếp"}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 shrink-0">10 {t.common.coins}</span>
              </button>

              {/* Tùy chọn 3: Hồi sinh miễn phí tại trại */}
              <button
                type="button"
                disabled={healingLoading}
                onClick={() => handleEmergencyHeal("free_camp")}
                className="w-full p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:bg-slate-800 text-left flex items-center justify-between gap-3 transition-colors duration-150 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center">
                    <Home className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{t.battle.reviveFree}</p>
                    <p className="text-[11px] text-slate-400">{isEn ? "Recover 100% HP" : "Hồi đầy 100% sinh lực"}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">{isEn ? "Free" : "Miễn Phí"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SÀN ĐẤU 2D RPG TRẢI RỘNG TOÀN MÀN HÌNH (KHÔNG KHOẢNG TRỐNG)  */}
      {/* ============================================================== */}
      <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px] shrink-0 flex flex-col justify-between px-3 sm:px-6 md:px-10 py-2 overflow-hidden select-none border-b-2 border-emerald-600/40 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950/60 shadow-inner">
        {/* Nền Sân Đấu Rừng Sương Mù Mở Rộng Tràn Màn Hình */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-emerald-950/40 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-emerald-900/50 via-slate-900/60 to-transparent border-b-2 border-emerald-500/50 pointer-events-none" />

        {/* MÂY XANH PIXEL TRÔI ĐỘNG TRÊN BẦU TRỜI SÀN ĐẤU (BLUE CLOUDS) */}
        <div className="absolute top-2 -left-16 w-52 h-12 opacity-85 pointer-events-none animate-[pixelCloudDriftSlow_55s_linear_infinite] z-0">
          <svg viewBox="0 0 128 32" className="w-full h-full drop-shadow-[0_2px_6px_rgba(2,132,199,0.35)]" shapeRendering="crispEdges">
            <rect x="0" y="20" width="128" height="6" fill="#0284c7" />
            <rect x="12" y="14" width="104" height="6" fill="#38bdf8" />
            <rect x="24" y="8" width="80" height="6" fill="#38bdf8" />
            <rect x="36" y="4" width="56" height="4" fill="#7dd3fc" />
            <rect x="44" y="2" width="40" height="2" fill="#bae6fd" />
          </svg>
        </div>
        <div className="absolute top-6 -right-20 w-64 h-14 opacity-80 pointer-events-none animate-[pixelCloudDriftMed_45s_linear_infinite] z-0">
          <svg viewBox="0 0 160 40" className="w-full h-full drop-shadow-[0_2px_8px_rgba(14,165,233,0.35)]" shapeRendering="crispEdges">
            <rect x="0" y="26" width="160" height="8" fill="#0369a1" />
            <rect x="16" y="18" width="128" height="8" fill="#0ea5e9" />
            <rect x="28" y="10" width="104" height="8" fill="#38bdf8" />
            <rect x="40" y="4" width="76" height="6" fill="#7dd3fc" />
            <rect x="52" y="0" width="52" height="4" fill="#bae6fd" />
          </svg>
        </div>

        {/* Thanh Máu 2 Bên Dàn Trải Đều (Player vs Monster) - Chuẩn Retro Pixel RPG */}
        <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-5xl mx-auto">
          {/* Cột 1: Thông tin Học sinh */}
          <div className="pixel-panel px-3 py-1.5 rounded-xl bg-slate-900/90 border-2 border-slate-700 space-y-1 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white flex items-center gap-1.5 truncate">
                <Shield className="w-3.5 h-3.5 text-blue-400 inline shrink-0" />
                <span className="font-pixel text-[11px]">{isEn ? "HERO" : "HIỆP SĨ"}</span>
                <span className="text-[10px] text-amber-400 font-semibold hidden sm:inline">
                  (+{weaponDef?.atk || 25} ATK)
                </span>
              </span>
              <span className="text-emerald-400 font-bold shrink-0">{playerHp}/{playerMaxHp} HP</span>
            </div>
            {/* Thanh HP Retro Pixel */}
            <div className="w-full h-2.5 bg-slate-950 border border-slate-700 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
          </div>

          {/* Cột 2: Thông tin Quái vật */}
          <div className="pixel-panel px-3 py-1.5 rounded-xl bg-slate-900/90 border-2 border-slate-700 space-y-1 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-rose-400 flex items-center gap-1.5 truncate">
                <span className="font-pixel text-[11px]">{monsterName.toUpperCase()}</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  (ATK {scaledMonster.atk})
                </span>
              </span>
              <span className="text-rose-400 font-bold shrink-0">{monsterCurrentHp}/{monsterMaxHp} HP</span>
            </div>
            {/* Thanh HP Retro Pixel */}
            <div className="w-full h-2.5 bg-slate-950 border border-slate-700 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500"
                style={{ width: `${monsterHpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Thông báo sự kiện trận đấu */}
        {battleNotice && (
          <div className="relative z-20 mx-auto px-4 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold animate-bounce shadow-xl">
            {battleNotice}
          </div>
        )}

        {/* FLOATING DAMAGE TEXTS */}
        {floatingTexts.map((item) => (
          <div
            key={item.id}
            className={`absolute z-30 font-black font-mono transition-opacity duration-700 pointer-events-none animate-out fade-out slide-out-to-top-8 ${
              item.isCrit ? "text-xl sm:text-2xl text-yellow-300 drop-shadow-md" : "text-base sm:text-lg " + item.color
            }`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
          >
            {item.text}
          </div>
        ))}

        {/* KHÔNG GIAN ĐỐI KHÁNG TRẢI RỘNG ĐỀU, KHÔNG BỊ TRỐNG 2 BÊN */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex items-end justify-between px-6 sm:px-16 md:px-24 pb-1 min-h-[110px]">
          {/* ========================================================== */}
          {/* A. NHÂN VẬT HỌC SINH (HERO)                                */}
          {/* ========================================================== */}
          <div
            className={`relative flex flex-col items-center transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none motion-reduce:animate-none ${
              heroAnim === "attack"
                ? "translate-x-8 sm:translate-x-14 scale-105"
                : heroAnim === "hurt"
                ? "-translate-x-3 scale-95 brightness-125"
                : heroAnim === "flee"
                ? "-translate-x-48 opacity-0 scale-75"
                : "motion-safe:animate-[pulse_4s_ease-in-out_infinite]"
            }`}
            style={{
              filter: heroAnim === "hurt" ? "drop-shadow(0 0 16px rgba(239, 68, 68, 0.9))" : undefined,
            }}
          >
            {/* Vệt kiếm chém */}
            {heroAnim === "attack" && (
              <div className="absolute -top-4 -right-8 w-20 h-20 border-r-4 border-t-4 border-amber-400 rounded-full animate-ping pointer-events-none" />
            )}

            {/* Khiên bảo vệ */}
            {heroAnim === "hurt" && totalDefensePct > 0 && (
              <div className="absolute -inset-4 border-2 border-blue-400/80 rounded-full animate-pulse bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            )}

            {/* Model Hiệp Sĩ Pixel Art Đồ Họa Động (Modular Paper-Doll) */}
            <div className="relative flex flex-col items-center">
              <PixelHero
                heroAnim={heroAnim}
                weaponId={weaponId}
                armorId={armorId}
                helmetId={helmetId}
                shieldId={shieldId}
                size={104}
                showShadow={true}
              />
            </div>

            <span className="text-[10px] font-mono font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800">
              {isEn ? "Explorer" : "Nhà Thám Hiểm"}
            </span>
          </div>

          {/* ========================================================== */}
          {/* B. QUÁI VẬT ĐỐI THỦ (MONSTER)                              */}
          {/* ========================================================== */}
          <div
            className={`relative flex flex-col items-center transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none motion-reduce:animate-none ${
              monsterAnim === "jump"
                ? "-translate-x-12 sm:-translate-x-24 -translate-y-2 scale-105"
                : monsterAnim === "hit"
                ? "translate-x-4 scale-95"
                : monsterAnim === "dead"
                ? "scale-90 opacity-40 translate-y-2"
                : monsterAnim === "spawn"
                ? "animate-bounce"
                : "motion-safe:animate-[pulse_3s_ease-in-out_infinite]"
            }`}
            style={{
              filter: monsterAnim === "hit" ? "drop-shadow(0 0 16px rgba(239, 68, 68, 0.9))" : undefined,
            }}
          >
            {(() => {
              const spriteSrc = getMonsterSprite(monsterDef.id, monsterFrame);
              const isBoss = monsterDef.id === "boar_king" || monsterDef.id === "rock_golem";
              const isHeavy = monsterDef.id === "small_golem";
              const isMedium = monsterDef.id === "mist_spider" || monsterDef.id === "skeleton";
              const isNimble =
                monsterDef.id === "baby_wolf" ||
                monsterDef.id === "wolf" ||
                monsterDef.id === "forest_goblin" ||
                monsterDef.id === "goblin";

              if (spriteSrc) {
                return (
                  <div
                    className={`relative flex items-end justify-center -scale-x-100 ${
                      isBoss
                        ? "w-28 h-28 sm:w-38 sm:h-38"
                        : isHeavy
                        ? "w-26 h-26 sm:w-34 sm:h-34"
                        : isMedium
                        ? "w-24 h-24 sm:w-30 sm:h-30"
                        : isNimble
                        ? "w-24 h-24 sm:w-28 sm:h-28"
                        : "w-20 h-20 sm:w-24 sm:h-24"
                    }`}
                  >
                    <img
                      src={spriteSrc}
                      alt={monsterName}
                      className={`max-w-full max-h-full object-contain filter drop-shadow-xl select-none transition-transform duration-200 pixelated ${
                        monsterAnim === "jump"
                          ? "-translate-y-2 scale-105"
                          : monsterAnim === "hit"
                          ? "brightness-125 saturate-150"
                          : ""
                      }`}
                      draggable={false}
                    />
                    <div
                      className={`absolute -bottom-1 bg-black/40 rounded-full blur-[2px] ${
                        isBoss
                          ? "w-28 h-3.5"
                          : isHeavy
                          ? "w-26 h-3.5"
                          : isMedium
                          ? "w-24 h-3"
                          : isNimble
                          ? "w-20 h-2.5"
                          : "w-16 h-2"
                      }`}
                    />
                  </div>
                );
              }

              return (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-end -scale-x-100">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 via-slate-900 to-slate-950 border-2 border-rose-500/40 flex items-center justify-center text-4xl shadow-lg shadow-rose-500/20">
                    <span className="filter drop-shadow-lg select-none">
                      {monsterDef.avatar}
                    </span>
                  </div>
                  <div className="w-16 h-2.5 bg-black/40 rounded-full blur-[2px] mt-0.5" />
                </div>
              );
            })()}

            <span className="text-[10px] font-mono font-bold text-rose-300 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800">
              {monsterName}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. BẢNG CÂU HỎI & NÚT TẤN CÔNG HOẶC BẢNG ĐÁP ÁN ĐÚNG           */}
      {/* ============================================================== */}
      <div className="flex-1 min-h-0 w-full bg-[#F8F9FA] dark:bg-slate-900/95 border-t border-slate-200/90 dark:border-slate-800 flex flex-col justify-between p-3 sm:p-5 shadow-xs">
        <div className="flex-1 min-h-0 overflow-y-auto max-w-5xl xl:max-w-6xl mx-auto w-full flex flex-col justify-center px-1 transition-all duration-300 ease-in-out">
          {reviewData ? (
            /* BẢNG XEM LẠI ĐÁP ÁN ĐÚNG CHO HỌC SINH (GOOGLE MATERIAL CARD) */
            <div className={`w-full max-w-2xl mx-auto p-6 sm:p-7 rounded-3xl border-2 shadow-md space-y-4 animate-in fade-in zoom-in-95 my-auto ${
              reviewData.isCorrect
                ? "bg-[#E6F4EA] dark:bg-[#34A853]/15 border-[#34A853] text-[#137333] dark:text-[#81C995]"
                : "bg-[#FCE8E6] dark:bg-[#EA4335]/15 border-[#EA4335] text-[#C5221F] dark:text-[#F28B82]"
            }`}>
              <div className="flex items-center gap-2.5 font-bold text-sm sm:text-base">
                {reviewData.isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6 shrink-0 text-[#34A853]" />
                    <span>{isEn ? "Correct Answer! Great Job!" : "Chính xác! Làm rất tốt!"}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 shrink-0 text-[#EA4335]" />
                    <span>{isEn ? "Incorrect Answer — Review & Learn:" : "Câu trả lời chưa chính xác — Hãy xem lại để học đáp án đúng:"}</span>
                  </>
                )}
              </div>

              {/* Ô hiển thị đáp án đúng */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
                <p className="text-xs font-semibold text-[#137333] dark:text-[#81C995] mb-1.5 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#34A853]" />
                  <span>{isEn ? "Correct Answer:" : "Đáp án đúng:"}</span>
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white break-words whitespace-normal leading-relaxed">
                  {reviewData.correctAnswerDisplay}
                </p>
              </div>

              {/* Lời giải thích nếu có */}
              {reviewData.explanation && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
                  <p className="text-xs font-semibold text-[#B06000] dark:text-amber-400 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FBBC05]" />
                    <span>{isEn ? "Explanation:" : "Lời giải thích:"}</span>
                  </p>
                  <p>{reviewData.explanation}</p>
                </div>
              )}

              {/* Nút tiếp tục sang câu tiếp theo chuẩn Pixel Art RPG */}
              <button
                type="button"
                onClick={() => {
                  setReviewData(null);
                  onNextQuestion();
                  setUserAnswer(null);
                }}
                className="w-full py-3.5 px-6 rounded-xl pixel-btn-amber text-slate-950 font-bold font-mono text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
              >
                <span>{isEn ? "Continue Battle ➔" : "Đã hiểu, Tiếp tục chiến đấu ➔"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : PlayerComponent && localizedQuestion ? (
            <div className="w-full transition-opacity duration-300 ease-in-out">
              <PlayerComponent
                content={localizedQuestion.content}
                value={userAnswer}
                onChange={(val) => setUserAnswer(val)}
                disabled={submitting || monsterAnim === "dead" || isOutOfHp}
              />
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400 text-xs font-mono">{t.common.loadingShort}</div>
          )}
        </div>

        {/* Nút hành động Tấn Công - Chuẩn Retro Pixel RPG */}
        {!reviewData && (
          <button
            type="button"
            disabled={userAnswer === null || submitting || monsterAnim === "dead" || isOutOfHp}
            onClick={handleAttack}
            className="mt-2 w-full max-w-5xl xl:max-w-6xl mx-auto py-3.5 px-8 rounded-xl pixel-btn-amber disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shrink-0 font-mono text-sm sm:text-base font-black uppercase tracking-wider"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.battle.attackingBtn}</span>
              </>
            ) : isOutOfHp ? (
              <>
                <Heart className="w-4 h-4 text-rose-500" />
                <span>{t.battle.outOfHpWarning}</span>
              </>
            ) : (
              <>
                <Swords className="w-4 h-4" />
                <span>{t.battle.attackBtn}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* SỔ TAY QUÁI VẬT HẦM NGỤC (7 LOÀI) */}
      <MonsterBestiaryModal
        isOpen={showBestiary}
        onClose={() => setShowBestiary(false)}
        language={language}
      />
    </div>
  );
}
