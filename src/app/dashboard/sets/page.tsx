import Link from "next/link";
import { Plus, BookOpen, Trash2, Edit3, Globe, Lock, EyeOff, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { deleteQuestionSet } from "./actions";
import { NavigationHeader } from "@/components/NavigationHeader";

export const dynamic = "force-dynamic";

export default async function QuestionSetsPage() {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  const { data: mySets } = await supabase
    .from("question_sets")
    .select("*, questions(count)")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavigationHeader profile={profile} activeItem="sets" />

      {/* Main Container - Dàn trải đều toàn màn hình */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Bộ câu hỏi
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-semibold">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Quản lý các bộ câu hỏi để tạo phòng chơi và kiểm tra kiến thức cho học sinh.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/sets/new"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo bộ câu hỏi mới</span>
            </Link>
          </div>
        </div>

        {/* Section 1: Bộ câu hỏi của bạn */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Bộ câu hỏi của bạn ({questionSets.length})
            </h2>
          </div>

          {questionSets.length === 0 ? (
            <div className="p-10 rounded-2xl bg-slate-900/40 border border-slate-800 text-center max-w-sm mx-auto my-8">
              <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">Chưa có bộ câu hỏi nào</h3>
              <p className="text-xs text-slate-400 mb-4">
                Bấm nút bên dưới để tạo bộ đề đầu tiên với 8 dạng câu hỏi.
              </p>
              <Link
                href="/dashboard/sets/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo câu hỏi</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {questionSets.map((set) => {
                const questionCount = (set as any).questions?.[0]?.count ?? 0;
                return (
                  <div
                    key={set.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                          {set.subject || "Tổng hợp"}
                        </span>
                        <span className="text-slate-500 text-xs">
                          {set.visibility === "public" ? (
                            <span title="Công khai"><Globe className="w-3.5 h-3.5 text-emerald-400" /></span>
                          ) : set.visibility === "unlisted" ? (
                            <span title="Link"><EyeOff className="w-3.5 h-3.5 text-blue-400" /></span>
                          ) : (
                            <span title="Riêng tư"><Lock className="w-3.5 h-3.5 text-slate-500" /></span>
                          )}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {set.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {set.description || "Không có mô tả."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>{questionCount} câu hỏi</span>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/dashboard/sets/${set.id}/edit`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteQuestionSet(set.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Section 2: Quản trị các bộ đề khác (Chỉ Admin) */}
        {isAdmin && systemSets.length > 0 && (
          <div className="pt-8 border-t border-slate-800/80">
            <h2 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              <span>Bộ câu hỏi khác trong hệ thống ({systemSets.length})</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {systemSets.map((set) => {
                const questionCount = (set as any).questions?.[0]?.count ?? 0;
                const author = (set as any).profiles?.display_name || "Giáo viên";
                return (
                  <div
                    key={set.id}
                    className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:border-rose-500/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {set.subject || "Tổng hợp"}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono truncate max-w-[120px]">
                          {author}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                        {set.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mb-4">
                        {set.description || "Không có mô tả."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>{questionCount} câu hỏi</span>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/dashboard/sets/${set.id}/edit`}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                          title="Chỉnh sửa (Admin)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteQuestionSet(set.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Xóa (Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
