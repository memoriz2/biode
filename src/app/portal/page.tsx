"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { AnimatedNumber } from "@/components/AnimatedNumber";

interface DashboardStats {
  // 방문자 통계 (새로 추가)
  visitors: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  searchBots: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    topBots: { name: string; count: number }[];
  };
  todos: {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
  organization: {
    total: number;
    departments: string[];
  };
  history: {
    total: number;
    yearRange: { min: number; max: number };
  };
  bannerNews: {
    total: number;
    active: number;
    inactive: number;
  };
  notices: {
    total: number;
    pinned: number;
    active: number;
    inactive: number;
  };
  inquiries: {
    total: number;
    pending: number;
    answered: number;
    secret: number;
    public: number;
    answerRate: number;
  };
}

export default function AdminDashboard() {
  // 초기값을 명시적으로 guest로 설정
  const [userType, setUserType] = useState<string>("guest");
  const [loading, setLoading] = useState(true);

  // 실시간 통계 훅 사용
  const { data: visitorStats, loading: visitorLoading } = useRealtimeStats(
    () => fetch("/api/stats/visitors").then((res) => res.json()),
    { intervalMs: 120000, enabled: true } // 2분마다 업데이트
  );

  const { data: inquiryStats, loading: inquiryLoading } = useRealtimeStats(
    () => fetch("/api/stats/inquiries").then((res) => res.json()),
    { intervalMs: 120000, enabled: true }
  );

  // 마지막 업데이트 시간 표시
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  useEffect(() => {
    if (visitorStats || inquiryStats) {
      setLastUpdateTime(new Date());
    }
  }, [visitorStats, inquiryStats]);

  // 통계 데이터 통합
  const stats: DashboardStats = {
    visitors: visitorStats || { total: 0, today: 0, thisWeek: 0, thisMonth: 0 },
    searchBots: {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      topBots: [],
    },
    todos: { total: 0, completed: 0, pending: 0, completionRate: 0 },
    organization: { total: 0, departments: [] },
    history: { total: 0, yearRange: { min: 2024, max: 2024 } },
    bannerNews: { total: 0, active: 0, inactive: 0 },
    notices: { total: 0, pinned: 0, active: 0, inactive: 0 },
    inquiries: inquiryStats || {
      total: 0,
      pending: 0,
      answered: 0,
      secret: 0,
      public: 0,
      answerRate: 0,
    },
  };

  const router = useRouter();

  const handleButtonClick = () => {
    if (userType === "guest") {
      router.push("/portal/login");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("[대시보드] 로그아웃 시작");
      const response = await fetch("/api/auth/logout", { method: "POST" });
      console.log("[대시보드] 로그아웃 API 응답:", response.status);

      localStorage.removeItem("userType");
      // 로그아웃 후 로그인 페이지로 리다이렉트
      console.log("[대시보드] 로그인 페이지로 이동");
      window.location.href = "/portal/login";
    } catch (err) {
      console.error("[대시보드] 로그아웃 오류:", err);
      localStorage.removeItem("userType");
      window.location.href = "/portal/login";
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUserType(data.userType || "guest");
      } else {
        setUserType("guest");
      }
    } catch (err) {
      console.error("사용자 정보 가져오기 실패:", err);
      setUserType("guest");
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // localStorage 먼저 체크
        const localUserType = localStorage.getItem("userType");
        console.log("[대시보드] localStorage userType:", localUserType);

        if (!localUserType || localUserType === "guest") {
          console.log("[대시보드] guest로 설정");
          setUserType("guest");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          console.log("[대시보드] API 응답 userType:", data.userType);
          setUserType(data.userType || "guest");
        } else {
          console.log("[대시보드] API 실패 - guest로 설정");
          setUserType("guest");
          localStorage.removeItem("userType");
        }
      } catch (err) {
        console.error("[대시보드] 사용자 정보 가져오기 실패:", err);
        setUserType("guest");
        localStorage.removeItem("userType");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading || visitorLoading || inquiryLoading) {
    return (
      <section className="dashboard-loading" aria-label="로딩 중">
        <div className="loading-text" role="status" aria-live="polite">
          📊 대시보드 데이터를 불러오는 중...
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="dashboard-error" role="alert" aria-live="assertive">
        <p>데이터를 불러올 수 없습니다.</p>
      </section>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          {userType === "admin" ? "관리자" : "게스트"} 대시보드
          <small style={{ fontSize: '0.5em', marginLeft: '10px', color: '#666' }}>
            (현재 userType: {userType})
          </small>
        </h1>

        <p className="dashboard-subtitle">
          {userType === "admin"
            ? "시스템 현황을 한눈에 확인하세요 (2분마다 자동 업데이트)"
            : "읽기 전용 모드로 시스템 현황을 확인하세요"}
        </p>
        <div className="dashboard-status">
          <span
            className={`status-badge ${
              userType === "admin" ? "status-admin" : "status-guest"
            }`}
          >
            {userType === "admin" ? "관리자 권한" : "게스트 권한"}
          </span>
          {userType === "admin" && (
            <>
              <span className="realtime-status">
                🔄 실시간 업데이트 활성화
                <span className="last-update-time">
                  (마지막 업데이트: {lastUpdateTime.toLocaleTimeString()})
                </span>
              </span>
              <button onClick={handleLogout} className="logout-button">
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>

      {/* 방문자 통계 */}
      <section className="visitor-stats-section" aria-label="방문자 통계">
        {/* 방문자 수 카드 */}
        <div className="card card-visitor-stats">
          <div className="stat-accent-line"></div>
          <div className="visitor-stat-header">
            <div className="visitor-icon">👥</div>
            <div className="visitor-title">방문자 통계</div>
          </div>
          <div className="visitor-main-number">
            <AnimatedNumber value={stats.visitors.total} />
          </div>
          <div className="visitor-main-label">총 방문자</div>
          <div className="visitor-details">
            <div className="visitor-period">
              <span className="period-label">오늘</span>
              <span className="period-value">{stats.visitors.today}</span>
            </div>
            <div className="visitor-period">
              <span className="period-label">이번 주</span>
              <span className="period-value">{stats.visitors.thisWeek}</span>
            </div>
            <div className="visitor-period">
              <span className="period-label">이번 달</span>
              <span className="period-value">{stats.visitors.thisMonth}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 카드들 - 문의글만 표시 */}
      <section className="stats-section" aria-label="시스템 통계">
        {/* 문의글 통계 */}
        <div className="card card-stats">
          <div className="stat-number">{stats.inquiries.total}</div>
          <div className="stat-label">문의글</div>
          <div className="stat-details">
            답변대기: {stats.inquiries.pending} | 답변완료:{" "}
            {stats.inquiries.answered}
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill progress-success"
                style={{ width: `${stats.inquiries.answerRate}%` }}
              ></div>
            </div>
            <div className="progress-text">
              답변율: {stats.inquiries.answerRate}%
            </div>
          </div>
          <div className="inquiry-tags">
            <div className="tag-container">
              <span className="status-tag status-secret">
                비밀글 {stats.inquiries.secret}
              </span>
              <span className="status-tag status-public">
                일반글 {stats.inquiries.public}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 빠른 액션 - 관리자만 표시 */}
      {userType === "admin" && (
        <section className="action-section card card-stats">
          <h2 className="section-title">빠른 액션</h2>
          <div className="action-buttons">
            <Link
              href="/portal/banners"
              className="action-button action-primary"
            >
              <span>🎨</span>배너 관리
            </Link>
            <Link
              href="/portal/inquiry"
              className="action-button action-purple"
            >
              <span>💬</span>
              문의글 관리
            </Link>
            <Link
              href="/portal/admin/add"
              className="action-button action-dark"
            >
              <span>👤</span>
              관리자 추가
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
