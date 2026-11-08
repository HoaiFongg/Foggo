"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { updateUserRole, updateUserPlan, verifySchool } from "./actions";
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
  const [users, setUsers] = useState(initialUsers);
  const [schools, setSchools] = useState(initialSchools);
  const [activeTab, setActiveTab] = useState<"users" | "schools">("users");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-2xl">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">Yêu Cầu Quyền Quản Trị Viên (Admin)</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tài khoản hiện tại của bạn (<strong>{currentUser?.display_name || currentUser?.username}</strong>) có vai trò là{" "}
            <span className="font-mono text-amber-400 font-bold">{currentUser?.role}</span>. Trang này chỉ dành riêng cho Admin hệ thống.
          </p>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-left font-mono text-[11px] text-slate-300">
            <span className="text-amber-400 block mb-1">Cách nâng quyền Admin trong Supabase:</span>
            <code>
              UPDATE public.profiles<br />
              SET role = &apos;admin&apos;<br />
              WHERE id = &apos;{currentUser?.id}&apos;;
            </code>
          </div>

          <Link
            href="/dashboard"
            className="block w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Quay lại Bàn làm việc
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
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 lg:px-12 py-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-rose-400" />
                <h1 className="text-sm font-bold text-white">Quản Trị Hệ Thống</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              Admin: <strong className="text-white">{currentUser?.display_name || currentUser?.username}</strong>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container - Dàn trải đều */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Người dùng</span>
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {metrics.totalUsers}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Tài khoản trong hệ thống</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <School className="w-4 h-4 text-emerald-400" />
              <span>Trường học</span>
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {metrics.totalSchools}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Đã khai báo / duyệt</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Câu hỏi</span>
            </span>
            <div className="text-2xl sm:text-3xl font-black text-blue-400">
              {metrics.totalQuestions}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Ngân hàng câu hỏi</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>Thế giới mở</span>
            </span>
            <div className="text-2xl sm:text-3xl font-black text-purple-400">
              {metrics.totalSessions}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Phiên chơi sinh tồn</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === "users"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Quản Lý Người Dùng ({users.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("schools")}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === "schools"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Quản Lý Trường Học ({schools.length})
          </button>
        </div>

        {/* TAB 1: QUẢN LÝ NGƯỜI DÙNG */}
        {activeTab === "users" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tên hiển thị</th>
                    <th className="py-3 px-4">Tên đăng nhập</th>
                    <th className="py-3 px-4">Vai trò (Role)</th>
                    <th className="py-3 px-4">Gói (Plan)</th>
                    <th className="py-3 px-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-white font-bold">
                        {u.display_name || "Chưa đặt tên"}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {u.username || "Tài khoản email"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.role === "admin"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : u.role === "teacher"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.plan === "plus"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {u.plan}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Chuyển vai trò */}
                          <select
                            disabled={loadingId === u.id}
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px]"
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                          </select>

                          {/* Chuyển gói */}
                          <select
                            disabled={loadingId === u.id}
                            value={u.plan}
                            onChange={(e) => handlePlanChange(u.id, e.target.value as UserPlan)}
                            className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px]"
                          >
                            <option value="free">Free</option>
                            <option value="plus">Plus</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ TRƯỜNG HỌC */}
        {activeTab === "schools" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tên trường</th>
                    <th className="py-3 px-4">Tỉnh / Thành phố</th>
                    <th className="py-3 px-4">Cấp học</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Duyệt trường</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {schools.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-white font-bold">{s.name}</td>
                      <td className="py-3 px-4 text-slate-400">{s.province}</td>
                      <td className="py-3 px-4 text-slate-300 uppercase">{s.level || "THCS"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            s.status === "verified"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : s.status === "rejected"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.status !== "verified" && (
                            <button
                              type="button"
                              disabled={loadingId === s.id}
                              onClick={() => handleVerifySchool(s.id, "verified")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-all"
                            >
                              Duyệt
                            </button>
                          )}
                          {s.status !== "rejected" && (
                            <button
                              type="button"
                              disabled={loadingId === s.id}
                              onClick={() => handleVerifySchool(s.id, "rejected")}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-all"
                            >
                              Từ chối
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {schools.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        Chưa có trường học nào trong danh sách.
                      </td>
                    </tr>
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

