import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { TelegramUser } from "@/lib/telegram";
import type { User } from "@prisma/client";

const COOKIE_NAME = "love_help_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const userId = await verifySessionToken(token);
  if (!userId) return null;

  return prisma.user.findUnique({ where: { id: userId } });
}

export async function upsertUserFromTelegram(tgUser: TelegramUser): Promise<User> {
  return prisma.user.upsert({
    where: { telegramId: String(tgUser.id) },
    create: {
      telegramId: String(tgUser.id),
      username: tgUser.username ?? null,
      firstName: tgUser.first_name ?? null,
      photoUrl: tgUser.photo_url ?? null,
    },
    update: {
      username: tgUser.username ?? null,
      firstName: tgUser.first_name ?? null,
      photoUrl: tgUser.photo_url ?? null,
    },
  });
}

export async function requireUser(request: Request): Promise<User> {
  const initData = request.headers.get("x-telegram-init-data");
  if (initData) {
    const { validateTelegramInitData } = await import("@/lib/telegram");
    const parsed = validateTelegramInitData(initData);
    if (parsed) {
      return upsertUserFromTelegram(parsed.user);
    }
  }

  const user = await getSessionUser();
  if (!user) {
    throw new AuthError("Unauthorized");
  }
  return user;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
