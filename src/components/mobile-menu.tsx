"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";

type NavLink = { label: string; href: string; children?: { title: string; href: string }[] };

/** Phone-only menu: a button in the header pill that opens a panel with every link, the switchers and the phone number. */
export function MobileMenu({ links, phone, phoneHref, children }: { links: NavLink[]; phone?: string; phoneHref?: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const row = "block rounded-xl px-3 py-3 text-sm text-neutral-700 hover:bg-brand-soft";
  return (
    <div className="lg:hidden">
      <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full bg-neutral-100">
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 space-y-3 rounded-3xl bg-white p-3 shadow-lg ring-1 ring-black/5">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                {l.children ? (
                  <details className="group">
                    <summary className={`${row} flex cursor-pointer list-none items-center justify-between`}>{l.label}<ChevronDown className="size-4 transition-transform group-open:rotate-180" /></summary>
                    <ul className="ml-3 border-l pl-2">
                      <li><Link href={l.href} onClick={close} className={row}>All financing</Link></li>
                      {l.children.map((c) => <li key={c.href}><Link href={c.href} onClick={close} className={row}>{c.title}</Link></li>)}
                    </ul>
                  </details>
                ) : <Link href={l.href} onClick={close} className={row}>{l.label}</Link>}
              </li>
            ))}
          </ul>
          {(children || phone) && (
            <div className="flex flex-wrap items-center gap-3 border-t px-3 pt-3">
              {children}
              {phone && phoneHref && <a href={phoneHref} className="ml-auto flex items-center gap-2 text-sm"><Phone className="size-4" />{phone}</a>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
