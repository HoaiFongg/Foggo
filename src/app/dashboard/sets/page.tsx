import Link from "next/link";
import { Plus, BookOpen, Clock, Play, Trash2, Edit3, Globe, Lock, EyeOff, ShieldCheck, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { deleteQuestionSet } from "./actions";
import { NavigationHeader } from "@/components/NavigationHeader";

export const dynamic = "force-dynamic";

export default async function QuestionSetsPage() {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  // Lấy bộ câu hỏi của chính mình
  const { data: mySets } = await supabase
    .from("question_sets")
    .select("*, questions(count)")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  // Nếu là Admin, lấy thêm tất cả bộ câu hỏi của hệ thống
  let systemSets: any[] = [];
  if (isAdmin) {
    const { data: allSets } = await supabase
      .from("question_sets")
      .select("*, questions(count), profiles:owner_id(display_name)")
      .neq("owner_id", user.id)
      .order("updated_at", { ascending: false });
    systemSets = allSets || [];
  }

  const questionSets = mySets || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      {/* Top Bar chuẩn */}
      <NavigationHeader profile={profile} activeItem="sets" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white font-sans">
                Ngân Hàng Bộ Câu Hỏi
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold">
                  Quyền Quản Trị Tối Cao
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Quản lý các bộ câu hỏi với 8 dạng tương tác để mở hầm ngục sinh tồn cho lớp học
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/teacher/worlds/new"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <span>Mở Hầm Ngục</span>
            </Link>

            <Link
              href="/dashboard/sets/new"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo bộ câu hỏi mới</span>
            </Link>
          </div>
        </div>

        {/* Section 1: Bộ câu hỏi của bạn */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>Bộ câu hỏi của bạn</span>
            <span className="text-xs font-mono text-amber-400">({questionSets.length})</span>
          </h2>

          {questionSets.length === 0 ? (
            /* Empty State */
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center max-w-lg mx-auto my-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Chưa có bộ câu hỏi nào</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Hãy tạo bộ câu hỏi đầu tiên với các dạng trắc nghiệm, đúng/sai, kéo thả, ghép cặp hoặc chạm điểm yếu để học sinh vừa học vừa sinh tồn!
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
                    className="bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all hover:shadow-xl group"
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
        </div>

        {/* Section 2: Quản trị toàn bộ câu hỏi hệ thống (Dành cho Admin) */}
        {isAdmin && systemSets.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Bộ câu hỏi khác trong hệ thống (Quyền Admin)</span>
                <span className="text-xs font-mono text-rose-400">({systemSets.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemSets.map((set) => {
                const questionCount = (set as any).questions?.[0]?.count ?? 0;
                const author = (set as any).profiles?.display_name || "Giáo viên ẩn danh";
                return (
                  <div
                    key={set.id}
                    className="bg-slate-900/40 border border-slate-800/80 hover:border-rose-500/30 rounded-3xl p-6 flex flex-col justify-between transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          {set.subject || "Tổng hợp"}
                        </span>
                        <span className="text-xs text-rose-300/80 font-mono">
                          Tác giả: {author}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1.5 line-clamp-2 group-hover:text-rose-300 transition-colors">
                        {set.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {set.description || "Chưa có mô tả."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                        <span>{questionCount} câu</span>
                        <span>·</span>
                        <span>{set.play_count} lượt chơi</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/sets/${set.id}/edit`}
                          title="Chỉnh sửa với quyền Admin"
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
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
                            title="Xóa bộ câu hỏi với quyền Admin"
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
          </div>
        )}
      </main>
    </div>
  );
}
