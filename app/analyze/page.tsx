"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AnalysisCard, type AnalysisData } from "@/components/AnalysisCard";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { useTranslation } from "@/lib/i18n";

export default function AnalyzePage() {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisData | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setError(null);
    const url = URL.createObjectURL(selected);
    setPreview(url);
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const data = await apiFetch<AnalysisData>("/api/analyze", {
        method: "POST",
        body: formData,
      });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPreview(null);
    setFile(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="pb-4">
      <PageHeader title={t("analyze.title")} />

      {!result && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            className="hidden"
            onChange={handleFileChange}
          />

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => inputRef.current?.click()}
            className="glass-card mb-4 flex w-full flex-col items-center gap-3 border-2 border-dashed border-accent/50 p-8"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 w-full rounded-2xl object-contain"
              />
            ) : (
              <>
                <ImagePlus className="h-10 w-10 text-primary" />
                <span className="font-semibold text-text-primary">
                  {t("analyze.upload")}
                </span>
                <span className="text-xs text-text-secondary">
                  {t("analyze.uploadHint")}
                </span>
              </>
            )}
          </motion.button>

          {file && !loading && (
            <Button className="w-full" onClick={analyze}>
              {t("analyze.submit")}
            </Button>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 py-8 text-text-secondary">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              {t("analyze.analyzing")}
            </div>
          )}
        </>
      )}

      {error && (
        <div className="mb-4 rounded-2xl bg-danger/20 p-4 text-sm text-text-primary">
          {error}
          <Button variant="ghost" className="mt-2 w-full" onClick={analyze}>
            {t("common.retry")}
          </Button>
        </div>
      )}

      {result && (
        <>
          <AnalysisCard data={result} />
          <Button variant="secondary" className="mt-6 w-full" onClick={reset}>
            {t("analyze.tryAgain")}
          </Button>
        </>
      )}
    </div>
  );
}
