"use client";
import { useState } from "react";
import { submitEnquiry } from "@/app/actions";
import { useMoney } from "@/components/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Channel = "whatsapp" | "sms" | "email";
export type EnquiryChannels = { whatsapp?: string; sms?: string; email?: string };

const digits = (n: string) => n.replace(/[^\d+]/g, "");
const labels: Record<Channel, string> = { whatsapp: "WhatsApp", sms: "Text message", email: "Email" };

/** Customer pays a down payment (or the full price); the details go to the dealer by the channel they pick. */
export function EnquiryForm({ carId, title, price, downPayment, percent, channels }: {
  carId: number; title: string; price: number; downPayment: number; percent: number; channels: EnquiryChannels;
}) {
  const money = useMoney();
  const available = (Object.keys(labels) as Channel[]).filter((c) => channels[c]);
  const [channel, setChannel] = useState<Channel | undefined>(available[0]);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!channel) return;
    const f = new FormData(e.currentTarget);
    const full = f.get("type") === "full-payment";
    f.set("email", String(f.get("email") ?? ""));
    setPending(true);
    setError("");
    const res = await submitEnquiry({}, f);
    setPending(false);
    if (res.error) return setError(res.error);

    const lines = [
      `Hello, I would like to ${full ? "pay the full price" : `make a down payment (${percent}%)`} for the ${title}.`,
      `Amount: ${money(full ? price : downPayment)}${full ? "" : ` (car price ${money(price)})`}`,
      `Name: ${f.get("name")}`,
      f.get("phone") && `Phone: ${f.get("phone")}`,
      f.get("email") && `Email: ${f.get("email")}`,
      f.get("message") && `Note: ${f.get("message")}`,
    ].filter(Boolean).join("\n");
    const body = encodeURIComponent(lines);
    const target = channels[channel]!;
    const url = channel === "whatsapp" ? `https://wa.me/${digits(target).replace("+", "")}?text=${body}`
      : channel === "sms" ? `sms:${digits(target)}?&body=${body}`
      : `mailto:${target}?subject=${encodeURIComponent(`${full ? "Payment" : "Down payment"} for ${title}`)}&body=${body}`;
    setLink(url);
    window.location.href = url;
  }

  if (link) {
    return (
      <p role="status" className="rounded-md bg-muted p-4 text-sm">
        Thanks! Your details are ready to send. If your {channel && labels[channel]} app did not open, <a href={link} className="font-medium underline">tap here</a>.
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="carId" value={carId} />
      <div className="space-y-1">
        <Label htmlFor="type">I&apos;d like to</Label>
        <select id="type" name="type" className="h-9 w-full rounded-md border bg-transparent px-3 text-sm">
          <option value="down-payment">Pay the down payment</option>
          <option value="full-payment">Pay the full price</option>
          <option value="enquiry">Ask a question first</option>
        </select>
      </div>
      <p className="rounded-md bg-brand-soft p-3 text-sm">Down payment ({percent}%): <strong>{money(downPayment)}</strong></p>
      <div className="space-y-1"><Label htmlFor="name">Name</Label><Input id="name" name="name" required autoComplete="name" /></div>
      <div className="space-y-1"><Label htmlFor="phone">Phone (optional)</Label><Input id="phone" name="phone" type="tel" autoComplete="tel" /></div>
      <div className="space-y-1"><Label htmlFor="email">Email (optional)</Label><Input id="email" name="email" type="email" autoComplete="email" /></div>
      <div className="space-y-1"><Label htmlFor="message">Message (optional)</Label><Textarea id="message" name="message" rows={3} /></div>
      {available.length ? (
        <fieldset className="space-y-1">
          <legend className="text-sm font-medium">Send my details by</legend>
          <div className="flex flex-wrap gap-2">
            {available.map((c) => (
              <label key={c} className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm ${channel === c ? "border-brand bg-brand text-white" : "bg-white"}`}>
                <input type="radio" name="channel" value={c} checked={channel === c} onChange={() => setChannel(c)} className="sr-only" />
                {labels[c]}
              </label>
            ))}
          </div>
        </fieldset>
      ) : <p className="text-sm text-neutral-500">Please contact us from the Contact page.</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={pending || !channel} className="w-full">{pending ? "Preparing…" : channel ? `Continue with ${labels[channel]}` : "Send"}</Button>
    </form>
  );
}
