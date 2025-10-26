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

  return (
    <>
      {!isAdminPortal && <Header />}
      <main>{children}</main>
      {!isAdminPortal && (
        <footer className="biode-footer">
          <div className="biode-footer__container">
            {/* 상단 메뉴 및 위로 가기 버튼 */}
            <div className="biode-footer__top">
              <div className="biode-footer__menu">
                <a href="/notice" className="biode-footer__menu-item">
                  NOTICE <span className="biode-footer__arrow">→</span>
                </a>
                <a href="/careers" className="biode-footer__menu-item">
                  CAREERS <span className="biode-footer__arrow">→</span>
                </a>
                <a href="/contact" className="biode-footer__menu-item">
                  CONTACT <span className="biode-footer__arrow">→</span>
                </a>
              </div>
              <button
                className="biode-footer__scroll-top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="맨 위로"
              >
                ↑
              </button>
            </div>

            {/* 회사 정보 */}
            <div className="biode-footer__info">
              <div className="biode-footer__info-row">
                <span className="biode-footer__label">본사</span>
                <span className="biode-footer__text">부산광역시 해운대구 센텀동로 123, C-1005</span>
              </div>
              <div className="biode-footer__info-row">
                <span className="biode-footer__label">TEL</span>
                <span className="biode-footer__text">070-4708-1788</span>
              </div>
              <div className="biode-footer__info-row">
                <span className="biode-footer__label">EMAIL</span>
                <span className="biode-footer__text">UNIDGROUP@UNIDGROUP.CO.KR</span>
              </div>
              <div className="biode-footer__info-row">
                <span className="biode-footer__text">사업자등록번호</span>
              </div>
              <div className="biode-footer__info-row">
                <span className="biode-footer__text">대표자</span>
              </div>
            </div>

            {/* BIODE 로고 */}
            <div className="biode-footer__logo">
              BIODE<sup>®</sup>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
