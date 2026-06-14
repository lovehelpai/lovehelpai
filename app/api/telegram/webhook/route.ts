import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const update = await req.json();

    const message = update?.message;
    const text = message?.text;
    const chatId = message?.chat?.id;

    // если нет сообщения — просто выходим
    if (!text || !chatId) {
      return NextResponse.json({ ok: true });
    }

    // ОБЫЧНЫЙ ОТВЕТ НА ЛЮБОЕ СООБЩЕНИЕ
    const responseText =
      text === "/appss_verify"
        ? "appss_207696"
        : "Привет! Бот работает ✅";

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseText,
        }),
      }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}