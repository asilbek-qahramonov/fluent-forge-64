import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setEmail(u.user.email ?? "");
      const { data: p } = await supabase
        .from("profiles")
        .select("display_name, bio, native_language")
        .eq("id", u.user.id)
        .maybeSingle();
      if (p) {
        setDisplayName(p.display_name ?? "");
        setBio(p.bio ?? "");
        setNativeLanguage(p.native_language ?? "");
      }
    })();
  }, []);

  const save = async () => {
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("profiles").update({
      display_name: displayName,
      bio,
      native_language: nativeLanguage,
    }).eq("id", u.user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your profile and account preferences.</p>
      </header>

      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>
          <div className="grid gap-2">
            <Label>Display name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Native language</Label>
            <Input value={nativeLanguage} onChange={(e) => setNativeLanguage(e.target.value)} placeholder="e.g. Uzbek" />
          </div>
          <div className="grid gap-2">
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself…" />
          </div>
          <Button onClick={save} disabled={busy} className="gradient-brand text-white">
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            onClick={async () => {
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
              });
              if (error) toast.error(error.message);
              else toast.success("Password reset email sent");
            }}
          >
            Change password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
