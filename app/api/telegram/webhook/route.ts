import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const update = await req.json();

    const message = update?.message;
    const text = message?.text;
    const chatId = message?.chat?.id;

    // если это не сообщение — просто отвечаем OK
    if (!text || !chatId) {
      return NextResponse.json({ ok: true });
    }

    // ⚡ APPSS VERIFY
    if (text === "/appss_verify") {
      // важно: НЕ await (чтобы не блокировать webhook)
      fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "appss_207696",
          }),
        }
      );

      // сразу отвечаем Telegram
      return NextResponse.json({ ok: true });
    }

    // остальные сообщения (если есть бот логика)
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("telegram webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}