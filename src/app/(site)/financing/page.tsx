import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/finance-ui";
import { financePages } from "@/lib/finance-pages";

export const metadata = { title: "Financing" };

const images = ["fin-dash", "fin-keys", "fin-drive", "camry-a"];

export default function Financing() {
  return (
    <>
      <section className="bg-brand-soft px-4 pb-10 pt-36 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-brand sm:text-4xl">Financing your next car</h1>
          <p className="text-sm text-neutral-500">Use our free tools and guides to work out what you can afford, what to ask for and how to get a fair deal.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-12 sm:grid-cols-2">
        {financePages.map((p, i) => (
          <Link key={p.href} href={p.href} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
            <div className="relative aspect-[16/9] bg-neutral-200">
              <Image src={`/images/${images[i]}.jpg`} alt="" fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="space-y-1 p-5">
              <h2 className="flex items-center justify-between font-semibold text-brand">{p.title}<ArrowRight className="size-4" /></h2>
              <p className="text-sm text-neutral-500">{p.text}</p>
            </div>
          </Link>
        ))}
      </section>
      <CtaBand title="Questions about finance?" text="We'll explain your options in plain English before you commit to anything." />
    </>
  );
}
