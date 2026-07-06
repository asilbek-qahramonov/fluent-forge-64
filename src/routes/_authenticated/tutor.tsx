import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, Loader2, User, Trash2, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/tutor")({
  component: Tutor,
});

const SUGGESTIONS = [
  "Explain the difference between 'been' and 'gone'.",
  "Give me 5 idioms about time with examples.",
  "Correct my sentence: 'I am agree with you'.",
  "Quiz me on the present perfect tense.",
];

function Tutor() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport,
    onError: (e) => console.error(e),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = async (text: string) => {
    const value = text.trim();
    if (!value || status === "streaming" || status === "submitted") return;
    setInput("");
    await sendMessage({ text: value });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
            <Sparkles className="h-6 w-6 text-primary" />
            AI English Tutor
          </h1>
          <p className="text-sm text-muted-foreground">Ask anything. Get instant feedback.</p>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
            <Trash2 className="mr-1 h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <EmptyState onPick={submit} />
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {(status === "submitted" || status === "streaming") &&
                messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-brand text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="animate-pulse">Thinking</span>
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="mx-auto flex max-w-3xl items-end gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask me anything about English…"
              rows={1}
              className="min-h-[52px] resize-none rounded-2xl"
              autoFocus
            />
            {status === "streaming" ? (
              <Button type="button" size="icon" variant="destructive" onClick={() => stop()} className="h-[52px] w-[52px] rounded-2xl">
                <StopCircle className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || status === "submitted"}
                className="h-[52px] w-[52px] rounded-2xl gradient-brand text-white"
              >
                {status === "submitted" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            )}
          </form>
        </div>
      </Card>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl gradient-brand shadow-glow">
        <Sparkles className="h-8 w-8 text-white" />
      </div>
      <h2 className="mt-6 font-display text-2xl font-bold">How can I help you today?</h2>
      <p className="mt-2 text-muted-foreground">Try one of these, or ask your own question:</p>
      <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-xl border bg-card p-4 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-card"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-muted" : "gradient-brand text-white"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-1 overflow-hidden">
        <p className="text-xs font-semibold text-muted-foreground">{isUser ? "You" : "LinguaAI"}</p>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
          {text}
        </div>
      </div>
    </motion.div>
  );
}
