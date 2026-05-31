"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ReplyCard } from "@/components/ReplyCard";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ReplyStyle =
  | "friendly"
  | "confident"
  | "flirty"
  | "funny"
  | "romantic";

const styles: { id: ReplyStyle; labelKey: `reply.${ReplyStyle}` }[] = [
  { id: "friendly", labelKey: "reply.friendly" },
  { id: "confident", labelKey: "reply.confident" },
  { id: "flirty", labelKey: "reply.flirty" },
  { id: "funny", labelKey: "reply.funny" },
  { id: "romantic", labelKey: "reply.romantic" },
];

export default function ReplyPage() {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<ReplyStyle>("friendly");
  const [replies, setReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{ replies: string[] }>("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), style }),
      });
      setReplies(data.replies);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-4">
      <PageHeader title={t("reply.title")} />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t("reply.placeholder")}
        rows={4}
        className="glass-card mb-4 w-full resize-none border-0 bg-transparent p-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40"
      />

      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
        {t("reply.style")}
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {styles.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            onClick={() => setStyle(id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              style === id
                ? "bg-primary text-text-primary"
                : "bg-surface-elevated text-text-secondary"
            )}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      <Button
        className="mb-6 w-full"
        onClick={generate}
        disabled={loading || !message.trim()}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("reply.generating")}
          </>
        ) : replies.length > 0 ? (
          t("reply.regenerate")
        ) : (
          t("reply.generate")
        )}
      </Button>

      {error && (
        <p className="mb-4 rounded-2xl bg-danger/20 p-3 text-sm">{error}</p>
      )}

      <div className="space-y-3">
        {replies.map((text, i) => (
          <ReplyCard
            key={`${i}-${text.slice(0, 12)}`}
            text={text}
            index={i}
            copyLabel={t("reply.copy")}
            copiedLabel={t("reply.copied")}
          />
        ))}
      </div>
    </div>
  );
}
