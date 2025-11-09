import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value;
    const adminSession = request.cookies.get("admin_session")?.value;

    if (!adminToken || adminToken !== "logged_in") {
      console.log("[세션 연장] 로그인 상태 아님");
      return NextResponse.json(
        { success: false, message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    if (!adminSession) {
      console.log("[세션 연장] 세션 데이터 없음");
      return NextResponse.json(
        { success: false, message: "세션 데이터가 없습니다." },
        { status: 401 }
      );
    }

    console.log("[세션 연장] 세션 연장 성공");

    const response = NextResponse.json({
      success: true,
      message: "세션이 연장되었습니다.",
    });

    // 쿠키 만료 시간 연장 (30분)
    response.cookies.set("admin_token", "logged_in", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60,
      path: "/",
    });

    response.cookies.set("admin_session", adminSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[세션 연장 오류]", error);
    return NextResponse.json(
      { success: false, message: "세션 연장에 실패했습니다." },
      { status: 401 }
    );
  }
}
