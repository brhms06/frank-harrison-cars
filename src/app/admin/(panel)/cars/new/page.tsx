import { CarForm } from "@/components/admin/car-form";
import { requireAdmin } from "@/lib/admin";
import { getBrands } from "@/lib/content";

export const metadata = { title: "Add a car" };
export const instant = false;

export default async function NewCar() {
  await requireAdmin();
  const brands = await getBrands(true);
  return (
    <>
      <h1 className="text-2xl font-semibold">Add a car</h1>
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <CarForm brands={brands.map((b) => b.name)} car={{ id: null, make: "", model: "", year: 0, price: 0, mileage: 0, fuel: "", transmission: "", bodyType: "", colour: "", description: "", downPaymentPercent: null, featured: false, sold: false, images: [] }} />
      </div>
    </>
  );
}
