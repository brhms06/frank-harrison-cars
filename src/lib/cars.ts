import { and, asc, desc, eq, getTableColumns, gte, ilike, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { carImages, cars } from "@/db/schema";

export type Filters = {
  q?: string; make?: string; body?: string; minPrice?: string; maxPrice?: string;
  minYear?: string; maxMileage?: string; sort?: string;
};

const num = (v?: string) => (v && /^\d+$/.test(v) ? Number(v) : undefined);

export const withCover = { ...getTableColumns(cars), // columns are qualified by hand: drizzle drops table names in single-table selects, which made `car_id = id` compare the subquery to itself
image: sql<string | null>`(select ci.url from ${carImages} ci where ci.car_id = ${cars}.id order by ci.position limit 1)` };

export async function listCars(f: Filters = {}) {
  const [minPrice, maxPrice, minYear, maxMileage] = [f.minPrice, f.maxPrice, f.minYear, f.maxMileage].map(num);
  const where = and(
    eq(cars.status, "available"),
    f.make ? eq(cars.make, f.make) : undefined,
    f.body ? eq(cars.bodyType, f.body) : undefined,
    f.q ? or(ilike(cars.make, `%${f.q}%`), ilike(cars.model, `%${f.q}%`)) : undefined,
    minPrice !== undefined ? gte(cars.price, minPrice) : undefined,
    maxPrice !== undefined ? lte(cars.price, maxPrice) : undefined,
    minYear !== undefined ? gte(cars.year, minYear) : undefined,
    maxMileage !== undefined ? lte(cars.mileage, maxMileage) : undefined,
  );
  const order = { "price-asc": asc(cars.price), "price-desc": desc(cars.price), "year-desc": desc(cars.year) }[f.sort ?? ""] ?? desc(cars.createdAt);
  return db.select(withCover).from(cars).where(where).orderBy(order);
}

export async function featuredCars() {
  return db.select(withCover).from(cars).where(and(eq(cars.status, "available"), eq(cars.featured, true))).orderBy(desc(cars.id)).limit(6);
}

export async function listMakes() {
  const rows = await db.selectDistinct({ make: cars.make }).from(cars).where(eq(cars.status, "available")).orderBy(cars.make);
  return rows.map((r) => r.make);
}

export async function getCar(slug: string) {
  const [car] = await db.select().from(cars).where(eq(cars.slug, slug));
  if (!car) return null;
  const images = await db.select().from(carImages).where(eq(carImages.carId, car.id)).orderBy(asc(carImages.position));
  return { ...car, images };
}


export async function makeCounts(limit = 4) {
  return db
    .select({ make: cars.make, count: sql<number>`count(*)::int` })
    .from(cars)
    .where(eq(cars.status, "available"))
    .groupBy(cars.make)
    .orderBy(desc(sql`count(*)`), cars.make)
    .limit(limit);
}
