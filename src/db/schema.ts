import { boolean, index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const cars = pgTable(
  "cars",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    make: text("make").notNull(),
    model: text("model").notNull(),
    year: integer("year").notNull(),
    price: integer("price").notNull(),
    mileage: integer("mileage").notNull(),
    fuel: text("fuel").notNull(),
    transmission: text("transmission").notNull(),
    bodyType: text("body_type").notNull(),
    colour: text("colour").notNull(),
    description: text("description").notNull(),
    status: text("status", { enum: ["available", "sold"] }).notNull().default("available"),
    featured: boolean("featured").notNull().default(false),
    downPaymentPercent: integer("down_payment_percent"), // null = the default 25%
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("cars_status_idx").on(t.status)],
);

export const carImages = pgTable("car_images", {
  id: serial("id").primaryKey(),
  carId: integer("car_id").notNull().references(() => cars.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  position: integer("position").notNull().default(0),
});

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  carId: integer("car_id").notNull().references(() => cars.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["enquiry", "test-drive", "down-payment", "full-payment"] }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logoUrl: text("logo_url"),
  active: boolean("active").notNull().default(true),
  position: integer("position").notNull().default(0),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  carBought: text("car_bought"),
  text: text("text").notNull(),
  rating: integer("rating").notNull().default(5),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  visible: boolean("visible").notNull().default(true),
  position: integer("position").notNull().default(0),
});

// single row, id = 1
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  phones: text("phones").array().notNull().default([]),
  whatsapp: text("whatsapp").notNull().default(""),
  smsNumber: text("sms_number").notNull().default(""),
  email: text("email").notNull().default(""),
  address: text("address").notNull().default(""),
  defaultCurrency: text("default_currency").notNull().default("USD"),
  showTestimonials: boolean("show_testimonials").notNull().default(true),
  showFaq: boolean("show_faq").notNull().default(true),
  showWhatsapp: boolean("show_whatsapp").notNull().default(true),
  showCurrencySwitcher: boolean("show_currency_switcher").notNull().default(true),
  showTranslator: boolean("show_translator").notNull().default(true),
});
