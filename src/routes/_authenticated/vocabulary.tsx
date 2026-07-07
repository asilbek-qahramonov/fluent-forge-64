import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookMarked, Sparkles, RotateCw, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/vocabulary")({
  component: VocabPage,
});

function VocabPage() {
  const words = useQuery({
    queryKey: ["vocabulary"],
    queryFn: async () => {
      const { data } = await supabase.from("vocabulary").select("*").limit(200);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Vocabulary</h1>
        <p className="mt-1 text-muted-foreground">Learn, review and master new words with spaced repetition.</p>
      </header>

      <Tabs defaultValue="flashcards">
        <TabsList>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="dictionary">Dictionary</TabsTrigger>
          <TabsTrigger value="mine">My words</TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards">
          <Flashcards words={words.data ?? []} />
        </TabsContent>

        <TabsContent value="dictionary">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(words.data ?? []).map((w) => (
              <Card key={w.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{w.word}</CardTitle>
                    <Badge variant="secondary">{w.level ?? "A1"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{w.part_of_speech} · {w.pronunciation}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{w.definition}</p>
                  {w.example && <p className="mt-2 text-xs italic text-muted-foreground">"{w.example}"</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mine">
          <MyWords />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Flashcards({ words }: { words: Array<{ id: string; word: string; definition: string; example?: string | null }> }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const deck = useMemo(() => words.slice(0, 20), [words]);
  const current = deck[i];
  if (!current)
    return <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">No words available yet.</div>;

  const next = () => { setFlipped(false); setI((n) => (n + 1) % deck.length); };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="text-center text-xs text-muted-foreground">{i + 1} / {deck.length}</div>
      <div className="relative h-72 cursor-pointer perspective" onClick={() => setFlipped((f) => !f)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + (flipped ? "b" : "f")}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border bg-card p-8 text-center shadow-card"
          >
            {!flipped ? (
              <>
                <BookMarked className="mb-3 h-6 w-6 text-muted-foreground" />
                <h2 className="font-display text-4xl font-bold">{current.word}</h2>
                <p className="mt-2 text-xs text-muted-foreground">Tap to reveal</p>
              </>
            ) : (
              <>
                <Sparkles className="mb-3 h-6 w-6 text-primary" />
                <p className="text-lg">{current.definition}</p>
                {current.example && <p className="mt-3 text-sm italic text-muted-foreground">"{current.example}"</p>}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={next}><RotateCw className="mr-2 h-4 w-4" />Skip</Button>
        <Button onClick={next} className="gradient-brand text-white">Got it <ChevronRight className="ml-1 h-4 w-4" /></Button>
      </div>
    </div>
  );
}

function MyWords() {
  const mine = useQuery({
    queryKey: ["user_vocabulary"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase.from("user_vocabulary").select("*, vocabulary(*)").eq("user_id", u.user.id);
      return data ?? [];
    },
  });

  if (!mine.data?.length)
    return <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">You haven't saved any words yet.</div>;

  return (
    <div className="space-y-2">
      {mine.data.map((row) => {
        const v = (row as { vocabulary?: { word?: string; definition?: string } }).vocabulary;
        return (
          <div key={(row as { id: string }).id} className="rounded-xl border bg-card p-4">
            <p className="font-semibold">{v?.word}</p>
            <p className="text-sm text-muted-foreground">{v?.definition}</p>
          </div>
        );
      })}
    </div>
  );
}
