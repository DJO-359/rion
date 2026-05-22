import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const requestMap = new Map<string, number>();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, phone, product, productId } = body;

    if (!name || !phone || !productId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const cookieHeader = req.headers.get("cookie");

    const auth = cookieHeader
      ?.split(";")
      .find((c) => c.trim().startsWith("admin-auth="))
      ?.split("=")[1];

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";

    const lastRequest = requestMap.get(ip);
    const now = Date.now();

    if (lastRequest && now - lastRequest < 5000) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    requestMap.set(ip, now);

    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      product,
      product_id: productId,
      status: "new",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
