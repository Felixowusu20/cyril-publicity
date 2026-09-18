"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/lib/auth-actions";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/admin", label: "Home" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/pricing", label: "Pricing" },
  { href: "/admin/process", label: "Process" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="admin-nav">
      <p className="small-title">CyrilPublicity</p>
      <h2>Admin</h2>
      <p className="admin-nav-email">{email}</p>
      <nav aria-label="Admin">
        <ul>
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link href={link.href} className={active ? "active" : undefined}>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="admin-nav-footer">
        <ThemeToggle />
        <Link href="/" className="secondary-btn" target="_blank">
          View site
        </Link>
        <form action={logoutAdmin}>
          <button type="submit" className="admin-text-btn">
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
