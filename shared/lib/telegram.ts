function escapeTelegram(text: string): string {
  return text.replace(/[&<>]/g, (ch) => {
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    return "&gt;";
  });
}

export async function sendTelegramMessage(data: {
  name: string;
  phone: string;
  product: string;
  productId: string;
  orderId: string;
  image?: string;
  brand?: string;
  country?: string;
  size?: string;
  material?: string;
  price?: number | string;
}): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram env missing");
    return false;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://your-domain.com";
  const productUrl = `${baseUrl}/products/${data.productId}`;

  const cleanPhone = data.phone.replace(/[^\d+]/g, "");
  const digitsOnly = cleanPhone.replace(/\D/g, "");

  const text = `
🔥 НОВАЯ ЗАЯВКА

👤 Клиент: ${escapeTelegram(data.name)}

📞 Телефон: ${escapeTelegram(cleanPhone)}

🛍 Товар: ${escapeTelegram(data.product)}

💰 Цена: ${escapeTelegram(String(data.price ?? "-"))} ₽

🏷 Бренд: ${escapeTelegram(data.brand ?? "-")}

🌍 Страна: ${escapeTelegram(data.country ?? "-")}

📏 Размер: ${escapeTelegram(data.size ?? "-")}

🧱 Материал: ${escapeTelegram(data.material ?? "-")}
`;

  const fetchWithTimeout = async (
    url: string,
    options: RequestInit,
    timeout = 20000,
  ) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  const keyboard: Array<Array<{ text: string; url?: string; callback_data?: string }>> = [];

  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  if (botUsername && digitsOnly.length >= 10) {
    keyboard.push([
      {
        text: "💬 Написать в Telegram",
        url: `https://t.me/${botUsername}?start=call_${digitsOnly}`,
      },
    ]);
  }

  if (digitsOnly.length >= 10) {
    keyboard.push([
      {
        text: "💬 Написать в WhatsApp",
        url: `https://wa.me/${digitsOnly}`,
      },
    ]);
  }

  keyboard.push([
    { text: "✅ Подтвердить", callback_data: `confirm_${data.orderId}` },
    { text: "❌ Отменить", callback_data: `cancel_${data.orderId}` },
  ]);

  if (!productUrl.includes("localhost")) {
    keyboard.push([
      {
        text: "🛍 Открыть товар",
        url: productUrl,
      },
    ]);
  }

  const replyMarkup = { inline_keyboard: keyboard };
  const caption =
    text + `\n\n🧾 Заказ: ${data.orderId}\n🛍 Товар: ${escapeTelegram(data.product)}`;

  try {
    if (data.image) {
      const photoResponse = await fetchWithTimeout(
        `https://api.telegram.org/bot${token}/sendPhoto`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            photo: data.image,
            caption,
            parse_mode: "HTML",
            reply_markup: replyMarkup,
          }),
        },
      );
      const photoResult = await photoResponse.json();
      if (photoResult.ok) {
        return true;
      }
    }

    const textResponse = await fetchWithTimeout(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: caption,
          parse_mode: "HTML",
          reply_markup: replyMarkup,
        }),
      },
    );
    const textResult = await textResponse.json();
    return Boolean(textResult.ok);
  } catch (error) {
    console.error("TELEGRAM ERROR:", error);
    return false;
  }
}

const CONTACT_METHOD_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  phone: "Звонок",
};

export async function sendTelegramCartMessage(data: {
  orderId: string;
  contactMethod: string;
  items: Array<{ title: string; quantity: number; price: string }>;
  totalPrice: number;
}): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram env missing");
    return false;
  }

  const itemsList = data.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${escapeTelegram(item.title)} — ${item.quantity} шт. × ${escapeTelegram(item.price)} ₽`,
    )
    .join("\n");

  const contactLabel =
    CONTACT_METHOD_LABELS[data.contactMethod] ?? data.contactMethod;

  const text = `
🛒 ЗАЯВКА ИЗ КОРЗИНЫ

📱 Способ связи: ${escapeTelegram(contactLabel)}

📦 Товары:
${itemsList}

💰 Итого: ${escapeTelegram(String(data.totalPrice))} ₽

🧾 Заказ: ${data.orderId}
`;

  const fetchWithTimeout = async (
    url: string,
    options: RequestInit,
    timeout = 20000,
  ) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  const keyboard = [
    [
      { text: "✅ Подтвердить", callback_data: `confirm_${data.orderId}` },
      { text: "❌ Отменить", callback_data: `cancel_${data.orderId}` },
    ],
  ];

  try {
    const textResponse = await fetchWithTimeout(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: keyboard },
        }),
      },
    );
    const textResult = await textResponse.json();
    return Boolean(textResult.ok);
  } catch (error) {
    console.error("TELEGRAM CART ERROR:", error);
    return false;
  }
}

export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
    }),
  });
}
