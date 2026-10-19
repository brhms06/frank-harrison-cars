// ponytail: static rates; replace with live rates if the owner wants exact conversion.
// Rates are units of currency per 1 USD. Stored car prices are in the dealership's base currency (admin setting).
export const CURRENCIES = {
  USD: { rate: 1, locale: "en-US" },
  GBP: { rate: 0.79, locale: "en-GB" },
  EUR: { rate: 0.92, locale: "de-DE" },
  CAD: { rate: 1.37, locale: "en-CA" },
  NGN: { rate: 1550, locale: "en-NG" },
  GHS: { rate: 15, locale: "en-GH" },
  KES: { rate: 129, locale: "en-KE" },
} as const;

export type Currency = keyof typeof CURRENCIES;

export const isCurrency = (c: string): c is Currency => c in CURRENCIES;

/** Format an amount held in `base` currency as `currency`. */
export function formatMoney(amount: number, currency: Currency, base: Currency) {
  const converted = (amount * CURRENCIES[currency].rate) / CURRENCIES[base].rate;
  return new Intl.NumberFormat(CURRENCIES[currency].locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(converted);
}
