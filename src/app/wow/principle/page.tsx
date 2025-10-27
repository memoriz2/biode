export default function WowPrinciplePage() {
  return (
    <div>
      {/* 상단 이미지 섹션 */}
      <section className="wow-principle__section" style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
        <img
          src="/Homepage_11.png"
          alt="비오드의 원칙"
          style={{ width: '100%', height: 'auto', display: 'block'}}
        />

        {/* 이미지 위 텍스트 오버레이 */}
        <div className="wow-principle__overlay">
          <div className="wow-principle__content">
            <p className="wow-principle__text--primary wow-principle__text--largest">Biod Principle</p>
            <p className="wow-principle__text--primary wow-principle__text--large">세계 최고가 아니면 만들지 않습니다.</p>
            <p className="wow-principle__text--secondary">반려동물을 위한,</p>
            <p className="wow-principle__text--secondary">세계 최고 수준의 유산균을 만들어보자</p>
          </div>
        </div>
      </section>

      {/* 두 번째 섹션 */}
      <section className="wow-principle__section" style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
        <img
          src="/Homepage_12.png"
          alt="비오드의 원칙 2"
          className="wow-principle__image-philosophy"
          style={{ width: '100%', height: 'auto', display: 'block'}}
        />

        {/* 이미지 위 텍스트 오버레이 */}
        <div className="wow-principle__overlay-philosophy">
          <p className="wow-principle__philosophy-text">Biod</p>
          <p className="wow-principle__philosophy-text">Philosophy</p>
        </div>
      </section>
    </div>
  );
}
