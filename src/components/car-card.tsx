import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/currency";

type Props = { badge?: string; car: { slug: string; make: string; model: string; year: number; price: number; mileage: number; fuel: string; transmission: string; image: string | null } };

export function CarCard({ car, badge }: Props) {
  return (
    <Link href={`/cars/${car.slug}`} className="group overflow-hidden rounded-2xl bg-neutral-100 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[3/2] bg-neutral-200">
        {car.image && <Image src={car.image} alt={`${car.make} ${car.model}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
        {badge && <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-[11px] font-medium text-white">{badge}</span>}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="font-semibold leading-tight">{car.make} {car.model}</h3>
        <p className="text-xs text-muted-foreground">{car.year} · {car.mileage.toLocaleString("en-GB")} mi · {car.fuel} · {car.transmission}</p>
        <p className="pt-2 text-lg font-semibold"><Price n={car.price} /></p>
      </div>
    </Link>
  );
}
