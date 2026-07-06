import { createFileRoute } from "@tanstack/react-router";
import { MarketingPageShell } from "@/components/marketing-page-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LinguaAI" },
      { name: "description", content: "Our mission is to make world-class English learning accessible to everyone." },
      { property: "og:title", content: "About LinguaAI" },
      { property: "og:description", content: "Meet the team building the future of language learning." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <MarketingPageShell eyebrow="Our story" title="Language learning, reimagined." subtitle="We believe great teaching should be personal, patient, and always available.">
      <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>
          LinguaAI started with a simple question: <em>what if every English learner had access to a world-class personal tutor?</em>
          Today, powered by cutting-edge AI, that vision is real.
        </p>
        <p>
          Our team combines expert language educators, AI researchers, and product designers. Together, we're building the
          most delightful and effective English learning platform on the internet.
        </p>
        <p>
          We measure success not by hours logged, but by real-world confidence — the interview aced, the essay accepted,
          the friendship made. Welcome to LinguaAI.
        </p>
      </div>
    </MarketingPageShell>
  );
}
