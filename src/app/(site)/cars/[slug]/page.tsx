import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EnquiryForm } from "@/components/enquiry-form";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/currency";
import { getCar } from "@/lib/cars";
import { getSettings } from "@/lib/content";

async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const [car, s] = await Promise.all([getCar((await params).slug), getSettings()]);
  if (!car) notFound();
  const percent = car.downPaymentPercent ?? 25;
  const specs = [["Year", car.year], ["Mileage", `${car.mileage.toLocaleString("en-GB")} mi`], ["Fuel", car.fuel], ["Transmission", car.transmission], ["Body", car.bodyType], ["Colour", car.colour]];
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-12 pt-28 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div className="space-y-2">
          {car.images.map((img, i) => (
            <div key={img.id} className={`relative bg-muted ${i === 0 ? "aspect-[3/2]" : "inline-block aspect-[3/2] w-[calc(50%-4px)] align-top" } ${i > 1 ? "mt-0" : ""}`}>
              <Image src={img.url} alt={`${car.make} ${car.model} photo ${i + 1}`} fill priority={i === 0} sizes="(min-width:1024px) 66vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
        <section>
          <h2 className="mb-2 text-xl font-semibold">Description</h2>
          <p className="text-muted-foreground">{car.description}</p>
        </section>
      </div>
      <aside className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{car.make} {car.model}</h1>
          <p className="text-3xl font-bold"><Price n={car.price} /></p>
          {car.status === "sold" && <Badge variant="destructive">Sold</Badge>}
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          {specs.map(([k, v]) => (<div key={k as string}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>))}
        </dl>
        {car.status === "available" && (
          <div className="space-y-3 rounded-lg border p-4">
            <h2 className="font-semibold">Interested?</h2>
            <EnquiryForm
              carId={car.id}
              title={`${car.year} ${car.make} ${car.model}`}
              price={car.price}
              percent={percent}
              downPayment={Math.round((car.price * percent) / 100)}
              channels={{ whatsapp: s.showWhatsapp ? s.whatsapp : "", sms: s.smsNumber || s.phones[0], email: s.email }}
            />
          </div>
        )}
      </aside>
    </div>
  );
}

export default function CarPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}><Detail params={params} /></Suspense>;
}
