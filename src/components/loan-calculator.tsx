"use client";
import Link from "next/link";
import { useState } from "react";
import { useMoney } from "@/components/currency";
import { Slider } from "@/components/slider";
import { loanSummary } from "@/lib/finance";

export function LoanCalculator() {
  const money = useMoney();
  const [price, setPrice] = useState(35000);
  const [down, setDown] = useState(5000);
  const [trade, setTrade] = useState(0);
  const [apr, setApr] = useState(6);
  const [term, setTerm] = useState(60);

  const loan = Math.max(0, price - down - trade);
  const { monthly, totalInterest, totalPaid } = loanSummary(loan, apr, term);
  const interestPct = totalPaid ? Math.round((totalInterest / totalPaid) * 100) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="text-lg font-semibold text-brand">Enter your loan details</h2>
        <Slider label="Vehicle price" value={price} min={1000} max={100000} step={500} onChange={setPrice} display={money(price)} minLabel={money(1000)} maxLabel={money(100000)} />
        <Slider label="Down payment" value={down} min={0} max={30000} step={250} onChange={setDown} display={money(down)} minLabel={money(0)} maxLabel={money(30000)} />
        <Slider label="Trade-in value" value={trade} min={0} max={40000} step={250} onChange={setTrade} display={money(trade)} minLabel={money(0)} maxLabel={money(40000)} />
        <Slider label="Interest rate (APR)" value={apr} min={0} max={25} step={0.1} onChange={setApr} display={`${apr.toFixed(1)}%`} minLabel="0%" maxLabel="25%" />
        <Slider label="Loan term" value={term} min={12} max={84} step={6} onChange={setTerm} display={`${term} months`} minLabel="12 mo" maxLabel="84 mo" />
        <Link href="/contact" className="block rounded-full bg-brand py-3 text-center text-sm font-medium text-white">Ask us about finance at this rate →</Link>
      </div>

      <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="text-lg font-semibold text-brand">Your estimated payment</h2>
        <div className="rounded-xl bg-brand p-6 text-center text-white" aria-live="polite">
          <p className="text-xs text-white/70">Monthly payment</p>
          <p className="text-4xl font-bold">{money(monthly)}</p>
          <p className="text-xs text-white/70">per month for {term} months</p>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-center text-sm">
          {[["Loan amount", loan], ["Total interest", totalInterest], ["Total cost", totalPaid], ["Down + trade-in", down + trade]].map(([l, v]) => (
            <div key={l as string}><dt className="text-xs text-neutral-500">{l}</dt><dd className="font-semibold">{money(v as number)}</dd></div>
          ))}
        </dl>
        <div className="space-y-1.5">
          <p className="text-xs font-medium">Payment breakdown</p>
          <div className="flex h-3 overflow-hidden rounded-full bg-neutral-200" role="img" aria-label={`${100 - interestPct}% principal, ${interestPct}% interest`}>
            <div className="bg-brand" style={{ width: `${100 - interestPct}%` }} />
            <div className="bg-amber-500" style={{ width: `${interestPct}%` }} />
          </div>
          <p className="flex justify-between text-[11px] text-neutral-500"><span>Principal {100 - interestPct}%</span><span>Interest {interestPct}%</span></p>
        </div>
        <p className="rounded-lg bg-brand-soft p-3 text-xs text-neutral-600"><b>Tip:</b> a bigger down payment or a shorter term can cut the interest you pay. Try the sliders.</p>
        <p className="text-[11px] text-neutral-400">Estimates only, not a credit offer. Your actual rate depends on your lender and circumstances.</p>
      </div>
    </div>
  );
}
