import Image from "next/image";
import Link from "next/link";
import { Bullets, CtaBand, Faq, InfoCard, KeyNumbers, PageHero, RelatedGuides, Section, card } from "@/components/finance-ui";

export const metadata = { title: "First-time car buyer guide" };

type Step = { title: string; intro: string; cards: readonly (readonly [string, readonly string[]])[]; link?: readonly [string, string] };

const steps: readonly Step[] = [
  { title: "Set your real budget", intro: "Work out what you can truly afford, not just what a lender will offer.",
    cards: [["Use the 20/4/10 rule", ["20% down payment", "No more than a 4-year loan", "Total car costs under 10% of gross income"]], ["Count every cost", ["Insurance and fuel", "Maintenance and tyres", "Registration, tax and parking"]]],
    link: ["Try the loan calculator", "/financing/auto-loan-calculator"] },
  { title: "Check and improve your credit", intro: "Your credit score drives the rate you are offered, so check it before you shop.",
    cards: [["Check your score free", ["Get your report and look for errors", "Dispute anything incorrect", "Know your score range"]], ["Quick wins (30–90 days)", ["Pay down card balances", "Pay everything on time", "Avoid new credit applications"]], ["No credit history?", ["Start with a small credit product", "Consider a co-signer", "A larger deposit helps"]]],
    link: ["Read the bad credit guide", "/financing/bad-credit-auto-loans"] },
  { title: "Get pre-approved for financing", intro: "Walk in knowing your rate and budget so you shop with confidence.",
    cards: [["Why pre-approval matters", ["Know your budget before you shop", "Compare against any dealer offer", "Stronger position when negotiating"]], ["Where to apply", ["Your bank or credit union", "Online lenders", "Through us, on the car you pick"]]] },
  { title: "Research and shortlist cars", intro: "Decide what you need first, then compare specific cars within your budget.",
    cards: [["Used or certified pre-owned", ["Lower price and slower depreciation", "Check history and service records", "Look for 2–5 year old cars"]], ["New cars", ["Full warranty and latest features", "Faster depreciation in year one", "Higher price and insurance"]], ["Popular first-car picks", ["Budget-friendly: Toyota Corolla, Honda Civic, Kia Forte", "Compact SUVs: Honda CR-V, Toyota RAV4, Kia Sportage", "Efficient: Toyota Camry Hybrid, RAV4 Hybrid"]]],
    link: ["Browse our cars", "/cars"] },
  { title: "Get insurance quotes before you buy", intro: "The same budget can mean very different insurance costs, so check first.",
    cards: [["Why it matters", ["Insurance can differ a lot by model", "Some cars cost far more to insure", "You need cover before you drive away"]], ["How to save", ["Compare several quotes", "Raise your excess if you can afford it", "Ask about discounts and safety features"]]] },
  { title: "Test drive at least 3 cars", intro: "A short drive can reveal things a spec sheet never will.",
    cards: [["Test drive checklist", ["Seating position and visibility", "Braking, steering and acceleration", "Noise on the road and at speed", "Infotainment and controls", "Parking and manoeuvring"]], ["Test drive tips", ["Drive on roads you use every day", "Try motorway or highway speeds", "Take your time, no pressure", "Bring a friend for a second opinion"]]] },
  { title: "Get a pre-purchase inspection (used cars)", intro: "An independent check is cheap insurance against an expensive mistake.",
    cards: [["What it covers", ["Engine, gearbox and brakes", "Suspension, tyres and steering", "Signs of accident repair", "Fluid leaks and warning lights"]], ["Also check", ["Full service history", "Vehicle history report", "Outstanding finance on the car", "Matching VIN and paperwork"]]] },
  { title: "Negotiate the price", intro: "Negotiate in the right order to keep the deal clear.",
    cards: [["1. Negotiate the car price first", ["Agree the price of the car on its own", "Compare with similar cars locally"]], ["2. Trade-in second", ["Know your car's value in advance", "Keep it separate from the purchase price"]], ["3. Financing last", ["Compare with your pre-approval", "Focus on total cost, not just the payment"]]] },
  { title: "Survive the finance office", intro: "This is where extras get offered. Know what you actually need.",
    cards: [["What they may try to sell you", ["Extended warranties", "Paint and interior protection", "Gap cover and service plans"]], ["Your survival checklist", ["Ask for every price in writing", "Take time to read before you sign", "Say no to anything you don't want", "Never feel rushed"]]] },
  { title: "Close the deal and drive home", intro: "A few last checks make for a smooth handover.",
    cards: [["Before signing", ["Check every figure matches the deal", "Confirm the car's condition", "Read all documents in full"]], ["Documents to keep", ["Sales contract and finance agreement", "Registration and title paperwork", "Service history and manuals"]], ["Before driving off", ["Confirm insurance is active", "Get all keys and spares", "Check the car one last time"]]] },
];

