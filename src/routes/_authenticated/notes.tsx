import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StickyNote, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notes")({
  component: NotesPage,
});

function NotesPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const qc = useQueryClient();

  const notes = useQuery({
    queryKey: ["user_notes"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase
        .from("user_notes")
        .select("*")
        .eq("user_id", u.user.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

    const add = async () => {
    if (!title.trim() && !body.trim()) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("user_notes").insert({
      user_id: u.user.id,
      title: title || "Untitled",
      content: body,
    });
    if (error) return toast.error(error.message);
    setTitle(""); setBody("");
    qc.invalidateQueries({ queryKey: ["user_notes"] });
  };

  const remove = async (id: string) => {
    await supabase.from("user_notes").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["user_notes"] });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Notes</h1>
        <p className="mt-1 text-muted-foreground">Capture vocabulary, grammar rules, and study reminders.</p>
      </header>

      <Card>
        <CardHeader><CardTitle className="text-base">New note</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Write your note…" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={add} className="gradient-brand text-white">Save note</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(notes.data ?? []).map((n) => (
          <Card key={n.id} className="group">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-warning" />
                  <CardTitle className="text-base">{n.title}</CardTitle>
                </div>
                <button onClick={() => remove(n.id)} className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{n.content}</p>
            </CardContent>
          </Card>
        ))}
        {notes.data?.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No notes yet — jot your first thought above.
          </p>
        )}
      </div>
    </div>
  );
}
