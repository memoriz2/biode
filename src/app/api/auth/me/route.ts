import { NextRequest, NextResponse } from "next/server";

interface SessionData {
  userId: string;
  username: string;
  userType: string;
  name: string;
  loginTime: string;
}

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value;
    const adminSession = request.cookies.get("admin_session")?.value;

    if (!adminToken || adminToken !== "logged_in") {
      return NextResponse.json({ userType: "guest" }, { status: 200 });
    }

    if (!adminSession) {
      return NextResponse.json({ userType: "guest" }, { status: 200 });
    }

    // 세션 데이터 파싱
    const sessionData: SessionData = JSON.parse(adminSession);

    return NextResponse.json({
      userType: sessionData.userType,
      username: sessionData.username,
      name: sessionData.name,
    });
  } catch (error) {
    console.error("세션 검증 오류:", error);
    return NextResponse.json({ userType: "guest" }, { status: 200 });
  }
}
