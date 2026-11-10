"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  QrCode,
  X,
  CheckCircle2,
} from "lucide-react";
import { upgradeToPlus } from "./actions";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface PricingClientProps {
  isLoggedIn: boolean;
  currentPlan: "free" | "plus";
  planExpiresAt: string | null;
}

export function PricingClient({
  isLoggedIn,
  currentPlan,
  planExpiresAt,
}: PricingClientProps) {
  const router = useRouter();
  const { t, isEn } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [upgradedSuccess, setUpgradedSuccess] = useState(false);

  const isPlus = currentPlan === "plus";

  async function handleConfirmPayment() {
    setProcessing(true);
    const res = await upgradeToPlus({ cycle: billingCycle });
    setProcessing(false);

    if (res?.error) {
      alert(res.error);
      return;
    }

    setUpgradedSuccess(true);
    setTimeout(() => {
      setShowCheckoutModal(false);
      router.refresh();
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl">🦊</span>
            <span className="font-black text-base text-white tracking-tight">
              FOGGO <span className="text-amber-400">PLUS</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-mono font-bold">
            <LanguageSwitcher />

            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                {t.nav.dashboard}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
              >
                {t.common.login}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-12">
        {/* Banner tiêu đề */}
        <div className="text-center space-y-4 pt-6">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {isEn ? "ELEVATE YOUR CLASSROOM WITH FOGGO PLUS" : "NÂNG TẦM TRẢI NGHIỆM LỚP HỌC VỚI FOGGO PLUS"}
          </span>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            {isEn ? "Unlock the Full Power of the " : "Mở Khóa Toàn Bộ Sức Mạnh Của "}<br className="hidden sm:inline" />
            <span className="text-amber-400">{isEn ? "Knowledge Survival Island" : "Hòn Đảo Sinh Tồn Tri Thức"}</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "For educators who want unlimited quiz worlds: all 8 question types, detailed difficulty metrics, and no room capacity bottlenecks."
              : "Dành cho giáo viên hiện đại muốn tạo thế giới học tập không giới hạn cho học sinh: đầy đủ 8 dạng câu hỏi, phân tích độ khó chi tiết và không giới hạn phòng chơi."}
          </p>

          {/* Toggle Chu Kỳ Thanh Toán */}
          <div className="pt-2 flex items-center justify-center">
            <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1 font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isEn ? "Monthly" : "Hàng Tháng"}
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Hàng Năm</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Tiết kiệm 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Lưới so sánh 2 gói: Free vs Plus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch max-w-4xl mx-auto">
          {/* GÓI FREE */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Gói Khởi Đầu
                </span>
                <h3 className="text-2xl font-black text-white mt-1">Miễn Phí</h3>
                <div className="text-3xl font-black text-slate-200 mt-2 font-mono">
                  0 đ <span className="text-xs text-slate-500 font-sans font-normal">/ mãi mãi</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Đầy đủ công cụ cần thiết để tổ chức kiểm tra nhanh và trải nghiệm sinh tồn cơ bản cho 1 lớp học.
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                {[
                  "Tối đa 40 học sinh mỗi Thế giới",
                  "3 dạng câu hỏi cơ bản (Trắc nghiệm, Đúng/Sai, Chọn nhiều)",
                  "Tạo tối đa 10 bộ câu hỏi",
                  "Bảng xếp hạng trực tiếp trong thế giới",
                  "Khám phá & nhân bản bộ câu hỏi cộng đồng",
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <span className="block text-center py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono font-bold text-slate-400">
                {isPlus ? "Gói Cơ Bản" : "Gói Bạn Đang Dùng"}
              </span>
            </div>
          </div>

          {/* GÓI PLUS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-900 border-2 border-amber-500/60 flex flex-col justify-between space-y-6 shadow-2xl shadow-amber-500/10 relative">
            <div className="absolute -top-3.5 right-6 bg-amber-500 text-slate-950 text-[10px] font-black font-mono px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              KHUYÊN DÙNG CHO GIÁO VIÊN
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Gói Giáo Viên Plus
                </span>
                <h3 className="text-2xl font-black text-white mt-1">Toàn Năng</h3>
                <div className="text-3xl font-black text-amber-400 mt-2 font-mono">
                  {billingCycle === "yearly" ? "799.000 đ" : "89.000 đ"}{" "}
                  <span className="text-xs text-slate-400 font-sans font-normal">
                    /{billingCycle === "yearly" ? "năm" : "tháng"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Tối đa hóa hứng thú học sinh với toàn bộ cơ chế game, không giới hạn bộ câu hỏi và báo cáo học lực chuyên sâu.
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                {[
                  "Lên tới 500 học sinh cùng lúc (quy mô toàn khối/trường)",
                  "Mở khóa toàn bộ 8 dạng câu hỏi (Hotspot, Ghép cặp, Điền từ, Kéo thứ tự...)",
                  "Không giới hạn số lượng bộ câu hỏi tạo ra",
                  "Báo cáo sinh tồn chuyên sâu & Phân tích câu hỏi khó nhất",
                  "Xuất toàn bộ điểm số & thống kê ra file CSV / Excel",
                  "Cơ chế sương mù nâng cao, quái vật trùm và sự kiện đêm",
                  "Ưu tiên hỗ trợ kỹ thuật từ đội ngũ Foggo",
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              {isPlus ? (
                <div className="text-center py-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
                  ⭐ Tài khoản của bạn đang có gói Plus
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!isLoggedIn) {
                      router.push("/login?redirect=/pricing");
                      return;
                    }
                    setShowCheckoutModal(true);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black font-mono text-sm transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>NÂNG CẤP LÊN PLUS NGAY</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cam kết hoàn tiền & bảo mật */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 max-w-2xl mx-auto flex items-center gap-4 text-xs text-slate-400">
          <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
          <p>
            Hỗ trợ chuyển khoản ngân hàng qua VietQR hoặc thẻ nội địa. Kích hoạt tự động tức thì. Hỗ trợ xuất hóa đơn VAT theo yêu cầu của trường học.
          </p>
        </div>
      </main>

      {/* CHECKOUT MODAL: Mô phỏng thanh toán VietQR / PayOS */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              disabled={processing}
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {upgradedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-xl font-black text-white">
                  Kích Hoạt Gói Plus Thành Công!
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Chào mừng thầy cô đến với hòn đảo Foggo Plus. Mọi tính năng cao cấp đã sẵn sàng!
                </p>
              </div>
            ) : (
              <>
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                    THANH TOÁN AN TOÀN VIETQR
                  </span>
                  <h3 className="text-lg font-black text-white">
                    Gói Giáo Viên Plus ({billingCycle === "yearly" ? "1 Năm" : "1 Tháng"})
                  </h3>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {billingCycle === "yearly" ? "799.000 đ" : "89.000 đ"}
                  </div>
                </div>

                {/* Mã QR mô phỏng */}
                <div className="p-4 rounded-2xl bg-white text-slate-950 text-center space-y-2 shadow-inner">
                  <div className="w-44 h-44 mx-auto bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                    <QrCode className="w-24 h-24 text-slate-800" />
                    <span className="text-[10px] font-mono font-bold text-slate-600 mt-1">
                      VietQR · PayOS Sandbox
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold">
                    <span>Nội dung: </span>
                    <span className="text-indigo-600">FOGGO PLUS {billingCycle.toUpperCase()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    disabled={processing}
                    onClick={handleConfirmPayment}
                    className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black font-mono text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {processing ? "Đang xác thực giao dịch..." : "XÁC NHẬN ĐÃ CHUYỂN KHOẢN (MÔ PHỎNG)"}
                  </button>

                  <p className="text-[11px] text-center text-slate-500 font-mono">
                    Hệ thống sẽ tự động kích hoạt tài khoản ngay khi xác nhận.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

