import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/grammar")({
  component: GrammarPage,
});

function GrammarPage() {
  const [q, setQ] = useState("");
  const topics = useQuery({
    queryKey: ["grammar_topics"],
    queryFn: async () => {
      const { data } = await supabase.from("grammar_topics").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const filtered = (topics.data ?? []).filter((t) =>
    t.title.toLowerCase().includes(q.toLowerCase()) || (t.category ?? "").toLowerCase().includes(q.toLowerCase()),
  );
  const categories = Array.from(new Set(filtered.map((t) => t.category ?? "General")));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Grammar</h1>
          <p className="mt-1 text-muted-foreground">Bite-sized explanations. From tenses to conditionals.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search topics…" className="pl-9" />
        </div>
      </header>

      {categories.map((cat) => (
        <section key={cat}>
          <h2 className="mb-3 font-display text-lg font-semibold">{cat}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.filter((t) => (t.category ?? "General") === cat).map((t) => (
              <Card key={t.id} className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-glow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-brand text-white">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary">{t.level}</Badge>
                  </div>
                  <CardTitle className="mt-2 text-base">{t.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{t.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No topics match your search.
        </div>
      )}
    </div>
  );
}
