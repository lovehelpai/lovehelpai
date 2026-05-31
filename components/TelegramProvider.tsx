"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { useTranslation } from "@/lib/i18n";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string;
        ready?: () => void;
        expand?: () => void;
        setHeaderColor?: (color: string) => void;
        setBackgroundColor?: (color: string) => void;
        themeParams?: Record<string, string>;
      };
    };
  }
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = async () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready?.();
        tg.expand?.();
        tg.setHeaderColor?.("#F7F5FF");
        tg.setBackgroundColor?.("#F7F5FF");
      }

      const initData = tg?.initData;
      if (initData) {
        try {
          await apiFetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData }),
          });
        } catch (e) {
          console.warn("Auth:", e);
        }
      }

      setReady(true);
    };

    script.onerror = () => {
      setReady(true);
    };

    const fallback = setTimeout(() => setReady(true), 3000);

    return () => {
      clearTimeout(fallback);
      script.remove();
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-hero">
        <p className="text-text-secondary animate-pulse">{t("auth.connecting")}</p>
      </div>
    );
  }

  return <>{children}</>;
}
