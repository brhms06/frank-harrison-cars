import { saveSettings } from "@/app/admin/actions";
import { ActionForm, FormSwitch } from "@/components/admin/controls";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/admin";
import { getSettings } from "@/lib/content";
import { CURRENCIES } from "@/lib/currency";

export const metadata = { title: "Settings" };
export const instant = false;

export default async function AdminSettings() {
  await requireAdmin();
  const s = await getSettings();
  return (
    <>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <ActionForm action={saveSettings} submit="Save settings" className="space-y-8">
        <section className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="font-semibold">Contact details</h2>
          <div className="space-y-1.5"><Label htmlFor="phones">Phone numbers (one per line)</Label><Textarea id="phones" name="phones" rows={3} defaultValue={s.phones.join("\n")} placeholder="+1 555 120 0077" /></div>
          <div className="space-y-1.5"><Label htmlFor="whatsapp">WhatsApp number</Label><Input id="whatsapp" name="whatsapp" defaultValue={s.whatsapp} placeholder="+15551200077 (with country code)" /></div>
          <div className="space-y-1.5"><Label htmlFor="smsNumber">Text message (SMS) number</Label><Input id="smsNumber" name="smsNumber" defaultValue={s.smsNumber} placeholder="Where customers text their enquiry (defaults to your first phone)" /></div>
          <div className="space-y-1.5"><Label htmlFor="email">Contact email</Label><Input id="email" name="email" type="email" defaultValue={s.email} placeholder="sales@yourdealership.com" /></div>
          <div className="space-y-1.5"><Label htmlFor="address">Address</Label><Textarea id="address" name="address" rows={2} defaultValue={s.address} /></div>
        </section>

        <section className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="font-semibold">Currency</h2>
          <div className="space-y-1.5">
            <Label htmlFor="defaultCurrency">Your currency (prices you enter are in this currency)</Label>
            <select id="defaultCurrency" name="defaultCurrency" defaultValue={s.defaultCurrency} className="h-9 w-full max-w-xs rounded-md border bg-transparent px-3 text-sm">
              {Object.keys(CURRENCIES).map((c) => <option key={c}>{c}</option>)}
            </select>
            <p className="text-xs text-neutral-500">Changing this does not convert existing prices; it changes what currency they are shown in.</p>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="font-semibold">Order notifications</h2>
          <div className="space-y-1.5"><Label htmlFor="discordWebhook">Discord webhook URL</Label><Input id="discordWebhook" name="discordWebhook" defaultValue={s.discordWebhook} placeholder="https://discord.com/api/webhooks/..." autoComplete="off" /><p className="text-xs text-neutral-500">New orders and messages are posted to your Discord channel. In Discord: channel settings, Integrations, Webhooks, New webhook, Copy URL. Leave empty to turn off.</p></div>
        </section>

        <section className="space-y-3 rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="font-semibold">Show on the website</h2>
          <FormSwitch name="showTestimonials" label="Testimonials section" hint="On the home page" defaultChecked={s.showTestimonials} />
          <FormSwitch name="showFaq" label="FAQ section" hint="On the Contact page" defaultChecked={s.showFaq} />
          <FormSwitch name="showWhatsapp" label="WhatsApp" hint="Chat button, contact page and the WhatsApp option on car enquiries. Turn off to hide your number everywhere." defaultChecked={s.showWhatsapp} />
          <FormSwitch name="showCurrencySwitcher" label="Currency switcher" hint="Lets customers view prices in another currency" defaultChecked={s.showCurrencySwitcher} />
          <FormSwitch name="showTranslator" label="Language translator" hint="Lets customers translate the website into their language" defaultChecked={s.showTranslator} />
        </section>
      </ActionForm>
    </>
  );
}
