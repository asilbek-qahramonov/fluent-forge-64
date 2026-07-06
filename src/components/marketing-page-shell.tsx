import type { ReactNode } from "react";
import { motion } from "motion/react";
import { MarketingNav, MarketingFooter } from "./marketing-shell";

export function MarketingPageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-background">
      <MarketingNav />
      <section className="gradient-mesh">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold sm:text-6xl"
          >
            {title}
          </motion.h1>
          {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 py-16">{children}</div>
      <MarketingFooter />
    </div>
  );
}
