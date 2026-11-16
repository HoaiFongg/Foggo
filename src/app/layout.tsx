import type { Metadata } from "next";
import { Suspense } from "react";
import { NavigationProgressBar } from "@/components/NavigationProgressBar";
import { PixelAnimatedBackground } from "@/components/PixelAnimatedBackground";
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
    <html lang="vi" className="h-full antialiased light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var v=localStorage.getItem("foggo_theme_v_light");if(!v){localStorage.setItem("foggo_theme","light");localStorage.setItem("foggo_theme_v_light","1");}var t=localStorage.getItem("foggo_theme");if(t==="dark"){document.documentElement.setAttribute("data-theme","dark");document.documentElement.classList.add("dark");document.documentElement.classList.remove("light");}else{document.documentElement.setAttribute("data-theme","light");document.documentElement.classList.remove("dark");document.documentElement.classList.add("light");}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-amber-500/20 relative">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <PixelAnimatedBackground />
        {children}
      </body>
    </html>
  );
}
