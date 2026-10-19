import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { financePages } from "@/lib/finance-pages";

export const card = "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5";

export function PageHero({ crumb, title, intro, image }: { crumb: string; title: string; intro: string; image: string }) {
  return (
    <section className="relative overflow-hidden bg-neutral-900 px-4 pb-14 pt-36 text-center text-white">
      <Image src={`/images/${image}.jpg`} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand/80 to-brand/40" />
      <div className="relative mx-auto max-w-3xl space-y-4">
        <p className="text-xs text-white/70"><Link href="/" className="hover:underline">Home</Link> / <Link href="/financing" className="hover:underline">Financing</Link> / <span className="text-white">{crumb}</span></p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h1>
        <p className="text-sm text-white/80">{intro}</p>
      </div>
    </section>
  );
}

export function Section({ title, sub, children, tone = "white", id }: { title: string; sub?: React.ReactNode; children: React.ReactNode; tone?: "white" | "soft"; id?: string }) {
  return (
    <section id={id} className={`px-4 py-14 ${tone === "soft" ? "bg-brand-soft" : ""}`}>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-brand">{title}</h2>
          {sub && <p className="text-sm text-neutral-500">{sub}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export const Cards = ({ cols = 3, children }: { cols?: 2 | 3 | 4; children: React.ReactNode }) => (
  <div className={`grid gap-4 sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : cols === 4 ? "lg:grid-cols-4" : ""}`}>{children}</div>
);

export function InfoCard({ title, children, icon }: { title: string; children?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className={`${card} space-y-3`}>
      {icon}
      <h3 className="font-semibold text-brand">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-neutral-500">{children}</div>
    </div>
  );
}

export const Bullets = ({ items, tone }: { items: readonly string[]; tone?: "good" | "bad" }) => (
  <ul className="space-y-1.5 text-sm text-neutral-600">
    {items.map((t) => <li key={t} className="flex gap-2"><span className={tone === "bad" ? "text-red-600" : "text-brand"}>{tone === "bad" ? "✕" : "✓"}</span>{t}</li>)}
  </ul>
);

export const KeyNumbers = ({ items }: { items: readonly (readonly [string, string])[] }) => (
  <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {items.map(([n, l]) => (
      <div key={l} className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
        <dd className="text-xl font-bold text-brand">{n}</dd>
        <dt className="mt-1 text-xs text-neutral-500">{l}</dt>
      </div>
    ))}
  </dl>
);

export const Prose = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mx-auto w-full max-w-3xl space-y-4 px-4 py-14">
    <h2 className="text-2xl font-semibold tracking-tight text-brand">{title}</h2>
    <div className="space-y-4 text-sm leading-relaxed text-neutral-500">{children}</div>
  </section>
);

export function Faq({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <Section title="Frequently asked questions">
      <div className="mx-auto grid max-w-4xl gap-3 md:grid-cols-2">
        {items.map(([q, a]) => (
          <details key={q} className="group rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 open:ring-brand/30">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-brand">{q}<Plus className="size-4 shrink-0 transition-transform group-open:rotate-45" /></summary>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

export function RelatedGuides({ current }: { current?: string }) {
  const items = [...financePages.filter((p) => p.href !== current), { href: "/cars", title: "Browse our cars", text: "See every car in stock right now." }];
  return (
    <Section title="Related guides" tone="soft">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((p) => (
          <Link key={p.href} href={p.href} className={`${card} space-y-1 transition-shadow hover:shadow-md`}>
            <p className="text-sm font-semibold text-brand">{p.title}</p>
            <p className="text-xs text-neutral-500">{p.text}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section className="bg-brand-soft px-4 py-14">
      <div className="relative mx-auto max-w-4xl space-y-5 overflow-hidden rounded-2xl bg-brand px-6 py-14 text-center text-white">
        <Image src="/images/banner.jpg" alt="" fill sizes="896px" className="object-cover opacity-20" />
        <h2 className="relative text-2xl font-semibold">{title}</h2>
        <p className="relative mx-auto max-w-lg text-sm text-white/80">{text}</p>
        <div className="relative flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black">Talk to us about finance <ArrowRight className="size-4" /></Link>
          <Link href="/cars" className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium">Browse cars</Link>
        </div>
      </div>
    </section>
  );
}
