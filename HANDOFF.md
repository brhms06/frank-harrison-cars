# Handoff: website with admin + super admin on Next.js and Neon

For a Claude session on a **different project** that wants to reuse the setup built for a car-dealership site ("Frank Harrison Cars"). The car site is only the worked example; take the patterns, not the content. Contains no secrets: env vars are names only.

## 0. How to use this

1. Read sections 2 to 6 fully before writing code. Section 7 lists the mistakes that cost the most time.
2. Ask the owner first (do not assume): what the business sells, market and currency, languages, which sections need an on/off switch, who the first admin is, who the super admin is.
3. Load the user's Neon skills (`neon`, `neon-auth`, `neon-object-storage`) when touching those services; they are more current than this file.
4. Never put real passwords or keys in files you create. The owner shares credentials in chat; use them in commands only, and tell them to change them.

## 1. What the finished product looks like

- **Public site**: pages driven by the database (settings, items, reviews, FAQs), with owner-controlled toggles, a currency switcher and a language switcher.
- **Admin** (`/admin`): the owner's staff run the site: items with photos, brands/categories, testimonials, FAQs, contact details, site toggles, own email and password.
- **Super admin** (`/superadmin`): the developer/agency. It can **only** add admins, remove admins, change its own password and delete its own account. It cannot open any admin page. This lets the developer hand a site over and later remove all ties to it.

## 2. Stack and setup

| Piece | Choice |
| --- | --- |
| Framework | Next.js 16 App Router with `cacheComponents: true` (read `node_modules/next/dist/docs` before assuming Next APIs) |
| UI | Tailwind v4, shadcn/ui |
| Database | Neon Postgres, Drizzle ORM, Neon HTTP driver |
| Auth | Neon Managed Better Auth (`@neondatabase/auth`) |
| Files | Neon Object Storage, `files-sdk` with the `neon` adapter |
| Hosting | Vercel, code on GitHub |
| Validation | zod 4 |

Env var names: `DATABASE_URL` (pooled, runtime), `DATABASE_URL_UNPOOLED` (drizzle-kit and scripts), `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `MASTER_EMAIL`. Set all of them in Vercel too. Add the production domain to Neon Auth trusted domains.

Scripts: `db:push` (`drizzle-kit push`), `db:seed` (`tsx --env-file=.env.local src/db/seed.ts`), `make-admin`.

Schema pattern: domain tables + `site_settings` as a **single row (id = 1)**: phones (text[]), whatsapp, sms number, email, address, default currency, and one boolean per toggle. Content tables (`brands`, `testimonials`, `faqs`) each get a `visible`/`active` boolean. Seed demo content so the site looks real, and tell the owner it is placeholder.

Storage: a `cars` bucket with `public_read` in `neon.ts`; public URL = `${AWS_ENDPOINT_URL_S3}/<bucket>/<key>`; allow that host in `next.config.ts` `images.remotePatterns`.

## 3. Auth model (the important part)

**Roles.** Admin = a user in `neon_auth."user"` with `role = 'admin'`. The super admin is also `role = 'admin'` but is identified by its email equal to the `MASTER_EMAIL` env var (case-insensitive). There is no other role.

**One module, three gates** (`src/lib/admin.ts`):

- `isMaster(email)`: compares to `MASTER_EMAIL`.
- `getAdminUser(loginPath = "/admin/login")`: `await connection()`, `auth.getSession()`, redirect to `loginPath` unless `role === 'admin'`, then **re-check in the database** that the user still exists with role admin (`select 1 from neon_auth."user" where id = $1 and role = 'admin'`). The session is cached in a cookie, so without this re-check a deleted admin keeps access until the cookie expires.
- `requireAdmin()`: `getAdminUser()`, then if the user is the master redirect to `/superadmin`. **Every** admin page, layout and server action calls this first. Page-level redirects alone are not security.
- `requireMaster()`: `getAdminUser("/superadmin/login")`, then if the user is not the master redirect to `/superadmin/login?denied=1`.

**Separate areas and logins.** `/admin/login` and `/superadmin/login` are different pages (same `LoginForm` with a `redirectTo` prop). Layouts live in route groups, `admin/(panel)` and `superadmin/(panel)`, with the login pages **outside** the group (otherwise the layout's gate redirects to the login page forever). `src/proxy.ts` (Next 16 middleware) creates two instances, `auth.middleware({ loginUrl: "/admin/login" })` and `auth.middleware({ loginUrl: "/superadmin/login" })`, and picks by path prefix; its matcher excludes the login pages.

**Super admin actions** (all start with `requireMaster()`):

- `addAdmin`: zod (email, password 8+, confirm, master password); re-check the master password by POSTing to `${NEON_AUTH_BASE_URL}/sign-in/email`; reject an existing email or the master email; create via `${NEON_AUTH_BASE_URL}/sign-up/email`; then `update neon_auth."user" set role='admin'`; confirm a row changed.
- `removeAdmin(id)`: `delete from neon_auth."user" where id = $1 and role = 'admin' and id <> master.id`. Sessions and accounts cascade (`ON DELETE CASCADE`, verified in `information_schema`), so lockout is immediate. Then `revalidatePath("/superadmin")`.
- `removeMaster`: needs master password + typing `REMOVE`; **refused if no admin exists** so the site is never left unmanaged; deletes the master row. The owner then deletes `MASTER_EMAIL` from env.
- The master changes its own password through `authClient.changePassword` (works); its email is fixed by `MASTER_EMAIL`, so email change is refused for it.

**Admin account page**: password change uses `authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true })`. Email change: Neon Auth **disables** Better Auth `changeEmail`, so use a server action that re-checks the password (sign-in POST) and runs `update neon_auth."user" set email = ...`, then signs the user out.

**First account**: `scripts/make-admin.mts <email> <password>` signs up through the auth API (header `origin: http://localhost:3000` is required by Neon Auth) then sets `role = 'admin'` using `DATABASE_URL_UNPOOLED`. There is no public admin sign-up. Open sign-up on Neon Auth stays reachable, but role gating protects the app; recommend the owner disables sign-ups.

