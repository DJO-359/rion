import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("admin-auth", "true", {
      httpOnly: true,
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
