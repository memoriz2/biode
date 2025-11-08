export default function WowExperiencePage() {
  return (
    <div>
      <section className="img-section">
        <img src="/contact/contact_01.png" className="pc" />
        <img src="/contact/m_contact_01.png" className="mobile" />
      </section>
      <section className="contact">
        <div className="rows">
          <h3 className="contact-title">문의</h3>
          <div className="contact-wrap">
            <div className="offline">
              <h4>오프라인 문의</h4>
              <div className="map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.1511674702997!2d129.12188467635187!3d35.17778465746451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356892e83ff2f7b7%3A0x9267d2c8fce9805e!2z67aA7IKw6rSR7Jet7IucIO2VtOyatOuMgOq1rCDshLzthYDrj5nroZwgMTIz!5e0!3m2!1sko!2skr!4v1762440037999!5m2!1sko!2skr"
                  loading="lazy"
                ></iframe>
              </div>
              <div className="map-info">
                <div className="item">
                  <span className="title">오시는길</span>
                  <span className="value">
                    경기도 광명시 소하로 190 G타워 1217
                  </span>
                </div>
                <div className="item">
                  <span className="title">EMAIL</span>
                  <span className="value">MCCOYS1361@GMAIL.COM</span>
                </div>
                <div className="item">
                  <span className="title">상담 전화</span>
                  <span className="value">010-8104-7181</span>
                </div>
                <div className="item">
                  <span className="title">상담 시간</span>
                  <span className="value">AM 9:00 ~ PM 18:00</span>
                </div>
              </div>
            </div>
            <div className="online">
              <h4>온라인 문의</h4>
              <div className="form-wrap">
                <form>
                  <div className="input-wrap">
                    <span>이름</span>
                    <input
                      type="text"
                      title="이름"
                      placeholder="이름을 입력하세요."
                    />
                  </div>

                  <div className="input-wrap">
                    <span>전화번호</span>
                    <input
                      type="text"
                      title="전화번호"
                      placeholder="전화번호을 입력하세요."
                    />
                  </div>
                  <div className="input-wrap">
                    <span>이메일</span>
                    <input
                      type="text"
                      title="이메일"
                      placeholder="이메일을 입력하세요."
                    />
                  </div>
                  <div className="input-wrap">
                    <span>문의내용</span>
                    <textarea
                      title="문의내용"
                      placeholder="문의내용을 입력하세요."
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
