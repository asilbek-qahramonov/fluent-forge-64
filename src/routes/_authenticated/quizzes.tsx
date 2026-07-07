import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, BookOpen, BookMarked, Headphones, ScrollText, PenLine } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/quizzes")({
  component: QuizzesPage,
});

const CATEGORIES = [
  { key: "grammar", label: "Grammar", icon: BookOpen, grad: "gradient-brand", count: 42 },
  { key: "vocabulary", label: "Vocabulary", icon: BookMarked, grad: "gradient-warm", count: 68 },
  { key: "listening", label: "Listening", icon: Headphones, grad: "bg-success", count: 24 },
  { key: "reading", label: "Reading", icon: ScrollText, grad: "bg-warning", count: 31 },
  { key: "writing", label: "Writing", icon: PenLine, grad: "gradient-brand", count: 12 },
];

function QuizzesPage() {
  const attempts = useQuery({
    queryKey: ["quiz_attempts"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("user_id", u.user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Quizzes</h1>
        <p className="mt-1 text-muted-foreground">Test what you've learned. Short, focused, and adaptive.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Card key={c.key} className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.grad} text-white`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary">{c.count} quizzes</Badge>
              </div>
              <CardTitle className="mt-3 text-lg">{c.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full"><Target className="mr-2 h-4 w-4" /> Start random quiz</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Recent attempts</h2>
        <div className="space-y-2">
          {(attempts.data ?? []).map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border bg-card p-4">
              <div>
                <p className="text-sm font-medium capitalize">{a.category}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(a.created_at as string).toLocaleString()}
                </p>
              </div>
              <Badge>{a.score}/{a.total}</Badge>
            </div>
          ))}
          {attempts.data?.length === 0 && (
            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              Take your first quiz above.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
