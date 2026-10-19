import Link from "next/link";
import { Suspense } from "react";
import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrands, getSettings } from "@/lib/content";
import { listCars, listMakes, type Filters } from "@/lib/cars";

const sel = "h-9 rounded-md border bg-transparent px-3 text-sm";

async function Results({ searchParams }: { searchParams: Promise<Filters> }) {
  const f = await searchParams;
  const [cars, stocked, settings, brands] = await Promise.all([listCars(f), listMakes(), getSettings(), getBrands(true)]);
  const active = new Set(brands.map((b) => b.name));
  const makes = stocked.filter((m) => active.has(m));
  return (
    <>
      {/* plain GET form: filters live in the URL, no client JS needed */}
      <form className="grid gap-2 sm:grid-cols-3 lg:grid-cols-7" aria-label="Filter cars">
        <Input name="q" placeholder="Search make or model" defaultValue={f.q} className="lg:col-span-2" />
        <select name="make" defaultValue={f.make ?? ""} className={sel} aria-label="Make">
          <option value="">All makes</option>
          {makes.map((m) => <option key={m}>{m}</option>)}
        </select>
        <Input name="maxPrice" type="number" min={0} placeholder={`Max price (${settings.defaultCurrency})`} defaultValue={f.maxPrice} />
        <Input name="minYear" type="number" min={1990} placeholder="Min year" defaultValue={f.minYear} />
        <Input name="maxMileage" type="number" min={0} placeholder="Max mileage" defaultValue={f.maxMileage} />
        <select name="sort" defaultValue={f.sort ?? ""} className={sel} aria-label="Sort">
          <option value="">Newest listed</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="year-desc">Newest year</option>
        </select>
        <div className="flex gap-2 sm:col-span-3 lg:col-span-7">
          <Button type="submit">Apply</Button>
          <Link href="/cars" className="inline-flex h-9 items-center px-3 text-sm underline">Clear</Link>
        </div>
      </form>
      <p className="text-sm text-muted-foreground">{cars.length} car{cars.length === 1 ? "" : "s"} found</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cars.map((c) => <CarCard key={c.id} car={c} />)}</div>
    </>
  );
}

export default function CarsPage({ searchParams }: { searchParams: Promise<Filters> }) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-12 pt-28">
      <h1 className="text-3xl font-bold">Our cars</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
