"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Flame, ArrowRight, ShieldCheck } from "lucide-react";
import { login } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-amber-500/30">
      {/* Sương mù nền & Ánh đèn lồng ấm */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Box chính */}
      <div className="w-full max-w-md relative z-10">
        {/* Header thương hiệu */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:border-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-3xl font-black tracking-tight text-white font-mono">
              FOG<span className="text-amber-400">GO</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm mt-2">
            Thắp sáng đèn lồng, xua tan màn sương tri thức
          </p>
        </div>

        {/* Card form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
          <h1 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>Đăng nhập</span>
            <span className="text-xs font-normal text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Sinh tồn
            </span>
          </h1>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Tên đăng nhập hoặc Email
              </label>
              <input
                type="text"
                name="account"
                required
                placeholder="ví dụ: hocsinh8a hoặc email@truong.edu.vn"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-300 uppercase tracking-wider font-mono">
                  Mật khẩu
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
            >
              {loading ? (
                <span>Đang kết nối...</span>
              ) : (
                <>
                  <span>Vào thế giới Foggo</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 text-xs uppercase tracking-widest text-slate-500 bg-slate-900 font-mono">
              Hoặc
            </span>
          </div>

          {/* Đăng nhập nhanh Google */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-medium flex items-center justify-center gap-3 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.16z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Đăng nhập với Google</span>
          </button>

          {/* Dành riêng cho học sinh */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-300">Bạn là Học sinh?</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Không cần email, đăng ký trong 30s</p>
              </div>
              <Link
                href="/register/student"
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1 shadow-sm"
              >
                <span>Đăng ký ngay</span>
                <Sparkles className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer chuyển sang đăng ký */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Chưa có tài khoản Giáo viên?{" "}
          <Link href="/register" className="text-amber-400 hover:underline font-semibold">
            Đăng ký tại đây
          </Link>
        </p>
      </div>
    </div>
  );
}
