import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const update = await req.json();

    const text = update?.message?.text;
    const chatId = update?.message?.chat?.id;

    // защита: если нет сообщения — просто выходим
    if (!text || !chatId) {
      return NextResponse.json({ ok: true });
    }

    // Appss Pro verification
    if (text === "/appss_verify") {
      await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: "appss_207696",
          }),
        }
      );

      return NextResponse.json({ ok: true, verified: true });
    }


    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[telegram webhook error]", error);

    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}