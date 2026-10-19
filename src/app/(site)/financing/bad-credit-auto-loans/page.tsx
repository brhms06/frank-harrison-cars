import Image from "next/image";
import { Bullets, Cards, CtaBand, Faq, InfoCard, KeyNumbers, PageHero, Prose, RelatedGuides, Section, card } from "@/components/finance-ui";

export const metadata = { title: "Bad credit auto loans" };

const tiers = [
  ["Excellent (780+)", "About 5–7%"],
  ["Good (660–779)", "About 6–9%"],
  ["Fair (600–659)", "About 9–13%"],
  ["Poor (500–599)", "About 13–19%"],
  ["Very poor (below 500)", "About 15–22%"],
] as const;

const steps = [
  ["Check your credit report", "Get your report for free and look for mistakes. Errors are more common than you think, and fixing them can lift your score."],
  ["Know your exact score", "Lenders price your loan on your score. Knowing it tells you which rate range to expect and what to aim for."],
  ["Improve what you can, fast", "Pay down card balances, bring accounts up to date and avoid new applications. Small moves can add up within weeks."],
  ["Get pre-approved by 2–3 lenders", "Rate shopping within a short window usually counts as a single enquiry. Compare real offers before you visit a dealer."],
  ["Choose an affordable car", "A cheaper, reliable car means a smaller loan, a lower payment and less risk of owing more than the car is worth."],
  ["Refinance in 12–24 months", "Make every payment on time, then refinance to a lower rate once your score has improved."],
] as const;

const strategies = [
  ["Bigger down payment", "A larger deposit reduces the lender's risk, which can lower your rate and improve your chances of approval."],
  ["Choose a cheaper car", "A smaller loan means a smaller payment and less interest, and approval is easier."],
  ["Shortest term possible", "Shorter loans carry lower rates and far less interest. Keep the payment comfortable."],
  ["Credit union first", "Credit unions often lend at lower rates than other lenders, with more flexible rules for members."],
  ["Find a co-signer", "A co-signer with good credit can unlock a much better rate. They share responsibility for the loan."],
  ["Shop multiple lenders", "Rates differ widely between lenders. Compare at least three offers."],
  ["Plan to refinance", "After a year of on-time payments, you may qualify for a much lower rate."],
] as const;

const quickWins = [
  ["Pay down card balances", "Lower balances relative to your limits can lift your score quickly. Aim to get below 30% of each limit."],
  ["Dispute credit report errors", "Check all three reports for mistakes and dispute anything wrong. Corrections can raise your score."],
  ["Make everything current", "Bring late accounts up to date. Recent on-time payments matter more than old mistakes."],
  ["Don't open new accounts", "Each new application can lower your score slightly in the short term."],
  ["Keep old accounts open", "The length of your credit history helps your score, so avoid closing your oldest accounts."],
  ["Ask for a limit increase", "A higher limit on an existing card lowers your utilisation, if you don't spend more."],
] as const;

const traps = [
  ["“Guaranteed approval” claims", "No reputable lender guarantees approval before looking at your details. It is often a sign of very high costs."],
  ["Yo-yo financing", "You drive off, then are told the deal \"fell through\" and asked to sign at a worse rate. Don't take the car until financing is final."],
  ["Payment packing", "Unwanted extras such as warranties, add-ons or insurance slipped into the monthly payment. Ask for every item to be itemised."],
  ["Inflated vehicle prices", "Some sellers raise the car's price for buyers with weak credit. Check the price against similar cars before you agree."],
  ["Excessive loan terms", "Very long loans keep payments low but cost far more and leave you owing more than the car is worth."],
  ["Mandatory extras", "Be wary if a tracker or kill-switch is required without clear terms. Read what each one does and costs."],
] as const;

const faqs = [
  ["Can I get a car loan with bad credit?", "Yes, many people with poor credit are approved, but usually at a higher rate. A bigger down payment, a co-signer or a cheaper car all help."],
  ["How much more will I pay with bad credit?", "Rates can be several times higher than for prime borrowers, which can add thousands in interest. Use the loan calculator to see the effect."],
  ["Will shopping around hurt my score?", "Multiple applications for the same type of loan in a short window are generally treated as one enquiry, so compare offers within a couple of weeks."],
  ["Should I use a buy-here-pay-here dealer?", "Treat it as a last resort. Rates are often high and payments may not help build your credit. Check first whether they report to the credit bureaus."],
  ["Can I refinance later?", "Often, yes. After 12–24 months of on-time payments, and a better score, you can look for a lower rate, as long as the loan terms allow it."],
  ["How can I raise my score quickly?", "Pay down card balances, fix errors on your report, pay everything on time and avoid new credit applications."],
] as const;

