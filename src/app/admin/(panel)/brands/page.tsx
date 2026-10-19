import { addBrand, deleteBrand, toggleBrand } from "@/app/admin/actions";
import { ActionForm, DeleteButton, Toggle } from "@/components/admin/controls";
import { Input } from "@/components/ui/input";
import { requireAdmin } from "@/lib/admin";
import { getBrands } from "@/lib/content";

export const metadata = { title: "Brands" };
export const instant = false;

export default async function AdminBrands() {
  await requireAdmin();
  const brands = await getBrands(false);
  return (
    <>
      <h1 className="text-2xl font-semibold">Brands</h1>
      <p className="text-sm text-neutral-500">Brands appear in the car form and in the Make filter on the Cars page. Hiding a brand removes it from both.</p>
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <ActionForm action={addBrand} submit="Add brand" resetOnSuccess className="flex flex-wrap items-start gap-3">
          <Input name="name" placeholder="e.g. Toyota" required className="w-64" aria-label="Brand name" />
        </ActionForm>
      </div>
      <ul className="space-y-2">
        {brands.map((b) => (
          <li key={b.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <span className="text-sm font-medium">{b.name}</span>
            <span className="flex items-center gap-5">
              <label className="flex items-center gap-2 text-xs">Show <Toggle checked={b.active} action={toggleBrand.bind(null, b.id)} label={`Show ${b.name}`} /></label>
              <DeleteButton action={deleteBrand.bind(null, b.id)} what={b.name} />
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
