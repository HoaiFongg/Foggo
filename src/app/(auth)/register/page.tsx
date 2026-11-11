import { Suspense } from "react";
import AuthUnifiedClient from "@/app/(auth)/AuthUnifiedClient";

export const metadata = {
  title: "Đăng Ký Tài Khoản | FOGGO",
  description: "Khởi tạo tài khoản Học sinh (không cần email) hoặc Giáo viên để bắt đầu hành trình học tập sinh tồn Foggo.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-400 font-mono text-sm">
          Đang tải Foggo Auth...
        </div>
      }
    >
      <AuthUnifiedClient defaultTab="register" />
    </Suspense>
  );
}