**Testing gotcha.** A browser holds **one session per site**, and cookies ignore ports. Logging in as the super admin signs the admin out and vice versa. Test both with a second browser or a private window, or with separate Playwright contexts.

## 4. Admin dashboard patterns

- Pages: `export const instant = false;` and `await requireAdmin()` first. Add `loading.tsx`. Layout wraps in `<Suspense>` and reads the user inside an async child.
- Forms: client `ActionForm` around `useActionState(action, {})` with `{ ok?, error? }` state; server actions take `(prev, FormData)`, parse with zod, return `{ error: issues[0].message }`.
- Toggles: `Toggle` (instant server action via `useTransition`) for list rows, `FormSwitch` (checkbox) inside forms. Style: iOS look, `#34c759` when on, `neutral-300` when off.
- Delete/toggle buttons use `action.bind(null, id)`; `DeleteButton` confirms with `confirm()`.
- Cached public reads: `'use cache'` + `cacheTag("settings")`, invalidated in actions with `updateTag("settings")`. Admin lists that are not cached need `revalidatePath(...)` after writes or the page looks stale.
- Photo upload: server action `getUploadUrl(contentType)` (admin only, allow jpg/png/webp) returns a presigned PUT URL from `files.signedUploadUrl(key, { expiresIn, contentType })`; the browser `PUT`s the file **sending only the signed headers returned** (extra headers give 403). Keys like `uploads/<uuid>.<ext>`. Do this instead of posting files through a server action (4.5 MB serverless limit).
- Slugs generated server-side from the title, with a random suffix on collision.

## 5. Public-site patterns

- Header, footer, floating WhatsApp button and contact page all read `getSettings()`. A single `showWhatsapp` toggle hides the number everywhere while keeping it saved.
- **Currency**: prices are stored as plain numbers in the owner's base currency (setting). `CurrencyProvider` gets `{ base, locked }`; the customer's choice lives in `localStorage` read through `useSyncExternalStore`; static rates in `src/lib/currency.ts` (replace with live rates if exactness matters); switcher hidden and locked to base when the toggle is off.
- **Language switcher**: Google Translate website widget (hidden element + `googtrans` cookie + reload), so database content is translated too. CSS hides Google's top bar. Caveat: occasional layout quirks; swap for a paid API if needed.
- **Enquiry form** (customer pays a down payment or the full price): down payment = price x percent, percent is a nullable per-item column defaulting to 25. The customer picks WhatsApp (`https://wa.me/<digits>?text=`), text (`sms:<number>?&body=`) or email (`mailto:`); only channels the admin configured appear. The form saves the enquiry to the database first, then sets `window.location.href` to the deep link (navigating after an `await` is not popup-blocked, `window.open` is).
- Honeypot field on public contact forms.

