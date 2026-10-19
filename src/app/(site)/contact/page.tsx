import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/finance-ui";
import { getFaqs, getSettings } from "@/lib/content";

export const metadata = { title: "Contact us" };

const times = [["General questions", "Within 1 business day"], ["Test drive requests", "Same business day"], ["Finance enquiries", "Within 1 business day"], ["Weekends and holidays", "Next business day"]];

const quick = [
  ["Browse our cars", "See what's in stock now", "/cars"],
  ["Financing guide", "Calculators, rates and loan terms", "/financing"],
  ["About us", "Who we are and how we work", "/about"],
  ["Part-exchange", "Find out what your car is worth", "/financing"],
] as const;

export default async function Contact() {
  const [s, faqRows] = await Promise.all([getSettings(), getFaqs(true)]);
  const ways: { Icon: typeof Mail; title: string; value: string; href?: string; note: string }[] = [
    ...(s.email ? [{ Icon: Mail, title: "Email", value: s.email, href: `mailto:${s.email}`, note: "Best for general questions. Response within 1 business day." }] : []),
    ...s.phones.map((p) => ({ Icon: Phone, title: "Phone", value: p, href: `tel:${p.replace(/[^\d+]/g, "")}`, note: "Call us to book a test drive or ask about a car." })),
    ...(s.showWhatsapp && s.whatsapp ? [{ Icon: MessageCircle, title: "WhatsApp", value: s.whatsapp, href: `https://wa.me/${s.whatsapp.replace(/\D/g, "")}`, note: "Message us any time and we will reply during opening hours." }] : []),
    ...(s.address ? [{ Icon: MapPin, title: "Visit us", value: s.address, note: "Come and see the cars in person. Appointments welcome." }] : []),
  ];
  return (
    <>
      <section className="bg-brand-soft px-4 pb-12 pt-36 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="text-xs text-neutral-500"><Link href="/" className="text-brand hover:underline">Home</Link> / <span className="font-medium text-neutral-700">Contact us</span></p>
          <h1 className="text-3xl font-semibold tracking-tight text-brand sm:text-4xl">Contact us</h1>
          <p className="text-sm text-neutral-500">Have a question about a car, financing, part-exchange or a test drive? We&apos;re here to help. <b className="text-neutral-700">Fill out the form below</b> or use any of the options on this page.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-12 px-4 py-14 md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-brand">Send us a message</h2>
          <p className="pb-4 text-xs text-neutral-500">We typically respond within 1 business day.</p>
          <ContactForm />
        </div>

        <div className="space-y-8">
          <div className="space-y-1"><h2 className="text-lg font-semibold text-brand">Other ways to reach us</h2><p className="text-xs text-neutral-500">Choose whichever method works best for you.</p></div>
          <ul className="space-y-6">
            {ways.map(({ Icon, title, value, href, note }) => (
              <li key={title + value} className="space-y-1">
                <Icon className="size-5 text-brand" />
                <p className="text-sm font-semibold text-brand">{title}</p>
                {href ? <a href={href} className="block text-sm text-brand underline">{value}</a> : <p className="text-sm">{value}</p>}
                <p className="text-xs text-neutral-500">{note}</p>
              </li>
            ))}
          </ul>
          <div className="space-y-3 rounded-2xl bg-brand p-6 text-white">
            <p className="flex items-center gap-2 text-sm font-semibold"><Clock className="size-4" />Response times</p>
            <ul className="space-y-1.5 text-xs text-white/80">
              {times.map(([a, b]) => <li key={a}><b className="text-white">{a}:</b> {b}</li>)}
            </ul>
            <p className="border-t border-white/10 pt-3 text-xs text-white/70">Open Monday to Saturday, 9:00 to 18:00.</p>
          </div>
        </div>
      </section>

      <section className="bg-brand-soft px-4 py-14">
        <div className="mx-auto max-w-5xl space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-brand">Before you reach out, you might find your answer here</h2>
            <p className="text-sm text-neutral-500">Most questions are covered in our guides and tools.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quick.map(([t, d, h]) => (
              <Link key={t} href={h} className="space-y-1 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
                <p className="text-sm font-semibold text-brand">{t}</p><p className="text-xs text-neutral-500">{d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {s.showFaq && faqRows.length > 0 && <Faq items={faqRows.map((f) => [f.question, f.answer] as const)} />}

      <section className="bg-brand-soft px-4 py-14">
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-brand">About apexdrivehouse.com</h2>
            <p className="text-sm leading-relaxed text-neutral-500">We are an independent dealership selling inspected pre-owned sedans and SUVs at fair prices. We hand-pick our cars, tell you everything we know about them, and support you from your first visit to the day you drive away.</p>
            <p className="text-sm leading-relaxed text-neutral-500">If you have questions, feedback or just want to say hello, we&apos;d love to hear from you. Use the form above or email us directly. We read and respond to every message.</p>
            <Link href="/about" className="inline-block rounded-full bg-brand px-6 py-2.5 text-xs font-medium text-white">More about us</Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200">
            <Image src="/images/sportage-a.jpg" alt="" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

    </>
  );
}
