import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Root credentials from environment variables
    const rootEmail = process.env.ADMIN_ROOT_EMAIL || "root@admin.local";
    const rootPassword = process.env.ADMIN_ROOT_PASSWORD || "root123456";

    if (email === rootEmail && password === rootPassword) {
      const response = NextResponse.json({ success: true });

      // Set HTTP-only cookie for better security
      response.cookies.set("admin_root_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
