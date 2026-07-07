import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Mic, Square, Play, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/speaking")({
  component: SpeakingPage,
});

const PROMPTS = [
  { level: "A2", text: "Describe your morning routine in 30 seconds." },
  { level: "B1", text: "Talk about a hobby you enjoy and why." },
  { level: "B2", text: "Explain the pros and cons of remote work." },
  { level: "C1", text: "Argue whether AI will help or hurt language learning." },
];

function SpeakingPage() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      setRecording(true);
    } catch {
      toast.error("Microphone permission denied");
    }
  };

  const stop = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Speaking</h1>
        <p className="mt-1 text-muted-foreground">Practice pronunciation and fluency with AI feedback.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's prompt</CardTitle>
              <Badge variant="secondary">{prompt.level}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{prompt.text}</p>

            <div className="flex flex-col items-center gap-4 rounded-3xl border bg-muted/30 p-10">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={recording ? stop : start}
                className={`flex h-24 w-24 items-center justify-center rounded-full text-white shadow-glow transition-all ${
                  recording ? "bg-destructive animate-pulse" : "gradient-brand"
                }`}
              >
                {recording ? <Square className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
              </motion.button>
              <p className="text-sm text-muted-foreground">
                {recording ? "Recording… tap to stop" : "Tap to record your answer"}
              </p>
              {audioUrl && (
                <div className="w-full">
                  <audio controls src={audioUrl} className="w-full" />
                  <Button className="mt-3 w-full gradient-brand text-white" onClick={() => toast.info("AI scoring coming soon")}>
                    <Sparkles className="mr-2 h-4 w-4" /> Get AI feedback
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Try another</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {PROMPTS.map((p) => (
              <button
                key={p.text}
                onClick={() => { setPrompt(p); setAudioUrl(null); }}
                className="flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted"
              >
                <Play className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <Badge variant="outline" className="mb-1 text-[10px]">{p.level}</Badge>
                  <p className="text-sm">{p.text}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
