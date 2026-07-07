import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PenLine, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/writing")({
  component: WritingPage,
});

const PROMPTS = [
  "Describe your favorite city and why you love it.",
  "Discuss the pros and cons of studying abroad.",
  "Write a formal email requesting time off from work.",
  "Argue whether social media does more good than harm.",
];

function WritingPage() {
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();

  const submissions = useQuery({
    queryKey: ["writing_submissions"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase
        .from("writing_submissions")
        .select("*")
        .eq("user_id", u.user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  const submit = async () => {
    if (text.trim().length < 20) return toast.error("Write at least a few sentences");
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setBusy(false); return; }
    const { error } = await supabase.from("writing_submissions").insert({
      user_id: u.user.id,
      prompt,
      text,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Submitted — AI feedback will follow");
    setText("");
    qc.invalidateQueries({ queryKey: ["writing_submissions"] });
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Writing</h1>
        <p className="mt-1 text-muted-foreground">Get instant grammar, style and vocabulary feedback on your writing.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PenLine className="h-4 w-4" /> Essay editor</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{prompt}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start writing…"
              className="min-h-[280px] resize-y"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{wordCount} words</span>
              <Button onClick={submit} disabled={busy} className="gradient-brand text-white">
                <Sparkles className="mr-2 h-4 w-4" /> {busy ? "Submitting…" : "Submit for AI review"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Prompts</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  className={`w-full rounded-xl border p-3 text-left text-sm transition-colors hover:bg-muted ${
                    p === prompt ? "border-primary" : ""
                  }`}
                >
                  {p}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Your submissions</h2>
        <div className="space-y-2">
          {(submissions.data ?? []).map((s) => (
            <div key={s.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{s.prompt}</p>
                <Badge variant={s.score ? "default" : "secondary"}>{s.score ? `${s.score}/100` : "Pending"}</Badge>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
          {submissions.data?.length === 0 && (
            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              No submissions yet — write your first essay above.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
