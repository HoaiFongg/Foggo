import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-mono">
            <ArrowLeft className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
          <span className="font-bold text-xs text-amber-400 font-mono">FOGGO PRIVACY</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 space-y-8">
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
            AN TOÀN THÔNG TIN
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Chính Sách Bảo Mật Foggo
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Tuân thủ chuẩn bảo vệ dữ liệu giáo dục và trẻ em COPPA & GDPR
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Dữ liệu chúng tôi thu thập</h2>
            <p>
              Đối với học sinh: Chỉ lưu tên đăng nhập (hoặc nickname hiển thị), trường, lớp, mật khẩu đã được băm (bcrypt/argon2) và kết quả làm bài. Tuyệt đối không yêu cầu số điện thoại, địa chỉ nhà hay thông tin tài chính của học sinh.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Cơ chế chấm điểm và chống lộ đề</h2>
            <p>
              Toàn bộ đáp án chính xác của câu hỏi (answer key) được lưu trữ và chấm điểm độc quyền trên máy chủ thông qua Row Level Security (RLS). Trình duyệt người dùng không bao giờ nhận được dữ liệu đáp án trước khi hoàn thành bài.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Bảo vệ dữ liệu với mã hóa</h2>
            <p>
              Tất cả các kết nối đến Foggo đều được mã hóa bằng giao thức HTTPS/TLS hiện đại. Dữ liệu lưu trữ trong hệ thống cơ sở dữ liệu Supabase được kiểm soát truy cập nghiêm ngặt.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

