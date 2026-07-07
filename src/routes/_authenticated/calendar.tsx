import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";

export const Route = createFileRoute("/_authenticated/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const [month, setMonth] = useState(new Date());
  const y = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const today = new Date();

  const cells: Array<number | null> = [
    ...Array(first).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Calendar</h1>
        <p className="mt-1 text-muted-foreground">Track your study streak and plan learning sessions.</p>
      </header>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">
            {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </CardTitle>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => setMonth(new Date(y, m - 1, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setMonth(new Date(y, m + 1, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {cells.map((d, i) => {
              const isToday =
                d && today.getDate() === d && today.getMonth() === m && today.getFullYear() === y;
              const active = d && d % 3 !== 0;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-xl border p-2 text-sm ${
                    !d ? "border-transparent" : isToday ? "border-primary bg-primary/10" : "bg-card"
                  }`}
                >
                  <div className="flex h-full flex-col justify-between">
                    <span className={isToday ? "font-bold text-primary" : ""}>{d}</span>
                    {active && d && <Flame className="ml-auto h-3 w-3 text-warning" />}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
