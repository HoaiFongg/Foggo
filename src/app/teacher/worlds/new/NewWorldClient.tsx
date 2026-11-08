"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Flame, Sparkles } from "lucide-react";
import { createWorld } from "../actions";

interface NewWorldClientProps {
  questionSets: Array<{
    id: string;
    title: string;
    subject: string | null;
  }>;
}

export function NewWorldClient({ questionSets }: NewWorldClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createWorld(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
            <Flame className="w-4 h-4 animate-pulse" />
            <span>MỞ THẾ GIỚI MỚI (KHÔNG DÙNG PIN)</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-amber-400" />
              <span>Thiết lập Thế Giới Mới</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Thế giới sẽ tự động sinh link và mã QR bảo mật để bạn chia sẻ cho học sinh.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                Tên Thế giới <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="ví dụ: Đảo Sinh Tồn 8A1 - Ôn thi Giữa kỳ"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                Chọn Bộ câu hỏi gắn vào Thế giới
              </label>
              {questionSets.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  Bạn chưa có bộ câu hỏi nào.{" "}
                  <Link href="/dashboard/sets/new" className="text-amber-400 hover:underline font-bold">
                    Tạo bộ câu hỏi trước
                  </Link>
                </div>
              ) : (
                <select
                  name="setId"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                >
                  {questionSets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.subject || "Tổng hợp"})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                  Chế độ chơi
                </label>
                <select
                  name="mode"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="survival">Sinh tồn tri thức (Tiêu chuẩn)</option>
                  <option value="peaceful">Yên bình (Chỉ ôn tập, không bị trừ máu)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                  Giới hạn phút chơi / ngày
                </label>
                <select
                  name="dailyLimitMin"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value={20}>20 phút / ngày</option>
                  <option value={30}>30 phút / ngày (Khuyên dùng)</option>
                  <option value={45}>45 phút / ngày</option>
                  <option value={60}>60 phút / ngày</option>
                  <option value={999}>Không giới hạn</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  name="allowGuests"
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
                />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Cho phép học sinh chơi bằng Tên tạm (Khách)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Học sinh chưa có tài khoản vẫn có thể mở link và nhập tên để chơi thử
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Đang mở thế giới...</span>
                ) : (
                  <>
                    <span>Khởi tạo Thế Giới</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

