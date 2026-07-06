import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  Mic,
  BookOpen,
  Brain,
  Trophy,
  Globe,
  MessageCircle,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";
import { Logo } from "@/lib/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingNav, MarketingFooter } from "@/components/marketing-shell";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  { icon: Brain, title: "AI Personal Tutor", desc: "Chat, ask, get explanations in seconds." },
  { icon: Mic, title: "Speaking Coach", desc: "Pronunciation scoring & fluency feedback." },
  { icon: BookOpen, title: "A1 → C2 Courses", desc: "Structured lessons, quizzes, and certificates." },
  { icon: Trophy, title: "Gamified Progress", desc: "XP, streaks, badges, and leaderboards." },
  { icon: Globe, title: "IELTS / TOEFL Prep", desc: "Full mock exams with detailed scoring." },
  { icon: MessageCircle, title: "Writing Assistant", desc: "AI grammar, style & vocabulary suggestions." },
];

const testimonials = [
  { name: "Amir K.", role: "IELTS 7.5", text: "The AI tutor is like having a native speaker on call 24/7. My score jumped 1.5 bands in two months." },
  { name: "Maria S.", role: "Business English", text: "Finally an app that adapts to my level. The writing feedback is incredibly detailed." },
  { name: "Kenji T.", role: "TOEFL 105", text: "Speaking practice with instant pronunciation scores changed everything for me." },
];

function Landing() {
  return (
    <div className="relative overflow-hidden bg-background">
      <MarketingNav />

      {/* HERO */}
      <section className="relative gradient-mesh">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-32 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by advanced AI — chat, speak, and write with confidence
            </Badge>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Learn English <span className="text-gradient">10× faster</span>
              <br />
              with your own AI tutor
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Personalized lessons, real conversations, grammar coaching, and mock IELTS/TOEFL exams — all in one
              beautifully designed platform.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gradient-brand shadow-glow text-white hover:opacity-90">
                <Link to="/auth">
                  Start learning free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/features">Explore features</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" /> No credit card
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Free forever plan
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Cancel anytime
              </span>
            </div>
          </motion.div>

          {/* Product preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-16 max-w-5xl"
          >
            <div className="glass rounded-3xl border p-2 shadow-glow">
              <div className="rounded-2xl bg-card p-8">
                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    { label: "Daily streak", value: "47 days", icon: Zap, color: "gradient-warm" },
                    { label: "XP earned", value: "12,480", icon: Trophy, color: "gradient-brand" },
                    { label: "Words mastered", value: "1,204", icon: BookOpen, color: "bg-success" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl border bg-background/60 p-6">
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color} text-white`}>
                        <s.icon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 text-2xl font-bold">{s.value}</p>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold">Everything you need. Nothing you don't.</h2>
          <p className="mt-4 text-muted-foreground">
            LinguaAI combines the best of Duolingo, Grammarly, Cambly & ChatGPT into one seamless experience.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-3xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand text-white shadow-glow">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold">Loved by learners worldwide</h2>
            <p className="mt-4 text-muted-foreground">Over 200,000 learners are studying English on LinguaAI right now.</p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-3xl border bg-card p-6 shadow-card">
                <div className="flex gap-0.5 text-warning">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-brand font-semibold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="relative overflow-hidden rounded-3xl gradient-brand p-12 text-white shadow-glow">
          <Logo size={48} className="mx-auto mb-6 justify-center" />
          <h2 className="font-display text-4xl font-bold">Ready to transform your English?</h2>
          <p className="mt-4 opacity-90">Join thousands of learners. Start free — no credit card required.</p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link to="/auth">
              Get started <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
