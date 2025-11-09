"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPortal = pathname.startsWith("/portal");

  const handleScrollToTop = () => {
    console.log("Click event triggered!");
    // 여러 방법으로 스크롤 시도
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return (
    <>
      {!isAdminPortal && <Header />}
      <main>{children}</main>
      {!isAdminPortal && (
        <footer className="biode-footer">
          {/* PC 버전 - 이미지 */}
          <div className="biode-footer__pc">
            <img src="/footer.png" alt="BIODE Footer" className="biode-footer__pc-image" />
            <button
              className="biode-footer__pc-circle"
              onClick={handleScrollToTop}
              aria-label="맨 위로"
            ></button>
          </div>

          {/* 모바일 버전 - 이미지 */}
          <div className="biode-footer__mobile">
            <img src="/mobile_footer.png" alt="BIODE Mobile Footer" className="biode-footer__mobile-image" />
            <button
              className="biode-footer__mobile-circle"
              onClick={handleScrollToTop}
              aria-label="맨 위로"
            ></button>
          </div>
        </footer>
      )}
    </>
  );
}
