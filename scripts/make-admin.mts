// Usage: npm run make-admin -- <email> <password>
import { neon } from "@neondatabase/serverless";

const [email, password] = process.argv.slice(2);
if (!email || !password || password.length < 8) {
  console.error("Usage: npm run make-admin -- <email> <password (8+ chars)>");
  process.exit(1);
}

const res = await fetch(`${process.env.NEON_AUTH_BASE_URL}/sign-up/email`, {
  method: "POST",
  headers: { "content-type": "application/json", origin: "http://localhost:3000" },
  body: JSON.stringify({ email, password, name: "Admin" }),
});
// an existing account is fine, we only promote it
if (!res.ok && !(await res.text()).toLowerCase().includes("exist")) {
  console.error("Sign-up failed:", res.status);
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
const rows = await sql`update neon_auth."user" set role = 'admin' where email = ${email} returning email`;
console.log(rows.length ? `${email} is now an admin` : "No such user, sign-up did not create it");
