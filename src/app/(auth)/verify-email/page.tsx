import Link from "next/link";
import { MailCheck, ArrowRight, Flame } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-[0_0_25px_rgba(245,158,11,0.25)] mb-6">
          <MailCheck className="w-8 h-8 animate-bounce" />
        </div>

        <h1 className="text-2xl font-black text-white font-mono">KIỂM TRA HỘP THƯ</h1>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          Chúng tôi đã gửi một liên kết xác nhận tới địa chỉ email của bạn. Vui lòng bấm vào liên kết trong thư để kích hoạt tài khoản Foggo.
        </p>

        <div className="mt-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
            Không thấy email?
          </h2>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>Kiểm tra trong mục Thư rác (Spam) hoặc Quảng cáo.</li>
            <li>Đợi 1–2 phút để hệ thống gửi thư hoàn tất.</li>
          </ul>
        </div>

        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold"
          >
            <span>Quay lại trang Đăng nhập</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