## 6. Environment notes (Windows + this harness)

- The shell tool breaks on apostrophes inside heredocs and `node -e '...'`: write files with the Write/Edit tools, or write a temp `.mjs` and run it, then delete it.
- Regex backslashes get lost when code is passed through shell heredocs (`/\D/g` became `/D/g`, silently). Re-grep after scripted edits.
- A bare `cat > file` with no heredoc waits on stdin and hangs for 120 s.
- Python may not be installed; use node for scripted edits.
- Playwright: use the existing install; scripts that `import "playwright"` must sit next to its `node_modules`.
- Stopping the dev server then deleting `.next` fixes stale types; restart after changing `.env.local` or `proxy.ts`.
- Port 3001 was used for dev.

## 7. Gotchas and fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Admin login redirect loop | Login page inside the guarded layout | Put pages in a `(panel)` route group, login outside |
| "Uncached data was accessed outside Suspense" | Runtime data in a page under Cache Components | `export const instant = false` on admin pages; Suspense around runtime reads |
| Build logs auth errors | `getSession()` during prerender | `await connection()` first in the gate |
| Presigned upload 403 | Extra headers on the PUT | Send only the headers returned with the signed URL |
| `changeEmail` does nothing | Disabled in Neon Managed Auth | SQL update after password re-check |
| Everything renders in serif | `--font-sans` defined as itself in `globals.css` | Point it at the font variable |
| Cards have no images | Drizzle drops table qualifiers in single-table selects, so `car_id = id` compared the subquery to itself | Qualify manually: `ci.car_id = ${cars}.id` |
| Newly featured item missing on home | Ordered by something unrelated | Order featured by `desc(id)` |
| Removed admin still has access | Session cached in cookie | DB existence re-check in `getAdminUser` |
| Admin list does not update after add/delete | Uncached page, no revalidation | `revalidatePath` in the action |
| `useSearchParams` build error | Needs a Suspense boundary | Wrap the client component in `<Suspense>` |
| Exporting a const from a `"use server"` file fails | Server action files may only export async functions | Move constants to a plain module |
| Typing in tests is lost | Typed before hydration | Wait for `networkidle` |
| Sign-up script fails with origin error | Neon Auth checks `Origin` | Send `origin: http://localhost:3000` |
| Mobile admin nav wraps into a tall block | Plain flex-wrap nav | Horizontal swipe row of pills on small screens |

## 8. Workflow that worked

1. Build the public site first from the owner's reference screenshots (use open-source photos, credit them in a `credits` page).
2. Use plan mode for each big feature, with `AskUserQuestion` for real choices (toggles, first-admin method, roles); skip questions that have a sensible default.
3. Implement, then run `npx tsc --noEmit`, `npx eslint src`, any self-check scripts, `npm run build`.
4. End-to-end test with Playwright: unauthenticated redirects, wrong-role lockout, each feature, then **clean up** throwaway users/rows and restore env values.
5. Write an `ADMIN.md` for the owner (how to create the first admin, what each page does, going-live checklist).

## 9. New-project checklist

- [ ] Ask the owner the section 0 questions
- [ ] Neon project, `neon.ts` (auth, bucket), env pulled, `db:push`
- [ ] Schema with `site_settings` single row + toggles; seed demo data
- [ ] `src/lib/admin.ts` gates, proxy with two logins, `/admin` and `/superadmin` route groups
- [ ] `make-admin` script; create the super admin first, then the admin; set `MASTER_EMAIL`
- [ ] Admin pages, upload flow, cached public reads
- [ ] e2e checks incl. both roles; build; `ADMIN.md`
- [ ] GitHub push, Vercel env vars (including `MASTER_EMAIL`), trusted domain in Neon Auth, disable open sign-ups

## 10. Known gaps in the car site

Enquiries and contact messages are saved but have no admin inbox; photos are not deleted from the bucket when an item is deleted; currency rates are static; the public site has no mobile nav menu; GitHub push and Vercel deploy were not done yet.

## 11. Starter prompt for the next session

> Read `HANDOFF.md`. Build a website for **[business]** in **[country/currency]** using that stack. It needs an admin (`/admin`) and a super admin (`/superadmin`) exactly as described. Ask me about the sections, toggles and first accounts before you start, then plan, build, test with Playwright and write `ADMIN.md`.
