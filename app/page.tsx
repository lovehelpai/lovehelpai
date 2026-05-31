"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  MessageSquare,
  HeartHandshake,
  ScanFace,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const actions = [
  {
    href: "/analyze",
    icon: Camera,
    titleKey: "home.analyzeScreenshot" as const,
    color: "from-primary to-primary-glow",
  },
  {
    href: "/reply",
    icon: MessageSquare,
    titleKey: "home.whatShouldIReply" as const,
    color: "from-accent to-accent-light",
  },
  {
    href: "/coach",
    icon: HeartHandshake,
    titleKey: "home.dateCoach" as const,
    color: "from-primary-glow to-accent",
  },
  {
    href: "/profile",
    icon: ScanFace,
    titleKey: "home.profileAnalysis" as const,
    color: "from-accent-light to-primary",
  },
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 pb-4">
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-hero -mx-4 rounded-b-[32px] px-6 pb-8 pt-2"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-surface/80 px-3 py-1.5 text-xs font-medium text-text-secondary backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          {t("home.hero")}
        </h1>
        <p className="mt-2 text-text-secondary">{t("home.subtitle")}</p>
      </motion.section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          {t("home.quickActions")}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {actions.map(({ href, icon: Icon, titleKey, color }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={href}
                className="glass-card group flex flex-col gap-3 p-4 transition-transform active:scale-[0.98]"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${color}`}
                >
                  <Icon className="h-5 w-5 text-text-primary" />
                </div>
                <span className="text-sm font-semibold leading-tight text-text-primary">
                  {t(titleKey)}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
