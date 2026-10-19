import { db } from "./index";
import { brands, carImages, cars, faqs, siteSettings, testimonials } from "./schema";

// make, model, year, price, mileage, fuel, transmission, body, colour, featured, image keys in public/images
const rows = [
  ["Honda", "Accord EX-L", 2018, 17950, 52000, "Petrol", "Automatic", "Sedan", "White", true, ["accord-2018-a", "accord-2018-b"]],
  ["Kia", "Sportage EX", 2019, 16800, 41000, "Petrol", "Automatic", "SUV", "Grey", true, ["sportage-b", "sportage-a"]],
  ["Toyota", "Camry LE", 2019, 18400, 38000, "Petrol", "Automatic", "Sedan", "Silver", true, ["camry-a", "camry-b"]],
  ["Lexus", "ES 350", 2019, 27900, 34000, "Petrol", "Automatic", "Sedan", "Grey", true, ["es-a", "es-b"]],
  ["Honda", "Accord Sport 1.5T", 2019, 19500, 36000, "Petrol", "Automatic", "Sedan", "Red", false, ["accord-2019-a"]],
  ["Honda", "CR-V EX AWD", 2019, 21900, 44000, "Petrol", "Automatic", "SUV", "Blue", true, ["crv-a"]],
  ["Kia", "Optima GT", 2018, 14250, 58000, "Petrol", "Automatic", "Sedan", "Black", true, ["optima-a", "optima-b"]],
  ["Kia", "Sorento SX", 2019, 22750, 47000, "Petrol", "Automatic", "SUV", "White", false, ["sorento-a", "sorento-b"]],
  ["Toyota", "RAV4 Hybrid", 2019, 25900, 39000, "Hybrid", "Automatic", "SUV", "Grey", false, ["rav4-a", "rav4-b"]],
  ["Hyundai", "Tucson SE", 2019, 15600, 49000, "Petrol", "Automatic", "SUV", "Silver", false, ["tucson-a"]],
  ["Mazda", "CX-5 Grand Touring", 2019, 21200, 42000, "Petrol", "Automatic", "SUV", "Red", false, ["cx5-a", "cx5-b"]],
  ["Acura", "TLX SH-AWD", 2018, 20800, 55000, "Petrol", "Automatic", "Sedan", "Black", false, ["tlx-a", "tlx-b"]],
] as const;

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  await db.delete(cars); // ponytail: wipes data, dev seed only
  for (const [make, model, year, price, mileage, fuel, transmission, bodyType, colour, featured, images] of rows) {
    const slug = slugify(`${make}-${model}-${year}`);
    const [car] = await db
      .insert(cars)
      .values({
        slug, make, model, year, price, mileage, fuel, transmission, bodyType, colour, featured,
        description: `${year} ${make} ${model} in ${colour}. Full service history, one careful owner, HPI clear. Part exchange welcome.`,
      })
      .returning({ id: cars.id });
    await db.insert(carImages).values(images.map((k, position) => ({ carId: car.id, position, url: `/images/${k}.jpg` })));
  }
  // demo content the owner replaces from the dashboard
  await db.delete(brands);
  await db.insert(brands).values(["Honda", "Kia", "Toyota", "Lexus", "Hyundai", "Mazda", "Acura"].map((name, position) => ({ name, position })));
  await db.delete(testimonials);
  await db.insert(testimonials).values([
    { name: "James K.", carBought: "Honda Accord", text: "Bought an Accord in perfect condition, exactly as described. The whole process was quick and painless." },
    { name: "Maria L.", carBought: "Kia Sportage", text: "Great help choosing the right SUV for the family, and a fair part-exchange price on my old car." },
    { name: "Daniel P.", carBought: "Toyota Camry", text: "Honest, no pressure and fully transparent. I would happily buy from them again." },
  ]);
  await db.delete(faqs);
  await db.insert(faqs).values([
    ["Can I book a test drive?", "Yes. Send us a message or call, tell us which car you would like to try and when suits you, and we will arrange it."],
    ["Do you accept part-exchange?", "Yes, we offer free, no-obligation valuations on your current car, which can go towards your next one."],
    ["Do you offer finance?", "We can talk you through finance options on any car in stock. Try our loan calculator first to see what suits your budget."],
    ["Can I reserve a car?", "Contact us and we will explain how reservations work for the car you are interested in."],
    ["Are your cars inspected?", "Every car goes through a multi-point inspection before it is listed, and we share its history so you know what you are buying."],
    ["What are your opening hours?", "Monday to Saturday, 9:00 to 18:00. Weekend and holiday messages are answered on the next business day."],
  ].map(([question, answer], position) => ({ question, answer, position })));
  await db.insert(siteSettings).values({ id: 1, phones: ["+1 (555) 120-0077"], whatsapp: "+15551200077", email: "sales@example.com", address: "123 High Street, Your City", defaultCurrency: "USD" }).onConflictDoNothing();
  console.log(`Seeded ${rows.length} cars`);
}
main();
