import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { TelegramProvider } from "@/components/TelegramProvider";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Love Help AI",
  description: "Your AI relationship assistant",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F7F5FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <I18nProvider>
          <TelegramProvider>
            <main className="safe-bottom mx-auto min-h-screen max-w-lg px-4 pt-6">
              {children}
            </main>
            <BottomNav />
          </TelegramProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
