import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing-page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — LinguaAI" },
      { name: "description", content: "Simple, transparent pricing. Start free forever." },
      { property: "og:title", content: "LinguaAI Pricing" },
      { property: "og:description", content: "Free forever plan. Upgrade any time." },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    name: "Free",
    price: "$0",
    tagline: "Perfect for getting started.",
    features: ["AI tutor (limited)", "A1 course access", "Basic vocabulary", "Community access"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    tagline: "Everything you need to master English.",
    features: [
      "Unlimited AI tutor",
      "All A1–C2 courses",
      "Speaking, listening, writing",
      "IELTS / TOEFL mock exams",
      "Certificates & progress reports",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Teams",
    price: "$8",
    tagline: "Per seat. For schools & companies.",
    features: ["Everything in Pro", "Team dashboard", "Bulk seats", "SSO & SAML", "Dedicated success manager"],
    cta: "Contact sales",
    highlight: false,
  },
];

function Pricing() {
  return (
    <MarketingPageShell eyebrow="Pricing" title="Simple pricing. Serious progress." subtitle="Start free. Upgrade when you're ready.">
      <div className="grid gap-8 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-3xl border p-8 shadow-card ${
              p.highlight ? "gradient-brand text-white shadow-glow" : "bg-card"
            }`}
          >
            {p.highlight && (
              <Badge variant="secondary" className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most popular
              </Badge>
            )}
            <h3 className="font-display text-xl font-bold">{p.name}</h3>
            <p className={`mt-1 text-sm ${p.highlight ? "opacity-80" : "text-muted-foreground"}`}>{p.tagline}</p>
            <div className="mt-6">
              <span className="font-display text-5xl font-bold">{p.price}</span>
              <span className={`text-sm ${p.highlight ? "opacity-80" : "text-muted-foreground"}`}> / month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={`h-4 w-4 shrink-0 ${p.highlight ? "text-white" : "text-success"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild className={`mt-8 w-full ${p.highlight ? "bg-white text-primary hover:bg-white/90" : ""}`}>
              <Link to="/auth">{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </MarketingPageShell>
  );
}
