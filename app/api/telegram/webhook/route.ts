export async function POST(req: Request) {
    const update = await req.json();
  
    const text = update.message?.text;
    const chatId = update.message?.chat?.id;
  
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
  
    return new Response("ok");
  }