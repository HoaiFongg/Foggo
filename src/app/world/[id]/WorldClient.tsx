"use client";

import { useState } from "react";
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
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { getQuestionType } from "@/question-types/registry";
import { submitWorldAnswer } from "./actions";

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
  const [activeTab, setActiveTab] = useState<"hunt" | "leaderboard" | "backpack">("hunt");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    damageDealt: number;
    damageTaken: number;
    monsterDefeated: boolean;
    pointsAwarded: number;
    explanation?: string | null;
  } | null>(null);

  // Trạng thái người chơi
  const [playerState, setPlayerState] = useState({
    score: initialPlayer.score,
    gold: initialPlayer.gold,
    hp: initialPlayer.state?.hp ?? 100,
    maxHp: initialPlayer.state?.maxHp ?? 100,
    day: initialPlayer.state?.day ?? 1,
    inventory: initialPlayer.state?.inventory || [
      { id: "item_wood", name: "Gỗ sồi", quantity: 5 },
      { id: "item_bread", name: "Bánh mì", quantity: 2 },
    ],
  });

  // Trạng thái quái vật
  const [monster, setMonster] = useState({
    name: "Heo Rừng Sương Mù",
    hp: 100,
    maxHp: 100,
    atk: 20,
    avatar: "🐗",
  });

  const question = questions[currentQIndex];
  const typeDef = question ? getQuestionType(question.type) : null;
  const PlayerComponent = typeDef?.Player;

  async function handleAnswerSubmit() {
    if (userAnswer === null || !question) return;
    setSubmitting(true);

    const res = await submitWorldAnswer({
      sessionId,
      questionId: question.id,
      answer: userAnswer,
      monsterHp: monster.hp,
    });

    setSubmitting(false);

    if (!res || "error" in res) {
      alert(res?.error || "Có lỗi xảy ra");
      return;
    }

    setFeedback({
      isCorrect: res.isCorrect,
      damageDealt: res.damageDealt,
      damageTaken: res.damageTaken,
      monsterDefeated: res.monsterDefeated,
      pointsAwarded: res.pointsAwarded,
      explanation: res.explanation,
    });

    setPlayerState((prev) => ({
      ...prev,
      hp: res.newHp,
      gold: res.newGold,
      score: res.newScore,
    }));

    if (res.isCorrect) {
      setMonster((prev) => ({
        ...prev,
        hp: Math.max(0, prev.hp - res.damageDealt),
      }));
    }
  }

  function handleNextQuestion() {
    setFeedback(null);
    setUserAnswer(null);

    if (feedback?.monsterDefeated) {
      // Đổi sang quái mới
      setMonster({
        name: "Sói Bóng Đêm",
        hp: 100,
        maxHp: 100,
        atk: 25,
        avatar: "🐺",
      });
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setCurrentQIndex(0); // Lặp lại vòng câu hỏi nếu hết
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30">
      {/* Top HUD: Thanh sinh tồn, HP, Xu, Ngày/Đêm */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-4 py-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold"
              title="Về Dashboard"
            >
              <Flame className="w-5 h-5 animate-pulse" />
            </Link>
            <div>
              <p className="text-xs font-bold text-white font-mono truncate max-w-[150px] sm:max-w-xs">
                {worldTitle}
              </p>
              <p className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                <SunMedium className="w-3 h-3" />
                <span>Ngày {playerState.day}: Ban ngày</span>
              </p>
            </div>
          </div>

          {/* Chỉ số sinh tồn */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Thanh Máu HP */}
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
              <div className="w-20 sm:w-28 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{
                    width: `${Math.max(
                      0,
                      (playerState.hp / playerState.maxHp) * 100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-200">
                {playerState.hp}
              </span>
            </div>

            {/* Tiền Xu */}
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <Coins className="w-3.5 h-3.5" />
              <span>{playerState.gold} Xu</span>
            </div>

            {/* Điểm số */}
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <Trophy className="w-3.5 h-3.5" />
              <span>{playerState.score} đ</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-slate-800 bg-slate-950/90 py-2 px-4">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("hunt")}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "hunt"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Đi Săn & Đảo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "leaderboard"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Xếp Hạng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("backpack")}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "backpack"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Backpack className="w-3.5 h-3.5" />
            <span>Túi Đồ</span>
          </button>
        </div>
      </div>

      {/* Main Gameplay Screen */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {activeTab === "hunt" && (
          <div className="space-y-6">
            {/* Thẻ Quái Vật */}
            <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="text-4xl sm:text-5xl filter drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                  {monster.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-white">
                      {monster.name}
                    </span>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Cấp 1
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-32 sm:w-48 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="bg-rose-500 h-full transition-all duration-300"
                        style={{
                          width: `${(monster.hp / monster.maxHp) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {monster.hp}/{monster.maxHp} HP
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-slate-400 hidden sm:block">
                <span>Sát thương quái: </span>
                <span className="text-rose-400 font-bold">{monster.atk}</span>
              </div>
            </div>

            {/* Màn hình câu hỏi */}
            {questions.length === 0 ? (
              <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center">
                <p className="text-sm text-slate-400">
                  Thế giới này chưa có câu hỏi nào. Hãy báo giáo viên cập nhật câu hỏi!
                </p>
              </div>
            ) : (
              <div>
                {PlayerComponent && (
                  <PlayerComponent
                    content={question.content}
                    value={userAnswer}
                    onChange={(val) => {
                      if (!feedback) setUserAnswer(val);
                    }}
                    disabled={submitting || feedback !== null}
                  />
                )}

                {/* Khung phản hồi sau khi trả lời */}
                {feedback ? (
                  <div
                    className={`mt-6 p-6 rounded-3xl border animate-in fade-in duration-200 text-center space-y-3 ${
                      feedback.isCorrect
                        ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]"
                        : "bg-rose-500/10 border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.2)]"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {feedback.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          <span className="text-base font-black text-emerald-300">
                            CHÍNH XÁC! Chém quái -{feedback.damageDealt} HP (+
                            {feedback.pointsAwarded}đ)
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-rose-400" />
                          <span className="text-base font-black text-rose-300">
                            CHƯA ĐÚNG! Quái đánh trả -{feedback.damageTaken} HP
                          </span>
                        </>
                      )}
                    </div>

                    {feedback.monsterDefeated && (
                      <p className="text-xs font-bold text-amber-400 font-mono">
                        🎉 BẠN ĐÃ HẠ GỤC {monster.name.toUpperCase()}! (+15 Xu)
                      </p>
                    )}

                    {feedback.explanation && (
                      <p className="text-xs text-slate-300 italic max-w-lg mx-auto">
                        "{feedback.explanation}"
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
                    >
                      <span>Tiếp tục cuộc săn</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      disabled={userAnswer === null || submitting}
                      onClick={handleAnswerSubmit}
                      className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <span>
                        {submitting ? "Đang tung đòn..." : "Tung Đòn Trả Lời"}
                      </span>
                      <Swords className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab Xếp Hạng */}
        {activeTab === "leaderboard" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-lg font-black text-white font-mono mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>BẢNG XẾP HẠNG THẾ GIỚI</span>
            </h2>

            <div className="space-y-2">
              {initialLeaderboard.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Chưa có ai ghi điểm trong thế giới này. Hãy là người đầu tiên!
                </p>
              ) : (
                initialLeaderboard.map((player, idx) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                          idx === 0
                            ? "bg-amber-500 text-slate-950"
                            : idx === 1
                            ? "bg-slate-400 text-slate-950"
                            : idx === 2
                            ? "bg-amber-700 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {player.nickname}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-amber-400">{player.gold} Xu</span>
                      <span className="font-bold text-emerald-400">
                        {player.score} đ
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab Túi Đồ */}
        {activeTab === "backpack" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-lg font-black text-white font-mono mb-4 flex items-center gap-2">
              <Backpack className="w-5 h-5 text-amber-400" />
              <span>TÚI ĐỒ SINH TỒN</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {playerState.inventory.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center"
                >
                  <p className="text-2xl mb-2">🪵</p>
                  <p className="text-xs font-bold text-white">{item.name}</p>
                  <p className="text-[11px] text-amber-400 font-mono mt-1">
                    x{item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

