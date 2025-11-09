import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "@/utils/encryption";

interface LoginRequest {
  username: string;
  password: string;
}

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log("[로그인] 요청 시작");
    const body: LoginRequest = await request.json();
    const { username, password } = body;
    console.log("[로그인] 사용자명:", username);

    // 입력 검증
    if (!username || !password) {
      console.log("[로그인] 입력 검증 실패");
      return NextResponse.json(
        {
          success: false,
          message: "사용자명과 비밀번호를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    // 데이터베이스에서 관리자 찾기
    console.log("[로그인] DB에서 관리자 조회 시작");
    const admin = await prisma.admin.findUnique({
      where: { username },
    });
    console.log("[로그인] 관리자 조회 결과:", admin ? "찾음" : "없음");

    if (!admin) {
      console.log("[로그인] 관리자를 찾을 수 없음");
      return NextResponse.json(
        {
          success: false,
          message: "사용자명이 올바르지 않습니다.",
        },
        { status: 401 }
      );
    }

    // 비밀번호 검증
    console.log("[로그인] 비밀번호 검증 시작");
    const isPasswordValid = verifyPassword(password, admin.password);
    console.log("[로그인] 비밀번호 검증 결과:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("[로그인] 비밀번호 불일치");
      return NextResponse.json(
        {
          success: false,
          message: "비밀번호가 올바르지 않습니다.",
        },
        { status: 401 }
      );
    }

    // 세션 생성 (간단한 세션 ID)
    console.log("[로그인] 세션 생성");
    const sessionData = JSON.stringify({
      userId: admin.id,
      username: admin.username,
      userType: "admin",
      name: "관리자",
      loginTime: new Date().toISOString(),
    });

    const response = NextResponse.json({
      success: true,
      message: "로그인에 성공했습니다.",
      userType: "admin",
      user: {
        id: admin.id,
        username: admin.username,
        name: "관리자",
        userType: "admin",
      },
    });

    // 세션 쿠키 설정
    console.log("[로그인] 쿠키 설정 시작");
    response.cookies.set("admin_session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60, // 30분
      path: "/",
    });

    response.cookies.set("admin_token", "logged_in", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60, // 30분
      path: "/",
    });
    console.log("[로그인] 쿠키 설정 완료");

    console.log("[로그인] 로그인 성공");
    return response;
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
