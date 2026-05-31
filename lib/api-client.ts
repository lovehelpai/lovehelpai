"use client";

function getInitData(): string {
  if (typeof window === "undefined") return "";
  const tg = (
    window as unknown as {
      Telegram?: { WebApp?: { initData?: string } };
    }
  ).Telegram?.WebApp;
  return tg?.initData ?? "";
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  const initData = getInitData();
  if (initData) {
    headers.set("x-telegram-init-data", initData);
  }

  const res = await fetch(path, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error ?? `Request failed: ${res.status}`
    );
  }

  return data as T;
}
