import crypto from "crypto";

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export interface ParsedInitData {
  user: TelegramUser;
  authDate: number;
  hash: string;
}

function parseInitData(initData: string): Record<string, string> {
  const params = new URLSearchParams(initData);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function validateTelegramInitData(initData: string): ParsedInitData | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || !initData) return null;

  const params = parseInitData(initData);
  const hash = params.hash;
  if (!hash) return null;

  const dataCheckArr = Object.keys(params)
    .filter((k) => k !== "hash")
    .sort()
    .map((k) => `${k}=${params[k]}`);

  const dataCheckString = dataCheckArr.join("\n");
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash !== hash) return null;

  const authDate = parseInt(params.auth_date ?? "0", 10);
  const maxAge = 60 * 60 * 24;
  if (Date.now() / 1000 - authDate > maxAge) return null;

  let user: TelegramUser;
  try {
    user = JSON.parse(params.user ?? "{}") as TelegramUser;
  } catch {
    return null;
  }

  if (!user?.id) return null;

  return { user, authDate, hash };
}

export function getTelegramUserFromInitData(initData: string): TelegramUser | null {
  return validateTelegramInitData(initData)?.user ?? null;
}
