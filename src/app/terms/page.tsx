import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-mono">
            <ArrowLeft className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
          <span className="font-bold text-xs text-amber-400 font-mono">FOGGO TERMS</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 space-y-8">
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
            QUY ĐỊNH SỬ DỤNG
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Điều Khoản Dịch Vụ Foggo
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Cập nhật lần cuối: Tháng 11/2026
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Giới thiệu và Phạm vi dịch vụ</h2>
            <p>
              Foggo là nền tảng học tập kết hợp trò chơi sinh tồn trực tuyến dành cho nhà trường, giáo viên và học sinh.
              Bằng việc truy cập hoặc sử dụng Foggo, người dùng đồng ý tuân thủ các điều khoản này.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Tài khoản học sinh và Quyền riêng tư trẻ em</h2>
            <p>
              Foggo hỗ trợ hình thức đăng ký không cần email dành cho học sinh (chỉ dùng tên đăng nhập và mã khôi phục).
              Chúng tôi cam kết không thu thập dữ liệu cá nhân nhạy cảm của học sinh dưới 16 tuổi mà không có sự bảo hộ của giáo viên hoặc nhà trường.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Bản quyền nội dung câu hỏi</h2>
            <p>
              Giáo viên giữ toàn quyền sở hữu đối với các bộ câu hỏi do mình tạo ra. Khi chọn chế độ "Công khai", giáo viên cấp quyền cho cộng đồng giáo viên Foggo nhân bản và sử dụng trong hoạt động giảng dạy phi thương mại.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Gói trả phí và Hoàn tiền</h2>
            <p>
              Các gói dịch vụ trả phí (Foggo Plus) được kích hoạt theo tháng hoặc theo năm. Người dùng có thể yêu cầu hoàn tiền trong vòng 7 ngày đầu tiên nếu không hài lòng với chất lượng dịch vụ.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
