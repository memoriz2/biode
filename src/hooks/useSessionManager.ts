"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseSessionManagerProps {
  onLogout: () => void;
  sessionTimeout?: number; // 30분 (밀리초)
  warningTimeout?: number; // 10초 (밀리초)
  enabled?: boolean; // 세션 관리 활성화 여부
}

export function useSessionManager({
  onLogout,
  sessionTimeout = 30 * 60 * 1000, // 30분
  warningTimeout = 10 * 1000, // 10초
  enabled = true, // 기본값: 활성화
}: UseSessionManagerProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isActive, setIsActive] = useState(true);

  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 세션 타이머 시작
  const startSessionTimer = useCallback(() => {
    if (!enabled) return;
    sessionTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      // 카운트다운 시작
      setCountdown(10);
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, sessionTimeout - warningTimeout);
  }, [enabled, sessionTimeout, warningTimeout, onLogout]);

  // 활동 감지 함수
  const resetSession = useCallback(async () => {
    if (!enabled) return;

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      if (response.ok) {
        setIsActive(true);
        setShowWarning(false);
        setCountdown(10);

        // 기존 타이머들 정리
        if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

        // 새로운 세션 타이머 시작
        startSessionTimer();
      } else {
        // 401 에러 등이 발생하면 아무것도 하지 않음 (무한 루프 방지)
        // 로그아웃은 하지 않음
      }
    } catch (error) {
      // 에러 발생 시에도 로그아웃하지 않음 (무한 루프 방지)
      console.error("세션 연장 실패:", error);
    }
  }, [enabled, startSessionTimer]);

  // 활동 감지 이벤트 리스너
  useEffect(() => {
    if (!enabled) return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      if (isActive) {
        resetSession();
      }
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isActive, resetSession, enabled]);

  // 초기 세션 타이머 시작
  useEffect(() => {
    if (!enabled) return;

    startSessionTimer();

    return () => {
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [startSessionTimer, enabled]);

  // 경고 모달 닫기
  const closeWarning = useCallback(() => {
    setShowWarning(false);
    setCountdown(10);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    resetSession();
  }, [resetSession]);

  return {
    showWarning,
    countdown,
    closeWarning,
    resetSession,
  };
}
