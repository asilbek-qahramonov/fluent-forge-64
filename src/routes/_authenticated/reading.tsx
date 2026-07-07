import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/reading")({
  component: ReadingPage,
});

const ARTICLES = [
  { title: "Why cities grow: a beginner's guide", level: "A2", minutes: 4, tag: "Society" },
  { title: "The science of sleep", level: "B1", minutes: 7, tag: "Health" },
  { title: "How LLMs learn to talk", level: "B2", minutes: 9, tag: "Tech" },
  { title: "Climate change and coffee", level: "B2", minutes: 6, tag: "Environment" },
  { title: "A brief history of the internet", level: "C1", minutes: 12, tag: "Tech" },
  { title: "On writing well", level: "C1", minutes: 10, tag: "Culture" },
];

function ReadingPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Reading</h1>
        <p className="mt-1 text-muted-foreground">Curated articles with vocab highlights and comprehension checks.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {ARTICLES.map((a) => (
          <Card key={a.title} className="transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <CardHeader>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-warm text-white">
                    <ScrollText className="h-4 w-4" />
                  </div>
                  <Badge variant="secondary">{a.tag}</Badge>
                </div>
                <span>{a.level} · {a.minutes} min read</span>
              </div>
              <CardTitle className="mt-3 text-lg">{a.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" size="sm">Read article <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
