import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = crypto.randomBytes(32).toString("hex");

  const res = NextResponse.json({ success: true });

  res.cookies.set("admin-auth", token, {
    httpOnly: true,
    secure: false, // 👈 ВАЖНО для localhost
    sameSite: "lax",
    path: "/",
  });

  return res;
}
