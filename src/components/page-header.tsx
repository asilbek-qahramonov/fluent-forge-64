import type { ReactNode } from "react";
import { motion } from "motion/react";

export function PageHeader({ icon: Icon, title, subtitle }: { icon?: React.ComponentType<{ className?: string }>; title: string; subtitle?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start gap-4">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand text-white shadow-glow">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div>
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

export function EmptyPageState({ title, message, action }: { title: string; message?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-card/50 p-16 text-center">
      <p className="font-display text-xl font-semibold">{title}</p>
      {message && <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
