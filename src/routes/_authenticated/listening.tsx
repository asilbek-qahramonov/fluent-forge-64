import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Headphones, Play, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/listening")({
  component: ListeningPage,
});

const EPISODES = [
  { title: "Small talk at the airport", level: "A2", minutes: 5, desc: "Two travelers meet at the gate." },
  { title: "Ordering coffee like a local", level: "A2", minutes: 4, desc: "Cafe vocabulary and polite requests." },
  { title: "A short interview with a designer", level: "B1", minutes: 8, desc: "Talking about creative process." },
  { title: "News: renewable energy trends", level: "B2", minutes: 10, desc: "Follow arguments, take notes." },
  { title: "TED talk: the art of storytelling", level: "C1", minutes: 14, desc: "Advanced vocabulary and idioms." },
  { title: "Podcast: startups in 2026", level: "C1", minutes: 22, desc: "Business English deep dive." },
];

function ListeningPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Listening</h1>
        <p className="mt-1 text-muted-foreground">Podcasts, interviews and news — with transcripts and quizzes.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EPISODES.map((e) => (
          <Card key={e.title} className="group overflow-hidden">
            <div className="flex h-32 items-center justify-center gradient-brand">
              <Headphones className="h-10 w-10 text-white/90" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Badge variant="secondary">{e.level}</Badge>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{e.minutes} min</span>
              </div>
              <CardTitle className="mt-2 text-base">{e.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{e.desc}</p>
              <Button size="sm" className="w-full"><Play className="mr-2 h-4 w-4" /> Listen</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
