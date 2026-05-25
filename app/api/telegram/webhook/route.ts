import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const callback = body.callback_query;

    if (!callback) {
      return NextResponse.json({ ok: true });
    }

    const data = callback.data;

    const [action, productId] = data.split("_");

    let status = "new";

    if (action === "confirm") {
      status = "confirmed";
    }

    if (action === "cancel") {
      status = "canceled";
    }

    await supabase
      .from("leads")
      .update({
        status,
      })
      .eq("product_id", productId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      error: "Webhook error",
    });
  }
}
