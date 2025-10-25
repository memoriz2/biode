"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { bannerNews } from "@/types/bannerNews";

import { OrganizationStructuredData } from "@/components/StructuredData";

// Google Maps API 타입 선언
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (
          element: HTMLElement,
          options: {
            center: { lat: number; lng: number };
            zoom: number;
            styles?: Array<{
              featureType?: string;
              elementType?: string;
              stylers: Array<{ [key: string]: string | number | boolean }>;
            }>;
          }
        ) => {
          setZoom: (zoom: number) => void;
          setCenter: (center: { lat: number; lng: number }) => void;
        };
        Marker: new (options: {
          position: { lat: number; lng: number };
          map: {
            setZoom: (zoom: number) => void;
            setCenter: (center: { lat: number; lng: number }) => void;
          };
          title: string;
        }) => {
          setMap: (
            map: {
              setZoom: (zoom: number) => void;
              setCenter: (center: { lat: number; lng: number }) => void;
            } | null
          ) => void;
        };
      };
    };
  }
}

// CSS 애니메이션을 위한 스타일
const animationStyles = `
  @keyframes pulse-delay-2 {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  @keyframes pulse-delay-4 {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface Banner {
  id: number;
  title: string;
  description?: string;
  fileName: string;
  filePath: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Greeting {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationChart {
  id: number;
  fileName: string;
  filePath: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface History {
  id: number;
  year: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function BIODEHomePage() {
  const firstSliderImageRef = useRef<HTMLImageElement | null>(null);
  const [verticalSliderHeightPx, setVerticalSliderHeightPx] = useState<number | null>(null);
  const sliderSectionRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef<number>(0);
  const [sliderSnapDone, setSliderSnapDone] = useState<boolean>(false);
  const [video, setVideo] = useState<Video | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [bannerNews, setBannerNews] = useState<bannerNews[] | null>(null);
  const [organizationChart, setOrganizationChart] =
    useState<OrganizationChart | null>(null);
  const [histories, setHistories] = useState<History[]>([]);

  // YouTube URL에서 비디오 ID 추출 함수
  const extractVideoId = (videoUrl: string): string | null => {
    try {
      // iframe 코드에서 src 추출
      const srcMatch = videoUrl.match(/src="([^"]+)"/);
      if (srcMatch) {
        const src = srcMatch[1];
        // YouTube URL에서 비디오 ID 추출
        const videoIdMatch = src.match(
          /(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/
        );
        return videoIdMatch ? videoIdMatch[1] : null;
      }
      return null;
    } catch (error) {
      console.error("비디오 ID 추출 실패:", error);
      return null;
    }
  };

  // YouTube 직접 링크 생성 함수
  const getYouTubeDirectLink = (videoUrl: string): string => {
    const videoId = extractVideoId(videoUrl);
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : "#";
  };

  useEffect(() => {
    // CSS 스타일 주입
    const style = document.createElement("style");
    style.textContent = animationStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 세로 슬라이더: 뷰포트 진입 시 부드러운 등장 클래스 토글
  useEffect(() => {
    const slides = Array.from(
      document.querySelectorAll<HTMLElement>(".biode-vertical-slider__slide")
    );
    if (slides.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
          }
        });
      },
      { root: document.querySelector(".biode-vertical-slider__viewport"), threshold: 0.6 }
    );

    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // 세로 슬라이더: 데스크톱에서 마지막 슬라이드 후 외부 스크롤 연결
  useEffect(() => {
    // 데스크톱에서만 작동
    const isDesktop = () => window.innerWidth >= 1024;
    if (!isDesktop()) return;

    const viewport = document.querySelector<HTMLElement>(".biode-vertical-slider__viewport");
    if (!viewport) return;

    let isScrollingInSlider = false;
    let lastScrollTime = 0;

    const handleWheel = (e: WheelEvent) => {
      if (!isDesktop()) return; // 데스크톱 체크

      const scrollTop = viewport.scrollTop;
      const scrollHeight = viewport.scrollHeight;
      const clientHeight = viewport.clientHeight;
      const isAtTop = scrollTop <= 10;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      const now = Date.now();

      // 위로 스크롤 중이고 맨 위에 있을 때
      if (e.deltaY < 0 && isAtTop && !isScrollingInSlider) {
        // 슬라이더 밖으로 스크롤 허용 (위로)
        return;
      }

      // 아래로 스크롤 중이고 맨 아래에 있을 때
      if (e.deltaY > 0 && isAtBottom) {
        if (now - lastScrollTime > 100) {
          // 다음 섹션으로 이동
          e.preventDefault();
          const nextSection = sliderSectionRef.current?.nextElementSibling as HTMLElement;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
            isScrollingInSlider = false;
          }
        }
        lastScrollTime = now;
        return;
      }

      // 슬라이더 내부에서 스크롤 중
      if (!isAtTop && !isAtBottom) {
        isScrollingInSlider = true;
      }
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // 세로 슬라이더: 첫 이미지 비율에 맞춰 섹션 높이를 고정
  useEffect(() => {
    const computeHeight = () => {
      const img = firstSliderImageRef.current;
      if (!img) return;
      const vw = window.innerWidth;
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const h = Math.round((vw * img.naturalHeight) / img.naturalWidth);
        setVerticalSliderHeightPx(h);
      } else {
        const rect = img.getBoundingClientRect();
        if (rect.height > 0) setVerticalSliderHeightPx(Math.round(rect.height));
      }
    };

    computeHeight();
    window.addEventListener("resize", computeHeight);
    return () => window.removeEventListener("resize", computeHeight);
  }, []);

  // 외부 스크롤이 내려오다 슬라이더를 만나면 섹션 상단에 스냅(지나치지 않도록)
  // 데스크톱과 모바일 모두 작동
  useEffect(() => {
    const section = sliderSectionRef.current;
    if (!section) return;

    const onWindowScroll = () => {
      lastScrollYRef.current = window.scrollY || window.pageYOffset;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const goingDown = (window.scrollY || window.pageYOffset) >= lastScrollYRef.current;
        lastScrollYRef.current = window.scrollY || window.pageYOffset;
        if (!sliderSnapDone && goingDown && entry.isIntersecting) {
          // 뷰포트에 일정 부분 들어오면 섹션 시작으로 스냅
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          setSliderSnapDone(true);
        }
      },
      { root: null, threshold: 0.15 }
    );

    observer.observe(section);
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onWindowScroll);
    };
  }, [sliderSnapDone]);

  // 배너 자동 로테이션 (5초 간격)
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const id = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(id);
  }, [banners]);

  const goToPrevBanner = () => {
    if (!banners || banners.length === 0) return;
    setCurrentBannerIndex((prev) =>
      (prev - 1 + banners.length) % banners.length
    );
  };

  const goToNextBanner = () => {
    if (!banners || banners.length === 0) return;
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const goToBanner = (index: number) => {
    if (!banners || banners.length === 0) return;
    setCurrentBannerIndex(index % banners.length);
  };

  // Google Maps API 로드 및 지도 초기화
  useEffect(() => {
    console.log("Google Maps API 초기화 시작");

    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyCJFR836cPFQxyZUE8bl375Cmkr3vBfAJ8";

    console.log("API 키 확인:", apiKey ? "설정됨" : "설정되지 않음");

    // API 키가 없으면 지도를 표시하지 않음
    if (!apiKey) {
      console.log("Google Maps API 키가 설정되지 않았습니다.");
      return;
    }

    // 지도 초기화 함수
    const initializeMap = () => {
      console.log("지도 초기화 함수 실행");
      const mapElement = document.getElementById("map");
      console.log("지도 엘리먼트:", mapElement);

      if (!mapElement) {
        console.log("map 엘리먼트를 찾을 수 없습니다. 2초 후 재시도...");
        setTimeout(initializeMap, 2000);
        return;
      }

      // 이미 스크립트가 있으면 추가하지 않음
      if (document.getElementById("google-maps-script")) {
        console.log("Google Maps 스크립트가 이미 로드되어 있습니다.");
        if (window.google && window.google.maps) {
          console.log("Google Maps 객체가 이미 존재합니다. 지도 생성 중...");
          createMap(mapElement);
        }
        return;
      }

      console.log("Google Maps 스크립트 로드 시작");
      const script: HTMLScriptElement = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps 스크립트 로드 완료");
        setTimeout(() => createMap(mapElement), 100);
      };
      script.onerror = () => {
        console.error("Google Maps API 로드 실패");
        showMapPlaceholder(mapElement);
      };
      document.head.appendChild(script);
    };

    function createMap(mapElement: HTMLElement) {
      console.log("지도 생성 함수 실행");
      console.log("Google Maps 객체:", window.google?.maps);

      if (window.google && window.google.maps && mapElement) {
        console.log("지도 생성 조건 충족, 지도 생성 중...");
        const center = { lat: 37.5665, lng: 126.978 }; // 서울 시청 좌표
        const map = new window.google.maps.Map(mapElement, {
          center,
          zoom: 15,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
        new window.google.maps.Marker({
          position: center,
          map: map,
          title: "BIODE",
        });
        console.log("지도 생성 완료");

        // 플레이스홀더 제거
        const placeholder = mapElement.querySelector(
          ".biode-map__placeholder"
        );
        if (placeholder) {
          placeholder.remove();
        }

        // Force map to recalculate its size and center
        setTimeout(() => {
          const googleMaps = window.google?.maps as {
            event?: {
              trigger: (
                map: {
                  setZoom: (zoom: number) => void;
                  setCenter: (center: { lat: number; lng: number }) => void;
                },
                event: string
              ) => void;
            };
          };
          if (googleMaps?.event) {
            googleMaps.event.trigger(map, "resize");
            map.setCenter(center);
          }
        }, 100);

        // Additional resize trigger after a longer delay
        setTimeout(() => {
          const googleMaps = window.google?.maps as {
            event?: {
              trigger: (
                map: {
                  setZoom: (zoom: number) => void;
                  setCenter: (center: { lat: number; lng: number }) => void;
                },
                event: string
              ) => void;
            };
          };
          if (googleMaps?.event) {
            googleMaps.event.trigger(map, "resize");
            map.setCenter(center);
          }
        }, 500);
      } else {
        console.error("지도 생성 실패:", {
          google: !!window.google,
          maps: !!window.google?.maps,
          mapElement: !!mapElement,
        });
        // 재시도
        setTimeout(() => createMap(mapElement), 500);
      }
    }

    function showMapPlaceholder(mapElement: HTMLElement) {
      console.log("지도 플레이스홀더 표시");
      if (mapElement) {
        mapElement.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-200 rounded-lg">
            <div class="text-center text-gray-600">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <p class="text-lg font-medium">지도 로드 중...</p>
              <p class="text-sm">Google Maps API 키가 필요합니다</p>
            </div>
          </div>
        `;
      }
    }

    // 컴포넌트가 마운트된 후 지도 초기화 시작
    setTimeout(initializeMap, 2000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 배너 데이터 가져오기
        try {
          const bannerResponse = await fetch("/api/banners?action=active");
          if (bannerResponse.ok) {
            const bannerData = await bannerResponse.json();
            console.log("배너 데이터(action=active):", bannerData);
            let list: Banner[] = [];
            if (Array.isArray(bannerData)) {
              list = bannerData as Banner[];
            } else if (bannerData && Array.isArray(bannerData.content)) {
              list = bannerData.content as Banner[];
            }

            if (list.length === 0) {
              // fallback: 전체 조회 시그니처 지원
              const fallback = await fetch("/api/banners");
              if (fallback.ok) {
                const fb = await fallback.json();
                console.log("배너 데이터(fallback):", fb);
                const fbList = Array.isArray(fb)
                  ? (fb as Banner[])
                  : Array.isArray(fb?.content)
                  ? (fb.content as Banner[])
                  : [];
                list = fbList.filter((b) => !!b.imageUrl && b.isActive !== false);
              }
            }

            const validBanners = list.filter((b) => !!b.imageUrl);
            setBanners(validBanners);
            setCurrentBannerIndex(0);
          }
        } catch (bannerError) {
          console.log("배너 데이터를 불러올 수 없습니다:", bannerError);
          setBanners([]);
        }

        // 비디오 데이터 가져오기
        try {
          const videoResponse = await fetch("/api/videos?action=active");
          if (videoResponse.ok) {
            const videoData = await videoResponse.json();
            console.log("비디오 데이터:", videoData);
            // 배열의 첫 번째 항목 사용
            if (videoData && Array.isArray(videoData) && videoData.length > 0) {
              const firstVideo = videoData[0];
              console.log("첫 번째 비디오:", firstVideo);
              console.log("비디오 활성 상태:", firstVideo.isActive);
              console.log("비디오 YouTube URL:", firstVideo.videoUrl);
              // 활성 상태인 비디오만 설정
              if (firstVideo.isActive) {
                setVideo(firstVideo);
                console.log("비디오 상태 설정 완료");
              } else {
                console.log("활성 상태인 비디오가 없습니다.");
              }
            } else {
              console.log("비디오 데이터가 비어있습니다.");
            }
          }
        } catch (videoError) {
          console.log("비디오 데이터를 불러올 수 없습니다:", videoError);
        }

        // 인사말 데이터 가져오기
        try {
          const greetingResponse = await fetch("/api/greetings?action=active");
          if (greetingResponse.ok) {
            const greetingData = await greetingResponse.json();
            console.log("인사말 데이터:", greetingData);
            // 배열의 첫 번째 항목 사용
            if (
              greetingData &&
              Array.isArray(greetingData) &&
              greetingData.length > 0
            ) {
              setGreeting(greetingData[0]);
            }
          }
        } catch (greetingError) {
          console.log("인사말 데이터를 불러올 수 없습니다:", greetingError);
        }

        // 배너뉴스 데이터 가져오기
        try {
          const bannerNewsResponse = await fetch(
            "/api/banner-news?action=active"
          );
          if (bannerNewsResponse.ok) {
            const bannerNewsData = await bannerNewsResponse.json();
            console.log("배너뉴스 데이터:", bannerNewsData);
            setBannerNews(bannerNewsData || []);
          }
        } catch (bannerNewsError) {
          console.log("배너뉴스 데이터를 불러올 수 없습니다:", bannerNewsError);
          setBannerNews([]);
        }

        // 조직도 데이터 가져오기
        try {
          const organizationResponse = await fetch(
            "/api/organization?action=active"
          );
          if (organizationResponse.ok) {
            const organizationData = await organizationResponse.json();
            console.log("조직도 데이터:", organizationData);
            // 조직도 데이터는 단일 객체로 반환됨
            if (organizationData && organizationData.isActive) {
              setOrganizationChart(organizationData);
            }
          }
        } catch (organizationError) {
          console.log("조직도 데이터를 불러올 수 없습니다:", organizationError);
        }

        // 히스토리 데이터 가져오기
        try {
          const historyResponse = await fetch("/api/history?action=active");
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            console.log("히스토리 데이터:", historyData);
            // 히스토리 데이터는 {data: Array} 형태로 반환됨
            if (
              historyData &&
              historyData.data &&
              Array.isArray(historyData.data)
            ) {
              setHistories(historyData.data);
            }
          }
        } catch (historyError) {
          console.log("히스토리 데이터를 불러올 수 없습니다:", historyError);
          setHistories([]);
        }
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다:", error);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="biode-home">
      <OrganizationStructuredData
        data={{
          name: "BIODE",
          url: "https://www.biode.com",
          description:
            "BIODE는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
          logo: "https://www.biode.com/logo.png",
          address: {
            streetAddress: "테헤란로 123",
            addressLocality: "강남구",
            addressRegion: "서울특별시",
            postalCode: "06123",
            addressCountry: "KR",
          },
          contactPoint: {
            telephone: "+82-2-1234-5678",
            contactType: "customer service",
          },
        }}
      />

      {/* 배너 섹션 - 슬라이드 효과와 함께 */}
      {banners.length > 0 && (
        <section className="biode-banner-full biode-banner-full--flush">
          <div className="biode-banner-slider">
            <div
              className="biode-banner-slider__track"
              style={{
                transform: `translateX(-${currentBannerIndex * 100}%)`,
              }}
            >
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className="biode-banner-slider__slide"
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.title ?? "banner"}
                    className="biode-banner-image__img"
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  {banner.description && (
                    <div className="biode-banner__content">
                      <div
                        className="banner-description"
                        dangerouslySetInnerHTML={{ __html: banner.description }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 배너 내 컨트롤 */}
            {banners.length > 1 && (
              <div className="biode-banner-controls">
                <button
                  type="button"
                  aria-label="이전 배너"
                  className="biode-banner-controls__prev"
                  onClick={goToPrevBanner}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="다음 배너"
                  className="biode-banner-controls__next"
                  onClick={goToNextBanner}
                >
                  ›
                </button>
                <div className="biode-banner-dots" role="tablist" aria-label="배너 선택">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={idx === currentBannerIndex}
                      aria-label={`${idx + 1}번째 배너`}
                      className={`biode-banner-dots__dot ${idx === currentBannerIndex ? "is-active" : ""}`}
                      onClick={() => goToBanner(idx)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 새 섹션: 한 번에 이미지 하나, 세로 스와이프/스크롤로 다음 이미지가 올라옴 */}
      <section ref={sliderSectionRef} className="biode-vertical-slider" aria-label="BIODE 제품 미리보기">
        <div className="biode-vertical-slider__viewport" aria-live="polite" style={verticalSliderHeightPx ? { height: `${verticalSliderHeightPx}px` } : undefined}>
          <div className="biode-vertical-slider__slide is-inview" aria-label="미리보기 이미지 1">
            <img
              ref={firstSliderImageRef}
              src="/Homepage_2.png"
              alt="BIODE 미리보기 1"
              className="biode-vertical-slider__img"
              onLoad={() => {
                const img = firstSliderImageRef.current;
                if (!img) return;
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                  const vw = window.innerWidth;
                  const h = Math.round((vw * img.naturalHeight) / img.naturalWidth);
                  setVerticalSliderHeightPx(h);
                }
              }}
            />
          </div>
          <div className="biode-vertical-slider__slide" aria-label="미리보기 이미지 2">
            <img src="/Homepage_3.png" alt="BIODE 미리보기 2" className="biode-vertical-slider__img" />
          </div>
          <div className="biode-vertical-slider__slide" aria-label="미리보기 이미지 3">
            <img src="/Homepage_4.png" alt="BIODE 미리보기 3" className="biode-vertical-slider__img" />
          </div>
        </div>
      </section>

        {/* 인사말 섹션 */}
        {greeting && (
          <section className="biode-greeting">
            <h2 className="biode-greeting__title">{greeting.title}</h2>
            <div className="biode-greeting__container">
              <div
                className="biode-greeting__content"
                dangerouslySetInnerHTML={{ __html: greeting.content }}
              />
            </div>
          </section>
        )}

        {/* 배너뉴스 섹션 */}
        {bannerNews && bannerNews.length > 0 && (
          <section className="biode-news biode-section">
            <h2 className="biode-contact__title">최신 소식</h2>
            <div className="biode-news__grid">
              {bannerNews.slice(0, 4).map((news) => (
                <article key={news.id} className="biode-news__item">
                  {news.imageUrl && (
                    <div className="biode-news__image-container">
                      <Image
                        src={news.imageUrl}
                        alt={news.title}
                        width={400}
                        height={192}
                        className="biode-news__image"
                        priority={true}
                        style={{
                          height: "192px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                  )}
                  <div className="biode-news__content">
                    <h3 className="biode-news__title">{news.title}</h3>
                    <p className="biode-news__description">
                      {news.content}
                    </p>
                    <div className="biode-news__meta">
                      <span className="biode-news__date">
                        {news.startDate
                          ? new Date(news.startDate).toLocaleDateString("ko-KR")
                          : "날짜 없음"}
                      </span>
                      {news.linkUrl && (
                        <a
                          href={news.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="biode-news__link"
                        >
                          자세히 보기 →
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 비디오 섹션 */}
        {/* 디버깅 정보 (개발 환경에서만 표시) */}
        {process.env.NODE_ENV === "development" && (
          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          >
            <strong>디버깅 정보:</strong>
            <br />
            Video 객체: {video ? "존재함" : "null"}
            <br />
            Video isActive: {video?.isActive ? "true" : "false"}
            <br />
            Video URL 길이: {video?.videoUrl?.length || 0}
            <br />
            Video URL 미리보기: {video?.videoUrl?.substring(0, 100) || "N/A"}...
            <br />
            추출된 비디오 ID:{" "}
            {video ? extractVideoId(video.videoUrl) || "추출 실패" : "N/A"}
            <br />
            YouTube 직접 링크:{" "}
            {video ? getYouTubeDirectLink(video.videoUrl) : "N/A"}
          </div>
        )}

        {video && video.isActive && (
          <section className="biode-video biode-section">
            <h2 className="biode-contact__title">회사 소개 영상</h2>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              {/* <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                {video.title}
              </h3> */}
              {/* {video.description && (
                <p className="text-gray-600 mb-6 text-center">
                  {video.description}
                </p>
              )} */}
              <div className="biode-video__container">
                <div className="biode-video__iframe-wrapper">
                  {/* YouTube iframe 렌더링 */}
                  <div
                    className="biode-video__iframe"
                    dangerouslySetInnerHTML={{ __html: video.videoUrl }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 조직도 섹션 */}
        {organizationChart && organizationChart.isActive && (
          <section className="biode-organization biode-section">
            <h2 className="biode-contact__title">조직도</h2>
            <div className="biode-news__container">
              <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                <div className="biode-organization__container">
                  {organizationChart.imageUrl ? (
                    <Image
                      src={organizationChart.imageUrl}
                      alt="조직도"
                      width={800}
                      height={600}
                      className="biode-organization__image"
                      onError={(e) => {
                        console.error(
                          "조직도 이미지 로드 실패:",
                          organizationChart.imageUrl
                        );
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="biode-organization__placeholder">
                      조직도 이미지를 불러올 수 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 히스토리 섹션 */}
        {histories.length > 0 && (
          <section className="biode-history biode-section">
            <h2 className="biode-contact__title">회사 연혁</h2>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="biode-history__timeline">
                  {Object.entries(
                    histories.reduce((acc, history) => {
                      if (!acc[history.year]) {
                        acc[history.year] = [];
                      }
                      acc[history.year].push(history);
                      return acc;
                    }, {} as Record<string, History[]>)
                  )
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([year, yearHistories]) => (
                      <div
                        key={year}
                        className="biode-history__year-group"
                      >
                        <h3 className="biode-history__year-title">
                          {year}
                        </h3>
                        <div className="biode-history__year-content">
                          {yearHistories
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((history) => (
                              <div
                                key={history.id}
                                className="biode-history__item"
                              >
                                <p className="biode-history__description">
                                  {history.description}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 오시는길 섹션 */}
        <section className="biode-contact">
          <h2 className="biode-contact__title">오시는 길</h2>
          <div className="biode-contact__container">
            <div className="biode-contact__content">
              {/* 주소 정보 카드 */}
              <div className="biode-contact__info">
                <div className="biode-contact__card">
                  <h3 className="biode-contact__company">BIODE</h3>
                  <div className="biode-contact__details">
                    <div className="biode-contact__item">
                      <strong>도로명</strong>
                      <p>서울특별시 강남구 테헤란로 123</p>
                    </div>
                    <div className="biode-contact__item">
                      <strong>지번</strong>
                      <p>서울특별시 강남구 역삼동 123-45</p>
                    </div>
                    <div className="biode-contact__item">
                      <strong>우편번호</strong>
                      <p>06123</p>
                    </div>
                    <div className="biode-contact__item">
                      <strong>전화</strong>
                      <p>02-1234-5678</p>
                    </div>
                    <div className="biode-contact__item">
                      <strong>이메일</strong>
                      <p>info@biode.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 지도 카드 */}
              <div className="biode-contact__map">
                <div className="biode-contact__card">
                  <h3 className="biode-contact__location">위치</h3>
                  <div className="biode-map__container">
                    <div id="map" className="biode-map__element">
                      <div className="biode-map__placeholder">
                        <div className="placeholder-content">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="placeholder-title">지도 로드 중...</p>
                          <p className="placeholder-subtitle">
                            잠시만 기다려주세요
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

    </div>
  );
}
