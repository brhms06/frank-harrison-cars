"use client";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { removeMaster } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";

export function RemoveMasterForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(removeMaster, {});
  useEffect(() => {
    if (!state.ok) return;
    authClient.signOut().catch(() => {}).finally(() => { router.push("/superadmin/login"); router.refresh(); });
  }, [state, router]);
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5"><Label htmlFor="rmPassword">Your master password</Label><Input id="rmPassword" name="masterPassword" type="password" required autoComplete="current-password" /></div>
      <div className="space-y-1.5"><Label htmlFor="rmConfirm">Type REMOVE to confirm</Label><Input id="rmConfirm" name="confirm" required autoComplete="off" /></div>
      {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
      {state.ok && <p role="status" className="text-sm text-green-700">Master removed. Signing you out…</p>}
      <Button type="submit" variant="destructive" disabled={pending}>{pending ? "Removing…" : "Remove my master access"}</Button>
    </form>
  );
}
