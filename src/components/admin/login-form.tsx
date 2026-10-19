"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";

export function LoginForm({ redirectTo = "/admin" }: { redirectTo?: string }) {
  const router = useRouter();
  const denied = useSearchParams().get("denied");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const { error } = await authClient.signIn.email({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) {
      setError("Wrong email or password.");
      setPending(false);
      return;
    }
    router.push(redirectTo); // the wrong kind of account is sent on by requireAdmin() / requireMaster()
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required autoComplete="username" /></div>
      <div className="space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required autoComplete="current-password" /></div>
      {denied && !error && <p role="status" className="text-sm text-neutral-600">You are signed in with an account that is not the super admin. Sign in below to switch.</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full">{pending ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}
