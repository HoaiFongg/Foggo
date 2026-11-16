"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Trophy,
  Users,
  Target,
  Swords,
  Skull,
  Coins,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

import { NavigationHeader } from "@/components/NavigationHeader";

interface ReportClientProps {
  profile?: any | null;
  session: any;
  players: any[];
  answers: any[];
  events: any[];
}

export function ReportClient({
  profile = null,
  session,
  players,
  answers,
  events,
}: ReportClientProps) {
  // Thống kê tổng quan
  const stats = useMemo(() => {
    const totalPlayers = players.length;
    const totalScore = players.reduce((sum, p) => sum + (p.score || 0), 0);
    const avgScore = totalPlayers > 0 ? Math.round(totalScore / totalPlayers) : 0;

    const totalAnswers = answers.length;
    const correctAnswers = answers.filter((a) => (a.score_ratio || 0) >= 0.5).length;
    const accuracyPct = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    // Chỉ số sinh tồn từ state
    let totalKills = 0;
    let totalDeaths = 0;
    let totalCoins = 0;

    for (const p of players) {
      totalCoins += p.gold || 0;
      if (p.state) {
        totalKills += p.state.monstersKilled || 0;
        totalDeaths += p.state.deaths || 0;
      }
    }

    return {
      totalPlayers,
      avgScore,
      totalAnswers,
      accuracyPct,
      totalKills,
      totalDeaths,
      totalCoins,
    };
  }, [players, answers]);

  const [sortMode, setSortMode] = useState<"wrong" | "index">("wrong");

  // Phân tích độ khó và tỉ lệ làm sai từng câu hỏi
  const questionStats = useMemo(() => {
    const rawQuestions = session?.question_sets?.questions || [];
    const list = rawQuestions.map((q: any, idx: number) => {
      const qAnswers = answers.filter((a) => a.question_id === q.id);
      const total = qAnswers.length;
      const correct = qAnswers.filter((a) => (a.score_ratio || 0) >= 0.5).length;
      const wrong = total - correct;
      const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
      const wrongPct = total > 0 ? Math.round((wrong / total) * 100) : 0;

      return {
        id: q.id,
        index: idx + 1,
        type: q.type,
        prompt: q.content?.prompt || "Câu hỏi không có tiêu đề",
        explanation: q.content?.explanation || null,
        totalAnswers: total,
        correctAnswers: correct,
        wrongAnswers: wrong,
        accuracyPct: pct,
        wrongPct: wrongPct,
        isHard: total >= 1 && wrongPct >= 50,
      };
    });

    if (sortMode === "wrong") {
      return [...list].sort((a, b) => b.wrongPct - a.wrongPct || b.wrongAnswers - a.wrongAnswers);
    }
    return list;
  }, [session, answers, sortMode]);

  // Các câu có tỉ lệ sai nhiều nhất
  const topWrongQuestions = useMemo(() => {
    return questionStats.filter((q: any) => q.totalAnswers > 0 && q.wrongPct > 0).slice(0, 3);
  }, [questionStats]);

  // Hàm xuất CSV
  function handleExportCsv() {
    if (players.length === 0) {
      alert("Không có dữ liệu người chơi để xuất.");
      return;
    }

    const headers = [
      "Hạng",
      "Tên học sinh",
      "Điểm số",
      "Số xu",
      "Quái đã hạ",
      "Số lần chết",
      "Thời gian tham gia",
    ];

    const rows = players.map((p, idx) => [
      idx + 1,
      `"${p.nickname}"`,
      p.score || 0,
      p.gold || 0,
      p.state?.monstersKilled || 0,
      p.state?.deaths || 0,
      `"${new Date(p.joined_at).toLocaleString("vi-VN")}"`,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `bao-cao-foggo-${session.id.substring(0, 8)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-16">
      {/* Unified Navigation Header */}
      <NavigationHeader
        profile={profile}
        activeItem="worlds"
        showBackButton
        backHref={`/teacher/worlds/${session.id}`}
        backLabel="Bảng điều khiển"
      />

      {/* Report Action Sub-bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md sticky top-14 z-30 px-4 sm:px-6 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              BÁO CÁO KẾT QUẢ THẾ GIỚI
            </span>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
              {session.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-8">
        {/* Lưới 4 Thẻ chỉ số chính */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Học sinh</span>
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats.totalPlayers}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Đã tham gia thế giới</p>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Tỉ lệ đúng</span>
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {stats.accuracyPct}%
            </div>
            <p className="text-[11px] text-slate-500 font-mono">{stats.totalAnswers} lượt trả lời</p>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-amber-400" />
              <span>Quái đã hạ</span>
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {stats.totalKills}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Thú rừng & Quái đêm</p>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Skull className="w-4 h-4 text-rose-400" />
              <span>Ngất xỉu</span>
            </span>
            <div className="text-2xl sm:text-3xl font-black text-rose-400">
              {stats.totalDeaths}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Lần gục ngã tại đảo</p>
          </div>
        </div>

        {/* Bảng phân tích chi tiết từng học sinh */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Bảng Thành Tích Học Sinh ({players.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Xếp hạng và chỉ số sống sót của từng thành viên trong lớp.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Hạng</th>
                    <th className="py-3 px-4">Học sinh</th>
                    <th className="py-3 px-4 text-right">Điểm số</th>
                    <th className="py-3 px-4 text-right">Xu tích lũy</th>
                    <th className="py-3 px-4 text-right">Quái hạ</th>
                    <th className="py-3 px-4 text-right">Ngất xỉu</th>
                    <th className="py-3 px-4 text-right">Tham gia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {players.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-amber-400 font-bold">#{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <span className="text-base">{p.avatar || "🦊"}</span>
                        <span>{p.nickname}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400">
                        {p.score || 0}
                      </td>
                      <td className="py-3 px-4 text-right text-amber-300">
                        {p.gold || 0} xu
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">
                        {p.state?.monstersKilled || 0}
                      </td>
                      <td className="py-3 px-4 text-right text-rose-400">
                        {p.state?.deaths || 0}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500">
                        {new Date(p.joined_at).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                  {players.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Chưa có học sinh nào tham gia thế giới này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Phân tích độ khó & Tỉ lệ làm sai câu hỏi */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Phân Tích Tỉ Lệ Làm Sai & Độ Khó ({questionStats.length} câu)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Thống kê chi tiết phần trăm làm sai của từng câu hỏi để hỗ trợ ôn tập trọng tâm.
              </p>
            </div>

            {/* Bộ chuyển đổi sắp xếp */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSortMode("wrong")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  sortMode === "wrong"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🔥 Sai nhiều nhất trước
              </button>
              <button
                type="button"
                onClick={() => setSortMode("index")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  sortMode === "index"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Theo thứ tự câu
              </button>
            </div>
          </div>

          {/* Top câu hỏi sai nhiều nhất */}
          {topWrongQuestions.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
              <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider block mb-2">
                ⚠️ Top câu hỏi học sinh làm sai nhiều nhất:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {topWrongQuestions.map((tq: any) => (
                  <div key={tq.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-rose-500/30">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white">Câu {tq.index}</span>
                      <span className="font-mono font-black text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full">
                        {tq.wrongPct}% sai
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-1">{tq.prompt}</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      {tq.wrongAnswers}/{tq.totalAnswers} lượt trả lời sai
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {questionStats.map((q: any) => (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  q.isHard
                    ? "bg-rose-950/20 border-rose-500/40 shadow-lg"
                    : "bg-slate-900/80 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Câu {q.index} · Dạng: {q.type}
                  </span>
                  {q.isHard ? (
                    <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/40 uppercase">
                      ⚠️ Tỉ lệ sai cao: {q.wrongPct}%
                    </span>
                  ) : q.totalAnswers > 0 ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Tỉ lệ sai: {q.wrongPct}%
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">Chưa có lượt làm</span>
                  )}
                </div>

                <p className="text-sm font-bold text-white mb-3 line-clamp-2">
                  {q.prompt}
                </p>

                {q.explanation && (
                  <p className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl mb-3">
                    💡 <strong>Giải thích:</strong> {q.explanation}
                  </p>
                )}

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 font-bold">
                      Tỉ lệ làm sai: {q.wrongPct}% ({q.wrongAnswers} lượt)
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Tỉ lệ đúng: {q.accuracyPct}% ({q.correctAnswers} lượt)
                    </span>
                  </div>

                  {/* Thanh so sánh tỉ lệ đúng / sai */}
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${q.accuracyPct}%` }}
                      title={`Đúng: ${q.accuracyPct}%`}
                    />
                    <div
                      className="h-full bg-rose-500 transition-all duration-300"
                      style={{ width: `${q.wrongPct}%` }}
                      title={`Sai: ${q.wrongPct}%`}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono text-right">
                    Tổng số lượt trả lời: {q.totalAnswers}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

