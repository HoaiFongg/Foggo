"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2, Calendar, CreditCard, Shield } from "lucide-react";

interface SubscriptionClientProps {
  profile: any;
  history: any[];
}

export function SubscriptionClient({
  profile,
  history,
}: SubscriptionClientProps) {
  const isPlus = profile?.plan === "plus";
  const expiresAt = profile?.plan_expires_at
    ? new Date(profile.plan_expires_at).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                TÀI KHOẢN & DỊCH VỤ
              </span>
              <h1 className="text-base font-black text-white">Quản Lý Gói Đăng Ký</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-8">
        {/* Card gói hiện tại */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Gói hiện tại của bạn:
              </span>
              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-2xl font-black text-white">
                  {isPlus ? "Gói Giáo Viên Plus" : "Gói Khởi Đầu (Miễn Phí)"}
                </h2>
                {isPlus && (
                  <span className="bg-amber-500/20 text-amber-400 text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                    ĐANG HOẠT ĐỘNG
                  </span>
                )}
              </div>
            </div>

            <div>
              {isPlus ? (
                <Link
                  href="/pricing"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 transition-colors inline-block"
                >
                  Gia Hạn Thêm
                </Link>
              ) : (
                <Link
                  href="/pricing"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-black transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Nâng Cấp Lên Plus</span>
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Hạn sử dụng</span>
              </span>
              <div className="font-bold text-white text-sm">
                {expiresAt || "Vĩnh viễn (Miễn phí)"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Phương thức</span>
              </span>
              <div className="font-bold text-white text-sm">
                {isPlus ? "VietQR / PayOS" : "Mặc định"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Số học sinh/phòng</span>
              </span>
              <div className="font-bold text-white text-sm">
                {isPlus ? "Tối đa 500" : "Tối đa 40"}
              </div>
            </div>
          </div>
        </div>

        {/* Lịch sử hóa đơn */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-white">Lịch Sử Giao Dịch</h3>
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ngày giao dịch</th>
                  <th className="py-3 px-4">Gói dịch vụ</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Hết hạn vào</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.map((sub) => (
                  <tr key={sub.id}>
                    <td className="py-3 px-4 text-slate-300">
                      {new Date(sub.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4 text-white font-bold uppercase">
                      {sub.plan}
                    </td>
                    <td className="py-3 px-4 text-emerald-400">
                      {sub.status === "active" ? "Thành công" : sub.status}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {new Date(sub.expires_at).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      Chưa có lịch sử giao dịch nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

