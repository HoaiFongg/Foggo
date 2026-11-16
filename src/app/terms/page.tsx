import Link from "next/link";
import { Shield } from "lucide-react";
import { NavigationHeader } from "@/components/NavigationHeader";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-16">
      <NavigationHeader
        profile={null}
        showBackButton
        backHref="/"
        backLabel="Trang chủ"
      />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 space-y-8">
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            QUY ĐỊNH SỬ DỤNG
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Điều Khoản Dịch Vụ Foggo
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Cập nhật lần cuối: Tháng 11/2026
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Giới thiệu và Phạm vi dịch vụ</h2>
            <p>
              Foggo là nền tảng học tập kết hợp trò chơi sinh tồn trực tuyến dành cho nhà trường, giáo viên và học sinh.
              Bằng việc truy cập hoặc sử dụng Foggo, người dùng đồng ý tuân thủ các điều khoản này.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Tài khoản học sinh và Quyền riêng tư trẻ em</h2>
            <p>
              Foggo hỗ trợ hình thức đăng ký không cần email dành cho học sinh (chỉ dùng tên đăng nhập và mã khôi phục).
              Chúng tôi cam kết không thu thập dữ liệu cá nhân nhạy cảm của học sinh dưới 16 tuổi mà không có sự bảo hộ của giáo viên hoặc nhà trường.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Bản quyền nội dung câu hỏi</h2>
            <p>
              Giáo viên giữ toàn quyền sở hữu đối với các bộ câu hỏi do mình tạo ra. Khi chọn chế độ "Công khai", giáo viên cấp quyền cho cộng đồng giáo viên Foggo nhân bản và sử dụng trong hoạt động giảng dạy phi thương mại.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Gói trả phí và Hoàn tiền</h2>
            <p>
              Các gói dịch vụ trả phí (Foggo Plus) được kích hoạt theo tháng hoặc theo năm. Người dùng có thể yêu cầu hoàn tiền trong vòng 7 ngày đầu tiên nếu không hài lòng với chất lượng dịch vụ.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
