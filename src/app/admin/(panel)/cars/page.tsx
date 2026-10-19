import { desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { deleteCar, toggleCar } from "@/app/admin/actions";
import { DeleteButton, Toggle } from "@/components/admin/controls";
import { Price } from "@/components/currency";
import { db } from "@/db";
import { cars } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { withCover } from "@/lib/cars";

export const metadata = { title: "Cars" };
export const instant = false;

export default async function AdminCars() {
  await requireAdmin();
  const rows = await db.select(withCover).from(cars).orderBy(desc(cars.createdAt), desc(cars.id));
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cars</h1>
        <Link href="/admin/cars/new" className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white">Add a car</Link>
      </div>
      {rows.length === 0 && <p className="rounded-2xl bg-white p-6 text-sm text-neutral-500">No cars yet. Add your first one.</p>}
      <ul className="space-y-3">
        {rows.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-black/5">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-200">{c.image && <Image src={c.image} alt="" fill sizes="96px" className="object-cover" />}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{c.make} {c.model} <span className="font-normal text-neutral-500">{c.year}</span></p>
              <p className="text-xs text-neutral-500"><Price n={c.price} /> · {c.mileage.toLocaleString("en-GB")} mi</p>
            </div>
            <label className="flex items-center gap-2 text-xs">Featured <Toggle checked={c.featured} action={toggleCar.bind(null, c.id, "featured")} label={`Featured: ${c.make} ${c.model}`} /></label>
            <label className="flex items-center gap-2 text-xs">Sold <Toggle checked={c.status === "sold"} action={toggleCar.bind(null, c.id, "sold")} label={`Sold: ${c.make} ${c.model}`} /></label>
            <div className="flex gap-4 text-xs"><Link href={`/admin/cars/${c.id}`} className="text-brand underline">Edit</Link><DeleteButton action={deleteCar.bind(null, c.id)} what={`${c.make} ${c.model}`} /></div>
          </li>
        ))}
      </ul>
    </>
  );
}
