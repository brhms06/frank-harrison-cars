"use client";
import { useActionState } from "react";
import { submitContact, type EnquiryState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSubjects } from "@/lib/contact";

export function ContactForm() {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitContact, {});
  if (state.ok) return <p role="status" className="rounded-xl bg-brand-soft p-6 text-sm">Thanks for your message. We typically respond within 1 business day.</p>;
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5"><Label htmlFor="name">Your name <span className="text-red-600">*</span></Label><Input id="name" name="name" placeholder="First and last name" required autoComplete="name" className="h-11 bg-neutral-50" /></div>
      <div className="space-y-1.5"><Label htmlFor="email">Email address <span className="text-red-600">*</span></Label><Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" className="h-11 bg-neutral-50" /></div>
      <div className="space-y-1.5"><Label htmlFor="phone">Phone (optional)</Label><Input id="phone" name="phone" type="tel" autoComplete="tel" className="h-11 bg-neutral-50" /></div>
      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject <span className="text-red-600">*</span></Label>
        <select id="subject" name="subject" required defaultValue="" className="h-11 w-full rounded-md border bg-neutral-50 px-3 text-sm">
          <option value="" disabled>Select a topic</option>
          {contactSubjects.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="space-y-1.5"><Label htmlFor="message">Message <span className="text-red-600">*</span></Label><Textarea id="message" name="message" rows={6} placeholder="Tell us how we can help…" required className="bg-neutral-50" /></div>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="h-12 w-full rounded-full">{pending ? "Sending…" : "Send message →"}</Button>
      <p className="text-xs text-neutral-500">We&apos;ll only use your details to respond to your enquiry.</p>
    </form>
  );
}
