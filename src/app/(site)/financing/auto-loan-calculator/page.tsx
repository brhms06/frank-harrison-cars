import { Banknote, Gauge, ShieldCheck } from "lucide-react";
import { Price } from "@/components/currency";
import { Bullets, Cards, CtaBand, Faq, InfoCard, KeyNumbers, PageHero, Prose, RelatedGuides, Section, card } from "@/components/finance-ui";
import { LoanCalculator } from "@/components/loan-calculator";
import { loanSummary } from "@/lib/finance";

export const metadata = { title: "Auto loan calculator" };

const scenarios = [
  { months: 36, apr: 5.5, note: "Highest payment, lowest total cost. Best if you can afford it.", tag: "Lowest cost" },
  { months: 60, apr: 6.0, note: "A balance of payment and cost. The most popular choice.", tag: "Sweet spot", best: true },
  { months: 84, apr: 7.0, note: "Lowest payment, but far more interest, and a long time to owe on a car that loses value.", tag: "Most interest" },
].map((s) => ({ ...s, ...loanSummary(30000, s.apr, s.months) }));

const rates = [3, 5, 7, 10].map((apr) => ({ apr, ...loanSummary(30000, apr, 60) }));
const rateGap = rates[3].totalInterest - rates[0].totalInterest;

const faqs = [
  ["How is a car payment calculated?", "Your payment depends on the loan amount (price minus down payment and trade-in), the interest rate (APR) and the term. The calculator spreads the amount you borrow, plus interest, evenly across every month of the loan."],
  ["What is a good monthly car payment?", "A common guideline is to keep your total monthly car costs, including insurance and fuel, under 10% of your gross monthly income, with the loan payment itself well below that."],
  ["How much car can I afford?", "Try the 20/4/10 rule: 20% down, a loan of no more than 4 years, and total vehicle costs under 10% of gross income. Then use the sliders to see what price fits."],
  ["Does a larger down payment make a difference?", "Yes. It lowers the amount you borrow, so you pay less interest and a smaller monthly payment, and it helps you avoid owing more than the car is worth."],
  ["Should I choose a shorter or longer loan term?", "A shorter term costs more each month but far less in total interest. A longer term eases the monthly payment but you pay more overall and stay in debt longer."],
  ["How much interest will I pay in total?", "The calculator shows total interest for your exact numbers. Move the APR and term sliders to see how much a lower rate or shorter loan could save."],
] as const;

