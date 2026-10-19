"use server";
import { z } from "zod";
import { db } from "@/db";
import { contactMessages, enquiries } from "@/db/schema";
import { contactSubjects } from "@/lib/contact";

const schema = z.object({
  carId: z.coerce.number().int().positive(),
  type: z.enum(["enquiry", "test-drive", "down-payment", "full-payment"]),
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email").max(200)]), // optional: WhatsApp and text enquiries carry their own contact
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().max(2000).optional(),
});

export type EnquiryState = { ok?: boolean; error?: string };

export async function submitEnquiry(_: EnquiryState, form: FormData): Promise<EnquiryState> {
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await db.insert(enquiries).values(parsed.data);
  } catch {
    return { error: "Something went wrong, please try again." };
  }
  return { ok: true };
}


const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(30).optional(),
  subject: z.enum(contactSubjects, { message: "Choose a topic" }),
  message: z.string().trim().min(5, "Please tell us how we can help").max(3000),
  website: z.string().max(0).optional(), // honeypot: real users leave it empty
});

export async function submitContact(_: EnquiryState, form: FormData): Promise<EnquiryState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    // a filled honeypot is a bot: report success without saving
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return { ok: true };
    return { error: parsed.error.issues[0].message };
  }
  const data = { ...parsed.data, website: undefined };
  try {
    await db.insert(contactMessages).values(data);
  } catch {
    return { error: "Something went wrong, please try again." };
  }
  return { ok: true };
}
