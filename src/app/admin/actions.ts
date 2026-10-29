"use server";
import { eq, max, sql } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { brands, carImages, cars, contactMessages, enquiries, faqs, ownerSettings, siteSettings, testimonials } from "@/db/schema";
import { isMaster, requireAdmin, requireMaster } from "@/lib/admin";
import { isCurrency } from "@/lib/currency";
import { carFiles, carImageUrl } from "@/lib/storage";

export type FormState = { ok?: boolean; error?: string };

const on = (f: FormData, k: string) => f.get(k) === "on";
const fail = (e: z.ZodError): FormState => ({ error: e.issues[0].message });
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ---------- settings ----------
const optionalEmail = z.string().trim().max(200).refine((v) => !v || z.string().email().safeParse(v).success, "Enter a valid email");

const discordHook = z.string().trim().max(300).refine((v) => !v || /^https:\/\/(discord|discordapp)\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(v), "Enter a Discord webhook URL (https://discord.com/api/webhooks/...)");

const settingsSchema = z.object({
  discordWebhook: discordHook,
  phones: z.string().transform((s) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean)).pipe(z.array(z.string().max(30)).max(10)),
  smsNumber: z.string().trim().max(30).refine((v) => !v || /^\+?[\d\s()-]{7,}$/.test(v), "Enter a valid text message number"),
  whatsapp: z.string().trim().max(30).refine((v) => !v || /^\+?[\d\s()-]{7,}$/.test(v), "Enter a valid WhatsApp number"),
  email: optionalEmail,
  address: z.string().trim().max(300),
  defaultCurrency: z.string().refine(isCurrency, "Pick a currency"),
});

export async function saveSettings(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(f));
  if (!parsed.success) return fail(parsed.error);
  const values = {
    ...parsed.data,
    showTestimonials: on(f, "showTestimonials"),
    showFaq: on(f, "showFaq"),
    showWhatsapp: on(f, "showWhatsapp"),
    showLiveChat: on(f, "showLiveChat"),
    showCurrencySwitcher: on(f, "showCurrencySwitcher"),
    showTranslator: on(f, "showTranslator"),
  };
  await db.insert(siteSettings).values({ id: 1, ...values }).onConflictDoUpdate({ target: siteSettings.id, set: values });
  updateTag("settings");
  return { ok: true };
}

/** Master only: the webhook that sends every order to the super admin's own Discord. Deleted with the master account. */
export async function saveMasterWebhook(_: FormState, f: FormData): Promise<FormState> {
  await requireMaster();
  const parsed = z.object({ discordWebhook: discordHook }).safeParse(Object.fromEntries(f));
  if (!parsed.success) return fail(parsed.error);
  await db.insert(ownerSettings).values({ id: 1, ...parsed.data }).onConflictDoUpdate({ target: ownerSettings.id, set: parsed.data });
  return { ok: true };
}

// ---------- map location ----------
export type Place = { label: string; lat: number; lon: number };

