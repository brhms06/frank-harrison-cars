"use client";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { changeAdminEmail } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

type State = { ok?: boolean; error?: string };

/** A form bound to a server action, with pending, error and saved states. */
export function ActionForm({ action, children, submit = "Save", resetOnSuccess = false, className = "space-y-4" }: {
  action: (prev: State, f: FormData) => Promise<State>;
  children: React.ReactNode;
  submit?: string;
  resetOnSuccess?: boolean;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.ok && resetOnSuccess) ref.current?.reset(); }, [state, resetOnSuccess]);
  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
      {state.ok && <p role="status" className="text-sm text-green-700">Saved.</p>}
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : submit}</Button>
    </form>
  );
}

/** An on/off switch that calls a server action as soon as it is flipped. */
export function Toggle({ checked, action, label }: { checked: boolean; action: (v: boolean) => Promise<void>; label: string }) {
  const [value, setValue] = useState(checked);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      disabled={pending}
      onClick={() => { const next = !value; setValue(next); start(async () => { await action(next); }); }}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${value ? "bg-[#34c759]" : "bg-neutral-300"}`}
    >
      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

/** Same switch, but a plain checkbox inside a form (submitted with the form). */
export function FormSwitch({ name, label, defaultChecked, hint }: { name: string; label: string; defaultChecked: boolean; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border bg-white p-4">
      <span><span className="block text-sm font-medium">{label}</span>{hint && <span className="text-xs text-neutral-500">{hint}</span>}</span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-neutral-300 transition-colors peer-checked:bg-[#34c759] peer-focus-visible:ring-2 peer-focus-visible:ring-[#34c759] peer-checked:[&>span]:left-[22px]">
        <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-all" />
      </span>
    </label>
  );
}

export function DeleteButton({ action, what }: { action: () => Promise<void>; what: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => { if (confirm(`Delete ${what}? This cannot be undone.`)) start(async () => { await action(); }); }}
      className="text-xs text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function LogoutButton({ to = "/admin/login" }: { to?: string }) {
  const router = useRouter();
  return (
    <button onClick={async () => { await authClient.signOut(); router.push(to); router.refresh(); }} className="text-sm text-neutral-300 hover:text-white">
      Sign out
    </button>
  );
}

const inputClass = "h-10 w-full rounded-md border bg-white px-3 text-sm";

/** Change login password and email through Neon Auth (Better Auth client). */
export function AccountForms({ email, emailEditable = true }: { email: string; emailEditable?: boolean }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<Record<string, { ok: boolean; text: string }>>({});
  const set = (k: string, ok: boolean, text: string) => setMsg((m) => ({ ...m, [k]: { ok, text } }));

  // the Neon auth client may throw or return { error }, so handle both
  const message = (e: unknown, fallback: string) => (e instanceof Error && e.message) || (typeof e === "object" && e && "message" in e && String((e as { message: unknown }).message)) || fallback;

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const next = String(f.get("next"));
    if (next.length < 8) return set("pw", false, "Use at least 8 characters.");
    if (next !== f.get("confirm")) return set("pw", false, "The new passwords do not match.");
    try {
      const { error } = await authClient.changePassword({ currentPassword: String(f.get("current")), newPassword: next, revokeOtherSessions: true });
      if (error) return set("pw", false, message(error, "Could not change the password."));
    } catch (err) {
      return set("pw", false, message(err, "Could not change the password. Check the current password."));
    }
    setPw("");
    form.reset();
    set("pw", true, "Password changed.");
  }

  async function changeEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await changeAdminEmail(new FormData(e.currentTarget));
    if (res.error) return set("email", false, res.error);
    set("email", true, "Email updated. Signing you out so you can log in with it…");
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {emailEditable && <form onSubmit={changeEmail} className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <h2 className="font-semibold">Login email</h2>
        <input name="email" type="email" required defaultValue={email} className={inputClass} aria-label="New email" />
        <input name="password" type="password" required autoComplete="current-password" placeholder="Current password (to confirm)" className={inputClass} />
        {msg.email && <p role="status" className={`text-sm ${msg.email.ok ? "text-green-700" : "text-destructive"}`}>{msg.email.text}</p>}
        <Button type="submit">Change email</Button>
      </form>}
      <form onSubmit={changePassword} className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <h2 className="font-semibold">Password</h2>
        <input name="current" type="password" required autoComplete="current-password" placeholder="Current password" className={inputClass} />
        <input name="next" type="password" required autoComplete="new-password" placeholder="New password (8+ characters)" value={pw} onChange={(e) => setPw(e.target.value)} className={inputClass} />
        <input name="confirm" type="password" required autoComplete="new-password" placeholder="Confirm new password" className={inputClass} />
        {msg.pw && <p role="status" className={`text-sm ${msg.pw.ok ? "text-green-700" : "text-destructive"}`}>{msg.pw.text}</p>}
        <Button type="submit">Change password</Button>
      </form>
    </div>
  );
}
