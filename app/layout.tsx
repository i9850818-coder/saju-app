import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "운세마당 - 사주·타로·꿈해몽",
    template: "%s | 운세마당",
  },
  description:
    "나만을 위한 사주·타로·꿈해몽 자기이해 리포트. 매일 새로운 운세를 무료로 만나보세요.",
  keywords: ["사주", "타로", "꿈해몽", "운세", "띠별운세", "궁합", "무료사주"],
  openGraph: {
    siteName: "운세마당",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
