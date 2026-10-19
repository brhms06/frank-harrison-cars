import { AccountForms } from "@/components/admin/controls";
import { requireAdmin } from "@/lib/admin";

export const metadata = { title: "Account" };
export const instant = false;

export default async function AdminAccount() {
  const user = await requireAdmin();
  return (
    <>
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="text-sm text-neutral-500">Change the email and password you use to sign in to this dashboard.</p>
      <AccountForms email={user.email} />
    </>
  );
}
