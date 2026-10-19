"use client";
import { createContext, useContext, useSyncExternalStore } from "react";
import { CURRENCIES, formatMoney, isCurrency, type Currency } from "@/lib/currency";

const KEY = "currency";
const listeners = new Set<() => void>();

// base = the dealership's currency (admin setting); locked = customers may not switch
const Ctx = createContext<{ base: Currency; locked: boolean }>({ base: "USD", locked: false });

export function CurrencyProvider({ base, locked, children }: { base: string; locked: boolean; children: React.ReactNode }) {
  return <Ctx.Provider value={{ base: isCurrency(base) ? base : "USD", locked }}>{children}</Ctx.Provider>;
}

function read(base: Currency): Currency {
  try {
    const v = localStorage.getItem(KEY);
    return v && isCurrency(v) ? v : base;
  } catch {
    return base;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => { listeners.delete(cb); window.removeEventListener("storage", cb); };
}

export function useCurrency() {
  const { base, locked } = useContext(Ctx);
  const chosen = useSyncExternalStore(subscribe, () => read(base), () => base);
  return { base, currency: locked ? base : chosen };
}

/** Returns a formatter for amounts held in the dealership's base currency. */
export function useMoney() {
  const { base, currency } = useCurrency();
  return (n: number) => formatMoney(n, currency, base);
}

export function Price({ n }: { n: number }) {
  const money = useMoney();
  return <>{money(n)}</>;
}

export function CurrencySwitcher() {
  const { currency } = useCurrency();
  return (
    <select
      aria-label="Currency"
      value={currency}
      onChange={(e) => { try { localStorage.setItem(KEY, e.target.value); } catch {} listeners.forEach((l) => l()); }}
      className="h-8 rounded-full bg-neutral-100 px-2 text-xs outline-none"
    >
      {Object.keys(CURRENCIES).map((c) => <option key={c}>{c}</option>)}
    </select>
  );
}
