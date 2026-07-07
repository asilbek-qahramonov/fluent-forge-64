import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/exams")({
  component: ExamsPage,
});

const EXAMS = [
  { title: "IELTS Academic — Full Mock", duration: 165, sections: 4, level: "B2–C2", grad: "gradient-brand" },
  { title: "TOEFL iBT — Full Mock", duration: 180, sections: 4, level: "B2–C2", grad: "gradient-warm" },
  { title: "CEFR Placement Test", duration: 30, sections: 3, level: "A1–C2", grad: "bg-success" },
  { title: "Cambridge FCE Practice", duration: 140, sections: 4, level: "B2", grad: "bg-warning" },
  { title: "Business English Assessment", duration: 45, sections: 3, level: "B1–C1", grad: "gradient-brand" },
  { title: "Speaking Only — 15 min", duration: 15, sections: 1, level: "Any", grad: "gradient-warm" },
];

function ExamsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Mock Exams</h1>
        <p className="mt-1 text-muted-foreground">Full-length IELTS / TOEFL simulations with band-score feedback.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {EXAMS.map((e) => (
          <Card key={e.title} className="overflow-hidden">
            <div className={`flex h-28 items-center justify-center ${e.grad}`}>
              <Trophy className="h-10 w-10 text-white/90" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Badge variant="secondary">{e.level}</Badge>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{e.duration} min</span>
              </div>
              <CardTitle className="mt-2 text-base">{e.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{e.sections} sections · Detailed AI scoring</p>
              <Button className="w-full">Start exam <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
