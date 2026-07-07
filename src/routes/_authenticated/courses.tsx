import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, PlayCircle, Clock, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/courses")({
  component: CoursesPage,
});

function CoursesPage() {
  const courses = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const lessons = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const { data } = await supabase.from("lessons").select("*").order("sort_order");
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Courses</h1>
        <p className="mt-1 text-muted-foreground">Structured A1 → C2 learning paths built by teachers and refined by AI.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(courses.data ?? []).map((c) => {
          const total = (lessons.data ?? []).filter((l) => l.course_id === c.id).length;
          return (
            <Card key={c.id} className="overflow-hidden">
              <div className={`h-24 ${c.cover_gradient || "gradient-brand"}`} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{c.level}</Badge>
                  <span className="text-xs text-muted-foreground">{total} lessons</span>
                </div>
                <CardTitle className="mt-2 text-lg">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{c.description}</p>
                <Progress value={Math.random() * 60} className="h-1.5" />
                <Button className="w-full" size="sm">
                  <PlayCircle className="mr-2 h-4 w-4" /> Continue
                </Button>
              </CardContent>
            </Card>
          );
        })}
        {courses.data?.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            <GraduationCap className="mx-auto mb-2 h-8 w-8" /> Courses will appear here as they're added.
          </div>
        )}
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Recent lessons</h2>
        <div className="space-y-2">
          {(lessons.data ?? []).slice(0, 8).map((l) => (
            <div key={l.id} className="flex items-center gap-4 rounded-xl border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand text-white">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{l.title}</p>
                <p className="truncate text-xs text-muted-foreground">{l.description}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{l.duration_minutes}m</span>
                <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{l.xp_reward} XP</span>
              </div>
              <Button size="sm" variant="outline">Start</Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
