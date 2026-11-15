"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Settings,
  User,
  School as SchoolIcon,
  ShieldCheck,
  Globe,
  KeyRound,
  Copy,
  Check,
  Download,
  Eye,
  EyeOff,
  X,
  Sparkles,
  Coins,
  LogOut,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import {
  updateStudentDisplayName,
  updateStudentSchoolClass,
  updateOwnPassword,
  getStudentAccountSecurity,
} from "@/app/dashboard/actions";
import { logout } from "@/app/(auth)/actions";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { VIETNAM_PROVINCES } from "@/lib/constants/provinces";
import type { Profile } from "@/types/database";

export interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: Profile | null;
  initialTab?: "profile" | "school" | "security" | "preferences";
  currentSchoolName?: string;
  currentClassName?: string;
  onProfileUpdated?: (updated: {
    displayName?: string;
    schoolName?: string;
    className?: string;
  }) => void;
}

export function UserSettingsModal({
  isOpen,
  onClose,
  profile,
  initialTab = "profile",
  currentSchoolName = "",
  currentClassName = "",
  onProfileUpdated,
}: UserSettingsModalProps) {
  const { language, setLanguage, isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<"profile" | "school" | "security" | "preferences">(
    initialTab
  );

  // Profile tab state
  const [displayNameInput, setDisplayNameInput] = useState(
    profile?.display_name || ""
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // School tab state
  const [schoolInput, setSchoolInput] = useState(currentSchoolName);
  const [classInput, setClassInput] = useState(currentClassName);
  const [provinceInput, setProvinceInput] = useState<string>("Hà Nội");
  const [savingSchool, setSavingSchool] = useState(false);
  const [schoolMsg, setSchoolMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Password / Security state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Recovery code
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setDisplayNameInput(profile?.display_name || "");
      setSchoolInput(currentSchoolName);
      setClassInput(currentClassName);
      setProfileMsg(null);
      setSchoolMsg(null);
      setPasswordMsg(null);
      setNewPassword("");
      setConfirmPassword("");

      // Fetch security and recovery details
      getStudentAccountSecurity().then((res) => {
        if (res.success && res.user) {
          setAccountInfo(res.user);
          if (res.user.recoveryCode) {
            setRecoveryCode(res.user.recoveryCode);
          }
          if (res.user.schoolName && !currentSchoolName) {
            setSchoolInput(res.user.schoolName);
          }
          if (res.user.className && !currentClassName) {
            setClassInput(res.user.className);
          }
        }
      });
    }
  }, [isOpen, initialTab, profile, currentSchoolName, currentClassName]);

  if (!isOpen || !mounted) return null;

  const role = profile?.role || accountInfo?.role || "student";
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const effectiveDisplayName = displayNameInput.trim() || profile?.display_name || "Nhà Thám Hiểm";

  // 1. Handle Rename
  async function handleSaveDisplayName(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = displayNameInput.trim();
    if (trimmed.length < 2 || trimmed.length > 40) {
      setProfileMsg({
        type: "error",
        text: isEn ? "Display name must be between 2 and 40 characters" : "Tên hiển thị phải từ 2 đến 40 ký tự",
      });
      return;
    }

    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await updateStudentDisplayName(trimmed);
      if (res.error) {
        setProfileMsg({ type: "error", text: res.error });
      } else {
        setProfileMsg({
          type: "success",
          text: isEn ? "Display name updated successfully!" : "Đổi tên hiển thị thành công!",
        });
        if (onProfileUpdated) {
          onProfileUpdated({ displayName: trimmed });
        }
      }
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Lỗi khi cập nhật tên" });
    } finally {
      setSavingProfile(false);
    }
  }

  // 2. Handle School & Class
  async function handleSaveSchoolClass(e: React.FormEvent) {
    e.preventDefault();
    if (!schoolInput.trim()) {
      setSchoolMsg({
        type: "error",
        text: isEn ? "Please enter a school name" : "Vui lòng nhập tên trường học",
      });
      return;
    }

    setSavingSchool(true);
    setSchoolMsg(null);
    try {
      const res = await updateStudentSchoolClass({
        schoolName: schoolInput.trim(),
        province: provinceInput.trim(),
        className: classInput.trim(),
      });
      if (res.error) {
        setSchoolMsg({ type: "error", text: res.error });
      } else {
        setSchoolMsg({
          type: "success",
          text: isEn ? "School & class updated successfully!" : "Đã cập nhật Trường & Lớp thành công!",
        });
        if (onProfileUpdated) {
          onProfileUpdated({
            schoolName: schoolInput.trim(),
            className: classInput.trim(),
          });
        }
      }
    } catch (err: any) {
      setSchoolMsg({ type: "error", text: err.message || "Lỗi khi cập nhật trường lớp" });
    } finally {
      setSavingSchool(false);
    }
  }

  // 3. Handle Password Change
  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({
        type: "error",
        text: isEn ? "Password must be at least 6 characters" : "Mật khẩu mới tối thiểu 6 ký tự",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({
        type: "error",
        text: isEn ? "Passwords do not match" : "Mật khẩu xác nhận không khớp",
      });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg(null);
    try {
      const res = await updateOwnPassword(newPassword);
      if (res.error) {
        setPasswordMsg({ type: "error", text: res.error });
      } else {
        setPasswordMsg({
          type: "success",
          text: isEn ? "Password changed successfully!" : "Đổi mật khẩu thành công!",
        });
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setPasswordMsg({ type: "error", text: err.message || "Lỗi khi đổi mật khẩu" });
    } finally {
      setSavingPassword(false);
    }
  }

  // 4. Handle Copy Recovery Code
  function handleCopyRecoveryCode() {
    if (!recoveryCode) return;
    navigator.clipboard.writeText(recoveryCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  // 5. Download Recovery Code Backup File
  function handleDownloadRecoveryBackup() {
    if (!recoveryCode) return;
    const username = accountInfo?.username || "student";
    const content = `FOGGO - MA KHOI PHUC TAI KHOAN HOC SINH
===============================================
Tai khoan: ${username}
Ten hien thi: ${effectiveDisplayName}
Ma khoi phuc bi mat: ${recoveryCode}
Ngay tao sao luu: ${new Date().toLocaleString("vi-VN")}
===============================================
Luu y: Giu bi mat ma nay de khoi phuc mat khau khi quen ma khong can email!`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `foggo-recovery-code-${username}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl my-auto max-h-[85vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-amber-500/20 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10">
              <Settings className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{isEn ? "Personal Settings" : "Cài Đặt Cá Nhân"}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {isEn
                  ? "Manage your profile, school, class, password & preferences"
                  : "Quản lý hồ sơ, trường lớp, bảo mật mật khẩu và tùy chọn của bạn"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
            title={isEn ? "Close" : "Đóng"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Bánh Răng Cài Đặt gom toàn bộ tùy chọn cá nhân) */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-800/80 bg-slate-950/30 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 shrink-0 ${
              activeTab === "profile"
                ? "border-amber-400 text-amber-300 bg-amber-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? "Profile" : "Hồ Sơ"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("school")}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 shrink-0 ${
              activeTab === "school"
                ? "border-blue-400 text-blue-300 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <SchoolIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>{isEn ? "School & Class" : "Trường & Lớp"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 shrink-0 ${
              activeTab === "security"
                ? "border-emerald-400 text-emerald-300 bg-emerald-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEn ? "Security & Password" : "Bảo Mật & Mật Khẩu"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 shrink-0 ${
              activeTab === "preferences"
                ? "border-purple-400 text-purple-300 bg-purple-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>{isEn ? "Preferences" : "Hệ Thống"}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: HỒ SƠ & TÊN HIỂN THỊ */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Card Header */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
                  {effectiveDisplayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-white truncate">{effectiveDisplayName}</h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                        isAdmin
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : isTeacher
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      {isAdmin ? "Admin" : isTeacher ? (isEn ? "Teacher" : "Giáo Viên") : (isEn ? "Student" : "Học Sinh")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                    {accountInfo?.username ? `@${accountInfo.username}` : (accountInfo?.email || "")}
                  </p>
                </div>
              </div>

              {/* Form Đổi Tên Hiển Thị */}
              <form onSubmit={handleSaveDisplayName} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono font-bold text-slate-300">
                      {isEn ? "Display Name (In-Game & Leaderboard):" : "Tên hiển thị nhân vật:"}
                    </label>
                    <span className="text-[11px] font-mono text-slate-500">
                      {displayNameInput.trim().length}/40 {isEn ? "chars" : "ký tự"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder={isEn ? "Enter your new display name..." : "Nhập tên hiển thị bạn muốn..."}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 text-sm font-sans transition-colors"
                    maxLength={40}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isEn
                      ? "This name will appear on the leaderboard, in dungeon teams and classroom activities."
                      : "Tên này sẽ hiển thị trên bảng xếp hạng thế giới, đấu trường lớp và danh sách lớp học."}
                  </p>
                </div>

                {profileMsg && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-mono ${
                      profileMsg.type === "success"
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/40 border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {profileMsg.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    )}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {savingProfile ? (isEn ? "Saving..." : "Đang lưu...") : (isEn ? "Save Display Name" : "Lưu Tên Hiển Thị")}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: TRƯỜNG & LỚP HỌC */}
          {activeTab === "school" && (
            <form onSubmit={handleSaveSchoolClass} className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex items-start gap-3">
                <SchoolIcon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200 leading-relaxed">
                  {isEn
                    ? "Setting your school and class connects you with classmates, lets you find classroom dungeons, and practices with exams created by teachers in your school!"
                    : "Cập nhật Trường và Lớp giúp bạn tự động tìm thấy các bạn cùng lớp, tham gia nhanh hầm ngục và luyện tập các bộ đề do thầy cô trường bạn giao!"}
                </p>
              </div>

              {/* Tỉnh / Thành phố */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  {isEn ? "Province / City:" : "Tỉnh / Thành phố:"}
                </label>
                <select
                  value={provinceInput}
                  onChange={(e) => setProvinceInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-400 text-sm font-sans transition-colors cursor-pointer"
                >
                  {VIETNAM_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tên trường học */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  {isEn ? "School Name:" : "Tên trường học:"}
                </label>
                <input
                  type="text"
                  value={schoolInput}
                  onChange={(e) => setSchoolInput(e.target.value)}
                  placeholder={isEn ? "e.g. THCS Chu Van An" : "Ví dụ: THCS Chu Văn An"}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-400 text-sm font-sans transition-colors"
                  list="school-suggestions"
                  required
                />
                <datalist id="school-suggestions">
                  <option value="THCS Chu Văn An" />
                  <option value="THCS Lê Quý Đôn" />
                  <option value="THCS Nguyễn Tri Phương" />
                  <option value="THCS Trần Phú" />
                  <option value="THCS Trưng Vương" />
                  <option value="THPT Chuyên Hà Nội - Amsterdam" />
                  <option value="THPT Chuyên Lê Hồng Phong" />
                </datalist>
              </div>

              {/* Tên lớp học */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  {isEn ? "Class Name:" : "Lớp học:"}
                </label>
                <input
                  type="text"
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  placeholder={isEn ? "e.g. 7A1, 8A2, 10 Tin..." : "Ví dụ: 7A1, 8B, 10 Tin..."}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-400 text-sm font-sans transition-colors"
                />
              </div>

              {schoolMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-mono ${
                    schoolMsg.type === "success"
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                      : "bg-rose-950/40 border-rose-500/40 text-rose-300"
                  }`}
                >
                  {schoolMsg.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{schoolMsg.text}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingSchool}
                  className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {savingSchool ? (isEn ? "Saving..." : "Đang lưu...") : (isEn ? "Save School & Class" : "Lưu Trường & Lớp")}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BẢO MẬT & MẬT KHẨU */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Đổi Mật Khẩu */}
              <form onSubmit={handleSavePassword} className="space-y-4">
                <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  <span>{isEn ? "Change Password" : "Đổi Mật Khẩu Mới"}</span>
                </h3>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    {isEn ? "New Password (min 6 chars):" : "Mật khẩu mới (tối thiểu 6 ký tự):"}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={isEn ? "Enter new password..." : "Nhập mật khẩu mới..."}
                      className="w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 text-sm font-sans transition-colors"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    {isEn ? "Confirm New Password:" : "Xác nhận lại mật khẩu mới:"}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={isEn ? "Re-enter new password..." : "Nhập lại mật khẩu mới..."}
                      className="w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 text-sm font-sans transition-colors"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {passwordMsg && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-mono ${
                      passwordMsg.type === "success"
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/40 border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {passwordMsg.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    )}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {savingPassword ? (isEn ? "Saving..." : "Đang lưu...") : (isEn ? "Update Password" : "Cập Nhật Mật Khẩu")}
                  </button>
                </div>
              </form>

              {/* Mục Mã Khôi Phục Bí Mật Cho Học Sinh */}
              {recoveryCode && (
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isEn ? "Secret Recovery Code" : "Mã Khôi Phục Bí Mật Của Bạn"}</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isEn
                      ? "Because you registered as a student without email, this code allows you to recover your account if you forget your password."
                      : "Do tài khoản học sinh không cần email, mã bí mật này là chìa khóa để bạn lấy lại tài khoản khi quên mật khẩu."}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between gap-3 font-mono">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-300 tracking-wider">
                      <span>🔑 {recoveryCode}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyRecoveryCode}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                        title={isEn ? "Copy Code" : "Sao chép mã"}
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copiedCode ? (isEn ? "Copied" : "Đã chép") : (isEn ? "Copy" : "Sao chép")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadRecoveryBackup}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                        title={isEn ? "Download Backup .txt" : "Tải file ghi nhớ"}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isEn ? "Backup" : "Tải file"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TÙY CHỌN & HỆ THỐNG */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              {/* Lựa Chọn Ngôn Ngữ Giao Diện */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-purple-400" />
                      <span>{isEn ? "Interface Language" : "Ngôn Ngữ Giao Diện"}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isEn
                        ? "Choose your preferred display language across the entire platform"
                        : "Chọn ngôn ngữ hiển thị trên toàn bộ hệ thống Foggo"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setLanguage("vi")}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      language === "vi"
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/30"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-xl">🇻🇳</span>
                    <div className="text-left">
                      <p className="text-xs font-bold leading-tight">Tiếng Việt</p>
                      <p className="text-[10px] text-slate-400 font-mono">Bản ngữ</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      language === "en"
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/30"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-xl">🇬🇧</span>
                    <div className="text-left">
                      <p className="text-xs font-bold leading-tight">English</p>
                      <p className="text-[10px] text-slate-400 font-mono">Global</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Thông Tin Tài Khoản & Tài Nguyên */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-300">
                  {isEn ? "Account Resources & Status" : "Tài Nguyên & Trạng Thái Tài Khoản"}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400 font-mono">{isEn ? "Fireflies" : "Đom Đóm"}</p>
                      <p className="text-sm font-bold text-amber-300 font-mono">{profile?.fireflies ?? 120}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <User className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400 font-mono">{isEn ? "Account Type" : "Loại tài khoản"}</p>
                      <p className="text-xs font-bold text-emerald-300 font-mono capitalize">{role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút Đăng Xuất An Toàn */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-300">{isEn ? "Sign Out" : "Đăng Xuất Khỏi Thiết Bị"}</p>
                  <p className="text-[11px] text-slate-500">
                    {isEn ? "Safely log out of your Foggo session." : "Kết thúc phiên làm việc trên trình duyệt hiện tại."}
                  </p>
                </div>
                <form action={logout}>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isEn ? "Log Out" : "Đăng Xuất"}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>FOGGO · {isEn ? "Account Settings Center" : "Trung Tâm Cài Đặt Tài Khoản"}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
          >
            {isEn ? "Close" : "Đóng"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

