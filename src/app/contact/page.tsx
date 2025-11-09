"use client";

import { useState, FormEvent } from "react";

export default function WowExperiencePage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // 이메일은 선택사항
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // 전화번호는 선택사항
    const phoneRegex = /^[0-9-]+$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수 입력 검증
    if (!formData.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      alert("문의내용을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    if (formData.email && !validateEmail(formData.email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 전화번호 형식 검증
    if (formData.phone && !validatePhone(formData.phone)) {
      alert("전화번호는 숫자와 하이픈(-)만 입력 가능합니다.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${formData.name}님의 문의`,
          content: `전화번호: ${formData.phone}\n이메일: ${formData.email}\n\n${formData.content}`,
          author: formData.name,
          email: formData.email,
          isSecret: false,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage("문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.");
        setFormData({ name: "", phone: "", email: "", content: "" });
      } else {
        setSubmitMessage(result.error || "문의 접수 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setSubmitMessage("문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      <section className="img-section">
        <img src="/contact/contact_01.png" className="pc" />
        <img src="/contact/m_contact_01.png" className="mobile" />
      </section>
      <section className="contact" style={{ marginBottom: 0 }}>
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
                <form onSubmit={handleSubmit}>
                  <div className="input-wrap">
                    <span>이름</span>
                    <input
                      type="text"
                      name="name"
                      title="이름"
                      placeholder="이름을 입력하세요."
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="input-wrap">
                    <span>전화번호</span>
                    <input
                      type="text"
                      name="phone"
                      title="전화번호"
                      placeholder="전화번호를 입력하세요."
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-wrap">
                    <span>이메일</span>
                    <input
                      type="email"
                      name="email"
                      title="이메일"
                      placeholder="이메일을 입력하세요."
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-wrap">
                    <span>문의내용</span>
                    <textarea
                      name="content"
                      title="문의내용"
                      placeholder="문의내용을 입력하세요."
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="submit-wrap">
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "제출 중..." : "문의하기"}
                    </button>
                  </div>
                  {submitMessage && (
                    <div className={`submit-message ${submitMessage.includes("성공") ? "success" : "error"}`}>
                      {submitMessage}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
