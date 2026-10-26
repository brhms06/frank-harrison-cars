import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { cars, contactMessages, enquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { getSettings } from "@/lib/content";

export const metadata = { title: "Enquiries" };
export const instant = false;

const labels = { "down-payment": "Down payment", "full-payment": "Full payment", "test-drive": "Test drive", enquiry: "Question" } as const;
const when = (d: Date) => d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";

export default async function AdminEnquiries() {
  await requireAdmin();
  const [settings, orders, messages] = await Promise.all([
    getSettings(),
    db
      .select({ e: enquiries, make: cars.make, model: cars.model, year: cars.year, slug: cars.slug, price: cars.price, percent: cars.downPaymentPercent })
      .from(enquiries)
      .innerJoin(cars, eq(cars.id, enquiries.carId))
      .orderBy(desc(enquiries.createdAt)),
    db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)),
  ]);
  const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: settings.defaultCurrency, maximumFractionDigits: 0 }).format(n);
  return (
    <>
      <h1 className="text-2xl font-semibold">Enquiries</h1>
      <section className="space-y-3">
        <h2 className="font-semibold">Car enquiries ({orders.length})</h2>
        {orders.length ? (
          <ul className="space-y-2">
            {orders.map(({ e, make, model, year, slug, price, percent }) => {
              const amount = e.type === "full-payment" ? money(price) : e.type === "down-payment" ? `${money(Math.round((price * (percent ?? 25)) / 100))} (${percent ?? 25}%)` : null;
              return (
                <li key={e.id} className="space-y-1 rounded-2xl bg-white p-4 ring-1 ring-black/5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link href={`/cars/${slug}`} target="_blank" className="text-sm font-semibold text-brand underline">{year} {make} {model}</Link>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">{labels[e.type]}{amount && ` · ${amount}`}</span>
                  </div>
                  <p className="text-sm">{e.name}{e.phone && <> · <a href={`tel:${e.phone}`} className="underline">{e.phone}</a></>}{e.email && <> · <a href={`mailto:${e.email}`} className="underline">{e.email}</a></>}</p>
                  {e.message && <p className="whitespace-pre-line text-sm text-neutral-600">{e.message}</p>}
                  <p className="text-xs text-neutral-400">{when(e.createdAt)}</p>
                </li>
              );
            })}
          </ul>
        ) : <p className="text-sm text-neutral-500">No car enquiries yet.</p>}
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Contact messages ({messages.length})</h2>
        {messages.length ? (
          <ul className="space-y-2">
            {messages.map((m) => (
              <li key={m.id} className="space-y-1 rounded-2xl bg-white p-4 ring-1 ring-black/5">
                <p className="text-sm font-semibold">{m.subject}</p>
                <p className="text-sm">{m.name}{m.phone && <> · {m.phone}</>} · <a href={`mailto:${m.email}`} className="underline">{m.email}</a></p>
                <p className="whitespace-pre-line text-sm text-neutral-600">{m.message}</p>
                <p className="text-xs text-neutral-400">{when(m.createdAt)}</p>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-neutral-500">No messages yet.</p>}
      </section>
    </>
  );
}
