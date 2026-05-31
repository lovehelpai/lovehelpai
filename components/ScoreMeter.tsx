"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreMeterProps {
  label: string;
  value: number;
  colorClass?: string;
}

export function ScoreMeter({ label, value, colorClass }: ScoreMeterProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="font-semibold text-text-primary">{clamped}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface-elevated">
        <motion.div
          className={cn("h-full rounded-full bg-primary", colorClass)}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
