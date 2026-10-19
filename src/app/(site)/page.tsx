import { ArrowRight, Car, FileCheck, Headset, ShieldCheck, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CarCard } from "@/components/car-card";
import { featuredCars } from "@/lib/cars";
import { getSettings, getTestimonials } from "@/lib/content";

const wrap = "mx-auto w-full max-w-6xl px-4";

const stats = [
  [ShieldCheck, "10+ years", "in the business"],
  [Car, "1,000+ cars", "sold"],
  [Star, "98%", "happy customers"],
] as const;

const why = [
  [Car, "Inspected cars", "Every car goes through a full multi-point inspection before it is listed."],
  [FileCheck, "Clear terms", "No hidden fees. All paperwork in order and handed over with the car."],
  [Users, "Tailored to you", "We match cars to your budget and needs, with advice at every step."],
  [Headset, "Full support", "Finance, insurance and part-exchange help, from first visit to handover."],
] as const;

const news = [
  ["News", "New arrivals this month", "A fresh selection of pre-owned sedans and SUVs has just landed.", "es-a"],
  ["Guide", "How to choose a reliable used car", "Practical tips for checking history, mileage and condition.", "camry-a"],
  ["Review", "Test drive: Honda Accord", "Comfort, space and efficiency from a used-market favourite.", "accord-2018-a"],
] as const;

async function Catalog() {
  const cars = await featuredCars();
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cars.map((c) => <CarCard key={c.id} car={c} badge="Featured" />)}</div>;
}

async function Reviews() {
  const [settings, items] = await Promise.all([getSettings(), getTestimonials(true)]);
  if (!settings.showTestimonials || items.length === 0) return null;
  return (
    <section id="reviews" className={`${wrap} space-y-5 py-8`}>
      <SectionHead title="What our customers say" />
      <div className="grid gap-4 md:grid-cols-3">
        {items.slice(0, 6).map((t) => (
          <figure key={t.id} className="flex gap-4 rounded-2xl bg-neutral-100 p-4">
            <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-brand font-serif text-2xl text-white">{t.name[0]}</div>
            <div className="space-y-2">
              <blockquote className="text-xs leading-relaxed text-neutral-600">“{t.text}”</blockquote>
              <figcaption className="flex items-center justify-between text-xs"><span><b className="block">{t.name}</b><span className="text-neutral-500">{t.carBought}</span></span><span aria-label={`${t.rating} stars`} className="flex text-amber-500">{Array.from({ length: t.rating }, (_, i) => <Star key={i} className="size-3 fill-current" />)}</span></figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

const SectionHead = ({ title, href, label }: { title: string; href?: string; label?: string }) => (
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
    {href && <Link href={href} className="flex items-center gap-1 text-xs text-neutral-600 hover:text-black">{label} <ArrowRight className="size-3.5" /></Link>}
  </div>
);

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-100 to-white pt-28">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] md:block [mask-image:linear-gradient(to_right,transparent,black_40%)]">
          <Image src="/images/hero.jpg" alt="" fill priority sizes="62vw" className="object-cover object-left" />
        </div>
        <div className={`${wrap} relative py-12 md:py-24`}>
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Quality used cars with transparent service</h1>
            <p className="text-sm text-neutral-500">apexdrivehouse.com sells used cars only. Every car is pre-owned, inspected and described honestly. No hidden fees and full paperwork with every sale.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/cars" className="inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white">Browse cars <ArrowRight className="size-4" /></Link>
              <Link href="/contact" className="rounded-full border bg-white px-6 py-3 text-sm font-medium">Get a consultation</Link>
            </div>
            <ul className="flex gap-6 pt-4 text-xs">
              {stats.map(([Icon, a, b]) => (
                <li key={a} className="flex items-center gap-2"><Icon className="size-4 text-neutral-500" /><span><b className="block font-semibold">{a}</b><span className="text-neutral-500">{b}</span></span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative aspect-[16/9] md:hidden"><Image src="/images/hero.jpg" alt="" fill sizes="100vw" className="object-cover" /></div>
      </section>

      <section id="why" className={`${wrap} space-y-5 py-12`}>
        <SectionHead title="Why choose us" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(([Icon, title, text]) => (
            <div key={title} className="space-y-3 rounded-2xl bg-neutral-100 p-5">
              <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-brand text-white"><Icon className="size-4" /></span><h3 className="text-sm font-semibold">{title}</h3></div>
              <p className="text-xs leading-relaxed text-neutral-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${wrap} space-y-5 py-8`}>
        <SectionHead title="Cars in stock" href="/cars" label="See all cars" />
        <Suspense fallback={<div className="h-96" />}><Catalog /></Suspense>
      </section>

      <section id="offer" className={`${wrap} py-8`}>
        <div className="relative overflow-hidden rounded-3xl bg-brand text-white">
          <Image src="/images/banner.jpg" alt="" fill sizes="100vw" className="object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/90 to-transparent" />
          <div className="relative max-w-md space-y-3 p-8 sm:p-10">
            <p className="text-xs text-white/70">Special offer</p>
            <h2 className="text-2xl font-semibold leading-snug">Free valuation when you trade in your car</h2>
            <p className="text-xs text-white/70">Part-exchange your current car against any vehicle in stock. No obligation.</p>
            <Link href="/cars" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black">Find out more <ArrowRight className="size-3.5" /></Link>
          </div>
          <div className="h-24 sm:h-32" />
        </div>
      </section>

      <Suspense fallback={null}><Reviews /></Suspense>

      <section className={`${wrap} space-y-5 py-8`}>
        <SectionHead title="News and articles" />
        <div className="grid gap-4 md:grid-cols-3">
          {news.map(([tag, title, text, img]) => (
            <Link key={title} href="/cars" className="group relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-2xl p-5 text-white">
              <Image src={`/images/${img}.jpg`} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
              <span className="relative w-fit rounded-full bg-white/20 px-3 py-1 text-[11px] backdrop-blur">{tag}</span>
              <div className="relative flex items-end justify-between gap-4">
                <div><h3 className="font-semibold leading-snug">{title}</h3><p className="mt-1 text-xs text-white/70">{text}</p></div>
                <ArrowRight className="size-5 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
