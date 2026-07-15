import { NextResponse } from "next/server";
import { createPublicPb } from "@/shared/lib/pocketbase-server";
import { getProductFileUrl } from "@/shared/lib/pocketbase";
import { sendTelegramCartMessage, sendTelegramMessage } from "@/shared/lib/telegram";

const PB_ID_RE = /^[a-z0-9]{15}$/;

type CartLeadItem = {
  productId: string;
  title: string;
  quantity: number;
  price: string;
};

/** Публичный endpoint — регистрация не требуется */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const leadType = String(body.type ?? "").trim();

    if (leadType === "cart") {
      return handleCartLead(body);
    }

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

async function handleCartLead(body: Record<string, unknown>) {
  const contactMethod = String(body.contactMethod ?? "").trim();
  const items = Array.isArray(body.items) ? (body.items as CartLeadItem[]) : [];
  const totalPrice = Number(body.totalPrice ?? 0);

  const validMethods = ["whatsapp", "telegram", "phone"];
  if (!validMethods.includes(contactMethod)) {
    return NextResponse.json({ error: "Invalid contact method" }, { status: 400 });
  }

  if (!items.length) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  for (const item of items) {
    if (!PB_ID_RE.test(String(item.productId ?? ""))) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }
    if (!String(item.title ?? "").trim()) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }
    if (!Number.isFinite(Number(item.quantity)) || Number(item.quantity) < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
  }

  const pb = createPublicPb();
  const firstProductId = String(items[0].productId);

  const commentPayload = {
    type: "cart",
    contactMethod,
    items: items.map((item) => ({
      productId: item.productId,
      title: String(item.title).trim(),
      quantity: Number(item.quantity),
      price: String(item.price ?? ""),
    })),
    totalPrice,
  };

  const order = await pb.collection("orders").create({
    name: "Заявка из корзины",
    phone: "с сайта",
    product: firstProductId,
    status: "new",
    comment: JSON.stringify(commentPayload),
  });

  const telegramSent = await sendTelegramCartMessage({
    orderId: order.id,
    contactMethod,
    items: commentPayload.items,
    totalPrice,
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
