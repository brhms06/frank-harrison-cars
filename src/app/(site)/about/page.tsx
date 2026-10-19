import { BadgeCheck, Banknote, ClipboardCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "About us" };

const Photo = ({ src, className = "aspect-[4/3]" }: { src: string; className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-neutral-200 ${className}`}>
    <Image src={`/images/${src}.jpg`} alt="" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
  </div>
);

const help = [
  [ClipboardCheck, "Inspected stock", "Every car is checked before it is listed, and we publish honest photos, mileage and history so you know exactly what you are getting."],
  [BadgeCheck, "Clear pricing", "The price you see is the price you pay. No hidden fees, no pressure, and all the paperwork handed over with the car."],
  [Banknote, "Finance and part-exchange", "Spread the cost with finance, or put your current car towards your next one with a free, no-obligation valuation."],
] as const;

const numbers = [["10+", "Years in business"], ["1,000+", "Cars sold"], ["150", "Point inspection"], ["98%", "Happy customers"]];

const Prose = ({ title, children, photo, photoClass, flip }: { title: string; children: React.ReactNode; photo?: string; photoClass?: string; flip?: boolean }) => (
  <section className={`mx-auto w-full px-4 py-14 ${photo ? "grid max-w-5xl items-center gap-10 md:grid-cols-2" : "max-w-3xl"}`}>
    <div className={`space-y-4 ${flip ? "md:order-2" : ""}`}>
      <h2 className="text-2xl font-semibold tracking-tight text-brand">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-neutral-500">{children}</div>
    </div>
    {photo && <Photo src={photo} className={photoClass} />}
  </section>
);

export default function About() {
  return (
    <>
      <section className="bg-brand-soft px-4 pb-14 pt-36 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-brand sm:text-4xl">About Frank Harrison Cars: quality used cars, honestly sold</h1>
          <p className="text-sm text-neutral-500">We are an independent dealership selling inspected pre-owned sedans and SUVs at fair prices, with <b className="text-neutral-700">clear terms and no hidden costs</b>.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-3 gap-3">
          {["accord-2018-a", "sorento-a", "camry-a"].map((k) => <Photo key={k} src={k} className="aspect-[4/3]" />)}
        </div>
      </section>

      <Prose title="Our mission" photo="es-a" flip>
        <p>Buying a used car is one of the biggest purchases most people make, yet the process can feel confusing and one-sided. Prices vary, histories are unclear and it is hard to know who to trust.</p>
        <p>We believe every buyer deserves transparent information, a fair price and a stress-free experience. We hand-pick our cars, tell you everything we know about them, and support you from your first visit to the day you drive away.</p>
      </Prose>

      <section className="bg-brand-soft px-4 py-14">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-brand">How we help car buyers</h2>
            <p className="text-sm text-neutral-500">Three things that put you in control when buying a car.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {help.map(([Icon, title, text]) => (
              <div key={title} className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
                <Icon className="size-7 text-brand" />
                <h3 className="text-lg font-semibold text-brand">{title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Prose title="How we find our cars" photo="about-mechanic" photoClass="aspect-[4/5] max-h-[28rem] w-full">
        <p>We source our cars from trusted trade and private sellers, then inspect each one before it goes on sale. Anything that does not meet our standards is turned away, however good the price.</p>
        <p>Because we choose what we sell, we can stand behind it. If you have a question about a car&apos;s history or condition, ask us and you will get a straight answer.</p>
      </Prose>

      <section className="bg-brand-soft px-4 py-14">
        <div className="mx-auto max-w-6xl space-y-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-brand">Frank Harrison Cars by the numbers</h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {numbers.map(([n, label]) => (
              <div key={label} className="rounded-xl bg-white p-6 text-center shadow-sm">
                <dt className="text-xs text-neutral-500">{label}</dt>
                <dd className="mt-1 text-2xl font-bold text-brand">{n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div id="financing" className="scroll-mt-24">
        <Prose title="Financing">
          <p>Whether you are paying in full, financing part of the price or trading in your current car, we will talk you through the options in plain English. Ask about finance on any car and we will give you a clear monthly figure before you commit.</p>
          <Link href="/financing" className="inline-block rounded-full bg-brand px-6 py-2.5 text-xs font-medium text-white">Explore our finance tools</Link>
        </Prose>
      </div>

      <Prose title="Our standards">
        <p>We are committed to accurate, up-to-date listings. Each car page shows the year, mileage, fuel and transmission, and we remove cars the moment they are sold.</p>
        <p>If you spot anything inaccurate on our site, please <Link href="/contact" className="text-brand underline">contact us</Link> and we will correct it promptly. Our reputation depends on your trust, and we take that seriously.</p>
      </Prose>

      <section className="bg-brand-soft px-4 py-14">
        <div className="relative mx-auto max-w-4xl space-y-5 overflow-hidden rounded-2xl bg-brand px-6 py-14 text-center text-white">
          <Image src="/images/banner.jpg" alt="" fill sizes="896px" className="object-cover opacity-25" />
          <h2 className="relative text-2xl font-semibold">Start your car search</h2>
          <p className="relative text-sm text-white/80">Browse our current stock and find the right car at the right price.</p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <Link href="/cars" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black">Browse cars</Link>
            <Link href="/contact" className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
