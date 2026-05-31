"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Plus, Trash2, Globe } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  ProfileInsight,
  type ProfileInsightData,
} from "@/components/ProfileInsight";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface RelationshipProfile {
  id: string;
  personName: string;
  description: string | null;
  interestLevel: number;
  notes: string | null;
  lastInteraction: string | null;
  createdAt: string;
}

interface HistoryItem {
  id: string;
  summary: string;
  interestScore: number;
  flirtScore: number;
  relationshipPotential: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { t, locale, setLocale } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"analysis" | "memory" | "history">("analysis");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<ProfileInsightData | null>(null);
  const [profiles, setProfiles] = useState<RelationshipProfile[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    personName: "",
    description: "",
    notes: "",
    interestLevel: 50,
  });

  const loadMemory = useCallback(async () => {
    try {
      const data = await apiFetch<{ profiles: RelationshipProfile[] }>(
        "/api/memory"
      );
      setProfiles(data.profiles);
    } catch {
      /* ignore */
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const data = await apiFetch<{ analyses: HistoryItem[] }>("/api/history");
      setHistory(data.analyses);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadMemory();
    loadHistory();
  }, [loadMemory, loadHistory]);

  async function analyzeProfile(file: File) {
    setLoading(true);
    setError(null);
    setInsight(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const data = await apiFetch<ProfileInsightData>(
        "/api/profile-analysis",
        { method: "POST", body: formData }
      );
      setInsight(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) analyzeProfile(file);
  }

  async function saveProfile() {
    if (!form.personName.trim()) return;
    try {
      await apiFetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personName: form.personName.trim(),
          description: form.description || undefined,
          notes: form.notes || undefined,
          interestLevel: form.interestLevel,
        }),
      });
      setForm({ personName: "", description: "", notes: "", interestLevel: 50 });
      setShowForm(false);
      await loadMemory();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.error"));
    }
  }

  async function deleteProfile(id: string) {
    try {
      await apiFetch(`/api/memory?id=${id}`, { method: "DELETE" });
      await loadMemory();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.error"));
    }
  }

  const tabs = [
    { id: "analysis" as const, label: t("profile.uploadProfile") },
    { id: "memory" as const, label: t("profile.memory") },
    { id: "history" as const, label: t("profile.history") },
  ];

  return (
    <div className="pb-4">
      <PageHeader title={t("profile.title")} />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1 rounded-2xl bg-surface-elevated p-1">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "rounded-xl px-2 py-1.5 text-[10px] font-semibold sm:text-xs",
                tab === id
                  ? "bg-surface text-text-primary shadow-sm"
                  : "text-text-secondary"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setLocale(locale === "ru" ? "en" : "ru")}
          className="flex items-center gap-1 rounded-full bg-accent-light px-3 py-1.5 text-xs font-medium text-text-primary"
        >
          <Globe className="h-3.5 w-3.5" />
          {locale.toUpperCase()}
        </button>
      </div>

      {tab === "analysis" && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            className="hidden"
            onChange={handleFile}
          />
          <Button
            className="mb-4 w-full"
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("profile.analyzing")}
              </>
            ) : (
              t("profile.uploadProfile")
            )}
          </Button>
          <p className="mb-4 text-center text-xs text-text-secondary">
            {t("profile.uploadHint")}
          </p>
          {insight && <ProfileInsight data={insight} />}
        </>
      )}

      {tab === "memory" && (
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="h-4 w-4" />
            {t("profile.addPerson")}
          </Button>

          {showForm && (
            <div className="glass-card space-y-3 p-4">
              <input
                placeholder={t("profile.personName")}
                value={form.personName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, personName: e.target.value }))
                }
                className="w-full rounded-xl bg-surface-elevated px-3 py-2 text-sm"
              />
              <input
                placeholder={t("profile.description")}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full rounded-xl bg-surface-elevated px-3 py-2 text-sm"
              />
              <textarea
                placeholder={t("profile.notes")}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                rows={2}
                className="w-full resize-none rounded-xl bg-surface-elevated px-3 py-2 text-sm"
              />
              <label className="block text-xs text-text-secondary">
                {t("profile.interestLevel")}: {form.interestLevel}
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={form.interestLevel}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    interestLevel: Number(e.target.value),
                  }))
                }
                className="w-full accent-primary"
              />
              <Button className="w-full" onClick={saveProfile}>
                {t("profile.save")}
              </Button>
            </div>
          )}

          {profiles.length === 0 && (
            <p className="py-8 text-center text-sm text-text-secondary">
              {t("profile.noMemory")}
            </p>
          )}

          {profiles.map((p) => (
            <div key={p.id} className="glass-card flex gap-3 p-4">
              <div className="flex-1">
                <h4 className="font-semibold text-text-primary">{p.personName}</h4>
                {p.description && (
                  <p className="mt-1 text-xs text-text-secondary">
                    {p.description}
                  </p>
                )}
                {p.notes && (
                  <p className="mt-2 text-sm text-text-primary">{p.notes}</p>
                )}
                <p className="mt-1 text-xs text-text-secondary">
                  {t("profile.interestLevel")}: {p.interestLevel}%
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteProfile(p.id)}
                className="text-danger"
                aria-label={t("profile.delete")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-3">
          {history.length === 0 && (
            <p className="py-8 text-center text-sm text-text-secondary">
              {t("profile.noMemory")}
            </p>
          )}
          {history.map((h) => (
            <div key={h.id} className="glass-card p-4">
              <p className="text-sm text-text-primary line-clamp-2">
                {h.summary}
              </p>
              <div className="mt-2 flex gap-3 text-xs text-text-secondary">
                <span>{h.interestScore}%</span>
                <span>{h.flirtScore}%</span>
                <span>{h.relationshipPotential}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-2xl bg-danger/20 p-3 text-sm">{error}</p>
      )}
    </div>
  );
}
