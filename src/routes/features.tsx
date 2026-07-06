import { createFileRoute } from "@tanstack/react-router";
import { MarketingPageShell } from "@/components/marketing-page-shell";
import { Brain, Mic, BookOpen, Trophy, Globe, MessageCircle, ScrollText, PenLine, Users, Headphones, Award, Target } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — LinguaAI" },
      { name: "description", content: "Everything LinguaAI does — AI tutor, courses, grammar, vocabulary, speaking, listening, writing, exams." },
      { property: "og:title", content: "LinguaAI Features" },
      { property: "og:description", content: "The complete AI English learning toolkit." },
    ],
  }),
  component: Features,
});

const FEATURES = [
  { icon: Brain, title: "AI Personal Tutor", desc: "A ChatGPT-style tutor that knows English inside out. Explanations, corrections, exercises." },
  { icon: Mic, title: "Speaking & Pronunciation", desc: "Record yourself. Get fluency and accent scores instantly." },
  { icon: BookOpen, title: "A1 → C2 Courses", desc: "CEFR-aligned lessons, videos, quizzes, and certificates." },
  { icon: PenLine, title: "Writing Assistant", desc: "AI grades essays, suggests better vocabulary, and fixes grammar." },
  { icon: Headphones, title: "Listening Library", desc: "Podcasts, conversations, movies — with comprehension checks." },
  { icon: ScrollText, title: "Reading Practice", desc: "Articles at every level with instant word lookup." },
  { icon: Target, title: "Quizzes & Drills", desc: "Multiple-choice, fill-in-the-blank, drag & drop, match, and more." },
  { icon: Trophy, title: "IELTS / TOEFL Mock Exams", desc: "Full mock exams with timer, scoring, and AI feedback." },
  { icon: Globe, title: "Translator (100+ languages)", desc: "Understand and be understood, in any language." },
  { icon: MessageCircle, title: "Grammar Center", desc: "Every rule, every tense, every exception — explained clearly." },
  { icon: Users, title: "Community", desc: "Ask questions, share notes, and follow inspiring learners." },
  { icon: Award, title: "Gamification", desc: "XP, streaks, badges, leaderboards. Learning that hooks you." },
];

function Features() {
  return (
    <MarketingPageShell eyebrow="Features" title="Everything you need to master English" subtitle="Twelve powerful modules, one beautiful platform.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-3xl border bg-card p-6 shadow-card">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand text-white shadow-glow">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </MarketingPageShell>
  );
}
