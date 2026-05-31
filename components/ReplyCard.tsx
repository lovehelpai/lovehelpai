"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReplyCardProps {
  text: string;
  copyLabel: string;
  copiedLabel: string;
  index?: number;
}

export function ReplyCard({
  text,
  copyLabel,
  copiedLabel,
  index,
}: ReplyCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index ?? 0) * 0.05 }}
      className="glass-card flex items-start gap-3 p-4"
    >
      <p className="flex-1 text-sm leading-relaxed text-text-primary">{text}</p>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleCopy}
        className="shrink-0"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            {copiedLabel}
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            {copyLabel}
          </>
        )}
      </Button>
    </motion.div>
  );
}