const mistakes = [
  ["No pre-approval", "Walking in without a rate in hand gives the seller all the power."],
  ["Buying on emotion", "Fall in love with the deal, not the car. Be ready to walk away."],
  ["Focusing on the payment", "A low payment can hide a long term and a high total cost."],
  ["Skipping inspection", "A small fee can reveal expensive problems before you buy."],
  ["Buying too much car", "Spend within your budget, including insurance and running costs."],
  ["Not reading the contract", "What you sign is what you owe. Read every page."],
  ["Forgetting insurance costs", "Quote the insurance before you commit."],
  ["Rushing the process", "A good deal today is still a good deal tomorrow."],
] as const;

const faqs = [
  ["How much should I spend on my first car?", "A common guide is to keep total vehicle costs, including payment, insurance and fuel, under about 10% of your gross income."],
  ["Do I need a down payment?", "It isn't always required, but 10–20% helps keep payments and interest down and reduces the risk of owing more than the car is worth."],
  ["Is a used car a good first choice?", "Often, yes. A well-maintained used car loses value more slowly than a new one and costs less to buy and insure."],
  ["What documents do I need?", "Usually photo ID, proof of address, proof of income and insurance. Ask us for the list for your situation before you visit."],
  ["Can I buy a car with no credit history?", "Yes, though you may be offered higher rates. A larger deposit or a co-signer can help."],
  ["How long should the loan be?", "Aim for no more than 48–60 months. Longer loans cost more in interest and keep you in debt longer."],
] as const;

export default function FirstTimeBuyerGuide() {
  return (
    <>
      <PageHero crumb="First-Time Buyer Guide" title="First-time car buyer guide: everything you need to know on one page" intro="Buying your first car is exciting and a little overwhelming. This 10-step guide takes you from setting a budget to driving home, with clear tips at every stage." image="fin-keys" />

      <Section title="The 10-step process" sub="Jump to any step." tone="soft">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title}><a href={`#step-${i + 1}`} className="flex h-full items-center gap-3 rounded-xl bg-white p-3 text-xs shadow-sm ring-1 ring-black/5 hover:ring-brand/40"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-[11px] text-white">{i + 1}</span>{s.title}</a></li>
          ))}
        </ol>
      </Section>

      {steps.map((s, i) => (
        <Section key={s.title} id={`step-${i + 1}`} title={`Step ${i + 1}: ${s.title}`} sub={s.intro} tone={i % 2 ? "soft" : "white"}>
          <div className={`grid gap-4 sm:grid-cols-2 ${s.cards.length > 2 ? "lg:grid-cols-3" : ""}`}>
            {s.cards.map(([t, items]) => <InfoCard key={t} title={t}><Bullets items={items} /></InfoCard>)}
          </div>
          {s.link && <p className="text-center"><Link href={s.link[1]} className="inline-block rounded-full bg-brand px-6 py-2.5 text-xs font-medium text-white">{s.link[0]}</Link></p>}
        </Section>
      ))}

      <section className="px-4 py-14">
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200">
            <Image src="/images/fin-drive.jpg" alt="" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-brand">Why first-time buyers take a different approach</h2>
            <p className="text-sm leading-relaxed text-neutral-500">First-time buyers don&apos;t have a car to trade in or years of credit history, so the process feels harder. The upside is that you can set it up the right way from day one: a realistic budget, a pre-approval, a car you have inspected and a contract you understand.</p>
            <p className="text-sm leading-relaxed text-neutral-500">If you want help at any stage, just ask. We would rather you take your time and buy right.</p>
          </div>
        </div>
      </section>

      <Section title="The 8 biggest first-time buyer mistakes" tone="soft">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mistakes.map(([t, d]) => (
            <div key={t} className={`${card} space-y-1`}><p className="text-sm font-semibold text-brand">{t}</p><p className="text-xs leading-relaxed text-neutral-500">{d}</p></div>
          ))}
        </div>
      </Section>

      <Section title="Key numbers for first-time buyers">
        <KeyNumbers items={[["20/4/10", "The affordability rule"], ["3+", "Cars to test drive"], ["48–60 mo", "Recommended loan term"], ["10–20%", "Recommended down payment"]]} />
      </Section>

      <Faq items={faqs} />
      <RelatedGuides current="/financing/first-time-buyer-guide" />
      <CtaBand title="Ready to buy your first car?" text="Browse our inspected cars and talk to us about finance. We'll guide you through every step." />
    </>
  );
}
