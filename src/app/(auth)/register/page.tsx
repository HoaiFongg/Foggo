"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, Sparkles, GraduationCap, ArrowRight, UserCheck } from "lucide-react";
import { register } from "@/app/(auth)/actions";

export default function RegisterPage() {
  const [role, setRole] = useState<"student" | "teacher">("teacher");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("role", role);

    const res = await register(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-amber-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-3xl font-black tracking-tight text-white font-mono">
              FOG<span className="text-amber-400">GO</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm mt-2">
            Khởi tạo hành trình tri thức mới
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
          {/* Lựa chọn vai trò */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === "teacher"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Giáo viên / Tạo đề</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("student")}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === "student"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Học sinh</span>
            </button>
          </div>

          {role === "student" ? (
            <div className="space-y-4 text-center py-4">
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left">
                <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Dành riêng cho Học sinh</span>
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Bạn không cần địa chỉ email! Chỉ cần chọn một tên đăng nhập và mật khẩu là có thể vào chơi ngay, lưu Đom Đóm và trang bị.
                </p>
              </div>

              <Link
                href="/register/student"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30 cursor-pointer"
              >
                <span>Đăng ký Học sinh không cần Email</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  name="displayName"
                  required
                  placeholder="Thầy/Cô Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Email Giáo viên
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="giaovien@truong.edu.vn"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
              >
                {loading ? (
                  <span>Đang gửi xác nhận...</span>
                ) : (
                  <>
                    <span>Tạo tài khoản Giáo viên</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-slate-400">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-amber-400 hover:underline font-semibold">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
