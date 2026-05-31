"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  ImageIcon,
  MessageCircle,
  Heart,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const tabs = [
  { href: "/", icon: Home, key: "nav.home" as const },
  { href: "/analyze", icon: ImageIcon, key: "nav.analyze" as const },
  { href: "/reply", icon: MessageCircle, key: "nav.reply" as const },
  { href: "/coach", icon: Heart, key: "nav.coach" as const },
  { href: "/profile", icon: User, key: "nav.profile" as const },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-accent/30 bg-surface/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {tabs.map(({ href, icon: Icon, key }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-[10px] font-medium transition-colors",
                active ? "text-text-primary" : "text-text-secondary"
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-1 rounded-2xl bg-accent-light"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 h-5 w-5",
                  active && "text-primary"
                )}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="relative z-10">{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
