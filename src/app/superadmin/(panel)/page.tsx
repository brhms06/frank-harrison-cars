import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ownerSettings } from "@/db/schema";
import { addAdmin, saveMasterWebhook, listDealershipAdmins, removeAdmin } from "@/app/admin/actions";
import { AccountForms, ActionForm, DeleteButton } from "@/components/admin/controls";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RemoveMasterForm } from "@/components/admin/remove-master";
import { requireMaster } from "@/lib/admin";

export const metadata = { title: "Admins" };
export const instant = false;

export default async function AdminsPage() {
  const me = await requireMaster();
  const admins = await listDealershipAdmins();
  const [owner] = await db.select().from(ownerSettings).where(eq(ownerSettings.id, 1));
  return (
    <>
      <h1 className="text-2xl font-semibold">Super admin</h1>
      <section className="space-y-2 rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <h2 className="font-semibold">Admins</h2>
        <p className="text-sm text-neutral-600">Super admin: you only manage admin accounts. Admins run the website (cars, brands, settings…).</p>
        {admins.length ? (
          <ul className="divide-y text-sm">
            {admins.map((a) => <li key={a.id} className="flex items-center justify-between gap-4 py-2"><span className="truncate">{a.email}</span><DeleteButton action={removeAdmin.bind(null, a.id)} what={a.email} /></li>)}
          </ul>
        ) : <p className="text-sm text-neutral-500">No admins yet. Add one below.</p>}
      </section>
      <section className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <h2 className="font-semibold">Add an admin</h2>
        <p className="text-sm text-neutral-600">The new admin gets full access to run the website. Removing an admin signs them out immediately.</p>
        <ActionForm action={addAdmin} submit="Add admin" resetOnSuccess className="space-y-4">
          <div className="space-y-1.5"><Label htmlFor="email">New admin email</Label><Input id="email" name="email" type="email" required autoComplete="off" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="password">New password</Label><Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" /></div>
            <div className="space-y-1.5"><Label htmlFor="confirm">Confirm new password</Label><Input id="confirm" name="confirm" type="password" required autoComplete="new-password" /></div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="masterPassword">Your master password (to confirm)</Label><Input id="masterPassword" name="masterPassword" type="password" required autoComplete="current-password" /></div>
        </ActionForm>
      </section>
      <section className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <h2 className="font-semibold">My Discord notifications</h2>
        <p className="text-sm text-neutral-600">Every order and message is also sent to this Discord webhook. It belongs to your super admin account and is deleted if you remove it.</p>
        <ActionForm action={saveMasterWebhook} submit="Save webhook" className="space-y-4">
          <div className="space-y-1.5"><Label htmlFor="discordWebhook">Discord webhook URL</Label><Input id="discordWebhook" name="discordWebhook" defaultValue={owner?.discordWebhook ?? ""} placeholder="https://discord.com/api/webhooks/..." autoComplete="off" /></div>
        </ActionForm>
      </section>
      <section className="space-y-4">
        <h2 className="font-semibold">My password</h2>
        <AccountForms email={me.email} emailEditable={false} />
      </section>
      <section className="space-y-4 rounded-2xl border border-red-200 bg-white p-6">
        <h2 className="font-semibold text-red-700">Remove my master access</h2>
        <p className="text-sm text-neutral-600">This deletes your master login for good, so you have no access to this website anymore. It cannot be undone. Afterwards the dealership admin can only be replaced from the server (the make-admin script with a new MASTER_EMAIL). Remember to delete MASTER_EMAIL from your hosting settings too.</p>
        <RemoveMasterForm />
      </section>
    </>
  );
}
