"use client";
import { useState } from "react";
import { getUploadUrl, saveCar } from "@/app/admin/actions";
import { ActionForm, FormSwitch } from "@/components/admin/controls";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type CarValues = {
  id: number | null; make: string; model: string; year: number; price: number; mileage: number; fuel: string; transmission: string;
  bodyType: string; colour: string; description: string; downPaymentPercent: number | null; featured: boolean; sold: boolean; images: string[];
};

const field = (id: string, label: string, props: React.ComponentProps<typeof Input>) => (
  <div className="space-y-1.5"><Label htmlFor={id}>{label}</Label><Input id={id} name={id} required {...props} /></div>
);

export function CarForm({ car, brands }: { car: CarValues; brands: string[] }) {
  const [images, setImages] = useState(car.images);
  const [status, setStatus] = useState("");
  const makes = brands.includes(car.make) || !car.make ? brands : [car.make, ...brands];

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setStatus("Uploading…");
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const res = await getUploadUrl(file.type);
      if ("error" in res) { setStatus(res.error); return; }
      const put = await fetch(res.url, { method: "PUT", headers: res.headers, body: file }).catch(() => null);
      if (!put?.ok) { setStatus("Upload failed. Try a smaller image."); return; }
      added.push(res.publicUrl);
    }
    setImages((prev) => [...prev, ...added]);
    setStatus(`${added.length} photo${added.length === 1 ? "" : "s"} added. Save the car to keep them.`);
  }

  return (
    <ActionForm action={saveCar.bind(null, car.id)} submit={car.id ? "Save changes" : "Add car"} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="make">Brand</Label>
          <input id="make" name="make" list="brand-options" defaultValue={car.make} placeholder="Optional: pick a brand or type one" className="h-9 w-full rounded-md border bg-transparent px-3 text-sm" />
          <datalist id="brand-options">{makes.map((m) => <option key={m} value={m} />)}</datalist>
          <p className="text-xs text-neutral-500">Optional. Leave empty to add a car without a brand.</p>
        </div>
        {field("model", "Model", { defaultValue: car.model, placeholder: "Accord EX-L" })}
        {field("year", "Year", { type: "number", defaultValue: car.year || "", min: 1950 })}
        {field("price", "Price", { type: "number", defaultValue: car.price || "", min: 0 })}
        {field("mileage", "Mileage", { type: "number", defaultValue: car.mileage || "", min: 0 })}
        {field("colour", "Colour", { defaultValue: car.colour })}
        {field("fuel", "Fuel", { defaultValue: car.fuel, placeholder: "Petrol, Diesel, Hybrid, Electric" })}
        {field("transmission", "Transmission", { defaultValue: car.transmission, placeholder: "Automatic or Manual" })}
        {field("bodyType", "Body type", { defaultValue: car.bodyType, placeholder: "Sedan, SUV, Hatchback" })}
      </div>
      <div className="space-y-1.5 sm:max-w-xs">
        <Label htmlFor="downPaymentPercent">Down payment (% of price)</Label>
        <Input id="downPaymentPercent" name="downPaymentPercent" type="number" min={1} max={100} defaultValue={car.downPaymentPercent ?? ""} placeholder="25" />
        <p className="text-xs text-neutral-500">Leave empty to use the default 25%.</p>
      </div>
      <div className="space-y-1.5"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={5} required defaultValue={car.description} /></div>

      <div className="space-y-3">
        <Label>Photos</Label>
        <input type="hidden" name="images" value={JSON.stringify(images)} />
        {images.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((url, i) => (
              <li key={url} className="space-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="aspect-[3/2] w-full rounded-lg bg-neutral-200 object-cover" />
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">{i === 0 ? "Main photo" : `Photo ${i + 1}`}</span>
                  <span className="space-x-2">
                    {i > 0 && <button type="button" onClick={() => setImages((p) => [p[i], ...p.filter((_, j) => j !== i)])} className="underline">Make main</button>}
                    <button type="button" onClick={() => setImages((p) => p.filter((_, j) => j !== i))} className="text-red-600 underline">Remove</button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} className="block text-sm" />
        {status && <p role="status" className="text-xs text-neutral-600">{status}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormSwitch name="featured" label="Featured" hint="Show on the home page" defaultChecked={car.featured} />
        <FormSwitch name="sold" label="Sold" hint="Hide the enquiry form and mark as sold" defaultChecked={car.sold} />
      </div>
    </ActionForm>
  );
}
