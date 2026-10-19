import { addFaq, deleteFaq, toggleFaq } from "@/app/admin/actions";
import { ActionForm, DeleteButton, Toggle } from "@/components/admin/controls";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/admin";
import { getFaqs, getSettings } from "@/lib/content";

export const metadata = { title: "FAQs" };
export const instant = false;

export default async function AdminFaqs() {
  await requireAdmin();
  const [items, settings] = await Promise.all([getFaqs(false), getSettings()]);
  return (
    <>
      <h1 className="text-2xl font-semibold">FAQs</h1>
      {!settings.showFaq && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">The FAQ section is switched off in Settings, so none of these show on the site.</p>}
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <ActionForm action={addFaq} submit="Add FAQ" resetOnSuccess>
          <div className="space-y-1.5"><Label htmlFor="question">Question</Label><Input id="question" name="question" required /></div>
          <div className="space-y-1.5"><Label htmlFor="answer">Answer</Label><Textarea id="answer" name="answer" rows={3} required /></div>
        </ActionForm>
      </div>
      <ul className="space-y-2">
        {items.map((f) => (
          <li key={f.id} className="flex items-start justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <div className="min-w-0 space-y-1"><p className="text-sm font-semibold">{f.question}</p><p className="text-sm text-neutral-600">{f.answer}</p></div>
            <span className="flex shrink-0 items-center gap-5">
              <label className="flex items-center gap-2 text-xs">Show <Toggle checked={f.visible} action={toggleFaq.bind(null, f.id)} label={`Show FAQ: ${f.question}`} /></label>
              <DeleteButton action={deleteFaq.bind(null, f.id)} what="this FAQ" />
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
