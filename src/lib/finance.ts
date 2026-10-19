/** Monthly payment on an amortising loan. apr is a percentage. */
export function payment(principal: number, apr: number, months: number) {
  if (principal <= 0) return 0;
  const r = apr / 1200;
  return r === 0 ? principal / months : (principal * r) / (1 - (1 + r) ** -months);
}

/** Remaining loan balance after `paid` payments. */
export function balanceAfter(principal: number, apr: number, months: number, paid: number) {
  const r = apr / 1200;
  const pmt = payment(principal, apr, months);
  if (paid >= months) return 0;
  return r === 0 ? principal - pmt * paid : principal * (1 + r) ** paid - (pmt * ((1 + r) ** paid - 1)) / r;
}

export function loanSummary(principal: number, apr: number, months: number) {
  const monthly = payment(principal, apr, months);
  return { monthly, totalInterest: monthly * months - principal, totalPaid: monthly * months };
}

export type LeaseBuyInput = {
  price: number; dueAtSigning: number; moneyFactor: number; residualPct: number; leaseTerm: number; acquisitionFee: number; dispositionFee: number;
  down: number; apr: number; loanTerm: number; valuePct: number; years: number;
};

export function leaseVsBuy(i: LeaseBuyInput) {
  const horizon = i.years * 12;
  const residual = (i.price * i.residualPct) / 100;
  const capCost = i.price + i.acquisitionFee - i.dueAtSigning;
  const leaseMonthly = (capCost - residual) / i.leaseTerm + (capCost + residual) * i.moneyFactor;
  const cycles = horizon / i.leaseTerm;
  const leaseTotal = cycles * (leaseMonthly * i.leaseTerm + i.dueAtSigning + i.dispositionFee);

  const loan = Math.max(0, i.price - i.down);
  const buyMonthly = payment(loan, i.apr, i.loanTerm);
  const cashOut = i.down + buyMonthly * Math.min(i.loanTerm, horizon);
  const value = (i.price * i.valuePct) / 100;
  const balance = balanceAfter(loan, i.apr, i.loanTerm, horizon);
  const buyTotal = cashOut + balance - value;
  return {
    leaseMonthly, leaseTotal, leaseMonthlyTotal: leaseMonthly * i.leaseTerm * cycles, cycles,
    buyMonthly, buyTotal, buyMonthlyTotal: buyMonthly * Math.min(i.loanTerm, horizon), interest: buyMonthly * i.loanTerm - loan, value, equity: value - balance,
  };
}
