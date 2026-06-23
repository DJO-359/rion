import { NextResponse } from "next/server";
import { createPublicPb } from "@/shared/lib/pocketbase-server";
import { getProductFileUrl } from "@/shared/lib/pocketbase";
import { sendTelegramMessage } from "@/shared/lib/telegram";

const PB_ID_RE = /^[a-z0-9]{15}$/;

/** Публичный endpoint — регистрация не требуется */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const productId = String(body.productId ?? "").trim();

    if (!name || name.length > 100) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    const pb = createPublicPb();
    const hasProduct = PB_ID_RE.test(productId);

    if (hasProduct) {
      const productData = await pb.collection("products").getOne(productId);

      const order = await pb.collection("orders").create({
        name,
        phone,
        product: productId,
        status: "new",
      });

      const image = productData.images?.length
        ? getProductFileUrl(productData, productData.images[0])
        : undefined;

      const telegramSent = await sendTelegramMessage({
        name,
        phone,
        product: productData.title,
        productId,
        orderId: order.id,
        image,
        brand: productData.brand,
        country: productData.country,
        size: productData.size,
        material: productData.material,
        price: productData.price,
      });

      if (!telegramSent) {
        return NextResponse.json(
          {
            success: true,
            orderId: order.id,
            warning: "Order saved but Telegram notification failed",
          },
          { status: 201 },
        );
      }

      return NextResponse.json({ success: true, orderId: order.id });
    }

    // Общая консультация с главной (без товара)
    const order = await pb.collection("orders").create({
      name,
      phone,
      status: "new",
      comment: "Общая консультация с сайта",
    });

    const telegramSent = await sendTelegramMessage({
      name,
      phone,
      product: "Общая консультация",
      productId: "consultation",
      orderId: order.id,
    });

    if (!telegramSent) {
      return NextResponse.json(
        {
          success: true,
          orderId: order.id,
          warning: "Order saved but Telegram notification failed",
        },
        { status: 201 },
      );
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
