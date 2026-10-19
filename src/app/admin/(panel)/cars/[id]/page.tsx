import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CarForm } from "@/components/admin/car-form";
import { db } from "@/db";
import { carImages, cars } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { getBrands } from "@/lib/content";

export const metadata = { title: "Edit car" };
export const instant = false;

export default async function EditCar({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [car] = await db.select().from(cars).where(eq(cars.id, id));
  if (!car) notFound();
  const [images, brands] = await Promise.all([db.select().from(carImages).where(eq(carImages.carId, id)).orderBy(asc(carImages.position)), getBrands(true)]);
  return (
    <>
      <h1 className="text-2xl font-semibold">Edit {car.make} {car.model}</h1>
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <CarForm brands={brands.map((b) => b.name)} car={{ ...car, sold: car.status === "sold", images: images.map((i) => i.url) }} />
      </div>
    </>
  );
}
