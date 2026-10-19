import { asc, desc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { db } from "@/db";
import { brands, faqs, siteSettings, testimonials } from "@/db/schema";

export type Settings = typeof siteSettings.$inferSelect;

// shown until the admin saves settings for the first time
export const defaultSettings: Settings = {
  id: 1, phones: [], whatsapp: "", smsNumber: "", email: "", address: "", defaultCurrency: "USD",
  showTestimonials: true, showFaq: true, showWhatsapp: true, showCurrencySwitcher: true, showTranslator: true,
};

export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheTag("settings");
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
  return row ?? defaultSettings;
}

export async function getBrands(onlyActive = true) {
  "use cache";
  cacheTag("brands");
  const q = db.select().from(brands);
  return (onlyActive ? q.where(eq(brands.active, true)) : q).orderBy(asc(brands.position), asc(brands.name));
}

export async function getTestimonials(onlyVisible = true) {
  "use cache";
  cacheTag("testimonials");
  const q = db.select().from(testimonials);
  return (onlyVisible ? q.where(eq(testimonials.visible, true)) : q).orderBy(desc(testimonials.createdAt));
}

export async function getFaqs(onlyVisible = true) {
  "use cache";
  cacheTag("faqs");
  const q = db.select().from(faqs);
  return (onlyVisible ? q.where(eq(faqs.visible, true)) : q).orderBy(asc(faqs.position), asc(faqs.id));
}
