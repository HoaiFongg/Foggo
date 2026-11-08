"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Flame, Sparkles } from "lucide-react";
import { createQuestionSet } from "../actions";

export default function NewQuestionSetPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createQuestionSet(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/dashboard/sets"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách</span>
          </Link>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
            <Flame className="w-4 h-4 animate-pulse" />
            <span>TẠO BỘ CÂU HỎI MỚI</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <span>Thông tin Bộ câu hỏi</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Thiết lập thông tin chung trước khi bước vào Trình soạn thảo câu hỏi chi tiết.
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
                Tiêu đề bộ câu hỏi <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="ví dụ: Đố vui Khoa học Tự nhiên Lớp 7 - Chương 1"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                Mô tả ngắn
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Mô tả nội dung, mục tiêu bài học hoặc lời nhắn gửi đến học sinh..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                  Môn học
                </label>
                <select
                  name="subject"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="Toán học">Toán học</option>
                  <option value="Tiếng Việt / Ngữ văn">Tiếng Việt / Ngữ văn</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Khoa học Tự nhiên">Khoa học Tự nhiên</option>
                  <option value="Lịch sử & Địa lý">Lịch sử & Địa lý</option>
                  <option value="Tin học">Tin học</option>
                  <option value="Kiến thức chung / Đố vui">Kiến thức chung / Đố vui</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                  Khối lớp
                </label>
                <select
                  name="gradeLevel"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="Lớp 1-5 (Tiểu học)">Lớp 1-5 (Tiểu học)</option>
                  <option value="Lớp 6">Lớp 6</option>
                  <option value="Lớp 7">Lớp 7</option>
                  <option value="Lớp 8">Lớp 8</option>
                  <option value="Lớp 9">Lớp 9</option>
                  <option value="Lớp 10-12 (THPT)">Lớp 10-12 (THPT)</option>
                  <option value="Mọi lứa tuổi">Mọi lứa tuổi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                Quyền hiển thị
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 flex items-start gap-3 cursor-pointer hover:border-slate-700">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    defaultChecked
                    className="mt-1 text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Riêng tư</span>
                    <span className="text-[11px] text-slate-400">Chỉ bạn mới xem được</span>
                  </div>
                </label>

                <label className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 flex items-start gap-3 cursor-pointer hover:border-slate-700">
                  <input
                    type="radio"
                    name="visibility"
                    value="unlisted"
                    className="mt-1 text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Không công khai</span>
                    <span className="text-[11px] text-slate-400">Ai có link mới xem được</span>
                  </div>
                </label>

                <label className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 flex items-start gap-3 cursor-pointer hover:border-slate-700">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    className="mt-1 text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Công khai</span>
                    <span className="text-[11px] text-slate-400">Hiện trên trang khám phá</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
              <Link
                href="/dashboard/sets"
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
                  <span>Đang khởi tạo...</span>
                ) : (
                  <>
                    <span>Tạo & Bắt đầu soạn câu hỏi</span>
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
