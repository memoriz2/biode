"use client";

import { useState, useEffect } from 'react';

export default function WowPrinciplePage() {
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
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* 상단 이미지 섹션 */}
      <section className="wow-principle__section" style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
        <img
          src={isMobile ? "/principle1_m.png" : "/Homepage_11_pc.png"}
          alt="비오드의 원칙"
          style={{ width: '100%', height: 'auto', display: 'block'}}
        />
      </section>

      {/* 섹션 2 - PC는 원칙2.png */}
      {!isMobile && (
        <section style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
          <img
            src="/principle2.png"
            alt="원칙 2"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </section>
      )}

      {isMobile && (
        <>
          {/* Biod Principle 섹션 */}
          <section style={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}>
            <div style={{ padding: '2rem' }}>
              <p style={{ fontSize: '1.3rem', fontWeight: 300, color: '#401F1D', lineHeight: 1.5 }}>
              비오드의 시작은 식이 보조제를 기반으로 노화 과정을 늦추는
              <br />기술을 연구하는 바이오 회사였습니다.
            <br />사람의 건강수명에 대한 수많은 연구 자료를 축적하고 있었고
            <br />자연스럽게 수명을 단축시키는 노화와 질병의 요인들에 대한
            <br />저항력을 갖추는 다양한 솔루션들을 보유하고 있었답니다.
            <br />그런데...

            <br />어느 날 저희는 너무나 충격적인 현실과 마주하게 되었습니다.
            <br />사람에 비해 너무나 뒤처진 기술과 증명되지 못한 임상결과들이
            <br />반려동물 건강식 시장에 버젓이 그것도 아주 자연스럽게
            <br />소비자들의 눈을 속이고 있는 상황이었습니다.
            <br />요것 봐라...

            <br />이미 부유한 아주 작은 기술만으로도 압도적으로 이길 수 있는
            <br />현실이었지만 비오드는 한 번 더 생각했습니다. 개발되고 증명된
            <br />최고의 솔루션에 반려동물에 최적화된 레시피까지 얹어
            <br />그야말로,

            <br />명실상부한 세계 최고의 반려동물 유산균 솔루션을 만들어 보자!
            <br />이렇게 탄생한 유산균이
              </p>
              <p>바로, 비오드의 라이트핏 펫 유산균입니다!</p>
            </div>
          </section>

          {/* 모바일 섹션 2 이미지 */}
          <section style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
            <img
              src="/principle2_m.png"
              alt="비오드의 원칙 2"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </section>

          {/* 다섯 번째 섹션 - 판매정책 */}
          <section className="wow-principle__policy-section">
            <div className="wow-principle__policy-container">
              <h2 className="wow-principle__policy-title">비오드의 <span className="wow-principle__policy-highlight">특별한·유별난</span> 판매정책</h2>

              <div className="wow-principle__policy-item">
                <h3 className="wow-principle__policy-number">01. 구매후 1개월 환불정책</h3>
                <p className="wow-principle__policy-text"><strong>비오드가 원하는 것은 여러분의 만족도입니다.</strong></p>
                <p className="wow-principle__policy-text">한 달 동안 급여 후 마음에 드시지 않는다면 편하게 환불 요청해 주셔도 됩니다.</p>
                <p className="wow-principle__policy-text">유산균은 하루 이틀이 아닌 평생을 생각해서 먹이는 아주 중요한 건강식품이니까요.</p>
              </div>

              <div className="wow-principle__policy-item">
                <h3 className="wow-principle__policy-number">02. 소비자 광고비 지원정책</h3>
                <p className="wow-principle__policy-text"><strong>최고의 광고는 바로 소비자분들의 진심입니다.</strong></p>
                <p className="wow-principle__policy-text">저희 제품을 잘 알지도 못하고 쓸 생각도 없는 분들의 입에서 저희 제품이 여러분에게 전달되는 것을 원하지 않습니다. 저희 제품을 직접 구매하신 분들께서 올려 주시는 블로그, 인스타그램, 유튜브에 관해 소정의 지원금을 드리고 있습니다.</p>
              </div>

              <div className="wow-principle__policy-item">
                <h3 className="wow-principle__policy-number">03. 찾아가는 연구정책</h3>
                <p className="wow-principle__policy-text"><strong>비오드는 우리가 만든 제품에 대한 자부심이 아주 크답니다.</strong></p>
                <p className="wow-principle__policy-text">출시하기 전부터 우리는 수많은 반려동물 주인님들을 만나러 다녔습니다. 급여 후 변화되는 몸 상태와 변성분을 꼼꼼히 분석하기 위해서였습니다. 저희는 구매하신 소비자분들에게 허락을 받은 후 소정의 선물을 들고 찾아갑니다. 어떤 변화가 있는지에 대한 의견과 소량의 분변만 주시면 됩니다.</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
