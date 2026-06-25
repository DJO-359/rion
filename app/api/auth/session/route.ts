import { NextResponse } from "next/server";
import { createPbFromCookie } from "@/shared/lib/pocketbase-server";

export async function GET(req: Request) {
  const pb = createPbFromCookie(req.headers.get("cookie"));

  if (!pb.authStore.isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    token: pb.authStore.token,
    record: pb.authStore.record,
  });
}
