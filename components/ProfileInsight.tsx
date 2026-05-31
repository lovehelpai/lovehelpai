"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

export interface ProfileInsightData {
  personalityType: string;
  interests: string[];
  conversationStarters: string[];
  topicsToAvoid: string[];
  datingStrategy: string;
}

interface ProfileInsightProps {
  data: ProfileInsightData;
}

export function ProfileInsight({ data }: ProfileInsightProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <InsightBlock title={t("profile.personality")} content={data.personalityType} />

      <TagBlock title={t("profile.interests")} items={data.interests} />
      <TagBlock title={t("profile.starters")} items={data.conversationStarters} variant="success" />
      <TagBlock title={t("profile.avoid")} items={data.topicsToAvoid} variant="danger" />

      <InsightBlock title={t("profile.strategy")} content={data.datingStrategy} />
    </motion.div>
  );
}

function InsightBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="glass-card p-5">
      <h3 className="mb-2 text-sm font-medium text-text-secondary">{title}</h3>
      <p className="text-text-primary leading-relaxed">{content}</p>
    </div>
  );
}

function TagBlock({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant?: "success" | "danger";
}) {
  const chipClass =
    variant === "danger"
      ? "bg-danger/20 text-text-primary"
      : variant === "success"
        ? "bg-success/20 text-text-primary"
        : "bg-accent-light text-text-primary";

  return (
    <div className="glass-card p-5">
      <h3 className="mb-3 text-sm font-medium text-text-secondary">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${chipClass}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
