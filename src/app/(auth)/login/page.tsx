import { Suspense } from "react";
import AuthUnifiedClient from "@/app/(auth)/AuthUnifiedClient";

export const metadata = {
  title: "Đăng Nhập | FOGGO",
  description: "Đăng nhập vào thế giới học tập Foggo, tiếp tục hành trình săn quái và xua tan màn sương tri thức.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-400 font-mono text-sm">
          Đang tải Foggo Auth...
        </div>
      }
    >
      <AuthUnifiedClient defaultTab="login" />
    </Suspense>
  );
}
