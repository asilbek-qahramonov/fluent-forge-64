import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import {
  Flame,
  Trophy,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  BookOpen,
  Mic,
  Headphones,
  PenLine,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [name, setName] = useState("Learner");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: p } = await supabase.from("profiles").select("display_name").eq("id", data.user.id).maybeSingle();
      setName(p?.display_name ?? data.user.email?.split("@")[0] ?? "Learner");
    });
  }, []);

  const stats = useQuery({
    queryKey: ["user_stats"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("user_stats").select("*").eq("user_id", u.user.id).maybeSingle();
      return data;
    },
  });

  const leaderboard = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_stats")
        .select("user_id, xp, level, profiles!inner(display_name, avatar_url)")
        .order("xp", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const s = stats.data;
  const skillData = [
    { skill: "Grammar", value: s?.score_grammar ?? 40 },
    { skill: "Vocab", value: s?.score_vocabulary ?? 55 },
    { skill: "Speaking", value: s?.score_speaking ?? 30 },
    { skill: "Listening", value: s?.score_listening ?? 45 },
    { skill: "Reading", value: s?.score_reading ?? 60 },
    { skill: "Writing", value: s?.score_writing ?? 35 },
  ];
  const weekly = [
    { day: "Mon", xp: 120 }, { day: "Tue", xp: 90 }, { day: "Wed", xp: 180 },
    { day: "Thu", xp: 60 }, { day: "Fri", xp: 220 }, { day: "Sat", xp: 150 }, { day: "Sun", xp: 200 },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">
          Welcome back, <span className="text-gradient">{name}</span> 👋
        </h1>
        <p className="mt-1 text-muted-foreground">Ready to level up your English today?</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Daily streak" value={`${s?.streak_days ?? 0} days`} icon={Flame} gradient="gradient-warm" />
        <StatCard label="XP earned" value={(s?.xp ?? 0).toLocaleString()} icon={Trophy} gradient="gradient-brand" />
        <StatCard label="Level" value={s?.level ?? 1} icon={Zap} gradient="bg-success" />
        <StatCard label="Coins" value={s?.coins ?? 0} icon={Target} gradient="bg-warning" />
      </div>

      {/* Weekly goal */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Weekly goal</CardTitle>
            <Badge variant="secondary">
              {s?.weekly_progress_minutes ?? 0} / {s?.weekly_goal_minutes ?? 60} min
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress
            value={((s?.weekly_progress_minutes ?? 0) / (s?.weekly_goal_minutes ?? 60)) * 100}
            className="h-3"
          />
          <p className="mt-2 text-xs text-muted-foreground">Keep going — you're doing great!</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Skill radar */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Skill balance</CardTitle></CardHeader>
          <CardContent className="pl-0">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Radar dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly bar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">XP this week</CardTitle>
              <span className="flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3.5 w-3.5" /> +18% vs last week
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="xp" radius={[8, 8, 0, 0]} fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Continue learning */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Continue learning</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/courses">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: "/tutor", title: "Chat with your AI tutor", desc: "Ask anything, in any language.", icon: Sparkles, grad: "gradient-brand" },
            { to: "/grammar", title: "Master Present Perfect", desc: "10-min interactive lesson.", icon: BookOpen, grad: "gradient-warm" },
            { to: "/speaking", title: "Speaking challenge: café order", desc: "AI will score your fluency.", icon: Mic, grad: "bg-success" },
            { to: "/listening", title: "Podcast: modern startups", desc: "5 comprehension questions.", icon: Headphones, grad: "bg-warning" },
            { to: "/writing", title: "Write about your weekend", desc: "AI will grade your essay.", icon: PenLine, grad: "gradient-brand" },
            { to: "/vocabulary", title: "12 new words for today", desc: "Spaced repetition ready.", icon: BookOpen, grad: "gradient-warm" },
          ].map((c, i) => (
            <motion.div
              key={c.to + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={c.to} className="group block rounded-2xl border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.grad} text-white`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-display font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Leaderboard — this week</CardTitle>
          <Button asChild variant="ghost" size="sm"><Link to="/gamification">See all</Link></Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {(leaderboard.data ?? []).map((row, i) => {
            const p = (row as { profiles?: { display_name?: string | null } }).profiles;
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{p?.display_name ?? "Anonymous learner"}</p>
                  <p className="text-xs text-muted-foreground">Level {row.level}</p>
                </div>
                <Badge variant="secondary">{row.xp.toLocaleString()} XP</Badge>
              </div>
            );
          })}
          {leaderboard.data?.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Be the first on the leaderboard!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string | number;
  icon: typeof Trophy;
  gradient: string;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${gradient} text-white`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
