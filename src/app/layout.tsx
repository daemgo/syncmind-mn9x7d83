import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Noto_Serif_SC } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EAM设备管理系统",
  description: "企业资产管理系统，实现设备全生命周期可追溯",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${playfair.variable} ${notoSerif.variable} antialiased`}
      >
        <Sidebar />
        <main className="ml-60 min-h-screen">
          {children}
        </main>
        <Script id="nav-bridge" strategy="afterInteractive">{`
          (function() {
            if (window === window.parent) return;
            var notify = function() {
              window.parent.postMessage({
                type: 'preview-navigation',
                pathname: location.pathname,
                url: location.href
              }, '*');
            };
            // Notify on initial load
            notify();
            // Intercept pushState / replaceState
            var origPush = history.pushState;
            var origReplace = history.replaceState;
            history.pushState = function() {
              origPush.apply(this, arguments);
              notify();
            };
            history.replaceState = function() {
              origReplace.apply(this, arguments);
              notify();
            };
            // Intercept popstate (browser back/forward)
            window.addEventListener('popstate', notify);
            // Listen for commands from parent
            window.addEventListener('message', function(e) {
              if (e.data && e.data.type === 'preview-command') {
                if (e.data.command === 'back') history.back();
                if (e.data.command === 'forward') history.forward();
                if (e.data.command === 'navigate') {
                  window.location.href = e.data.url;
                }
              }
            });
          })();
        `}</Script>
      </body>
    </html>
  );
}
