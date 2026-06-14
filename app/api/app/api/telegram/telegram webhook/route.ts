import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const update = await req.json();

    const message = update.message;
    const text = message?.text;
    const chatId = message?.chat?.id;

    if (!text || !chatId) {
      return NextResponse.json({ ok: true });
    }

    // 👇 APPSS VERIFY
    if (text === "/appss_verify") {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "appss_207696",
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false });
  }
}