/** Looks an address up on OpenStreetMap (free, no key). Done on the server because Nominatim requires a User-Agent. */
export async function searchLocation(query: string): Promise<{ places?: Place[]; error?: string }> {
  await requireAdmin();
  const q = query.trim().slice(0, 200);
  if (q.length < 3) return { error: "Type the store address first." };
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=4&q=${encodeURIComponent(q)}`, { headers: { "user-agent": "apexdrivehouse.com store locator" } });
    if (!res.ok) return { error: "The map search is busy, please try again in a moment." };
    const rows = (await res.json()) as { display_name: string; lat: string; lon: string }[];
    return { places: rows.map((r) => ({ label: r.display_name, lat: Number(r.lat), lon: Number(r.lon) })) };
  } catch {
    return { error: "Could not reach the map service, please try again." };
  }
}

export async function saveMapLocation(lat: number, lon: number): Promise<FormState> {
  await requireAdmin();
  const parsed = z.object({ lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180) }).safeParse({ lat, lon });
  if (!parsed.success) return { error: "That location is not valid." };
  await db.insert(siteSettings).values({ id: 1, latitude: lat, longitude: lon }).onConflictDoUpdate({ target: siteSettings.id, set: { latitude: lat, longitude: lon } });
  updateTag("settings");
  return { ok: true };
}

export async function clearMapLocation() {
  await requireAdmin();
  await db.update(siteSettings).set({ latitude: null, longitude: null }).where(eq(siteSettings.id, 1));
  updateTag("settings");
}

// ---------- brands ----------
export async function addBrand(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = z.object({ name: z.string().trim().min(1, "Brand name is required").max(60) }).safeParse(Object.fromEntries(f));
  if (!parsed.success) return fail(parsed.error);
  const [{ top }] = await db.select({ top: max(brands.position) }).from(brands);
  try {
    await db.insert(brands).values({ name: parsed.data.name, position: (top ?? -1) + 1 });
  } catch {
    return { error: "That brand already exists." };
  }
  updateTag("brands");
  return { ok: true };
}

export async function toggleBrand(id: number, active: boolean) {
  await requireAdmin();
  await db.update(brands).set({ active }).where(eq(brands.id, id));
  updateTag("brands");
}

export async function deleteBrand(id: number) {
  await requireAdmin();
  await db.delete(brands).where(eq(brands.id, id));
  updateTag("brands");
}

// ---------- testimonials ----------
const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  carBought: z.string().trim().max(80).optional(),
  text: z.string().trim().min(5, "Write the review").max(600),
  rating: z.coerce.number().int().min(1).max(5),
});

export async function addTestimonial(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(Object.fromEntries(f));
  if (!parsed.success) return fail(parsed.error);
  await db.insert(testimonials).values(parsed.data);
  updateTag("testimonials");
  return { ok: true };
}

export async function toggleTestimonial(id: number, visible: boolean) {
  await requireAdmin();
  await db.update(testimonials).set({ visible }).where(eq(testimonials.id, id));
  updateTag("testimonials");
}

export async function deleteTestimonial(id: number) {
  await requireAdmin();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  updateTag("testimonials");
}

// ---------- enquiries ----------
export async function deleteEnquiry(id: number) {
  await requireAdmin();
  await db.delete(enquiries).where(eq(enquiries.id, id));
  revalidatePath("/admin/enquiries");
}

export async function deleteContactMessage(id: number) {
  await requireAdmin();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  revalidatePath("/admin/enquiries");
}

// ---------- faqs ----------
const faqSchema = z.object({
  question: z.string().trim().min(3, "Write the question").max(200),
  answer: z.string().trim().min(3, "Write the answer").max(1500),
});

export async function addFaq(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = faqSchema.safeParse(Object.fromEntries(f));
  if (!parsed.success) return fail(parsed.error);
  const [{ top }] = await db.select({ top: max(faqs.position) }).from(faqs);
  await db.insert(faqs).values({ ...parsed.data, position: (top ?? -1) + 1 });
  updateTag("faqs");
  return { ok: true };
}

export async function toggleFaq(id: number, visible: boolean) {
  await requireAdmin();
  await db.update(faqs).set({ visible }).where(eq(faqs.id, id));
  updateTag("faqs");
}

export async function deleteFaq(id: number) {
  await requireAdmin();
  await db.delete(faqs).where(eq(faqs.id, id));
  updateTag("faqs");
}

// ---------- cars ----------
const carSchema = z.object({
  make: z.string().trim().max(60), // optional: a car can be added without a brand
  model: z.string().trim().min(1, "Model is required").max(80),
  year: z.coerce.number().int().min(1950, "Enter a valid year").max(2100, "Enter a valid year"),
  price: z.coerce.number().int().min(0, "Enter a price").max(100_000_000),
  mileage: z.coerce.number().int().min(0, "Enter the mileage").max(2_000_000),
  fuel: z.string().trim().min(1, "Fuel is required").max(30),
  transmission: z.string().trim().min(1, "Transmission is required").max(30),
  bodyType: z.string().trim().min(1, "Body type is required").max(30),
  colour: z.string().trim().min(1, "Colour is required").max(30),
  description: z.string().trim().min(1, "Add a description").max(3000),
  downPaymentPercent: z.union([z.literal("").transform(() => null), z.coerce.number().int().min(1, "Down payment must be 1-100%").max(100, "Down payment must be 1-100%")]),
  images: z.string().transform((s) => { try { return JSON.parse(s) as unknown; } catch { return []; } }).pipe(z.array(z.string().url().max(500)).max(20)),
});

export async function saveCar(id: number | null, _: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = carSchema.safeParse(Object.fromEntries(f));
  if (!parsed.success) return fail(parsed.error);
  const { images, ...data } = parsed.data;
  const flags = { featured: on(f, "featured"), status: on(f, "sold") ? ("sold" as const) : ("available" as const) };

  let carId = id;
  if (carId) {
    await db.update(cars).set({ ...data, ...flags }).where(eq(cars.id, carId));
  } else {
    const base = slugify(`${data.make}-${data.model}-${data.year}`);
    const [taken] = await db.select({ id: cars.id }).from(cars).where(eq(cars.slug, base));
    const slug = taken ? `${base}-${Math.random().toString(36).slice(2, 6)}` : base;
    [{ id: carId }] = await db.insert(cars).values({ ...data, ...flags, slug }).returning({ id: cars.id });
  }
  await db.delete(carImages).where(eq(carImages.carId, carId));
  if (images.length) await db.insert(carImages).values(images.map((url, position) => ({ carId, url, position })));
  redirect("/admin/cars");
}

export async function toggleCar(id: number, field: "featured" | "sold", value: boolean) {
  await requireAdmin();
  await db.update(cars).set(field === "featured" ? { featured: value } : { status: value ? "sold" : "available" }).where(eq(cars.id, id));
}

export async function deleteCar(id: number) {
  await requireAdmin();
  await db.delete(cars).where(eq(cars.id, id)); // images cascade; storage objects are left in the bucket
}

const allowedTypes: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Presigned PUT so the browser uploads photos straight to the public `cars` bucket. */
export async function getUploadUrl(contentType: string): Promise<{ url: string; headers?: Record<string, string>; publicUrl: string } | { error: string }> {
  await requireAdmin();
  const ext = allowedTypes[contentType];
  if (!ext) return { error: "Only JPG, PNG or WebP images are allowed." };
  const key = `uploads/${crypto.randomUUID()}.${ext}`;
  try {
    const signed = await carFiles.signedUploadUrl(key, { expiresIn: 300, contentType });
    if (signed.method !== "PUT") return { error: "Uploads are not available right now." };
    return { url: signed.url, headers: signed.headers, publicUrl: carImageUrl(key) };
  } catch {
    return { error: "Could not prepare the upload." };
  }
}

// ---------- account ----------
async function authPost(path: string, body: object) {
  return fetch(`${process.env.NEON_AUTH_BASE_URL}/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: (await headers()).get("origin") ?? "" },
    body: JSON.stringify(body),
  });
}

