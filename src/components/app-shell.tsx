import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  GraduationCap,
  BookMarked,
  Mic,
  Headphones,
  ScrollText,
  PenLine,
  Trophy,
  Target,
  Users,
  Award,
  Calendar,
  StickyNote,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Shield,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/lib/logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Item = { to: string; label: string; icon: typeof LayoutDashboard };

const MAIN: Item[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tutor", label: "AI Tutor", icon: Sparkles },
  { to: "/courses", label: "Courses", icon: GraduationCap },
  { to: "/grammar", label: "Grammar", icon: BookOpen },
  { to: "/vocabulary", label: "Vocabulary", icon: BookMarked },
];
const PRACTICE: Item[] = [
  { to: "/speaking", label: "Speaking", icon: Mic },
  { to: "/listening", label: "Listening", icon: Headphones },
  { to: "/reading", label: "Reading", icon: ScrollText },
  { to: "/writing", label: "Writing", icon: PenLine },
];
const EXAMS: Item[] = [
  { to: "/quizzes", label: "Quizzes", icon: Target },
  { to: "/exams", label: "Mock Exams", icon: Trophy },
];
const SOCIAL: Item[] = [
  { to: "/community", label: "Community", icon: Users },
  { to: "/gamification", label: "Achievements", icon: Award },
];
const PERSONAL: Item[] = [
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-sidebar text-sidebar-foreground lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-sidebar lg:hidden"
            >
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <TopBar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/dashboard" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <NavSection label="Learn" items={MAIN} onNavigate={onNavigate} />
        <NavSection label="Practice" items={PRACTICE} onNavigate={onNavigate} />
        <NavSection label="Assessments" items={EXAMS} onNavigate={onNavigate} />
        <NavSection label="Community" items={SOCIAL} onNavigate={onNavigate} />
        <NavSection label="Personal" items={PERSONAL} onNavigate={onNavigate} />
      </nav>
      <div className="border-t p-3">
        <Link
          to="/pricing"
          onClick={onNavigate}
          className="block rounded-2xl gradient-brand p-4 text-white shadow-glow transition-transform hover:scale-[1.02]"
        >
          <p className="font-display text-sm font-semibold">Upgrade to Pro</p>
          <p className="mt-0.5 text-xs opacity-90">Unlock everything.</p>
        </Link>
      </div>
    </div>
  );
}

function NavSection({ label, items, onNavigate }: { label: string; items: Item[]; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div>
      <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button className="lg:hidden" onClick={onMenu}>
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search lessons, words, topics…" className="pl-9" />
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function NotificationBell() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-3 py-8 text-center text-sm text-muted-foreground">
          You're all caught up. 🎉
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      if (data.user)
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle()
          .then(({ data: r }) => setIsAdmin(!!r));
    });
  }, []);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  const initial = email?.[0]?.toUpperCase() ?? "?";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="gradient-brand text-xs font-semibold text-white">{initial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin"><Shield className="mr-2 h-4 w-4" /> Admin</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
