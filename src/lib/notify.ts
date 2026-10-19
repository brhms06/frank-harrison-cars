import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ownerSettings, siteSettings } from "@/db/schema";

type Field = { name: string; value: string };

/** Posts an order/message to the super admin's Discord and the admin's own Discord (whichever are set). Never throws. */
export async function notifyDiscord(title: string, fields: Field[]) {
  try {
    const [[owner], [site]] = await Promise.all([
      db.select().from(ownerSettings).where(eq(ownerSettings.id, 1)),
      db.select().from(siteSettings).where(eq(siteSettings.id, 1)),
    ]);
    const hooks = [owner?.discordWebhook, site?.discordWebhook].filter((h): h is string => !!h);
    const body = JSON.stringify({
      username: "apexdrivehouse.com",
      embeds: [{ title, color: 0x1f2937, timestamp: new Date().toISOString(), fields: fields.filter((f) => f.value).map((f) => ({ name: f.name, value: f.value.slice(0, 1000) })) }],
    });
    await Promise.allSettled(hooks.map((url) => fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body })));
  } catch {
    // a Discord problem must never stop a customer's enquiry from being saved
  }
}
