import Link from "next/link";
import { Plus, BookOpen, Clock, Play, Trash2, Edit3, Flame, Globe, Lock, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { deleteQuestionSet } from "./actions";

export const dynamic = "force-dynamic";

export default async function QuestionSetsPage() {
  const { user } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();

  const { data: sets } = await supabase
    .from("question_sets")
    .select("*, questions(count)")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  const questionSets = sets || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-4 h-4 animate-pulse" />
              </div>
              <span className="font-bold text-white font-mono text-sm">FOGGO</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-semibold text-slate-300">Bộ câu hỏi của tôi</span>
          </div>

          <Link
            href="/dashboard/sets/new"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo bộ câu hỏi mới</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-white font-sans">
              Danh sách Bộ câu hỏi
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Quản lý các bộ câu hỏi của bạn để mở thế giới sinh tồn cho lớp học
            </p>
          </div>
        </div>

        {questionSets.length === 0 ? (
          /* Empty State */
          <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Chưa có bộ câu hỏi nào</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Hãy tạo bộ câu hỏi đầu tiên với các dạng trắc nghiệm, đúng/sai hoặc kéo thả để học sinh của bạn vừa học vừa khám phá đảo sương mù!
            </p>
            <Link
              href="/dashboard/sets/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo bộ câu hỏi đầu tiên</span>
            </Link>
          </div>
        ) : (
          /* Sets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionSets.map((set) => {
              const questionCount = (set as any).questions?.[0]?.count ?? 0;
              return (
                <div
                  key={set.id}
                  className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 flex flex-col justify-between transition-all hover:shadow-xl group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-amber-400 border border-slate-700">
                        {set.subject || "Tổng hợp"}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        {set.visibility === "public" ? (
                          <>
                            <Globe className="w-3 h-3 text-emerald-400" />
                            <span>Công khai</span>
                          </>
                        ) : set.visibility === "unlisted" ? (
                          <>
                            <EyeOff className="w-3 h-3 text-blue-400" />
                            <span>Link</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>Riêng tư</span>
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5 line-clamp-2 group-hover:text-amber-300 transition-colors">
                      {set.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {set.description || "Chưa có mô tả cho bộ câu hỏi này."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span>{questionCount} câu hỏi</span>
                      <span>·</span>
                      <span>{set.play_count} lượt chơi</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/sets/${set.id}/edit`}
                        title="Chỉnh sửa bộ câu hỏi"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>

                      <form
                        action={async () => {
                          "use server";
                          await deleteQuestionSet(set.id);
                        }}
                      >
                        <button
                          type="submit"
                          title="Xóa bộ câu hỏi"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

