import { Suspense } from "react";
import { LogoutButton } from "@/components/admin/controls";
import { requireMaster } from "@/lib/admin";

export const metadata = { title: { default: "Super admin", template: "%s | Super admin" }, robots: { index: false } };

async function Shell({ children }: { children: React.ReactNode }) {
  const user = await requireMaster();
  return (
    <div className="min-h-screen bg-neutral-100">
      {/* hide the live chat bubble here, even if it was loaded earlier on a public page */}
      <style>{"iframe[title*='chat widget' i],.widget-visible{display:none!important}"}</style>

      <header className="flex items-center justify-between gap-4 bg-brand px-5 py-3 text-white">
        <p className="font-serif text-2xl font-semibold">AD <span className="font-sans text-xs font-normal text-white/60">Super admin</span></p>
        <div className="flex items-center gap-4 text-xs text-white/60"><span className="hidden truncate sm:block">{user.email}</span><LogoutButton to="/superadmin/login" /></div>
      </header>
      <main className="p-5 md:p-8"><div className="mx-auto max-w-3xl space-y-6">{children}</div></main>
    </div>
  );
}

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}><Shell>{children}</Shell></Suspense>;
}
