"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { ReplyCard } from "@/components/ReplyCard";
import { useTranslation } from "@/lib/i18n";

export interface CoachResult {
  situation: string;
  advice: string;
  thingsToAvoid: string[];
  suggestedMessages: string[];
}

interface CoachChatProps {
  result: CoachResult;
}

export function CoachChat({ result }: CoachChatProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="glass-card p-5">
        <h3 className="mb-2 text-sm font-medium text-text-secondary">
          {t("coach.situation")}
        </h3>
        <p className="text-text-primary leading-relaxed">{result.situation}</p>
      </div>

      <div className="glass-card p-5">
        <h3 className="mb-2 text-sm font-medium text-text-secondary">
          {t("coach.advice")}
        </h3>
        <p className="text-text-primary leading-relaxed">{result.advice}</p>
      </div>

      {result.thingsToAvoid.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-warning">
            <AlertCircle className="h-4 w-4" />
            {t("coach.avoid")}
          </h3>
          <ul className="space-y-2 text-sm text-text-primary">
            {result.thingsToAvoid.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.suggestedMessages.length > 0 && (
        <div className="space-y-3">
          <h3 className="px-1 font-semibold text-text-primary">
            {t("coach.messages")}
          </h3>
          {result.suggestedMessages.map((msg, i) => (
            <ReplyCard
              key={i}
              text={msg}
              copyLabel={t("reply.copy")}
              copiedLabel={t("reply.copied")}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
