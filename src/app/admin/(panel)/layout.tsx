import Link from "next/link";
import { Suspense } from "react";
import { LogoutButton } from "@/components/admin/controls";
import { CurrencyProvider } from "@/components/currency";
import { requireAdmin } from "@/lib/admin";
import { getSettings } from "@/lib/content";

export const metadata = { title: { default: "Admin", template: "%s | Admin" }, robots: { index: false } };

const nav = [["Dashboard", "/admin"], ["Cars", "/admin/cars"], ["Enquiries", "/admin/enquiries"], ["Brands", "/admin/brands"], ["Testimonials", "/admin/testimonials"], ["FAQs", "/admin/faqs"], ["Settings", "/admin/settings"], ["Account", "/admin/account"]];

async function Shell({ children }: { children: React.ReactNode }) {
  const [user, settings] = await Promise.all([requireAdmin(), getSettings()]);
  return (
    <CurrencyProvider base={settings.defaultCurrency} locked>
    <div className="min-h-screen bg-neutral-100 md:flex">
      {/* hide the live chat bubble here, even if it was loaded earlier on a public page */}
      <style>{"iframe[title*='chat widget' i],.widget-visible{display:none!important}"}</style>

      <aside className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 bg-brand px-4 py-3 text-white md:block md:min-h-screen md:w-56 md:shrink-0 md:space-y-6 md:p-5">
        <p className="font-serif text-2xl font-semibold">AD <span className="font-sans text-xs font-normal text-white/60">Admin</span></p>
        {/* on phones the links sit in one swipeable row under the logo bar */}
        <nav className="order-last -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 text-sm [scrollbar-width:none] md:order-none md:m-0 md:w-auto md:flex-col md:gap-3 md:overflow-visible md:p-0">
          {nav.map(([label, href]) => <Link key={href} href={href} className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-white/90 hover:bg-white/20 md:rounded-none md:bg-transparent md:p-0 md:text-white/80 md:hover:bg-transparent md:hover:text-white">{label}</Link>)}
          <Link href="/" target="_blank" className="shrink-0 rounded-full px-3 py-1.5 text-white/60 hover:text-white md:rounded-none md:p-0">View site ↗</Link>
        </nav>
        <div className="flex items-center gap-3 text-xs text-white/60 md:block md:space-y-1 md:border-t md:border-white/10 md:pt-4"><p className="hidden truncate md:block">{user.email}</p><LogoutButton /></div>
      </aside>
      <main className="flex-1 p-5 md:p-8"><div className="mx-auto max-w-4xl space-y-6">{children}</div></main>
    </div>
    </CurrencyProvider>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}><Shell>{children}</Shell></Suspense>;
}
