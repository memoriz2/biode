import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.scss";
import ConditionalLayout from "@/components/ConditionalLayout";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import VisitorLogger from "@/components/VisitorLogger";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const nanumSquare = localFont({
  src: [
    {
      path: "../../public/fonts/biode/nanum-square/NanumSquareL.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/biode/nanum-square/NanumSquareR.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/biode/nanum-square/NanumSquareB.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/biode/nanum-square/NanumSquareEB.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-nanum-square",
  display: "swap", // 폰트 로딩 최적화
});

export const metadata: Metadata = {
  title: {
    default: "비오드(BIODE) - 친환경 비닐 제작업체",
    template: "%s | 비오드(BIODE)",
  },
  description:
    "비오드(BIODE)는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다. 환경을 생각하는 농업인의 선택입니다.",
  keywords: [
    "비오드",
    "BIODE",
    "친환경 비닐",
    "농업",
    "지속가능",
    "환경보호",
    "농사용품",
    "친환경 농자재",
    "농업용 비닐",
    "친환경 농업",
    "지속가능한 농업",
    "비닐하우스",
    "농업용품 제조업",
    "친환경 소재",
    "농업 솔루션",
  ],
  authors: [{ name: "비오드(BIODE)" }],
  creator: "비오드(BIODE)",
  publisher: "비오드(BIODE)",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.biode.com"),
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.biode.com",
    title: "비오드(BIODE) - 친환경 비닐 제작업체",
    description:
      "비오드(BIODE)는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
    siteName: "비오드(BIODE)",
    images: [
      {
        url: "/biode-og.jpg",
        width: 1200,
        height: 630,
        alt: "비오드 친환경 비닐",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "비오드(BIODE) - 친환경 비닐 제작업체",
    description:
      "비오드(BIODE)는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
    images: ["/biode-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "xEZ76J92M9LwzjzAuyiAbyg39cIZ7ywbgLQm4egg1aw",
  },
  other: {
    "naver-site-verification": "a51be3d0afbb84d1c24832ccb255986de60286e9",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${geist.variable} ${nanumSquare.variable} biode-layout`}>
        <ConditionalLayout>{children}</ConditionalLayout>

        {/* 방문자 로그 자동 기록 */}
        <VisitorLogger />

        {/* Google Analytics */}
        <GoogleAnalytics
          GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""}
        />
      </body>
    </html>
  );
}
