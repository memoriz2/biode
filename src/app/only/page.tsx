"use client";

import { useState, useEffect } from 'react';

export default function OnlyPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ width: '100%', backgroundColor: '#ffffff' }}>
      {/* 섹션 1 - PC/모바일 분기 */}
      <section style={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}>
        <img
          src={isMobile ? "/only_m.png" : "/Homepage_7.png"}
          alt="Only 비오드"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </section>

      {/* 섹션 2 - PC는 이미지, 모바일은 텍스트 */}
      {!isMobile && (
        <section style={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}>
          <img
            src="/section2.png"
            alt="섹션 2"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </section>
      )}

      {isMobile && (
        <section style={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}>
          <div style={{ padding: '2rem' }}>
            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#401F1D', lineHeight: 1.5 }}>우리는 얼마나 오랫동안 반려동물과 함께 할 수 있을까요?
              <br />반려동물의 건강이 걱정될 때 우리는 본능적으로
              <br />더 나은 기술을 찾아 여행을 떠나곤 합니다.
              <br />그리고 다양한 경험을 얻습니다.
              <br />그만큼 기술이 주는 위로 그리고 혜택은
              <br />우리가 생각하는 것보다 아주 크고 놀랍습니다.
              <br />그래서 우리는,
              <br />당신과 반려동물에게 기술의 감동을
              <br />고스란히 느낄 수 있는 효과적인 방법에 대해
              <br />고민하고 연구합니다.</p>
          </div>
        </section>
      )}

      {isMobile && (
        <>
          {/* Homepage_8 섹션 */}
          <section style={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}>
            <img
              src="/Homepage_8.png"
              alt="Homepage 8"
              style={{ width: '100%', height: 'auto', display: 'block', marginLeft: '2rem' }}
            />
          </section>

          <section style={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}>
            <div style={{ padding: '2rem' }}>
              <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#401F1D', lineHeight: 1.5 }}>
                아련하게 습관적으로
                <br />모호했지만 편견 없이 써왔던 유산균을
                <br />더 오랫동안 건강한 모습의 반려동물과 함께할 수 있는
                <br />더 나은 유산균으로 바꾸는 것</p>
            </div>
          </section>

          {/* 모바일 섹션 2 이미지 */}
          <section style={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}>
            <img
              src="/only2_m.png"
              alt="Only 섹션 2"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </section>

          {/* 모바일 섹션 3 이미지 */}
          <section style={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}>
            <img
              src="/only3_m.png"
              alt="Only 섹션 3"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </section>
        </>
      )}

      

    </div>
    
  );
}