export default function BadCredit() {
  return (
    <>
      <PageHero crumb="Bad Credit Auto Loans" title="Bad credit auto loans: how to get approved without getting ripped off" intro="Having bad credit doesn't mean you can't get a car, but it does mean you need to be more careful. Here is a clear guide to the rates, the options and the traps to avoid." image="fin-keys" />

      <Section title="What bad credit actually means for auto loans" sub="Illustrative ranges only. Actual rates vary by lender, market and your circumstances.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className={`${card} space-y-3`}>
            <h3 className="font-semibold text-brand">Typical rate tiers by credit score</h3>
            <dl className="space-y-2 text-sm">{tiers.map(([t, r]) => <div key={t} className="flex justify-between border-b pb-2 last:border-0"><dt className="text-neutral-500">{t}</dt><dd className="font-medium">{r}</dd></div>)}</dl>
          </div>
          <div className={`${card} space-y-3`}>
            <h3 className="font-semibold text-brand">What high rates actually cost you</h3>
            <p className="text-sm leading-relaxed text-neutral-500">On the same car and loan size, a higher rate can add thousands to the total you repay. The gap between a prime rate and a subprime rate on a five-year loan can easily be more than the price of a good used car stereo, a service and a set of tyres combined.</p>
            <p className="text-sm text-neutral-500">Try the <a href="/financing/auto-loan-calculator" className="text-brand underline">auto loan calculator</a> with different rates to see your own numbers.</p>
          </div>
        </div>
      </Section>

      <Section title="The smart approach: step by step" sub="Follow this process to get the best deal available to you." tone="soft">
        <Cards>{steps.map(([t, d], i) => <InfoCard key={t} title={`${i + 1}. ${t}`}><p>{d}</p></InfoCard>)}</Cards>
      </Section>

      <Section title="Where to get a bad credit car loan" sub="Each option has different costs and risks.">
        <Cards>
          <InfoCard title="Credit unions and banks"><p>Often the lowest rates and the most flexible rules for members. Start here and ask what you qualify for.</p><Bullets items={["Often lower rates", "Flexible underwriting", "Pre-approval available"]} /></InfoCard>
          <InfoCard title="Online subprime lenders"><p>Fast and easy to compare, and you can see offers without visiting a dealer. Read the terms carefully.</p><Bullets items={["Compare several offers", "Apply from home", "Check fees and terms"]} /></InfoCard>
          <InfoCard title="Dealer financing (carefully)"><p>Convenient, and we can arrange finance on the car you choose. Compare it against your pre-approval.</p><Bullets items={["One stop", "Ask for every figure in writing", "Compare against pre-approval"]} /></InfoCard>
        </Cards>
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard title="Co-signer option"><p>A co-signer with good credit can drop your rate significantly. They are equally responsible for the loan, and missed payments affect both of you, so talk it through first.</p></InfoCard>
          <InfoCard title="Buy-here-pay-here: last resort only"><p>These lenders approve almost anyone, but rates and prices are often high, and payments may not be reported to the credit bureaus. Use only if nothing else is available.</p></InfoCard>
        </div>
      </Section>

      <Section title="7 strategies for a lower rate with bad credit" tone="soft">
        <Cards>{strategies.map(([t, d], i) => <InfoCard key={t} title={`#${i + 1}: ${t}`}><p>{d}</p></InfoCard>)}</Cards>
      </Section>

      <Section title="Quick credit score improvements (30–90 days)" sub="Small changes you can make before you apply.">
        <Cards>{quickWins.map(([t, d]) => <InfoCard key={t} title={t}><p>{d}</p></InfoCard>)}</Cards>
      </Section>

      <Section title="Predatory traps to avoid" sub="Watch for these red flags in the deal." tone="soft">
        <Cards>{traps.map(([t, d]) => <InfoCard key={t} title={t}><p>{d}</p></InfoCard>)}</Cards>
      </Section>

      <section className="px-4 py-14">
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-brand">The refinance strategy: your exit plan</h2>
            <p className="text-sm leading-relaxed text-neutral-500">A high-rate loan does not have to last for its full term. Make every payment on time, keep your balances low, and after 12–24 months check your score again. If it has improved, apply to refinance at a lower rate and keep the savings.</p>
            <Bullets items={["Months 1–6: pay on time and don't open new credit", "Months 6–12: keep balances low and check your report", "Months 12–24: compare refinance offers", "Switch only if the new rate and fees beat what you have"]} />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200">
            <Image src="/images/camry-a.jpg" alt="" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <Section title="Key numbers for bad credit borrowers" tone="soft">
        <KeyNumbers items={[["Compare 3+", "Lenders before choosing"], ["30–90 days", "To improve your score quickly"], ["10–20%", "Down payment helps a lot"], ["12–24 mo", "Then consider refinancing"]]} />
      </Section>

      <Prose title="Navigating auto loans with bad credit">
        <p>Bad credit makes car buying harder, but not impossible. The people who come out best are the ones who prepare: they check their credit report, know their budget, get several offers and walk in with a pre-approval so they are not at the mercy of the first number they are given.</p>
        <p>Be honest about what you can afford. A modest, reliable car on a short loan will cost you less and help you rebuild your credit faster than a bigger car on a very long loan. Every on-time payment improves your credit history, which opens the door to better rates next time.</p>
        <p>If you are not sure where to start, talk to us. We can explain your options in plain English before you commit to anything.</p>
      </Prose>

      <Faq items={faqs} />
      <RelatedGuides current="/financing/bad-credit-auto-loans" />
      <CtaBand title="Bad credit doesn't mean bad options" text="Tell us your situation. We'll explain what's possible, with clear terms and no pressure." />
    </>
  );
}
