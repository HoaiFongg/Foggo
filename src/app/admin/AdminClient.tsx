"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  Users,
  School,
  BookOpen,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Crown,
  ArrowLeft,
  Sparkles,
  Lock,
  Search,
  KeyRound,
  GraduationCap,
  Award,
  Layers,
  UserCheck,
} from "lucide-react";
import {
  updateUserRole,
  updateUserPlan,
  verifySchool,
  awardFireflies,
  resetStudentRecoveryCode,
} from "./actions";
import type { UserRole, UserPlan } from "@/types/database";

interface AdminClientProps {
  currentUser: any;
  isUserAdmin: boolean;
  users: any[];
  schools: any[];
  metrics: {
    totalUsers: number;
    totalSchools: number;
    totalQuestions: number;
    totalSessions: number;
  };
}

export function AdminClient({
  currentUser,
  isUserAdmin,
  users: initialUsers,
  schools: initialSchools,
  metrics,
}: AdminClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = (searchParams.get("tab") as any) || "teachers";

  const [users, setUsers] = useState(initialUsers);
  const [schools, setSchools] = useState(initialSchools);
  const [activeTab, setActiveTab] = useState<"teachers" | "students" | "schools" | "all">(
    ["teachers", "students", "schools", "all"].includes(defaultTab) ? defaultTab : "teachers"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [alertInfo, setAlertInfo] = useState<string | null>(null);

  // Phân loại danh sách
  const teachers = useMemo(
    () => users.filter((u) => u.role === "teacher" || u.role === "admin"),
    [users]
  );
  const students = useMemo(
    () => users.filter((u) => u.role === "student"),
    [users]
  );

  // Lọc theo tìm kiếm
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchName = (t.display_name || "").toLowerCase().includes(q);
      const matchUser = (t.username || "").toLowerCase().includes(q);
      const matchSchool = (t.schools?.name || "").toLowerCase().includes(q);
      return matchName || matchUser || matchSchool;
    });
  }, [teachers, searchQuery]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchName = (s.display_name || "").toLowerCase().includes(q);
      const matchUser = (s.username || "").toLowerCase().includes(q);
      const matchSchool = (s.schools?.name || "").toLowerCase().includes(q);
      const matchClass = (s.classes?.name || "").toLowerCase().includes(q);
      return matchName || matchUser || matchSchool || matchClass;
    });
  }, [students, searchQuery]);

  const filteredSchools = useMemo(() => {
    return schools.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.province || "").toLowerCase().includes(q) ||
        (s.district || "").toLowerCase().includes(q)
      );
    });
  }, [schools, searchQuery]);

  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-2xl">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Yêu Cầu Quyền Quản Trị Viên</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Trang này dành riêng cho quản trị viên tối cao của hệ thống Foggo.
          </p>
          <Link
            href="/dashboard"
            className="block w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Quay lại Tổng quan
          </Link>
        </div>
      </div>
    );
  }

  async function handleRoleChange(targetUserId: string, newRole: UserRole) {
    setLoadingId(targetUserId);
    const res = await updateUserRole({ targetUserId, newRole });
    setLoadingId(null);
    if (res?.error) {
      alert(res.error);
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
    );
  }

  async function handlePlanChange(targetUserId: string, newPlan: UserPlan) {
    setLoadingId(targetUserId);
    const res = await updateUserPlan({ targetUserId, newPlan });
    setLoadingId(null);
    if (res?.error) {
      alert(res.error);
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUserId ? { ...u, plan: newPlan } : u))
    );
  }

  async function handleAwardFireflies(targetUserId: string, amount: number) {
    setLoadingId(targetUserId);
    const res = await awardFireflies({ targetUserId, amount });
    setLoadingId(null);
    if (res?.error) {
      alert(res.error);
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUserId ? { ...u, fireflies: res.newFireflies } : u))
    );
    setAlertInfo(`Đã tặng thành công +${amount} Đom Đóm cho người dùng!`);
  }

  async function handleResetRecoveryCode(studentId: string, studentName: string) {
    if (!confirm(`Bạn có chắc muốn cấp lại mã khôi phục bí mật cho học sinh "${studentName}" không?`)) {
      return;
    }
    setLoadingId(studentId);
    const res = await resetStudentRecoveryCode({ studentId });
    setLoadingId(null);
    if (res?.error) {
      alert(res.error);
      return;
    }
    alert(`Mã khôi phục mới của học sinh [${studentName}] là:\n\n👉  ${res.newCode}\n\nHãy gửi mã này cho học sinh để khôi phục mật khẩu.`);
  }

  async function handleVerifySchool(schoolId: string, status: "verified" | "rejected") {
    setLoadingId(schoolId);
    const res = await verifySchool({ schoolId, status });
    setLoadingId(null);
    if (res?.error) {
      alert(res.error);
      return;
    }
    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, status } : s))
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 lg:px-12 py-3.5">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-rose-400" />
                <h1 className="text-sm font-bold text-white tracking-tight">
                  Quản Trị Hệ Thống Foggo
                </h1>
                <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-semibold">
                  Tối Cao
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400 hidden sm:inline">
              Quản trị viên: <strong className="text-slate-200">{currentUser?.display_name || currentUser?.username}</strong>
            </span>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-sans transition-colors"
            >
              Về Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container - Dàn trải đều toàn màn hình */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 space-y-6">
        {alertInfo && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <span>✨ {alertInfo}</span>
            <button
              type="button"
              onClick={() => setAlertInfo(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4 Thống kê chính */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Giáo viên</span>
            </span>
            <div className="text-2xl font-bold text-white">{teachers.length}</div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              {teachers.filter((t) => t.plan === "plus").length} tài khoản Plus
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Học sinh</span>
            </span>
            <div className="text-2xl font-bold text-emerald-400">{students.length}</div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              {students.filter((s) => s.auth_type === "username").length} không dùng email
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <School className="w-4 h-4 text-blue-400" />
              <span>Trường học</span>
            </span>
            <div className="text-2xl font-bold text-blue-400">{metrics.totalSchools}</div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              {schools.filter((s) => s.status === "verified").length} trường đã duyệt
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>Hầm ngục mở</span>
            </span>
            <div className="text-2xl font-bold text-purple-400">{metrics.totalSessions}</div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Phiên sinh tồn</p>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("teachers");
                setSearchQuery("");
              }}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "teachers"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Quản Lý Giáo Viên ({teachers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("students");
                setSearchQuery("");
              }}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "students"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Quản Lý Học Sinh ({students.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("schools");
                setSearchQuery("");
              }}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "schools"
                  ? "bg-blue-500 text-slate-950 font-bold shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Trường Học ({schools.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, tài khoản, trường..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: QUẢN LÝ GIÁO VIÊN */}
        {/* ========================================================================= */}
        {activeTab === "teachers" && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">Giáo viên</th>
                    <th className="py-3 px-4">Tài khoản / Email</th>
                    <th className="py-3 px-4">Trường học</th>
                    <th className="py-3 px-4">Gói dịch vụ</th>
                    <th className="py-3 px-4">Vai trò</th>
                    <th className="py-3 px-4 text-right">Tác vụ quản trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                        Không tìm thấy giáo viên nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredTeachers.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span>{t.display_name || "Chưa đặt tên"}</span>
                            {t.role === "admin" && (
                              <span title="Admin tối cao"><Crown className="w-3.5 h-3.5 text-rose-400" /></span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {t.username || "Tài khoản Google/Email"}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {t.schools?.name || "Chưa gắn trường"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              t.plan === "plus"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {t.plan === "plus" ? "Gói Plus" : "Gói Free"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              t.role === "admin"
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {t.role === "admin" ? "Admin" : "Giáo viên"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Nâng / Hạ Gói Plus */}
                            <button
                              type="button"
                              disabled={loadingId === t.id}
                              onClick={() => handlePlanChange(t.id, t.plan === "plus" ? "free" : "plus")}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                                t.plan === "plus"
                                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                              }`}
                            >
                              {t.plan === "plus" ? "Hạ Free" : "Cấp Plus"}
                            </button>

                            {/* Đổi vai trò */}
                            <select
                              disabled={loadingId === t.id}
                              value={t.role}
                              onChange={(e) => handleRoleChange(t.id, e.target.value as UserRole)}
                              className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px] cursor-pointer"
                            >
                              <option value="teacher">Giáo viên</option>
                              <option value="admin">Admin</option>
                              <option value="student">Chuyển sang Học sinh</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: QUẢN LÝ HỌC SINH */}
        {/* ========================================================================= */}
        {activeTab === "students" && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">Học sinh</th>
                    <th className="py-3 px-4">Tên đăng nhập (Username)</th>
                    <th className="py-3 px-4">Trường / Lớp</th>
                    <th className="py-3 px-4">Cấp độ & XP</th>
                    <th className="py-3 px-4">Đom Đóm</th>
                    <th className="py-3 px-4">Loại tài khoản</th>
                    <th className="py-3 px-4 text-right">Tác vụ quản trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                        Không tìm thấy học sinh nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">
                          {s.display_name || "Chưa đặt tên"}
                        </td>
                        <td className="py-3 px-4 text-emerald-400 font-mono text-[11px] font-bold">
                          {s.username || "Chưa có username"}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {s.schools?.name || "Chưa gắn trường"}{" "}
                          {s.classes?.name ? `· Lớp ${s.classes.name}` : ""}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                          Level <strong className="text-amber-400">{s.level || 1}</strong> ({s.xp || 0} XP)
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-300 font-semibold">
                          {s.fireflies ?? 0}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                              s.auth_type === "username"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {s.auth_type === "username" ? "Không cần Email" : "Email"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Cấp lại mã khôi phục khi học sinh quên mật khẩu */}
                            <button
                              type="button"
                              disabled={loadingId === s.id}
                              onClick={() => handleResetRecoveryCode(s.id, s.display_name || s.username)}
                              title="Cấp lại mã khôi phục bí mật cho học sinh"
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <KeyRound className="w-3 h-3 text-amber-400" />
                              <span>Cấp lại mã</span>
                            </button>

                            {/* Tặng Đom Đóm */}
                            <button
                              type="button"
                              disabled={loadingId === s.id}
                              onClick={() => handleAwardFireflies(s.id, 50)}
                              title="Tặng 50 Đom Đóm"
                              className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-mono transition-colors cursor-pointer"
                            >
                              +50 🪲
                            </button>

                            {/* Nâng lên Giáo viên */}
                            <button
                              type="button"
                              disabled={loadingId === s.id}
                              onClick={() => handleRoleChange(s.id, "teacher")}
                              title="Thăng cấp tài khoản này thành Giáo viên"
                              className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] transition-colors cursor-pointer"
                            >
                              Lên GV
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: QUẢN LÝ TRƯỜNG HỌC */}
        {/* ========================================================================= */}
        {activeTab === "schools" && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">Tên trường học</th>
                    <th className="py-3 px-4">Tỉnh / Thành phố</th>
                    <th className="py-3 px-4">Quận / Huyện</th>
                    <th className="py-3 px-4">Cấp học</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Kiểm duyệt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSchools.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                        Không tìm thấy trường học nào.
                      </td>
                    </tr>
                  ) : (
                    filteredSchools.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">{s.name}</td>
                        <td className="py-3 px-4 text-slate-300">{s.province}</td>
                        <td className="py-3 px-4 text-slate-400">{s.district || "—"}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-amber-400 uppercase">
                          {s.level || "thcs"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              s.status === "verified"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : s.status === "pending"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-rose-500/20 text-rose-300"
                            }`}
                          >
                            {s.status === "verified" ? "Đã duyệt" : s.status === "pending" ? "Chờ duyệt" : "Từ chối"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {s.status !== "verified" && (
                              <button
                                type="button"
                                disabled={loadingId === s.id}
                                onClick={() => handleVerifySchool(s.id, "verified")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Duyệt
                              </button>
                            )}
                            {s.status !== "rejected" && (
                              <button
                                type="button"
                                disabled={loadingId === s.id}
                                onClick={() => handleVerifySchool(s.id, "rejected")}
                                className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] transition-colors cursor-pointer"
                              >
                                Từ chối
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
