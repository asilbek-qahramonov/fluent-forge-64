import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Flame, Trophy, Zap, Star, Target, BookOpen, Crown } from "lucide-react";

export const Route = createFileRoute("/_authenticated/gamification")({
  component: GamificationPage,
});

const BADGES = [
  { name: "First steps", desc: "Complete your first lesson", icon: Star, unlocked: true },
  { name: "Week warrior", desc: "7-day streak", icon: Flame, unlocked: true },
  { name: "Word hoarder", desc: "Learn 100 words", icon: BookOpen, unlocked: true },
  { name: "Marathon", desc: "30-day streak", icon: Trophy, unlocked: false },
  { name: "Perfectionist", desc: "Score 100% on 10 quizzes", icon: Target, unlocked: false },
  { name: "Polyglot", desc: "Reach C1 level", icon: Crown, unlocked: false },
];

function GamificationPage() {
  const board = useQuery({
    queryKey: ["leaderboard_full"],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_stats")
        .select("user_id, xp, level, streak_days, profiles!inner(display_name)")
        .order("xp", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Achievements</h1>
        <p className="mt-1 text-muted-foreground">Earn XP, unlock badges, and climb the leaderboard.</p>
      </header>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Badges</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((b) => (
            <Card key={b.name} className={b.unlocked ? "" : "opacity-60"}>
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    b.unlocked ? "gradient-brand text-white shadow-glow" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <b.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display font-semibold">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
                {b.unlocked && <Badge className="ml-auto" variant="secondary">Unlocked</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4" /> Global leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(board.data ?? []).map((row, i) => {
            const p = (row as { profiles?: { display_name?: string | null } }).profiles;
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  i === 0 ? "gradient-warm text-white" : i < 3 ? "bg-warning text-white" : "bg-muted"
                }`}>
                  {i + 1}
                </div>
                <p className="flex-1 text-sm font-medium">{p?.display_name ?? "Anonymous"}</p>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Flame className="h-3 w-3" />{row.streak_days ?? 0}d</span>
                <Badge variant="secondary"><Zap className="mr-1 h-3 w-3" />{row.xp?.toLocaleString()} XP</Badge>
              </div>
            );
          })}
          {board.data?.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">The leaderboard is warming up.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
