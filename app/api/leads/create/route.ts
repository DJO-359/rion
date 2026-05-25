import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTelegramMessage } from "@/shared/lib/telegram";

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

    // RATE LIMIT
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    const lastRequest = requestMap.get(ip);

    const now = Date.now();

    if (lastRequest && now - lastRequest < 1500) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    requestMap.set(ip, now);

    // PRODUCT DATA
    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    // INSERT LEAD
    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      product,
      product_id: productId,
      status: "new",
    });

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TELEGRAM
    await sendTelegramMessage({
      name,
      phone,
      product,
      productId,

      image: productData?.image,
      brand: productData?.brand,
      country: productData?.country,
      size: productData?.size,
      material: productData?.material,
      price: productData?.price,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
