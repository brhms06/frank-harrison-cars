# Admin dashboard

Admins sign in at `/admin/login`; the super admin at `/superadmin/login`. Each login only opens its own area.

Testing both locally: a browser holds one login per site, so use a second browser or a private window for the other account.

## Create the first admin (one time)

```
npm run make-admin -- owner@example.com "a-strong-password"
```

This signs the account up and gives it the admin role. There is no public admin sign-up. Run it again with another
email to add a second admin.

## Two kinds of login

- **Admin** (e.g. `admin@admin.com`), signs in at `/admin/login`: runs the website: cars, brands, reviews, FAQs, settings, own password and email.
- **Super admin** (the email in `MASTER_EMAIL`, e.g. `broomuhams@gmail.com`), signs in at `/superadmin/login`: only manages admins. On the `/superadmin` page it adds an admin (email + password + the super admin password) or removes one (they are signed out at once). It can also change its own password, and delete its own account. It cannot open cars, settings or anything else.

Create the super admin once: `npm run make-admin -- super@yourmail.com "a-strong-password"` with `MASTER_EMAIL` set to the same email.

## What the owner can do

| Page | What it does |
| --- | --- |
| Cars | Add, edit and delete cars with photos. Each car has **Featured** (shows on the home page) and **Sold** switches. |
| Brands | Add brands. Each has a **Show** switch. Brands feed the car form and the Make filter on the Cars page. |
| Testimonials | Add reviews. Each has a **Show** switch. |
| FAQs | Add questions and answers. Each has a **Show** switch. They appear on the Contact page. |
| Settings | Phone numbers (one per line), WhatsApp number, contact email, address, your currency, and four on/off switches: Testimonials section, FAQ section, WhatsApp chat button, Currency switcher. |
| Account | Change the login email and password. Both ask for the current password. Changing the email signs you out. |

Changes to settings, brands, testimonials and FAQs show on the website straight away.

## Notes

- **Photos** are uploaded from the browser straight to the public `cars` bucket (JPG, PNG or WebP). Deleting a car does not delete its photos from the bucket.
- **Currency**: prices are stored as plain numbers in the currency chosen in Settings. Changing it changes how they are displayed, it does not convert them. Customers can switch currency in the header unless that switch is off; their view uses fixed exchange rates in `src/lib/currency.ts`.
- **Login email change** is done with a direct update of the auth user record, because Neon Auth disables the built-in email change.
- Messages sent through the Contact form and car enquiries are saved in the `contact_messages` and `enquiries` tables (no dashboard page for them yet).

## Before going live

- Add the production site URL to Neon Auth **trusted domains** (`neon neon-auth domain add https://your-domain.com`).
- Consider disabling open sign-ups in the Neon Auth settings. The admin area is protected by the role check either way.
- Set `MASTER_EMAIL`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET` and the `AWS_*` storage variables in Vercel.

## Removing the master

On the Admins page, "Remove my master access" deletes the master login for good (needs the master password and typing REMOVE). It is refused if there is no dealership admin, so the site is never left without one. Afterwards delete `MASTER_EMAIL` from `.env.local` and Vercel. To get a master again, set `MASTER_EMAIL` and run `npm run make-admin`.
