"use client";

import { useMemo } from "react";
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
} from "lucide-react";

interface ReportClientProps {
  session: any;
  players: any[];
  answers: any[];
  events: any[];
}

export function ReportClient({
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

  // Phân tích độ khó từng câu hỏi
  const questionStats = useMemo(() => {
    const rawQuestions = session?.question_sets?.questions || [];
    return rawQuestions.map((q: any, idx: number) => {
      const qAnswers = answers.filter((a) => a.question_id === q.id);
      const total = qAnswers.length;
      const correct = qAnswers.filter((a) => (a.score_ratio || 0) >= 0.5).length;
      const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

      return {
        id: q.id,
        index: idx + 1,
        type: q.type,
        prompt: q.content?.prompt || "Câu hỏi không có tiêu đề",
        totalAnswers: total,
        correctAnswers: correct,
        accuracyPct: pct,
        isHard: total >= 2 && pct < 50,
      };
    });
  }, [session, answers]);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/teacher/worlds/${session.id}`}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                BÁO CÁO KẾT QUẢ THẾ GIỚI
              </span>
              <h1 className="text-base sm:text-lg font-black text-white truncate max-w-sm sm:max-w-md">
                {session.title}
              </h1>
            </div>
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
      </header>

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

        {/* Phân tích độ khó câu hỏi (Hardest Questions) */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Phân Tích Độ Khó Bộ Câu Hỏi ({questionStats.length} câu)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Tỉ lệ trả lời chính xác giúp giáo viên nhận biết phần kiến thức học sinh hay làm sai.
            </p>
          </div>

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
                  {q.isHard && (
                    <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30 uppercase">
                      HỌC SINH HAY SAI
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-white mb-3 line-clamp-2">
                  {q.prompt}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Tỉ lệ chính xác:</span>
                    <span
                      className={`font-black ${
                        q.accuracyPct >= 70
                          ? "text-emerald-400"
                          : q.accuracyPct >= 50
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {q.accuracyPct}% ({q.correctAnswers}/{q.totalAnswers} lượt)
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        q.accuracyPct >= 70
                          ? "bg-emerald-500"
                          : q.accuracyPct >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${q.accuracyPct}%` }}
                    />
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

