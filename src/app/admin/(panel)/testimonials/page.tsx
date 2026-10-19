import { addTestimonial, deleteTestimonial, toggleTestimonial } from "@/app/admin/actions";
import { ActionForm, DeleteButton, Toggle } from "@/components/admin/controls";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/admin";
import { getSettings, getTestimonials } from "@/lib/content";

export const metadata = { title: "Testimonials" };
export const instant = false;

export default async function AdminTestimonials() {
  await requireAdmin();
  const [items, settings] = await Promise.all([getTestimonials(false), getSettings()]);
  return (
    <>
      <h1 className="text-2xl font-semibold">Testimonials</h1>
      {!settings.showTestimonials && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">The testimonials section is switched off in Settings, so none of these show on the site.</p>}
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <ActionForm action={addTestimonial} submit="Add testimonial" resetOnSuccess>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5"><Label htmlFor="name">Customer name</Label><Input id="name" name="name" required placeholder="James K." /></div>
            <div className="space-y-1.5"><Label htmlFor="carBought">Car bought (optional)</Label><Input id="carBought" name="carBought" placeholder="Honda Accord" /></div>
            <div className="space-y-1.5"><Label htmlFor="rating">Rating</Label><select id="rating" name="rating" defaultValue="5" className="h-9 w-full rounded-md border bg-transparent px-3 text-sm">{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select></div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="text">Review</Label><Textarea id="text" name="text" rows={3} required /></div>
        </ActionForm>
      </div>
      <ul className="space-y-2">
        {items.map((t) => (
          <li key={t.id} className="flex items-start justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-semibold">{t.name} <span className="font-normal text-neutral-500">{t.carBought && `· ${t.carBought}`} · {"★".repeat(t.rating)}</span></p>
              <p className="text-sm text-neutral-600">{t.text}</p>
            </div>
            <span className="flex shrink-0 items-center gap-5">
              <label className="flex items-center gap-2 text-xs">Show <Toggle checked={t.visible} action={toggleTestimonial.bind(null, t.id)} label={`Show testimonial from ${t.name}`} /></label>
              <DeleteButton action={deleteTestimonial.bind(null, t.id)} what="this testimonial" />
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
