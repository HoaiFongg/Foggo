import type { Metadata } from "next";
import { Suspense } from "react";
import { NavigationProgressBar } from "@/components/NavigationProgressBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foggo - Web Học Tập Sinh Tồn",
  description: "Trả lời câu hỏi, tan sương mù, sinh tồn qua bóng đêm",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
