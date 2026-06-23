import { NextResponse } from "next/server";
import { getAdminPb } from "@/shared/lib/pocketbase-server";
import { answerCallbackQuery } from "@/shared/lib/telegram";

const PB_ID_RE = /^[a-z0-9]{15}$/;
const STATUS_MAP = {
  confirm: "confirmed",
  cancel: "canceled",
} as const;

export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const header = req.headers.get("x-telegram-bot-api-secret-token");
    if (header !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await req.json();
    const callback = body.callback_query;

    if (!callback) {
      return NextResponse.json({ ok: true });
    }

    const data = callback.data as string | undefined;
    if (!data) {
      await answerCallbackQuery(callback.id, "Некорректные данные");
      return NextResponse.json({ ok: true });
    }

    const [action, orderId] = data.split("_");

    if (!orderId || !PB_ID_RE.test(orderId)) {
      await answerCallbackQuery(callback.id, "Некорректный заказ");
      return NextResponse.json({ ok: true });
    }

    const status = STATUS_MAP[action as keyof typeof STATUS_MAP];
    if (!status) {
      await answerCallbackQuery(callback.id, "Неизвестное действие");
      return NextResponse.json({ ok: true });
    }

    // Логируем начало обработки
    console.log(
      `[Telegram] Обработка callback: action=${action}, orderId=${orderId}, status=${status}`,
    );

    const pb = await getAdminPb();
    console.log(
      `[Telegram] PocketBase администратор авторизован, обновляем заказ ${orderId}...`,
    );

    await pb.collection("orders").update(orderId, { status });
    console.log(`[Telegram] Заказ ${orderId} успешно обновлён`);

    await answerCallbackQuery(
      callback.id,
      status === "confirmed" ? "Заявка подтверждена" : "Заявка отменена",
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // ДЕТАЛЬНОЕ ЛОГИРОВАНИЕ ОШИБКИ
    console.error("=== TELEGRAM WEBHOOK ERROR ===");
    console.error("Сообщение:", error?.message);
    console.error("Стек:", error?.stack);
    if (error?.response?.data) {
      console.error("Данные ответа (PocketBase API):", error.response.data);
    }
    if (error?.request) {
      console.error("Запрос (PocketBase):", error.request);
    }
    console.error("Полный объект ошибки:", error);
    console.error("==============================");

    // Возвращаем 500 с минимальным телом, но в логах сервера будет детали
    return NextResponse.json(
      { error: "Webhook error", details: error?.message || "Unknown error" },
      { status: 500 },
    );
  }
}
