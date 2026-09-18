"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navLinks } from "@/lib/site";

function OrderLink({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/order" className="order-btn" onClick={onClick}>
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M6 7h12l-1 12H7L6 7Z" />
        <path d="M9 7V6a3 3 0 0 1 6 0v1" />
      </svg>
      Order Now
    </Link>
  );
}

export function Header({ siteName }: { siteName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 960) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header>
      <nav className="navbar" aria-label="Main">
        <Logo name={siteName} />

        <div
          id="primary-navigation"
          className={`nav-panel${open ? " open" : ""}`}
        >
          <ul className="nav-links">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={active ? "active" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mobile-order">
            <OrderLink />
          </div>
        </div>

        <div className="nav-actions">
          <ThemeToggle />
          <div className="desktop-order">
            <OrderLink />
          </div>
          <button
            type="button"
            className={`nav-toggle${open ? " open" : ""}`}
            aria-expanded={open}
            aria-controls="primary-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="nav-toggle-icon" aria-hidden="true" />
          </button>
        </div>
      </nav>
      {open ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </header>
  );
}
