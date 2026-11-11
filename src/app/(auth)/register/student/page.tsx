import { Suspense } from "react";
import AuthUnifiedClient from "@/app/(auth)/AuthUnifiedClient";

export const metadata = {
  title: "Đăng Ký Học Sinh | FOGGO",
  description: "Đăng ký học sinh không cần email chỉ trong 30 giây để vào săn quái và tích lũy Đom Đóm.",
};

export default function StudentRegisterPage() {
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
