import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingPageShell } from "@/components/marketing-page-shell";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — LinguaAI" },
      { name: "description", content: "Language tips, study strategies, and the science of learning." },
      { property: "og:title", content: "LinguaAI Blog" },
      { property: "og:description", content: "Ideas for smarter English learning." },
    ],
  }),
  component: Blog,
});

const POSTS = [
  { title: "The science behind spaced repetition", tag: "Study tips", excerpt: "Why 15 minutes a day beats 3 hours a week." },
  { title: "10 idioms every business English learner needs", tag: "Vocabulary", excerpt: "From 'ballpark figure' to 'back to the drawing board'." },
  { title: "How to pass IELTS Writing Task 2", tag: "Exams", excerpt: "The exact structure that scores band 8+." },
  { title: "The truth about accent reduction", tag: "Speaking", excerpt: "Why fluency beats accent every time." },
];

function Blog() {
  return (
    <MarketingPageShell eyebrow="Blog" title="Learn smarter, not harder." subtitle="Insights from teachers, researchers, and top learners.">
      <div className="grid gap-6 sm:grid-cols-2">
        {POSTS.map((p) => (
          <Link key={p.title} to="/blog" className="rounded-3xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
            <Badge variant="secondary" className="mb-3">{p.tag}</Badge>
            <h3 className="font-display text-xl font-bold">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </MarketingPageShell>
  );
}
