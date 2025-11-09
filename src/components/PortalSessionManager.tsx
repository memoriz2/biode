"use client";

import { useSessionManager } from "@/hooks/useSessionManager";
import AutoLogoutModal from "./AutoLogoutModal";
import { usePathname } from "next/navigation";

export default function PortalSessionManager() {
  const pathname = usePathname();

  // 로그인 페이지에서는 세션 관리 비활성화
  const isLoginPage = pathname === "/portal/login";

  // 세션 관리 훅 사용 (로그인 페이지가 아닐 때만)
  const { showWarning, countdown, closeWarning } = useSessionManager({
    onLogout: () => {
      // 로그아웃 처리
      window.location.href = "/portal/login";
    },
    sessionTimeout: 30 * 60 * 1000, // 30분
    warningTimeout: 10 * 1000, // 10초
    enabled: !isLoginPage, // 로그인 페이지에서는 비활성화
  });

  // 로그인 페이지에서는 아무것도 렌더링하지 않음
  if (isLoginPage) {
    return null;
  }

  return (
    <AutoLogoutModal
      isOpen={showWarning}
      onClose={closeWarning}
      onLogout={() => (window.location.href = "/portal/login")}
      countdown={countdown}
    />
  );
}
