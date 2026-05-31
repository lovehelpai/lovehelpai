import { NextResponse } from "next/server";
import { setSessionCookie, upsertUserFromTelegram } from "@/lib/auth";
import { validateTelegramInitData } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const initData =
      (body as { initData?: string }).initData ??
      request.headers.get("x-telegram-init-data");

    if (!initData) {
      return NextResponse.json({ error: "Missing initData" }, { status: 400 });
    }

    const parsed = validateTelegramInitData(initData);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid initData" }, { status: 401 });
    }

    const user = await upsertUserFromTelegram(parsed.user);
    await setSessionCookie(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    console.error("[auth]", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
