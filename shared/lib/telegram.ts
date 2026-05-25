export async function sendTelegramMessage(data: {
  name: string;
  phone: string;
  product: string;
  productId: string;
  image?: string;
  brand?: string;
  country?: string;
  size?: string;
  material?: string;
  price?: number;
}) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Telegram env missing");
      return;
    }

    // БЕЗОПАСНЫЙ URL - заменяем localhost на реальный домен
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";
    const productUrl = `${baseUrl}/products/${data.productId}`;

    // Очищаем номер телефона
    const cleanPhone = data.phone.replace(/[^\d+]/g, "");
    const digitsOnly = cleanPhone.replace(/\D/g, "");

    console.log("Original phone:", data.phone);
    console.log("Clean phone:", cleanPhone);
    console.log("Product URL:", productUrl);

    const text = `
🔥 НОВАЯ ЗАЯВКА

👤 Клиент: ${data.name}

📞 Телефон: ${cleanPhone}

🛍 Товар: ${data.product}

💰 Цена: ${data.price || "-"} ₽

🏷 Бренд: ${data.brand || "-"}

🌍 Страна: ${data.country || "-"}

📏 Размер: ${data.size || "-"}

🧱 Материал: ${data.material || "-"}
`;

    // Функция для fetch с таймаутом
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

    // Проверяем, доступно ли фото
    let isImageAvailable = false;
    if (data.image) {
      try {
        console.log("🔍 Checking image availability...");
        const imageCheck = await fetch(data.image, {
          method: "HEAD",
          signal: AbortSignal.timeout(5000),
        });
        isImageAvailable = imageCheck.ok;
        console.log("Image available:", isImageAvailable);
      } catch (error) {
        console.log("Image not available:", error.message);
        isImageAvailable = false;
      }
    }

    // Формируем клавиатуру
    const keyboard = [];

    // Кнопка звонка через сервис (единственный работающий способ)
    if (digitsOnly.length >= 10) {
      // Вариант 1: Используем Call2Bot сервис
      keyboard.push([
        {
          text: "📞 Позвонить клиенту",
          url: `https://t.me/${process.env.TELEGRAM_BOT_USERNAME}?start=call_${digitsOnly}`,
        },
      ]);

      // Вариант 2: Или просто показываем номер в тексте (уже есть)
    }

    // WhatsApp кнопка
    if (digitsOnly.length >= 10) {
      keyboard.push([
        {
          text: "💬 Написать в WhatsApp",
          url: `https://wa.me/${digitsOnly}`,
        },
      ]);
    }

    // Кнопки подтверждения
    keyboard.push([
      { text: "✅ Подтвердить", callback_data: `confirm_${data.productId}` },
      { text: "❌ Отменить", callback_data: `cancel_${data.productId}` },
    ]);

    // Кнопка с товаром (только если URL не localhost)
    if (!productUrl.includes("localhost")) {
      keyboard.push([
        {
          text: "🛍 Открыть товар",
          url: productUrl,
        },
      ]);
    }

    // Пробуем отправить с фото
    if (isImageAvailable && data.image) {
      try {
        console.log("📤 Trying to send photo with keyboard...");

        const response = await fetchWithTimeout(
          `https://api.telegram.org/bot${token}/sendPhoto`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              photo: data.image,
              caption: text,
              parse_mode: "HTML",
              reply_markup: { inline_keyboard: keyboard },
            }),
          },
          20000,
        );

        const result = await response.json();
        console.log("TELEGRAM PHOTO RESULT:", result);

        if (result.ok) {
          console.log("✅ Photo sent successfully!");
          return;
        } else {
          console.log("⚠️ Photo failed:", result.description);
        }
      } catch (photoError) {
        console.error("❌ Photo sending error:", photoError.message);
      }
    }

    // Отправляем текстовое сообщение с клавиатурой
    console.log("📤 Sending text message with keyboard...");

    const textResponse = await fetchWithTimeout(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text:
            text + `\n\n🔗 Товар: ${data.product}\n🆔 ID: ${data.productId}`,
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: keyboard },
        }),
      },
      20000,
    );

    const textResult = await textResponse.json();
    console.log("TELEGRAM TEXT RESULT:", textResult);

    if (textResult.ok) {
      console.log("✅ Text message sent successfully!");
    } else {
      console.error("❌ Text message failed, sending without keyboard...");

      // Финальный fallback - просто текст
      const ultimateResponse = await fetchWithTimeout(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `🔥 НОВАЯ ЗАЯВКА\n\n👤 ${data.name}\n📞 ${cleanPhone}\n🛍 ${data.product}\n💰 ${data.price || "-"} ₽\n\n⚠️ Фото: ${isImageAvailable ? "есть" : "нет"}`,
          }),
        },
        20000,
      );

      const ultimateResult = await ultimateResponse.json();
      console.log("ULTIMATE FALLBACK RESULT:", ultimateResult);
    }
  } catch (error) {
    console.error("TELEGRAM ERROR:", error);
  }
}
