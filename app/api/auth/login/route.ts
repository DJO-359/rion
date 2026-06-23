import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

function getServerUrl() {
  return (
    process.env.POCKETBASE_URL ??
    process.env.NEXT_PUBLIC_POCKETBASE_URL ??
    "http://127.0.0.1:8090"
  );
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const pb = new PocketBase(getServerUrl());
    await pb.collection("_superusers").authWithPassword(email, password);

    const res = NextResponse.json({ success: true });
    res.headers.append(
      "Set-Cookie",
      pb.authStore.exportToCookie({
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      }),
    );

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
