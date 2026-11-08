"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, ShieldCheck, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { registerStudent } from "@/app/(auth)/student-actions";

const PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bắc Giang",
  "Bắc Ninh",
  "Bình Dương",
  "Đồng Nai",
  "Khánh Hòa",
  "Lâm Đồng",
  "Nghệ An",
  "Quảng Nam",
  "Quảng Ninh",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Khác",
];

export default function StudentRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    displayName: "",
    schoolName: "",
    province: "Hà Nội",
    className: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await registerStudent({
      username: formData.username.trim().toLowerCase(),
      password: formData.password,
      displayName: formData.displayName.trim(),
      schoolName: formData.schoolName.trim() || undefined,
      province: formData.province || undefined,
      className: formData.className.trim() || undefined,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    if (res?.ok && res.recoveryCode) {
      // Lưu tạm mã khôi phục để màn hình tiếp theo đọc và hiển thị
      sessionStorage.setItem("foggo_recovery_code", res.recoveryCode);
      sessionStorage.setItem("foggo_username", formData.username.trim().toLowerCase());
      router.push("/register/recovery-code");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-amber-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mt-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đăng ký Học sinh (Không cần Email)</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Tên đăng nhập <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  pattern="^[a-zA-Z0-9_]{3,20}$"
                  title="3–20 ký tự (chữ thường, số, dấu gạch dưới)"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="ví dụ: minhanh_8a"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Tên hiển thị <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="ví dụ: Minh Anh"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Mật khẩu <span className="text-amber-400">*</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Tối thiểu 8 ký tự"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
              />
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-xs text-slate-400 mb-3 flex items-center gap-1.5 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Trường & Lớp học (giúp giáo viên tìm thấy bạn)</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tỉnh / Thành phố</label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tên Lớp</label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    placeholder="ví dụ: 8A1, 9B"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-400 mb-1">Tên Trường</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="ví dụ: THCS Trưng Vương"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? (
                  <span>Đang khởi tạo tài khoản...</span>
                ) : (
                  <>
                    <span>Tạo tài khoản & Lấy mã khôi phục</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-amber-400 hover:underline font-semibold">
              Đăng nhập tại đây
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
