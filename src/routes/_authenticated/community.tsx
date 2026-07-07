import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/community")({
  component: CommunityPage,
});

function CommunityPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const qc = useQueryClient();

  const posts = useQuery({
    queryKey: ["community_posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("community_posts")
        .select("*, profiles(display_name)")
        .order("created_at", { ascending: false })
        .limit(30);
      return data ?? [];
    },
  });

  const submit = async () => {
    if (!title.trim() || !body.trim()) return toast.error("Please add a title and body");
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("community_posts").insert({ user_id: u.user.id, title, body });
    if (error) return toast.error(error.message);
    setTitle(""); setBody("");
    qc.invalidateQueries({ queryKey: ["community_posts"] });
    toast.success("Posted!");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Community</h1>
        <p className="mt-1 text-muted-foreground">Ask questions, share wins, help other learners.</p>
      </header>

      <Card>
        <CardHeader><CardTitle className="text-base">Start a discussion</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Share your thoughts…" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={submit} className="gradient-brand text-white">Post</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {(posts.data ?? []).map((p) => {
          const author = (p as { profiles?: { display_name?: string | null } }).profiles;
          return (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{p.title}</CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date(p.created_at as string).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">by {author?.display_name ?? "Anonymous"}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{p.body}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{p.likes ?? 0}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> Reply</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {posts.data?.length === 0 && (
          <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No posts yet — be the first!
          </p>
        )}
      </div>
    </div>
  );
}