// Neon Auth disables Better Auth's changeEmail, so the admin's own login email is updated directly
// in the auth schema, after re-checking their current password.
export async function changeAdminEmail(f: FormData): Promise<FormState> {
  const user = await requireAdmin();
  if (isMaster(user.email)) return { error: "The master email is set in MASTER_EMAIL and cannot be changed here." };
  const parsed = z.object({ email: z.string().trim().toLowerCase().email("Enter a valid email").max(200), password: z.string().min(1, "Enter your current password") }).safeParse(Object.fromEntries(f));
  if (!parsed.success) return fail(parsed.error);
  if (!(await authPost("sign-in/email", { email: user.email, password: parsed.data.password })).ok) return { error: "Current password is incorrect." };
  try {
    await db.execute(sql`update neon_auth."user" set email = ${parsed.data.email} where id = ${user.id}`);
  } catch {
    return { error: "That email is already in use." };
  }
  return { ok: true };
}

// ---------- master: add and remove admins ----------
const addAdminSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(200),
  password: z.string().min(8, "The new password needs at least 8 characters").max(200),
  confirm: z.string(),
  masterPassword: z.string().min(1, "Enter your master password"),
}).refine((v) => v.password === v.confirm, { message: "The new passwords do not match", path: ["confirm"] });

export async function addAdmin(_: FormState, f: FormData): Promise<FormState> {
  const master = await requireMaster();
  const parsed = addAdminSchema.safeParse(Object.fromEntries(f));
  if (!parsed.success) return fail(parsed.error);
  const { email, password, masterPassword } = parsed.data;
  if (isMaster(email)) return { error: "That is the super admin email. Use a different email." };
  if (!(await authPost("sign-in/email", { email: master.email, password: masterPassword })).ok) return { error: "Your master password is incorrect." };

  const [existing] = await db.execute(sql`select id from neon_auth."user" where email = ${email}`).then((r) => r.rows);
  if (existing) return { error: "That email already has an account. Pick another one." };
  if (!(await authPost("sign-up/email", { email, password, name: "Admin" })).ok) return { error: "Could not create the admin. Try a different email or a stronger password." };
  const made = await db.execute(sql`update neon_auth."user" set role = 'admin' where email = ${email} returning id`);
  if (!made.rows.length) return { error: "The account was not created." };
  revalidatePath("/superadmin");
  return { ok: true };
}

/** Sessions and accounts of the removed admin go with the row (ON DELETE CASCADE), so they are locked out at once. */
export async function removeAdmin(id: string) {
  const master = await requireMaster();
  await db.execute(sql`delete from neon_auth."user" where id = ${id} and role = 'admin' and id <> ${master.id}`);
  revalidatePath("/superadmin");
}

export async function listDealershipAdmins() {
  const master = await requireMaster();
  const r = await db.execute(sql`select id, email from neon_auth."user" where role = 'admin' and id <> ${master.id} order by email`);
  return r.rows.map((x) => ({ id: String(x.id), email: String(x.email) }));
}

const removeMasterSchema = z.object({
  masterPassword: z.string().min(1, "Enter your master password"),
  confirm: z.literal("REMOVE", { message: "Type REMOVE to confirm" }),
});

/** Master only: delete the master account itself (never leaves the site without a dealership admin). */
export async function removeMaster(_: FormState, f: FormData): Promise<FormState> {
  const master = await requireMaster();
  const parsed = removeMasterSchema.safeParse(Object.fromEntries(f));
  if (!parsed.success) return fail(parsed.error);
  if (!(await authPost("sign-in/email", { email: master.email, password: parsed.data.masterPassword })).ok) return { error: "Your master password is incorrect." };
  if (!(await listDealershipAdmins()).length) return { error: "There is no dealership admin yet. Create one above first, so the site is not left without an admin." };
  await db.delete(ownerSettings); // the master's webhook goes with the master
  await db.execute(sql`delete from neon_auth."user" where id = ${master.id}`);
  return { ok: true };
}
