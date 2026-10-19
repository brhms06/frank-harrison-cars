import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

const admin = auth.middleware({ loginUrl: "/admin/login" });
const superadmin = auth.middleware({ loginUrl: "/superadmin/login" });

export default function proxy(req: NextRequest) {
  return req.nextUrl.pathname.startsWith("/superadmin") ? superadmin(req) : admin(req);
}

// login pages stay public; the role is enforced again by requireAdmin() / requireMaster() in layouts, pages and actions
export const config = { matcher: ["/admin", "/admin/((?!login).*)", "/superadmin", "/superadmin/((?!login).*)"] };
