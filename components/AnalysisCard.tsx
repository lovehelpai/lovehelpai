"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { ScoreMeter } from "@/components/ScoreMeter";
import { ReplyCard } from "@/components/ReplyCard";
import { useTranslation } from "@/lib/i18n";

export interface AnalysisData {
  summary: string;
  interestScore: number;
  flirtScore: number;
  relationshipPotential: number;
  redFlags: string[];
  greenFlags: string[];
  recommendation: string;
  nextMessages: string[];
}

interface AnalysisCardProps {
  data: AnalysisData;
}

export function AnalysisCard({ data }: AnalysisCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="glass-card p-5">
        <h3 className="mb-2 text-sm font-medium text-text-secondary">
          {t("analyze.summary")}
        </h3>
        <p className="text-text-primary leading-relaxed">{data.summary}</p>
      </div>

      <div className="glass-card space-y-4 p-5">
        <ScoreMeter label={t("analyze.interest")} value={data.interestScore} />
        <ScoreMeter label={t("analyze.flirt")} value={data.flirtScore} />
        <ScoreMeter
          label={t("analyze.potential")}
          value={data.relationshipPotential}
        />
      </div>

      {data.redFlags.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-danger">
            <AlertTriangle className="h-4 w-4" />
            {t("analyze.redFlags")}
          </h3>
          <ul className="space-y-2 text-sm text-text-primary">
            {data.redFlags.map((flag, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-danger">•</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.greenFlags.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" />
            {t("analyze.greenFlags")}
          </h3>
          <ul className="space-y-2 text-sm text-text-primary">
            {data.greenFlags.map((flag, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-success">•</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="glass-card p-5">
        <h3 className="mb-2 text-sm font-medium text-text-secondary">
          {t("analyze.recommendation")}
        </h3>
        <p className="text-text-primary leading-relaxed">{data.recommendation}</p>
      </div>

      {data.nextMessages.length > 0 && (
        <div className="space-y-3">
          <h3 className="px-1 font-semibold text-text-primary">
            {t("analyze.suggestedReplies")}
          </h3>
          {data.nextMessages.map((msg, i) => (
            <ReplyCard key={i} text={msg} copyLabel={t("analyze.copy")} copiedLabel={t("analyze.copied")} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
