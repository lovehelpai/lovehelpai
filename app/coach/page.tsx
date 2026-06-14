"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CoachChat, type CoachResult } from "@/components/CoachChat";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const scenarios = [
  {
    id: "firstDate",
    title: "First Date",
    emoji: "☕",
  },
  {
    id: "noResponse",
    title: "No Response",
    emoji: "⏳",
  },
  {
    id: "ghosting",
    title: "Ghosting",
    emoji: "👻",
  },
  {
    id: "longDistance",
    title: "Long Distance",
    emoji: "🌍",
  },
  {
    id: "afterFirstKiss",
    title: "After First Kiss",
    emoji: "💋",
  },
  {
    id: "conflict",
    title: "Relationship Conflict",
    emoji: "💔",
  },
];

export default function CoachPage() {
  const { t } = useTranslation();

  const [scenario, setScenario] = useState("firstDate");
  const [context, setContext] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<CoachResult | null>(null);

  async function getAdvice() {
    if (!context.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<CoachResult>("/api/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario,
          context,
        }),
      });

      setResult(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("common.error")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-6">
      <PageHeader title={t("coach.title")} />

      {!result && (
        <>
          <div className="mb-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Choose Scenario
            </p>

            <div className="grid grid-cols-2 gap-3">
              {scenarios.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScenario(item.id)}
                  className={cn(
                    "glass-card rounded-3xl p-4 text-left transition-all",
                    scenario === item.id
                      ? "border-2 border-primary bg-primary/10 shadow-lg"
                      : "hover:scale-[1.02]"
                  )}
                >
                  <div className="mb-2 text-2xl">
                    {item.emoji}
                  </div>

                  <div className="text-sm font-semibold text-text-primary">
                    {item.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card mb-4 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Describe Your Situation
            </p>

            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={6}
              placeholder="Tell Wingman AI what happened..."
              className="w-full resize-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
            />
          </div>

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
              "Get AI Advice"
            )}
          </Button>
        </>
      )}

      {error && (
        <div className="mt-4 rounded-2xl bg-danger/20 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {result && (
        <>
          <div className="mb-4 rounded-3xl bg-primary/10 p-4">
            <p className="text-xs text-text-secondary">
              Scenario
            </p>

            <p className="font-semibold text-text-primary">
              {
                scenarios.find((s) => s.id === scenario)
                  ?.title
              }
            </p>
          </div>

          <CoachChat result={result} />

          <Button
            variant="secondary"
            className="mt-6 w-full"
            onClick={() => {
              setResult(null);
              setContext("");
            }}
          >
            New Coaching Session
          </Button>
        </>
      )}
    </div>
  );
}