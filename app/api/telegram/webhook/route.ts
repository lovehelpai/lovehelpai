import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const update = await req.json();

    console.log("📩 Telegram update:", JSON.stringify(update));

    const message = update?.message;
    const text = message?.text;
    const chatId = message?.chat?.id;

    if (!text || !chatId) {
      return NextResponse.json({ ok: true });
    }

    if (text === "/appss_verify") {
      const token = process.env.TELEGRAM_BOT_TOKEN;

      console.log("🔑 token exists:", !!token);

      const res = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "appss_207696",
          }),
        }
      );

      const data = await res.json();
      console.log("📤 telegram response:", data);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}