import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, BookOpen, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data: r } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!r) throw redirect({ to: "/dashboard" });
  },
  component: AdminPage,
});

function AdminPage() {
  const counts = useQuery({
    queryKey: ["admin_counts"],
    queryFn: async () => {
      const [users, courses, posts] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("community_posts").select("id", { count: "exact", head: true }),
      ]);
      return {
        users: users.count ?? 0,
        courses: courses.count ?? 0,
        posts: posts.count ?? 0,
      };
    },
  });

  const stats = [
    { label: "Users", value: counts.data?.users ?? 0, icon: Users },
    { label: "Courses", value: counts.data?.courses ?? 0, icon: BookOpen },
    { label: "Community posts", value: counts.data?.posts ?? 0, icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-display text-3xl font-bold">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Platform overview and moderation.</p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-bold">{s.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
