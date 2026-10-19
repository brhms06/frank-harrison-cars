// Run: node src/lib/finance.check.ts
import assert from "node:assert/strict";
import { balanceAfter, leaseVsBuy, payment } from "./finance.ts";

assert.ok(Math.abs(payment(30000, 6, 60) - 579.98) < 0.01); // standard amortisation figure
assert.equal(payment(12000, 0, 12), 1000);
assert.equal(payment(0, 6, 60), 0);
assert.ok(Math.abs(balanceAfter(30000, 6, 60, 60)) < 1e-9);
assert.ok(balanceAfter(30000, 6, 60, 30) > 0 && balanceAfter(30000, 6, 60, 30) < 30000);
const r = leaseVsBuy({ price: 40000, dueAtSigning: 2000, moneyFactor: 0.0025, residualPct: 60, leaseTerm: 36, acquisitionFee: 1000, dispositionFee: 400, down: 5000, apr: 6, loanTerm: 60, valuePct: 40, years: 5 });
assert.ok(r.leaseTotal > 0 && r.buyTotal > 0 && r.equity > 0);
console.log("finance ok", Math.round(r.leaseTotal), Math.round(r.buyTotal));
