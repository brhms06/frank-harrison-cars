"use client";
import Link from "next/link";
import { useState } from "react";
import { useMoney } from "@/components/currency";
import { Slider } from "@/components/slider";
import { leaseVsBuy } from "@/lib/finance";

export function LeaseBuyCalculator() {
  const money = useMoney();
  const [price, setPrice] = useState(40000);
  const [due, setDue] = useState(2000);
  const [mf, setMf] = useState(0.0025);
  const [residual, setResidual] = useState(60);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [acq, setAcq] = useState(1000);
  const [disp, setDisp] = useState(400);
  const [down, setDown] = useState(5000);
  const [apr, setApr] = useState(6);
  const [loanTerm, setLoanTerm] = useState(60);
  const [valuePct, setValuePct] = useState(40);
  const [years, setYears] = useState(5);

  const r = leaseVsBuy({ price, dueAtSigning: due, moneyFactor: mf, residualPct: residual, leaseTerm, acquisitionFee: acq, dispositionFee: disp, down, apr, loanTerm, valuePct, years });
  const saving = Math.abs(r.leaseTotal - r.buyTotal);
  const buyWins = r.buyTotal <= r.leaseTotal;
  const max = Math.max(r.leaseTotal, r.buyTotal) || 1;

  const results: [string, [string, number][], number][] = [
    ["Lease results", [["Monthly payment", r.leaseMonthly], ["Total monthly payments", r.leaseMonthlyTotal], ["Due at signing", due], ["Acquisition + fees", acq], ["Disposition fee", disp], ["Equity at end", 0]], r.leaseTotal],
    ["Buy results", [["Monthly payment", r.buyMonthly], ["Total monthly payments", r.buyMonthlyTotal], ["Down payment", down], ["Total interest", r.interest], ["Vehicle value at end", r.value], ["Equity at end", r.equity]], r.buyTotal],
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <Slider label="Vehicle price (negotiated)" value={price} min={10000} max={100000} step={500} onChange={setPrice} display={money(price)} minLabel={money(10000)} maxLabel={money(100000)} />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-5">
            <h3 className="font-semibold text-brand">Lease scenario</h3>
            <Slider label="Due at signing" value={due} min={0} max={8000} step={250} onChange={setDue} display={money(due)} />
            <Slider label="Money factor" value={mf} min={0.0005} max={0.006} step={0.0001} onChange={setMf} display={`${mf.toFixed(4)} (≈ ${(mf * 2400).toFixed(1)}% APR)`} />
            <Slider label="Residual value" value={residual} min={30} max={80} onChange={setResidual} display={`${residual}%`} />
            <Slider label="Lease term" value={leaseTerm} min={24} max={48} step={6} onChange={setLeaseTerm} display={`${leaseTerm} months`} />
            <Slider label="Acquisition and fees" value={acq} min={0} max={2500} step={50} onChange={setAcq} display={money(acq)} />
            <Slider label="Disposition fee (at turn-in)" value={disp} min={0} max={1000} step={50} onChange={setDisp} display={money(disp)} />
          </div>
          <div className="space-y-5">
            <h3 className="font-semibold text-brand">Buy scenario</h3>
            <Slider label="Down payment" value={down} min={0} max={30000} step={250} onChange={setDown} display={money(down)} />
            <Slider label="Interest rate (APR)" value={apr} min={0} max={20} step={0.1} onChange={setApr} display={`${apr.toFixed(1)}%`} />
            <Slider label="Loan term" value={loanTerm} min={24} max={84} step={12} onChange={setLoanTerm} display={`${loanTerm} months`} />
            <Slider label="Estimated value after ownership" value={valuePct} min={20} max={70} onChange={setValuePct} display={`${valuePct}% of price`} />
            <Slider label="Years you plan to keep" value={years} min={2} max={10} onChange={setYears} display={`${years} years`} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-brand p-6 text-center text-white" aria-live="polite">
        <p className="text-xs text-white/70">Based on your numbers</p>
        <p className="text-2xl font-bold">{buyWins ? "Buying" : "Leasing"} saves you {money(saving)} over {years} years</p>
        <p className="text-xs text-white/70">after accounting for equity, fees and total payments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {results.map(([title, rows, total]) => (
          <div key={title} className="space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h3 className="font-semibold text-brand">{title}</h3>
            <dl className="space-y-2 text-sm">
              {rows.map(([l, v]) => <div key={l} className="flex justify-between"><dt className="text-neutral-500">{l}</dt><dd className="font-medium">{money(v)}</dd></div>)}
              <div className="flex justify-between border-t pt-2 font-semibold"><dt>Total true cost</dt><dd className="text-brand">{money(total)}</dd></div>
            </dl>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h3 className="font-semibold text-brand">Total true cost comparison</h3>
        {([["Lease", r.leaseTotal, "bg-neutral-400"], ["Buy", r.buyTotal, "bg-brand"]] as const).map(([l, v, c]) => (
          <div key={l} className="flex items-center gap-3 text-xs">
            <span className="w-10">{l}</span>
            <div className="h-6 flex-1 rounded bg-neutral-100"><div className={`h-6 rounded ${c}`} style={{ width: `${(v / max) * 100}%` }} /></div>
            <span className="w-24 text-right font-medium">{money(v)}</span>
          </div>
        ))}
        <p className="text-[11px] text-neutral-400">True cost = cash paid, plus any remaining loan balance, minus what the car is worth at the end. An estimate, not a quote.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/cars" className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white">Find my next car</Link>
        <Link href="/contact" className="rounded-full border bg-white px-6 py-3 text-sm font-medium">Talk to us about finance</Link>
      </div>
    </div>
  );
}
