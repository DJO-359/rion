import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

function getServerUrl() {
  return (
    process.env.POCKETBASE_URL ??
    process.env.NEXT_PUBLIC_POCKETBASE_URL ??
    "http://127.0.0.1:8090"
  );
}

export async function POST() {
  const pb = new PocketBase(getServerUrl());
  pb.authStore.clear();

  const res = NextResponse.json({ success: true });
  res.headers.append(
    "Set-Cookie",
    pb.authStore.exportToCookie({
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 0,
    }),
  );

  return res;
}
