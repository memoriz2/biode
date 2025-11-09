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
    default: "비오드(BIODE) - 세계 최고 수준의 반려동물 유산균",
    template: "%s | 비오드(BIODE)",
  },
  description:
    "비오드(BIODE)는 과학적 데이터에 근거한 세계 최고 수준의 반려동물 유산균 솔루션을 제공합니다. 라이트핏 펫 유산균으로 반려동물의 건강한 삶을 지켜드립니다.",
  keywords: [
    "비오드",
    "BIODE",
    "반려동물 유산균",
    "펫 유산균",
    "라이트핏 펫 유산균",
    "강아지 유산균",
    "고양이 유산균",
    "반려동물 건강식품",
    "펫 프로바이오틱스",
    "반려동물 헬스케어",
    "반려동물 건강",
    "펫 건강식",
    "반려견 유산균",
    "반려묘 유산균",
    "프로바이오틱스",
    "장 건강",
    "면역력 강화",
    "반려동물 영양제",
  ],
  authors: [{ name: "비오드(BIODE)" }],
  creator: "비오드(BIODE)",
  publisher: "비오드(BIODE)",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.biode.com"),
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.biode.com",
    title: "비오드(BIODE) - 세계 최고 수준의 반려동물 유산균",
    description:
      "과학적 데이터에 근거한 세계 최고 수준의 반려동물 유산균. 라이트핏 펫 유산균으로 반려동물의 건강한 삶을 지켜드립니다.",
    siteName: "비오드(BIODE)",
    images: [
      {
        url: "/biode-og.jpg",
        width: 1200,
        height: 630,
        alt: "비오드 반려동물 유산균",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "비오드(BIODE) - 세계 최고 수준의 반려동물 유산균",
    description:
      "과학적 데이터에 근거한 세계 최고 수준의 반려동물 유산균. 라이트핏 펫 유산균으로 반려동물의 건강한 삶을 지켜드립니다.",
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

      </body>
    </html>
  );
}
