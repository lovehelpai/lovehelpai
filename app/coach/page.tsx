"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CoachChat, type CoachResult } from "@/components/CoachChat";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const scenarioKeys = [
  { id: "firstDate", key: "coach.scenarios.firstDate" as const },
  { id: "noResponse", key: "coach.scenarios.noResponse" as const },
  { id: "ghosting", key: "coach.scenarios.ghosting" as const },
  { id: "longDistance", key: "coach.scenarios.longDistance" as const },
  { id: "afterFirstKiss", key: "coach.scenarios.afterFirstKiss" as const },
  { id: "conflict", key: "coach.scenarios.conflict" as const },
] as const;

export default function CoachPage() {
  const { t } = useTranslation();
  const [scenario, setScenario] = useState<string>(scenarioKeys[0].key);
  const [context, setContext] = useState("");
  const [result, setResult] = useState<CoachResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getAdvice() {
    if (!context.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<CoachResult>("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: t(scenario as Parameters<typeof t>[0]),
          context: context.trim(),
        }),
      });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-4">
      <PageHeader title={t("coach.title")} />

      {!result && (
        <>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("coach.selectScenario")}
          </p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {scenarioKeys.map(({ key }) => (
              <button
                key={key}
                type="button"
                onClick={() => setScenario(key)}
                className={cn(
                  "glass-card rounded-2xl p-3 text-left text-xs font-semibold transition-colors",
                  scenario === key
                    ? "ring-2 ring-primary"
                    : "opacity-90 hover:opacity-100"
                )}
              >
                {t(key)}
              </button>
            ))}
          </div>

          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("coach.describe")}
          </p>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={t("coach.placeholder")}
            rows={5}
            className="glass-card mb-4 w-full resize-none border-0 bg-transparent p-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <Button
            className="w-full"
            onClick={getAdvice}
            disabled={loading || !context.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("coach.loading")}
              </>
            ) : (
              t("coach.getAdvice")
            )}
          </Button>
        </>
      )}

      {error && (
        <p className="mb-4 rounded-2xl bg-danger/20 p-3 text-sm">{error}</p>
      )}

      {result && (
        <>
          <CoachChat result={result} />
          <Button
            variant="secondary"
            className="mt-6 w-full"
            onClick={() => {
              setResult(null);
            }}
          >
            {t("coach.getAdvice")}
          </Button>
        </>
      )}
    </div>
  );
}
