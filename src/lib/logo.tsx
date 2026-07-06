import { cn } from "@/lib/utils";

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="relative flex items-center justify-center rounded-2xl gradient-brand shadow-glow"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="text-white" style={{ width: size * 0.6, height: size * 0.6 }}>
          <path
            d="M4 18L10 4l6 14M6.5 13h7M14 20l3-7 3 7m-5.2-2h4.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-display text-xl font-bold tracking-tight">
        Lingua<span className="text-gradient">AI</span>
      </span>
    </div>
  );
}
