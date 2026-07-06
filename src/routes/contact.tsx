import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageSquare, Send } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing-page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LinguaAI" },
      { name: "description", content: "Get in touch with the LinguaAI team." },
      { property: "og:title", content: "Contact LinguaAI" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <MarketingPageShell eyebrow="Contact" title="Let's talk." subtitle="Questions, feedback, partnerships — we read every message.">
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-sm text-muted-foreground">hello@linguaai.example</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-warm text-white">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Community</p>
              <p className="text-sm text-muted-foreground">Join our Discord — 12k members.</p>
            </div>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent! We'll get back within 24h.");
            setSent(true);
          }}
          className="space-y-4 rounded-3xl border bg-card p-6 shadow-card"
        >
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input required />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" required />
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea rows={5} required />
          </div>
          <Button type="submit" disabled={sent} className="w-full gradient-brand text-white">
            <Send className="mr-1 h-4 w-4" /> {sent ? "Sent" : "Send message"}
          </Button>
        </form>
      </div>
    </MarketingPageShell>
  );
}
