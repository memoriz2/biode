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

      {/* 세 번째 섹션 - 텍스트 컨텐츠 */}
      <section className="wow-principle__text-section">
        <div className="wow-principle__text-container">
          <div>
          <p className="wow-principle__standard-text">|  올바른 선택의 기준을 만듭니다.</p>
          <p className="wow-principle__description-text">비오드의 사명은 올바른 기술과 원칙을 가지고 소비자가 더 바른 소비 판단을 할 수 있게 돕는 것입니다.
          <br />무엇이 바른 제품이고 무엇을 고려해야 하는지 소비자 스스로 바른 결정을 내릴 수 있도록 돕는 지혜로운 소비운동을 꿈입없이 펼쳐 나가고 있습니다.</p>
          </div>
          <div>
          <p className="wow-principle__standard-text">|  과학적인 기술로 접근합니다.</p>
          <p className="wow-principle__description-text">비오드는 누구보다 과학적인 데이터에 근거한 기술과 결과물 만을 신뢰합니다. 통념적이고 일반적인 정보에 의지하지 않고 철저히 우리의 연구와 실험을 통해 증명된 결과만을 믿습니다. 비오드가 만든 제품 앞에서 그 어떤 의심이나 고민도 필요하지 않은 이유입니다.</p>
          </div>
          <div>
          <p className="wow-principle__standard-text">|  효과를 확실하게 증명합니다.</p>
          <p className="wow-principle__description-text">사실이 아닌 결과나 충족되지 않는 품질로 소비자를 유린하는 행위는 결코 용납되어서는 안됩니다. 누군가의 소중한 반려동물, 가족들이 먹는 제품의 특성상 그 어떤 제품보다 더욱 신뢰할 수 있는 시험자료와 성적서가 필요합니다. 효과가 입증될 수 없으면 만들지 않겠다는 비오드만의 고집입니다.</p>
          </div>
        </div>
      </section>

      {/* 네 번째 섹션 */}
      <section className="wow-principle__section" style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', backgroundColor: 'white' }}>
        <img
          src="/Homepage_13.png"
          alt="비오드의 원칙 3"
          style={{ width: '100%', height: 'auto', display: 'block'}}
        />
      </section>
    </div>
  );
}
