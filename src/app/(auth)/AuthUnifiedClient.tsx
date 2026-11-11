"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Flame,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Swords,
  School,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { login, register } from "@/app/(auth)/actions";
import { registerStudent } from "@/app/(auth)/student-actions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/useLanguage";

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

interface AuthUnifiedClientProps {
  defaultTab?: "login" | "register";
}

export default function AuthUnifiedClient({
  defaultTab = "login",
}: AuthUnifiedClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isEn } = useLanguage();

  // Tab: 'login' | 'register'
  const queryTab = searchParams.get("tab");
  const [tab, setTab] = useState<"login" | "register">(
    queryTab === "register" || defaultTab === "register" ? "register" : "login"
  );

  // Role for registration: 'student' | 'teacher'
  const queryRole = searchParams.get("role");
  const [registerRole, setRegisterRole] = useState<"student" | "teacher">(
    queryRole === "teacher" ? "teacher" : "student"
  );

  // Show password toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Expand optional school details for student
  const [showSchoolDetails, setShowSchoolDetails] = useState(false);

  // Common form states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Student Register Form state
  const [studentForm, setStudentForm] = useState({
    username: "",
    displayName: "",
    password: "",
    schoolName: "",
    province: "Hà Nội",
    className: "",
  });

  // Login handler
  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const nextUrl = searchParams.get("next") || "/dashboard";
    formData.set("next", nextUrl);

    try {
      const res = await login(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (err: unknown) {
      // In Next.js, redirect() throws a NEXT_REDIRECT error which should be allowed to propagate
      const errorObj = err as { message?: string };
      if (errorObj?.message?.includes("NEXT_REDIRECT")) {
        throw err;
      }
      setError(isEn ? "Failed to log in. Please try again." : "Không thể đăng nhập. Vui lòng thử lại.");
      setLoading(false);
    }
  }

  // Teacher Register handler
  async function handleTeacherRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("role", "teacher");

    try {
      const res = await register(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      if (errorObj?.message?.includes("NEXT_REDIRECT")) {
        throw err;
      }
      setError(isEn ? "Registration failed. Please try again." : "Không thể đăng ký tài khoản. Vui lòng thử lại.");
      setLoading(false);
    }
  }

  // Student Register handler (No email)
  async function handleStudentRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await registerStudent({
        username: studentForm.username.trim().toLowerCase(),
        password: studentForm.password,
        displayName: studentForm.displayName.trim(),
        schoolName: studentForm.schoolName.trim() || undefined,
        province: studentForm.province || undefined,
        className: studentForm.className.trim() || undefined,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      if (res?.ok && res.recoveryCode) {
        sessionStorage.setItem("foggo_recovery_code", res.recoveryCode);
        sessionStorage.setItem("foggo_username", studentForm.username.trim().toLowerCase());
        router.push("/register/recovery-code");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      if (errorObj?.message?.includes("NEXT_REDIRECT")) {
        throw err;
      }
      setError(isEn ? "An unexpected error occurred." : "Đã có lỗi xảy ra khi tạo tài khoản học sinh.");
      setLoading(false);
    }
  }

  function switchTab(newTab: "login" | "register") {
    setTab(newTab);
    setError(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", newTab);
      window.history.replaceState({}, "", url.toString());
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden selection:bg-amber-500/30">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/25 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 -left-36 w-[420px] h-[420px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-36 w-[420px] h-[420px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating particles (ambient fireflies) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[20%] w-1.5 h-1.5 bg-amber-400 rounded-full blur-[0.5px] shadow-[0_0_8px_#f59e0b] animate-ping opacity-60" style={{ animationDuration: "3s" }} />
        <div className="absolute top-[40%] right-[18%] w-2 h-2 bg-amber-300 rounded-full blur-[0.5px] shadow-[0_0_10px_#f59e0b] animate-pulse opacity-70" />
        <div className="absolute bottom-[25%] left-[25%] w-1.5 h-1.5 bg-emerald-400 rounded-full blur-[0.5px] shadow-[0_0_8px_#10b981] animate-ping opacity-50" style={{ animationDuration: "4s" }} />
        <div className="absolute top-[70%] right-[30%] w-1.5 h-1.5 bg-amber-400 rounded-full blur-[0.5px] shadow-[0_0_8px_#f59e0b] animate-pulse opacity-60" />
      </div>

      {/* Top Header Action Bar */}
      <div className="w-full max-w-xl flex items-center justify-between mb-6 relative z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors py-1.5 px-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? "Back to Home" : "Về Trang Chủ"}</span>
        </Link>

        {/* Language switcher */}
        <LanguageSwitcher variant="segmented" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/30 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:border-amber-400 transition-all shadow-[0_0_25px_rgba(245,158,11,0.25)]">
              <Flame className="w-7 h-7 text-amber-400 animate-pulse drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            </div>
            <div className="text-left">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono flex items-center">
                FOG<span className="text-amber-400">GO</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-amber-500/80 font-mono -mt-1">
                RPG LEARNING ARENA
              </span>
            </div>
          </Link>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
            {isEn
              ? "Light your lantern, banish the fog of knowledge, conquer monsters"
              : "Thắp sáng đèn lồng, xua tan màn sương tri thức và chinh phục quái vật"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/90 relative overflow-hidden">
          {/* Subtle top ambient line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

          {/* 2-Part Segmented Switcher (Đăng Nhập ⇋ Đăng Ký) */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800/90 mb-6 shadow-inner">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                tab === "login"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 scale-[1.01]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isEn ? "Sign In" : "Đăng Nhập"}</span>
            </button>

            <button
              type="button"
              onClick={() => switchTab("register")}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                tab === "register"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 scale-[1.01]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? "New Account" : "Đăng Ký"}</span>
              <span
                className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                  tab === "register"
                    ? "bg-slate-950/20 text-slate-950"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {isEn ? "Fast 30s" : "Tân Thủ"}
              </span>
            </button>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{isEn ? "Notice" : "Thông báo"}</p>
                <p className="text-rose-200/90 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* TAB 1: ĐĂNG NHẬP (LOGIN) */}
          {tab === "login" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{isEn ? "Welcome Back!" : "Chào Mừng Trở Lại!"}</span>
                    <span className="text-amber-400">⚔️</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEn
                      ? "Enter your credentials to continue your adventure"
                      : "Nhập thông tin để tiếp tục săn quái và tích lũy Đom Đóm"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Account input (Username or Email) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isEn ? "Username or Email" : "Tên đăng nhập hoặc Email"}</span>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="account"
                      required
                      placeholder={
                        isEn
                          ? "e.g., student8a or teacher@school.edu.vn"
                          : "ví dụ: hocsinh8a hoặc giaovien@truong.edu.vn"
                      }
                      className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">🎒</span>
                    <span>
                      {isEn
                        ? "Students use Username • Teachers & Admins use Email"
                        : "Học sinh dùng Tên đăng nhập • Thầy cô & Admin dùng Email"}
                    </span>
                  </p>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isEn ? "Password" : "Mật khẩu"}</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer transition-colors"
                      tabIndex={-1}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all hover:shadow-amber-500/40 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>{isEn ? "Connecting..." : "Đang vào thế giới..."}</span>
                    </div>
                  ) : (
                    <>
                      <span>{isEn ? "Enter Foggo World" : "Vào Thế Giới Foggo"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Friendly New Adventurer Card */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isEn ? "New Adventurer?" : "Bạn là người chơi mới?"}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isEn
                        ? "Create an account in 30 seconds with no email required!"
                        : "Tạo tài khoản học sinh chỉ trong 30 giây, không cần email!"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchTab("register")}
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isEn ? "Sign Up Free" : "Đăng ký ngay"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ĐĂNG KÝ (REGISTER) */}
          {tab === "register" && (
            <div className="space-y-5 animate-fadeIn">
              {/* Role Picker: 2 Cards (Học Sinh vs Giáo Viên) */}
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider font-mono">
                  {isEn ? "Choose Your Role:" : "Chọn vai trò của bạn:"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Học sinh */}
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterRole("student");
                      setError(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      registerRole === "student"
                        ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/15"
                        : "bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {registerRole === "student" && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          registerRole === "student"
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        <Swords className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold block text-white">
                          {isEn ? "Student" : "Học Sinh"}
                        </span>
                        <span className="text-[10px] text-amber-400 font-semibold uppercase">
                          {isEn ? "No email required" : "Không cần email"}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {isEn
                        ? "Join in 30s, hunt monsters, forge gear & rank up."
                        : "Đăng ký 30s, săn quái, rèn đồ và nhận quà tân thủ."}
                    </p>
                  </button>

                  {/* Option 2: Giáo viên */}
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterRole("teacher");
                      setError(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      registerRole === "teacher"
                        ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/15"
                        : "bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {registerRole === "teacher" && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          registerRole === "teacher"
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold block text-white">
                          {isEn ? "Teacher / Admin" : "Giáo Viên / Quản Lý"}
                        </span>
                        <span className="text-[10px] text-sky-400 font-semibold uppercase">
                          {isEn ? "Requires email" : "Cần email"}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {isEn
                        ? "Create question sets, host dungeons & track reports."
                        : "Tạo 8 dạng bài, mở hầm ngục lớp và xuất điểm Excel."}
                    </p>
                  </button>
                </div>
              </div>

              {/* SUB-FORM A: ĐĂNG KÝ HỌC SINH (KHÔNG CẦN EMAIL) */}
              {registerRole === "student" && (
                <form onSubmit={handleStudentRegister} className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Username */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
                        {isEn ? "Username" : "Tên đăng nhập"} <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        pattern="^[a-zA-Z0-9_]{3,20}$"
                        title={
                          isEn
                            ? "3-20 characters (letters, numbers, underscore)"
                            : "3–20 ký tự (chữ thường, số, dấu gạch dưới)"
                        }
                        value={studentForm.username}
                        onChange={(e) =>
                          setStudentForm({ ...studentForm, username: e.target.value })
                        }
                        placeholder={isEn ? "e.g., knight_alex" : "ví dụ: hiepsi_nam"}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </div>

                    {/* Display Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
                        {isEn ? "Character / In-Game Name" : "Tên hiển thị nhân vật"}{" "}
                        <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={studentForm.displayName}
                        onChange={(e) =>
                          setStudentForm({ ...studentForm, displayName: e.target.value })
                        }
                        placeholder={isEn ? "e.g., Alex Nguyen" : "ví dụ: Nam Phong"}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
                      {isEn ? "Password" : "Mật khẩu"} <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={studentForm.password}
                        onChange={(e) =>
                          setStudentForm({ ...studentForm, password: e.target.value })
                        }
                        placeholder={isEn ? "Min 8 characters" : "Tối thiểu 8 ký tự"}
                        className="w-full pl-3.5 pr-11 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showRegPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Optional School / Class Collapse */}
                  <div className="border border-slate-800/80 rounded-2xl p-3 bg-slate-950/40">
                    <button
                      type="button"
                      onClick={() => setShowSchoolDetails(!showSchoolDetails)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <School className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          {isEn
                            ? "Add School & Class Info (Optional)"
                            : "Thêm thông tin Trường & Lớp (Tuỳ chọn)"}
                        </span>
                      </span>
                      {showSchoolDetails ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    {showSchoolDetails && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-800/60 animate-fadeIn">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            {isEn ? "Province" : "Tỉnh / TP"}
                          </label>
                          <select
                            value={studentForm.province}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, province: e.target.value })
                            }
                            className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                          >
                            {PROVINCES.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            {isEn ? "School Name" : "Tên Trường"}
                          </label>
                          <input
                            type="text"
                            value={studentForm.schoolName}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, schoolName: e.target.value })
                            }
                            placeholder={isEn ? "e.g., Lincoln High" : "ví dụ: THCS Lê Quý Đôn"}
                            className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            {isEn ? "Class" : "Lớp"}
                          </label>
                          <input
                            type="text"
                            value={studentForm.className}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, className: e.target.value })
                            }
                            placeholder={isEn ? "e.g., 9A1" : "ví dụ: 9A1"}
                            className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Student Register CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:shadow-amber-500/40 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>{isEn ? "Creating Character..." : "Đang tạo nhân vật..."}</span>
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {isEn ? "Create Character & Play Now" : "Khởi Tạo Nhân Vật & Vào Chơi"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    {isEn
                      ? "A secret recovery code will be automatically generated to protect your account."
                      : "Hệ thống sẽ tự động tạo Mã khôi phục bí mật để bạn bảo vệ tài khoản khi quên mật khẩu."}
                  </p>
                </form>
              )}

              {/* SUB-FORM B: ĐĂNG KÝ GIÁO VIÊN (CẦN EMAIL) */}
              {registerRole === "teacher" && (
                <form onSubmit={handleTeacherRegister} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
                      {isEn ? "Full Name" : "Họ và Tên (Thầy/Cô)"} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      required
                      placeholder={isEn ? "e.g., Prof. John Doe" : "Thầy/Cô Nguyễn Văn A"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isEn ? "Work / Teacher Email" : "Email Giáo Viên / Công Tác"}</span>
                      <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="giaovien@truong.edu.vn"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase">
                      {isEn ? "Password" : "Mật khẩu"} <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? "text" : "password"}
                        name="password"
                        required
                        minLength={8}
                        placeholder={isEn ? "Minimum 8 characters" : "Tối thiểu 8 ký tự"}
                        className="w-full pl-3.5 pr-11 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showRegPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Teacher Register CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:shadow-amber-500/40 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>{isEn ? "Registering..." : "Đang tạo tài khoản..."}</span>
                      </div>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4" />
                        <span>
                          {isEn ? "Register Teacher Account" : "Kích Hoạt Tài Khoản Giáo Viên"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    {isEn
                      ? "A verification link will be sent to your email to activate your account."
                      : "Một liên kết xác thực sẽ được gửi tới email của bạn để kích hoạt quyền tạo lớp."}
                  </p>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Security & Reliability reassurance footer */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500/70" />
            <span>{isEn ? "End-to-End Encryption" : "Mã hóa bảo mật"}</span>
          </div>
          <span>•</span>
          <span>{isEn ? "Foggo Learning RPG v1.0" : "Hệ Thống Foggo v1.0"}</span>
        </div>
      </div>
    </div>
  );
}
