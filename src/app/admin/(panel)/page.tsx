import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { cars, contactMessages, enquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export const instant = false;

export default async function Dashboard() {
  await requireAdmin();
  const [[live], [sold], [leads], [messages]] = await Promise.all([
    db.select({ n: count() }).from(cars).where(eq(cars.status, "available")),
    db.select({ n: count() }).from(cars).where(eq(cars.status, "sold")),
    db.select({ n: count() }).from(enquiries),
    db.select({ n: count() }).from(contactMessages),
  ]);
  const stats = [["Cars for sale", live.n], ["Cars sold", sold.n], ["Car enquiries", leads.n], ["Contact messages", messages.n]];
  const links = [["Add a car", "/admin/cars/new"], ["Add a testimonial", "/admin/testimonials"], ["Add an FAQ", "/admin/faqs"], ["Contact details and toggles", "/admin/settings"]];
  return (
    <>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-4">
        {stats.map(([l, n]) => <div key={l} className="rounded-2xl bg-white p-5 ring-1 ring-black/5"><p className="text-2xl font-bold text-brand">{n}</p><p className="text-xs text-neutral-500">{l}</p></div>)}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map(([l, h]) => <Link key={h} href={h} className="rounded-2xl bg-white p-5 text-sm font-medium ring-1 ring-black/5 hover:ring-brand/40">{l} →</Link>)}
      </div>
    </>
  );
}