export default function AutoLoanCalculator() {
  return (
    <>
      <PageHero crumb="Auto Loan Calculator" title="Auto loan calculator: estimate your monthly payment and total cost" intro="Enter your numbers to see your estimated monthly payment, total interest and total cost. Adjust the sliders to compare scenarios." image="fin-dash" />

      <section className="bg-brand-soft px-4 py-12">
        <div className="mx-auto max-w-5xl"><LoanCalculator /></div>
      </section>

      <Section title="Compare loan scenarios" sub={<>Same car, different terms. See how the numbers change on a loan of <Price n={30000} />.</>}>
        <div className="grid gap-4 md:grid-cols-3">
          {scenarios.map((s) => (
            <div key={s.months} className={`${card} space-y-3 ${s.best ? "ring-2 ring-brand" : ""}`}>
              <p className="text-xs font-medium text-brand">{s.tag}</p>
              <h3 className="text-lg font-semibold">{s.months}-month loan</h3>
              <p className="text-xs text-neutral-500"><Price n={30000} /> at {s.apr.toFixed(1)}% APR</p>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-neutral-500">Payment</dt><dd className="font-medium"><Price n={s.monthly} />/mo</dd></div>
                <div className="flex justify-between"><dt className="text-neutral-500">Total interest</dt><dd className="font-medium"><Price n={s.totalInterest} /></dd></div>
                <div className="flex justify-between"><dt className="text-neutral-500">Total cost</dt><dd className="font-medium"><Price n={s.totalPaid} /></dd></div>
              </dl>
              <p className="text-xs text-neutral-500">{s.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="The 20/4/10 rule: how much car can you afford?" sub="A widely used affordability guideline." tone="soft">
        <Cards>
          {[["20%", "Down payment", "Put at least 20% down to reduce the loan, lower your payment and protect against negative equity."], ["4 yrs", "Maximum loan term", "Finance for no more than 48 months to minimise interest and stay ahead of depreciation."], ["10%", "Of gross income", "Keep total vehicle costs (payment, insurance, fuel) under 10% of your gross monthly income."]].map(([n, t, d]) => (
            <div key={t} className={`${card} space-y-2 text-center`}>
              <p className="text-3xl font-bold text-brand">{n}</p>
              <h3 className="text-sm font-semibold">{t}</h3>
              <p className="text-xs leading-relaxed text-neutral-500">{d}</p>
            </div>
          ))}
        </Cards>
        <p className="mx-auto max-w-3xl rounded-xl bg-white p-4 text-sm text-neutral-600 ring-1 ring-brand/30"><b>Example:</b> earning <Price n={6000} /> a month gross means a maximum of about <Price n={600} /> a month in total vehicle costs. After around <Price n={150} /> for insurance and fuel, that leaves roughly <Price n={450} /> for the loan payment.</p>
      </Section>

      <Section title="How interest rate affects your total cost" sub={<>On a loan of <Price n={30000} /> over 60 months. See why rate shopping matters.</>}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rates.map((r) => (
            <div key={r.apr} className={`${card} text-center`}>
              <p className="text-xl font-bold text-brand">{r.apr}.0% APR</p>
              <p className="text-sm font-medium"><Price n={r.monthly} />/mo</p>
              <p className="text-xs text-neutral-500"><Price n={r.totalInterest} /> total interest</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-neutral-500">The gap between 3% and 10% is about <b><Price n={rateGap} /></b> in extra interest. Comparing offers before you sign is worth the time.</p>
      </Section>

      <Section title="Quick financing tips" sub="Apply these before you sign anything." tone="soft">
        <Cards>
          <InfoCard title="Get pre-approved first" icon={<ShieldCheck className="size-6 text-brand" />}><p>Lock in a rate with your bank or lender before you visit the dealer. If our offer can&apos;t beat it, you already have your financing secured.</p></InfoCard>
          <InfoCard title="Negotiate price, not payment" icon={<Banknote className="size-6 text-brand" />}><p>A low monthly figure can hide a long term or a high price. Agree the total price of the car first, then talk about how to pay for it.</p></InfoCard>
          <InfoCard title="Improve your score first" icon={<Gauge className="size-6 text-brand" />}><p>Even a small improvement in your credit score can lower your rate. Pay down cards, fix errors and avoid new credit before you apply.</p></InfoCard>
        </Cards>
      </Section>

      <Section title="Key numbers to know">
        <KeyNumbers items={[["Compare 3+", "Lenders before choosing"], ["48–60 mo", "Recommended loan term"], ["10–20%", "Recommended down payment"], ["10%", "Max of gross income on car costs"]]} />
      </Section>

      <Prose title="How to use this auto loan calculator to make a smarter purchase">
        <p>A car payment is one of the largest recurring expenses in most people&apos;s budgets, and many buyers commit to a loan without fully understanding what they are agreeing to. The monthly payment is just one number. What matters equally is how much of that payment goes to interest versus principal, and how much you will pay in total over the life of the loan.</p>
        <p>Adjust the sliders for price, down payment, trade-in, interest rate and term and you can see in real time how each variable affects your monthly payment and total cost. The breakdown bar shows the split between principal and interest, a useful reminder that longer terms and higher rates mean a greater share of every payment goes to the lender rather than toward owning your car.</p>
        <p>The most powerful use of the tool is scenario comparison. Try the same car at 60 months and then at 72 or 84 months and watch the total interest climb. Increase your down payment by a small amount and see the monthly saving. These comparisons take seconds and can be worth a lot over the life of a loan.</p>
        <Bullets items={["Know what you can afford and what rate you should be targeting.", "Get pre-approved, then compare our finance offer against it.", "Keep the term as short as your budget allows."]} />
      </Prose>

      <Faq items={faqs} />
      <RelatedGuides current="/financing/auto-loan-calculator" />
      <CtaBand title="Know your payment, now find your car" text="Get a clear finance figure before you commit. Talk to us about the car you have in mind." />
    </>
  );
}
