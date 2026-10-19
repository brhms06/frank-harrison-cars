import { Briefcase, Gauge, KeyRound, Repeat, Route, Wrench } from "lucide-react";
import { Bullets, Cards, CtaBand, Faq, InfoCard, KeyNumbers, PageHero, Prose, RelatedGuides, Section, card } from "@/components/finance-ui";
import { LeaseBuyCalculator } from "@/components/lease-buy-calculator";

export const metadata = { title: "Lease vs buy calculator" };

const faqs = [
  ["Is it cheaper to lease or buy?", "Leasing usually has the lower monthly payment, but buying is usually cheaper over five years or more because you end up owning an asset. The calculator compares both for your numbers."],
  ["What are the hidden costs of leasing?", "Acquisition and disposition fees, mileage overage charges, excess wear and tear, early termination penalties and the fact that you never finish paying."],
  ["When does leasing make financial sense?", "If you use the car for business, drive low mileage, or like to swap into a new car every few years, leasing can work well."],
  ["Is buying the clear winner?", "Not always. If you only want to keep a car for two or three years, the depreciation hit when buying can make leasing competitive."],
  ["What is residual value and why does it matter?", "It is what the car is expected to be worth at the end of the lease. A higher residual means lower depreciation to pay for, and a lower monthly payment."],
  ["How does this calculator work?", "It adds up everything you would pay under each option over your chosen time frame, then subtracts the equity you would own at the end. Treat the result as a guide, not a quote."],
] as const;

export default function LeaseVsBuy() {
  return (
    <>
      <PageHero crumb="Lease vs Buy" title="Lease vs buy calculator: compare the total cost side by side" intro="A lower payment doesn't always mean a lower cost. Enter your numbers to see the real total cost of leasing versus buying, including equity, fees and what you're left with at the end." image="fin-drive" />

      <section className="bg-brand-soft px-4 py-12"><div className="mx-auto max-w-5xl"><LeaseBuyCalculator /></div></section>

      <Section title="Lease vs buy: key differences" sub="Beyond the monthly payment, here is what matters.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className={`${card} space-y-3`}>
            <h3 className="text-lg font-semibold text-brand">Leasing</h3>
            <Bullets items={["Lower monthly payment (typically 30–40% less)", "New car every 2–3 years", "Usually under warranty throughout", "Lower upfront costs", "Possible business tax deductions"]} />
            <Bullets tone="bad" items={["No equity at the end", "Mileage limits", "Wear and tear charges at turn-in", "Limited modifications", "Always have a car payment"]} />
          </div>
          <div className={`${card} space-y-3 ring-2 ring-brand`}>
            <p className="text-xs font-medium text-brand">Often the lower total cost over 5+ years</p>
            <h3 className="text-lg font-semibold text-brand">Buying</h3>
            <Bullets items={["Build equity: the car is yours once paid off", "No mileage restrictions", "Modify and customise freely", "Payment-free driving once paid off", "Lower total cost over long ownership"]} />
            <Bullets tone="bad" items={["Higher monthly payment", "Larger down payment recommended", "Maintenance costs after warranty", "Depreciation risk", "Selling or trading effort"]} />
          </div>
        </div>
      </Section>

      <Section title="When leasing makes sense" sub="Leasing isn't always worse. Here is when it wins." tone="soft">
        <Cards>
          <InfoCard title="Business use" icon={<Briefcase className="size-6 text-brand" />}><p>If you use the car for business, lease payments may be tax deductible. Check with a tax professional for your situation.</p></InfoCard>
          <InfoCard title="You swap every 2–3 years" icon={<Repeat className="size-6 text-brand" />}><p>If you are going to trade in every few years anyway, leasing avoids the steepest part of depreciation: you only pay for the portion of the car&apos;s life you use.</p></InfoCard>
          <InfoCard title="Low-mileage driver" icon={<Gauge className="size-6 text-brand" />}><p>If you drive under about 12,000 miles a year, mileage allowances are not a problem. High mileage drivers face overage fees that erase the advantage.</p></InfoCard>
        </Cards>
      </Section>

      <Section title="When buying makes sense" sub="For most people in most situations, buying wins long term.">
        <Cards>
          <InfoCard title="You keep cars 5+ years" icon={<KeyRound className="size-6 text-brand" />}><p>The maths overwhelmingly favours buying if you keep the car past the loan term. Years of payment-free driving are the real saving.</p></InfoCard>
          <InfoCard title="You drive a lot" icon={<Route className="size-6 text-brand" />}><p>Buying removes mileage penalties entirely. At typical overage rates, a few thousand extra miles a year adds up quickly on a lease.</p></InfoCard>
          <InfoCard title="You want freedom" icon={<Wrench className="size-6 text-brand" />}><p>Buying means no turn-in inspection, no wear charges and no mileage tracking. Customise it, road trip across the country, and let the dog ride in back.</p></InfoCard>
        </Cards>
      </Section>

      <Section title="Hidden costs most calculators miss" sub="The full picture includes more than monthly payments." tone="soft">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard title="Hidden lease costs"><Bullets tone="bad" items={["Acquisition fee (often rolled into payments)", "Disposition fee at turn-in", "Mileage overages", "Excess wear and tear charges", "Early termination penalties", "A gap between leases when you never stop paying"]} /></InfoCard>
          <InfoCard title="Hidden buy costs"><Bullets tone="bad" items={["Depreciation: the biggest cost in the first years", "Out-of-warranty repairs", "Higher insurance for full coverage", "Negative equity risk on long loans", "Opportunity cost of your down payment", "Selling hassle: time and effort to sell or trade"]} /></InfoCard>
        </div>
      </Section>

      <Section title="Key numbers to know">
        <KeyNumbers items={[["30–40%", "Lower lease payment vs buy"], ["~60%", "Typical value left after 3 years"], ["Year 4–5", "When buying typically breaks even"], ["12,000 mi", "A common lease mileage allowance"]]} />
      </Section>

      <Prose title="The real answer to: should I lease or buy?">
        <p>The lease or buy debate generates strong opinions, but the right answer depends entirely on your own situation: how long you keep cars, how much you drive, whether you use the vehicle for business, and how much you value financial flexibility versus ownership.</p>
        <p>Leasing wins on monthly cash flow. Because you only pay for the part of the car&apos;s value you use, monthly payments are often lower, and you get a new car with a full warranty coverage every few years. For business users who can deduct lease payments, the tax advantage can matter too.</p>
        <p>Buying wins on total cost of ownership. The moment you make your last loan payment, the monthly cost of driving drops to fuel, insurance and maintenance. A buyer who keeps a car for seven to ten years will usually spend significantly less than someone who leases every three years, and still has a car to sell or trade in.</p>
        <p>Use the calculator with your own figures rather than relying on generalisations. Compare the total true cost, not just the payment, and ask us about any fees before you sign.</p>
      </Prose>

      <Faq items={faqs} />
      <RelatedGuides current="/financing/lease-vs-buy" />
      <CtaBand title="Know the numbers, now find your car" text="Whether you lease or buy, get a clear finance figure first and shop with confidence." />
    </>
  );
}
