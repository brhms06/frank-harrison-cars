import { sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth/server";

/** The master (developer/owner) login, set in MASTER_EMAIL. It is also an admin, plus it can replace the dealership admin. */
export const isMaster = (email: string) => !!process.env.MASTER_EMAIL && email.toLowerCase() === process.env.MASTER_EMAIL.toLowerCase();

/** A signed-in user whose role is "admin" and who still exists (the master is one too). */
export async function getAdminUser(loginPath = "/admin/login") {
  await connection(); // request-time only: never attempt to prerender a session read
  const { data } = await auth.getSession();
  const user = data?.user as { role?: string; email: string; id: string } | undefined;
  if (user?.role !== "admin") redirect(loginPath);
  // the session is cached in a cookie, so confirm the account still exists as an admin: removal takes effect at once
  const { rows } = await db.execute(sql`select 1 from neon_auth."user" where id = ${user.id} and role = 'admin'`);
  if (!rows.length) redirect(loginPath);
  return user;
}

/** Gate for every normal admin page AND server action. The master only manages admins, so it is sent there. */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (isMaster(user.email)) redirect("/superadmin");
  return user;
}

export async function requireMaster() {
  const user = await getAdminUser("/superadmin/login");
  if (!isMaster(user.email)) redirect("/superadmin/login?denied=1"); // e.g. an admin session is still open in this browser
  return user;
}
