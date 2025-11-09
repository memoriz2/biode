"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWowSubmenuOpen, setIsWowSubmenuOpen] = useState(true);
  const [isPcMenuOpen, setIsPcMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // 스크롤 이벤트 최적화 - debounce 적용
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolled(window.scrollY > 10);
    }, 16); // 60fps에 맞춘 최적화
  }, []);

  useEffect(() => {
    // passive: true로 성능 향상
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // 모바일 메뉴 토글 최적화
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // PC 메뉴 토글
  const togglePcMenu = useCallback(() => {
    setIsPcMenuOpen((prev) => !prev);
  }, []);

  // 메뉴 닫기 함수
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsWowSubmenuOpen(false);
  }, []);

  // WOW 서브메뉴 토글
  const toggleWowSubmenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsWowSubmenuOpen((prev) => !prev);
  }, []);

  // 서브메뉴 항목
  const wowSubmenuItems = useMemo(
    () => [
      { href: "/wow/principle", label: "비오드의 원칙" },
      { href: "/wow/technology", label: "비오드의 기술" },
      { href: "/wow/effect", label: "비오드의 효과" },
    ],
    []
  );

  return (
    <header
      className={`biode-header ${
        isScrolled ? "biode-header--scrolled" : ""
      } ${isHomePage ? "biode-header--home" : ""}`}
    >
      <div className="biode-header__container">
        <div className="biode-header__content">
          {/* 로고 */}
          <Link href="/" className="biode-header__logo">
            <img
              src="/20250915_BOID_Homepage_1 - 08-11-2025 17-41-29.png"
              alt="BIODE Logo"
              className="biode-header__logo-image"
            />
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="biode-header__nav">
            <div className="biode-header__nav-menu-wrapper">
              <img
                src="/menu.png"
                alt="메뉴"
                className="biode-header__nav-menu-image"
              />
              {/* 메뉴별 클릭 영역 */}
              <Link href="/only" className="biode-header__nav-area biode-header__nav-area--1" aria-label="ONLY, 비오드" />

              {/* WOW 메뉴 - 드롭다운 포함 */}
              <div className="biode-header__nav-area biode-header__nav-area--2 biode-header__nav-area--has-submenu">
                <Link href="/wow/principle" className="biode-header__nav-area-link" aria-label="WOW, 비오드" />
                {/* PC 드롭다운 서브메뉴 */}
                <div className="biode-header__submenu">
                  {wowSubmenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="biode-header__submenu-item"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/experience" className="biode-header__nav-area biode-header__nav-area--6" aria-label="놀라운 경험의 시작" />
              <Link href="/store" className="biode-header__nav-area biode-header__nav-area--7" aria-label="STORE" />
              <Link href="/contact" className="biode-header__nav-area biode-header__nav-area--8" aria-label="고객센터" />
            </div>
          </nav>

          {/* PC 투명 div */}
          <button
            className="biode-header__pc-toggle"
            onClick={togglePcMenu}
            aria-label="메뉴 열기"
            aria-expanded={isPcMenuOpen}
          >
          </button>

          {/* 모바일 메뉴 토글 */}
          <button
            className="biode-header__mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="메뉴 열기"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <span className="biode-header__close-icon">✕</span>
            ) : (
              <div className="biode-header__hamburger">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        <div
          className={`biode-header__mobile-menu ${
            isMobileMenuOpen ? "biode-header__mobile-menu--open" : ""
          }`}
        >
          {/* ONLY, 비오드 */}
          <Link
            href="/only"
            className="biode-header__mobile-menu-item"
            onClick={closeMobileMenu}
          >
            <span className="biode-header__dash">- </span>
            ONLY, 비오드
          </Link>

          {/* WOW, 비오드 - 아코디언 */}
          <div className="biode-header__mobile-menu-accordion">
            <button
              className="biode-header__mobile-menu-item biode-header__mobile-menu-item--button"
              onClick={toggleWowSubmenu}
            >
              <span className="biode-header__dash">- </span>
              WOW, 비오드
              <span className={`biode-header__mobile-menu-arrow ${isWowSubmenuOpen ? "biode-header__mobile-menu-arrow--open" : ""}`}>
                ▼
              </span>
            </button>
            {/* 서브메뉴 */}
            <div className={`biode-header__mobile-submenu ${isWowSubmenuOpen ? "biode-header__mobile-submenu--open" : ""}`}>
              {wowSubmenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="biode-header__mobile-menu-item biode-header__mobile-menu-item--normal biode-header__mobile-menu-item--sub"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 놀라운 경험의 시작 */}
          <Link
            href="/experience"
            className="biode-header__mobile-menu-item"
            onClick={closeMobileMenu}
          >
            <span className="biode-header__dash">- </span>
            놀라운 경험의 시작
          </Link>

          {/* STORE */}
          <Link
            href="/store"
            className="biode-header__mobile-menu-item"
            onClick={closeMobileMenu}
          >
            <span className="biode-header__dash">- </span>
            STORE
          </Link>

          {/* 고객센터 */}
          <Link
            href="/contact"
            className="biode-header__mobile-menu-item"
            onClick={closeMobileMenu}
          >
            <span className="biode-header__dash">- </span>
            고객센터
          </Link>
        </div>

        {/* PC 서브메뉴 - WOW 메뉴만 */}
        <div
          className={`biode-header__pc-menu ${
            isPcMenuOpen ? "biode-header__pc-menu--open" : ""
          }`}
        >
          {wowSubmenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="biode-header__mobile-menu-item biode-header__mobile-menu-item--normal"
              onClick={() => setIsPcMenuOpen(false)}
            >
              <span className="biode-header__dash">- </span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
