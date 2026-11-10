"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Flame } from "lucide-react";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Khi route đã hoàn thành chuyển đổi, tắt hiệu ứng loading
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Bắt sự kiện click vào các liên kết nội bộ để hiển thị loading tức thì
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Bỏ qua các liên kết ngoài, liên kết neo #, hoặc mở tab mới
      if (
        href.startsWith("#") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.getAttribute("target") === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // Nếu đang bấm vào đúng URL hiện tại thì không kích hoạt
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      setIsLoading(true);

      // Dự phòng tự tắt sau 5s nếu chuyển trang bị hủy
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      return () => clearTimeout(timer);
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      {/* Tia laser chạy dọc đỉnh màn hình */}
      <div className="h-1 w-full bg-slate-900/60 overflow-hidden backdrop-blur-xs">
        <div className="h-full w-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-loading-bar" />
      </div>

      {/* Pill thông báo góc trên bên phải mượt mà */}
      <div className="fixed top-3 right-4 z-[9999] flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-mono font-medium animate-pulse">
        <Flame className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span>Đang thắp đèn lồng...</span>
      </div>
    </div>
  );
}
