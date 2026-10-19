import Link from "next/link";
import { Suspense } from "react";
import { ChevronDown, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CurrencyProvider, CurrencySwitcher } from "@/components/currency";
import { LanguageSwitcher } from "@/components/translator";
import { getSettings } from "@/lib/content";
import { financePages } from "@/lib/finance-pages";

const links = [["Home", "/"], ["Cars", "/cars"], ["About", "/about"], ["Financing", "/financing"], ["Reviews", "/#reviews"], ["Contact", "/contact"]];

const waLink = (n: string) => `https://wa.me/${n.replace(/\D/g, "")}`;
const telLink = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

async function Chrome({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const phone = s.phones[0];
  const contact: (readonly [typeof Phone, string, string | undefined])[] = [
    ...s.phones.map((p) => [Phone, p, telLink(p)] as const),
    ...(s.email ? [[Mail, s.email, `mailto:${s.email}`] as const] : []),
    ...(s.address ? [[MapPin, s.address, undefined] as const] : []),
    [Clock, "Mon–Sat, 9:00 – 18:00", undefined] as const,
  ];
  return (
    <CurrencyProvider base={s.defaultCurrency} locked={!s.showCurrencySwitcher}>
      <header className="absolute inset-x-0 top-4 z-50 px-4">
        <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-full bg-white/95 px-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-semibold leading-none">FH</span>
            <span className="text-xs font-semibold tracking-wide">FRANK HARRISON</span>
          </Link>
          <ul className="hidden gap-7 text-xs lg:flex">
            {links.filter(([label]) => label !== "Reviews" || s.showTestimonials).map(([label, href]) => (
              <li key={label} className="group relative">
                <Link href={href} className="text-neutral-600 hover:text-black">{label}{label === "Financing" && <ChevronDown className="ml-1 inline size-3" />}</Link>
                {label === "Financing" && (
                  <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-4 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="space-y-1 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5">
                      {financePages.map((p) => <li key={p.href}><Link href={p.href} className="block rounded-xl px-3 py-2 text-neutral-600 hover:bg-brand-soft hover:text-black">{p.title}</Link></li>)}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            {s.showTranslator && <LanguageSwitcher />}
            {s.showCurrencySwitcher && <CurrencySwitcher />}
            {phone && <a href={telLink(phone)} className="hidden items-center gap-2 text-xs md:flex"><Phone className="size-3.5" />{phone}</a>}
            <Link href="/contact" className="rounded-full bg-brand px-5 py-2.5 text-xs font-medium text-white">Contact us</Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer id="contact" className="mx-auto w-full max-w-6xl px-4 pb-6 pt-10">
        <div className="rounded-3xl bg-brand p-8 text-white sm:p-10">
          <div className="grid gap-10 sm:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Can&apos;t find the right car?</h2>
              <p className="max-w-sm text-sm text-white/70">Tell us what you&apos;re looking for and we&apos;ll help you find it, from budget to body style.</p>
              <Link href="/contact" className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black">Contact us</Link>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Get in touch</h2>
              <ul className="space-y-3 text-sm text-white/80">
                {contact.map(([Icon, text, href]) => <li key={text} className="flex items-center gap-3"><Icon className="size-4 shrink-0" />{href ? <a href={href} className="hover:underline">{text}</a> : text}</li>)}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/50">
            <span>© 2026 Frank Harrison Cars. All rights reserved.</span>
            <Link href="/credits" className="underline">Photo credits</Link>
          </div>
        </div>
      </footer>
      {s.showWhatsapp && s.whatsapp && (
        <a href={waLink(s.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105">
          <MessageCircle className="size-7" />
        </a>
      )}
    </CurrencyProvider>
  );
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}><Chrome>{children}</Chrome></Suspense>;
}
